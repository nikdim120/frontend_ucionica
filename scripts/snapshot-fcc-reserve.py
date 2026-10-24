#!/usr/bin/env python3
"""Explicit maintenance command; never called by the app or its build.
Usage: python3 scripts/snapshot-fcc-reserve.py /path/to/freeCodeCamp
The input checkout must contain the English RWD v9 blocks and structure.
"""
import hashlib
import json
import pathlib
import re
import shutil
import subprocess
import sys

source = pathlib.Path(sys.argv[1]).resolve()
root = pathlib.Path(__file__).resolve().parents[1]
target = root / 'reserve/freecodecamp-responsive-web-design-v9'
commit = subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD'], text=True).strip()
structure_path = 'curriculum/structure/superblocks/responsive-web-design-v9.json'

def original(path):
    return subprocess.check_output(['git', '-C', str(source), 'show', f'{commit}:{path}'])

structure = json.loads(original(structure_path))
blocks = [block for chapter in structure['chapters'] for module in chapter['modules'] for block in module['blocks']]
paths = [structure_path, 'LICENSE.md', 'client/i18n/locales/english/intro.json']
summaries = []
for block in blocks:
    meta_path = f'curriculum/structure/blocks/{block}.json'
    paths.append(meta_path)
    metadata = json.loads(original(meta_path))
    directory = source / 'curriculum/challenges/english/blocks' / block
    files = sorted(p for p in directory.rglob('*') if p.is_file())
    assert files, f'Missing block: {block}'
    ids = {match.group(1) for path in files if (match := re.search(rb'^id:\s*(\S+)', path.read_bytes(), re.M))}
    for challenge in metadata['challengeOrder']:
        assert challenge['id'].encode() in ids, f'Missing ordered challenge: {challenge}'
    paths.extend(str(p.relative_to(source)) for p in files)
    summaries.append({'block': block, 'orderedChallenges': len(metadata['challengeOrder']), 'files': len(files)})

# Preserve exact git bytes, never generated/translated variants.
target.mkdir(parents=True, exist_ok=True)
if (target / 'upstream').exists():
    shutil.rmtree(target / 'upstream')
inventory = []
urls = set()
for path in paths:
    content = original(path)
    destination = target / 'upstream' / path
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(content)
    inventory.append({'path': 'upstream/' + path, 'bytes': len(content), 'sha256': hashlib.sha256(content).hexdigest()})
    urls.update(re.findall(r'https?://[^\s<>"\)\]\}]+', content.decode('utf-8', errors='replace')))

manifest = {'active': False, 'language': 'english', 'repository': 'https://github.com/freeCodeCamp/freeCodeCamp',
            'commit': commit, 'superblock': 'responsive-web-design-v9',
            'blockCount': len(blocks), 'orderedChallengeCount': sum(x['orderedChallenges'] for x in summaries),
            'sourceFileCount': len(inventory), 'blocks': summaries, 'files': inventory}
(target / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
(target / 'external-urls.json').write_text(json.dumps(sorted(urls), ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: manifest[k] for k in ['active', 'commit', 'blockCount', 'orderedChallengeCount', 'sourceFileCount']}))

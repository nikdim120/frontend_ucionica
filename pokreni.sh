#!/usr/bin/env bash
set -eu
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Instaliraj Node.js 24 ili noviji."
  exit 1
fi
node -e "if(Number(process.versions.node.split('.')[0])<24){console.error('Potreban je Node.js 24 ili noviji.');process.exit(1)}"
if [ ! -d node_modules ]; then
  npm ci
fi
echo "Otvori http://localhost:4173 u Chrome-u."
exec npm start

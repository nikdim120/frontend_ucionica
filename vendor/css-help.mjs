const getIsDeclaredAfter = rule => selector => { const all=Array.from(rule.parentStyleSheet?.cssRules || []).filter(x=>x.type===1); const prev=all.find(x=>x.selectorText===selector); return Boolean(prev)&&all.indexOf(rule)>all.indexOf(prev); };
// Adapted from freeCodeCamp/curriculum-helpers, BSD-3-Clause. See PROVENANCE.md.
export class CSSHelp {
    doc;
    constructor(doc) {
        this.doc = doc;
    }
    _getStyleRules() {
        const styleSheet = this.getStyleSheet();
        return this.styleSheetToCssRulesArray(styleSheet).filter((ele) => ele.type === this.doc.defaultView.CSSRule.STYLE_RULE);
    }
    getStyleDeclarations(selector) {
        return this._getStyleRules()
            ?.filter((ele) => ele?.selectorText === selector)
            .map((x) => x.style);
    }
    getStyle(selector) {
        const style = this._getStyleRules().find((ele) => ele?.selectorText === selector)?.style;
        if (!style)
            return null;
        style.getPropVal = (prop, strip = false) => strip
            ? style.getPropertyValue(prop).replace(/\s+/g, "")
            : style.getPropertyValue(prop);
        return style;
    }
    // A wrapper around getStyle for testing challenges where multiple CSS selectors are valid
    getStyleAny(selectors) {
        for (const selector of selectors) {
            const style = this.getStyle(selector);
            if (style) {
                return style;
            }
        }
        return null;
    }
    getStyleRule(selector) {
        const styleRule = this._getStyleRules()?.find((ele) => ele?.selectorText === selector);
        if (styleRule) {
            return {
                ...styleRule,
                isDeclaredAfter: (selector) => getIsDeclaredAfter(styleRule)(selector),
            };
        }
        return null;
    }
    getCSSRules(element) {
        const styleSheet = this.getStyleSheet();
        const cssRules = this.styleSheetToCssRulesArray(styleSheet);
        switch (element) {
            case "media":
                return cssRules.filter((ele) => ele.type === this.doc.defaultView.CSSRule.MEDIA_RULE);
            case "fontface":
                return cssRules.filter((ele) => ele.type === this.doc.defaultView.CSSRule.FONT_FACE_RULE);
            case "import":
                return cssRules.filter((ele) => ele.type === this.doc.defaultView.CSSRule.IMPORT_RULE);
            case "keyframes":
                return cssRules.filter((ele) => ele.type === this.doc.defaultView.CSSRule.KEYFRAMES_RULE);
            default:
                return cssRules;
        }
    }
    isPropertyUsed(property) {
        return this._getStyleRules().some((ele) => ele.style?.getPropertyValue(property));
    }
    getRuleListsWithinMedia(mediaText) {
        const medias = this.getCSSRules("media");
        const cond = medias?.find((x) => x?.media?.mediaText === mediaText);
        const cssRules = cond?.cssRules;
        return Array.from(cssRules || []);
    }
    getStyleSheet() {
        // TODO: Change selector to match exactly 'styles.css'
        const link = this.doc?.querySelector("link[href*='styles']");
        // When using the styles.css tab, we add a 'fcc-injected-styles' class so we can target that. This allows users to add external scripts without them interfering
        const stylesDotCss = this.doc?.querySelector("style.fcc-injected-styles");
        // For steps that use <style> tags, where they don't add the above class - most* browser extensions inject styles with class/media attributes, so it filters those
        const styleTag = this.doc?.querySelector("style:not([class]):not([media])");
        if (link?.sheet?.cssRules?.length) {
            return link.sheet;
        }
        if (stylesDotCss) {
            return stylesDotCss.sheet;
        }
        if (styleTag) {
            return styleTag.sheet;
        }
        return null;
    }
    styleSheetToCssRulesArray(styleSheet) {
        return Array.from(styleSheet?.cssRules || []);
    }
    // Takes a CSS selector, returns all equivalent selectors from the current document
    // or an empty array if there are no matches
    selectorsFromSelector(selector) {
        const elements = this.doc.querySelectorAll(selector);
        const allSelectors = Array.from(elements)
            .map((element) => {
            const directPath = [];
            const indirectPath = [];
            const allPaths = [];
            while (element.parentNode) {
                let tag = element.tagName.toLowerCase();
                const siblings = Array.from(element.parentNode.children);
                if (siblings.filter((e) => e.tagName === element.tagName).length > 1) {
                    const allSiblings = Array.from(element.parentNode.childNodes);
                    const index = allSiblings.indexOf(element);
                    tag += `:nth-child(${index + 1})`;
                }
                directPath.unshift(tag);
                indirectPath.unshift(tag);
                allPaths.push([directPath.join(" > "), indirectPath.join(" ")]);
                // Traverse up the DOM tree
                element = element.parentNode;
            }
            return allPaths.flat();
        })
            .flat();
        // Remove duplicates
        return [...new Set(allSelectors)];
    }
}

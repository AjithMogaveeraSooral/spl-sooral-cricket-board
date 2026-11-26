(() => {
    const key = 'spl-language';
    let language = 'kn';
    try { if (localStorage.getItem(key) === 'en') language = 'en'; } catch {}
    const selector = document.createElement('select');
    selector.className = 'language-select';
    selector.setAttribute('aria-label', 'Language / ಭಾಷೆ');
    selector.add(new Option('English', 'en'));
    selector.add(new Option('ಕನ್ನಡ', 'kn'));
    selector.value = language;
    document.querySelector('#main-nav').append(selector);

    const originals = new WeakMap();
    function update(node, field, read, write) {
        const current = read();
        const saved = originals.get(node)?.[field];
        const original = saved && current === saved.display ? saved.original : current;
        const display = language === 'kn' ? toKannada(original) : original;
        if (display !== current) write(display);
        if (display !== original || saved) originals.set(node, { ...originals.get(node), [field]: { original, display } });
    }
    function render(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.parentElement?.dataset.historyPlayer === node.data) return;
            if (!node.parentElement?.closest('script, style, .language-select')) update(node, 'text', () => node.data, value => { node.data = value; });
        } else if (node.nodeType === Node.ELEMENT_NODE && !node.matches('script, style, .language-select')) {
            for (const field of ['placeholder', 'aria-label', 'title']) {
                if (node.hasAttribute(field)) update(node, field, () => node.getAttribute(field), value => node.setAttribute(field, value));
            }
            for (const child of node.childNodes) render(child);
        }
    }
    const refresh = () => {
        document.documentElement.lang = language;
        render(document.body);
    };
    selector.onchange = () => {
        language = selector.value;
        try { localStorage.setItem(key, language); } catch {}
        refresh();
    };
    refresh();
    new MutationObserver(records => {
        for (const record of records) {
            if (record.type === 'characterData') render(record.target);
            else for (const node of record.addedNodes) render(node);
        }
    }).observe(document.body, { childList: true, characterData: true, subtree: true });
})();
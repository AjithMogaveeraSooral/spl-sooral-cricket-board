function playerKey(name) {
    return String(name || '').replace(/\s*\((?:c|wk)\)/gi, '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function playerHistory(tournaments, name) {
    const key = playerKey(name);
    const history = [];
    for (const season of tournaments || []) {
        for (const match of season.matches || []) {
            const lines = [];
            for (const innings of Object.values(match.detailed_scorecard || {})) {
                for (const row of innings?.batting_stats || []) {
                    if (key && playerKey(row.name) === key) lines.push(`Batting: ${row.runs} (${row.balls} balls) | ${row.fours} fours, ${row.sixes} sixes${row.status ? ` | ${row.status}` : ''}`);
                }
                for (const row of innings?.bowling_stats || []) {
                    if (key && playerKey(row.name) === key) lines.push(`Bowling: ${row.wickets}/${row.runs} in ${row.overs} overs | ${row.maidens ?? 0} maidens`);
                }
            }
            if (lines.length) history.push({ season: season.name, id: match.match_id, teams: match.teams.join(' vs '), result: match.scorecard_summary, lines });
        }
    }
    return history.reverse();
}

function historyButton(name, label = name) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'history-link';
    button.dataset.historyPlayer = name;
    button.textContent = label;
    return button.outerHTML;
}

function enablePlayerHistory(data) {
    const dialog = document.createElement('dialog');
    dialog.className = 'history-dialog';
    dialog.setAttribute('aria-labelledby', 'history-title');
    dialog.innerHTML = `<header><h2 id="history-title"></h2><button type="button" aria-label="Close player history">&times;</button></header><p class="career"></p><h3>Match history</h3><label>Season <select></select></label><div class="history-list"></div>`;
    document.body.append(dialog);
    dialog.querySelector('button').onclick = () => dialog.close();
    const select = dialog.querySelector('select');
    const list = dialog.querySelector('.history-list');
    const append = (parent, tag, text) => {
        const element = document.createElement(tag);
        element.textContent = text;
        parent.append(element);
        return element;
    };
    document.addEventListener('click', event => {
        const trigger = event.target.closest('[data-history-player]');
        if (!trigger) return;
        const name = trigger.dataset.historyPlayer;
        const player = data.players?.find(item => playerKey(item.name) === playerKey(name));
        dialog.querySelector('h2').textContent = player?.name || name;
        dialog.querySelector('.career').textContent = player ? `Career: ${player.matches} matches | ${player.total_runs} runs | ${player.wickets} wickets` : 'Career totals unavailable';
        const history = playerHistory(data.tournaments, name);
        select.replaceChildren(new Option('All seasons', ''));
        for (const season of new Set(history.map(match => match.season))) select.add(new Option(season, season));
        select.parentElement.hidden = select.length < 3;
        select.onchange = () => {
            list.replaceChildren();
            for (const match of history.filter(item => !select.value || item.season === select.value)) {
                const article = append(list, 'article', '');
                append(article, 'small', `${match.season} | ${match.id}`);
                append(article, 'h4', match.teams);
                for (const line of match.lines) append(article, 'p', line);
                append(article, 'small', match.result);
            }
            if (!history.length) append(list, 'p', 'No batting or bowling entries in available scorecards.');
        };
        select.onchange();
        dialog.showModal();
        dialog.scrollTop = 0;
    }, { capture: true });
}
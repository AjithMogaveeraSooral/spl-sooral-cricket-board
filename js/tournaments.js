let allTournaments = [];

const teamBadges = new Map([['Sooral Sixers', 'sixers'], ['Sooral Warriors', 'warriors'], ['Kings Sooral', 'kings'], ['Sooral Bulls', 'bulls']]);

function teamBadge(name) {
    const badge = teamBadges.get(name);
    return badge ? `<img class="team-badge" src="images/teams/${badge}.jpg" width="40" height="40" alt="">` : '';
}

function seasonTeams(matches, rosters) {
    const teams = new Map(Object.keys(rosters).map(name => [name, new Map()]));
    for (const match of matches) {
        const sides = match.teams || [];
        for (const side of sides) if (!teams.has(side)) teams.set(side, new Map());
        for (const innings of Object.values(match.detailed_scorecard || {})) {
            if (!sides.includes(innings?.batting_team)) continue;
            const opponent = sides.find(side => side !== innings.batting_team);
            for (const [side, rows] of [[innings.batting_team, innings.batting_stats], [opponent, innings.bowling_stats]]) {
                for (const row of rows || []) {
                    const key = playerKey(row.name);
                    if (key) teams.get(side)?.set(key, row.name.replace(/\s*\((?:c|wk)\)/gi, '').trim());
                }
            }
        }
    }
    return Array.from(teams, ([name, players]) => ({ name, players: [...players.values()].sort((left, right) => left.localeCompare(right)) })).sort((left, right) => left.name.localeCompare(right.name));
}

function rosterText(value) {
    const span = document.createElement('span');
    span.textContent = value;
    return span.outerHTML;
}

function renderSeasonTeams(matches, rosters = {}) {
    const container = document.getElementById('season-teams');
    const teams = seasonTeams(matches, rosters);
    container.hidden = !teams.length;
    container.querySelector('.roster-grid').innerHTML = teams.map(({ name, players }) => {
        const roster = rosters[name];
        const hasSquad = roster?.squad?.length > 0;
        const names = hasSquad ? roster.squad : players;
        return `<details><summary>${teamBadge(name)} ${rosterText(name)} (${names.length})</summary><p>Owners: ${rosterText(roster?.owners?.join(', ') || 'Not listed')}</p><strong>${hasSquad ? 'Season squad' : 'Squad not entered. Scorecard appearances:'}</strong><div class="roster-names">${names.map(player => historyButton(player)).join('') || 'No appearances recorded.'}</div></details>`;
    }).join('');
}

function generateBattingTable(team, score, stats, inningsNumber) {
    let tableHtml = `
        <div class="team-score-header">
            <span class="team-name">${team}</span>
            <span class="team-score">${score}</span>
        </div>
        <div class="scorecard-table-wrapper">
            <table class="scorecard-table">
                <thead>
                    <tr>
                        <th>Batter</th>
                        <th class="player-status">Status</th>
                        <th class="text-right">R</th>
                        <th class="text-right">B</th>
                        <th class="text-right">4s</th>
                        <th class="text-right">6s</th>
                    </tr>
                </thead>
                <tbody>
    `;
    stats.forEach(s => {
        tableHtml += `
            <tr>
                <td class="player-name">${historyButton(s.name)}</td>
                <td class="player-status">${s.status}</td>
                <td class="text-right stat-runs">${s.runs}</td>
                <td class="text-right">${s.balls}</td>
                <td class="text-right">${s.fours}</td>
                <td class="text-right">${s.sixes}</td>
            </tr>
        `;
    });
    tableHtml += `</tbody></table></div>`;
    return tableHtml;
}

function generateBowlingTable(stats) {
    let tableHtml = `
        <div class="bowling-section-title">Bowling</div>
        <div class="scorecard-table-wrapper">
            <table class="scorecard-table">
                <thead>
                    <tr>
                        <th>Bowler</th>
                        <th class="text-right">O</th>
                        <th class="text-right">R</th>
                        <th class="text-right">W</th>
                    </tr>
                </thead>
                <tbody>
    `;
    stats.forEach(s => {
        tableHtml += `
            <tr>
                <td class="player-name">${historyButton(s.name)}</td>
                <td class="text-right">${s.overs}</td>
                <td class="text-right">${s.runs}</td>
                <td class="text-right stat-wickets">${s.wickets}</td>
            </tr>
        `;
    });
    tableHtml += `</tbody></table></div>`;
    return tableHtml;
}

function populateTournamentSelector(tournaments) {
    const selector = document.getElementById('tournament-selector');
    selector.innerHTML = ''; 
    tournaments.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.name;
        selector.appendChild(option);
    });
}

function createMatchCard(match) {
    return `
        <div class="match-card" onclick="openScorecard('${match.match_id}')">
            <h4 class="match-sides"><span>${teamBadge(match.teams[0])}${match.teams[0]}</span> vs <span>${teamBadge(match.teams[1])}${match.teams[1]}</span></h4>
            <p class="match-winner">${match.winner}</p>
            <p>🏅 ${match.man_of_the_match}</p>
            <p style="font-size: 0.85em; color: var(--accent-color); margin-top: 10px;">Click to view scorecard →</p>
        </div>
    `;
}

function renderMatchCards(matches) {
    const container = document.getElementById('matches-container');
    if (matches.length === 0) {
        container.innerHTML = `<p>No matches found for this season. Check back soon!</p>`;
        return;
    }
    container.innerHTML = matches.map(createMatchCard).join('');
}

function loadMatches() {
    const selector = document.getElementById('tournament-selector');
    const selectedId = selector.value;

    const selectedTournament = allTournaments.find(t => t.id === selectedId);
    renderSeasonTeams(selectedTournament?.matches || [], selectedTournament?.team_rosters);

    if (!selectedId) {
        document.getElementById('matches-container').innerHTML = `
            <div class="empty-matches">
                <div class="icon">🏏</div>
                <p>Select a tournament above to see the matches</p>
            </div>
        `;
        return;
    }

    if (selectedTournament) {
        renderMatchCards(selectedTournament.matches);
    } else {
        document.getElementById('matches-container').innerHTML = `<p>Tournament data not available.</p>`;
    }
}

function openScorecard(matchId) {
    const modal = document.getElementById('scorecard-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    displayScorecard(matchId);
}

function closeScorecard() {
    const modal = document.getElementById('scorecard-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeModal(event) {
    if (event.target.id === 'scorecard-modal') {
        closeScorecard();
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !document.querySelector('.history-dialog[open]')) {
        closeScorecard();
    }
});

function displayScorecard(matchId) {
    const selector = document.getElementById('tournament-selector');
    const selectedId = selector.value;

    const selectedTournament = allTournaments.find(t => t.id === selectedId);
    const match = selectedTournament ? selectedTournament.matches.find(m => m.match_id === matchId) : null;
    
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (match?.detailed_scorecard?.innings1 && match.detailed_scorecard.innings2) {
        const scorecard = match.detailed_scorecard;

        modalTitle.textContent = `${match.teams[0]} vs ${match.teams[1]}`;

        const innings1Batting = generateBattingTable(
            scorecard.innings1.batting_team, 
            scorecard.innings1.score, 
            scorecard.innings1.batting_stats,
            1
        );
        const innings1Bowling = generateBowlingTable(scorecard.innings1.bowling_stats);
        
        const innings2Batting = generateBattingTable(
            scorecard.innings2.batting_team, 
            scorecard.innings2.score, 
            scorecard.innings2.batting_stats,
            2
        );
        const innings2Bowling = generateBowlingTable(scorecard.innings2.bowling_stats);
        
        modalBody.innerHTML = `
            <div class="match-result-banner">
                <div class="result-text">${scorecard.result_summary}</div>
                <div class="mom-text">🏅 Man of the Match: ${match.man_of_the_match}</div>
            </div>
            
            <div class="innings-section">
                <div class="innings-header">
                    <span class="innings-badge">1st</span>
                    <h4>Innings</h4>
                </div>
                ${innings1Batting}
                ${innings1Bowling}
            </div>

            <div class="innings-section">
                <div class="innings-header">
                    <span class="innings-badge">2nd</span>
                    <h4>Innings</h4>
                </div>
                ${innings2Batting}
                ${innings2Bowling}
            </div>
        `;
    } else {
        modalTitle.textContent = match ? match.teams.join(' vs ') : 'Scorecard Not Found';
        modalBody.innerHTML = `<p style="text-align: center; color: #a0a0c0;">Scorecard not found for Match ID: ${matchId} or detailed data is missing.</p>`;
    }
    if (match) modalBody.insertAdjacentHTML('afterbegin', `<section><h3>Playing XI</h3><div class="roster-grid">${match.teams.map(name => {
        const lineup = match.playing_xi?.[name] || [];
        return `<details><summary>${teamBadge(name)} ${rosterText(name)}</summary><div class="roster-names">${lineup.map(player => historyButton(player)).join('') || 'Lineup not entered.'}</div></details>`;
    }).join('')}</div></section>`);
}


async function initTournaments() {
    const data = await fetchSPLData(); 
    if (data && data.tournaments) {
        allTournaments = data.tournaments;
        enablePlayerHistory(data);
        populateTournamentSelector(allTournaments);
        
        document.getElementById('tournament-selector').addEventListener('change', loadMatches);

        if (allTournaments.length > 0) {
            document.getElementById('tournament-selector').value = allTournaments[0].id;
            loadMatches(); 
        }
    }
}

document.addEventListener('DOMContentLoaded', initTournaments);
function safeNum(v, fallback = 0) {
    return (v === undefined || v === null || Number.isNaN(Number(v))) ? fallback : Number(v);
}

function parseBestSpell(spell) {
    if (!spell || typeof spell !== 'string') return { wickets: 0, runs: Infinity };
    const m = spell.trim().match(/(\d+)\s*[\/-]\s*(\d+)/);
    if (!m) return { wickets: 0, runs: Infinity };
    const wickets = parseInt(m[1], 10) || 0;
    const runs = parseInt(m[2], 10);
    return { wickets, runs: Number.isFinite(runs) ? runs : Infinity };
}

function calculateRanks(players) {
    const list = Array.isArray(players) ? [...players] : [];

    const battingSorted = [...list].sort((a, b) => {
        const ha = safeNum(a.highest_score, 0);
        const hb = safeNum(b.highest_score, 0);
        if (hb !== ha) return hb - ha;

        const ra = safeNum(a.total_runs, 0);
        const rb = safeNum(b.total_runs, 0);
        if (rb !== ra) return rb - ra;

        return String(a.player_id || '').localeCompare(String(b.player_id || ''));
    });
    const battingMap = new Map(battingSorted.map((p, i) => [p.player_id, i + 1]));

    const bowlingSorted = [...list].sort((a, b) => {
        const A = parseBestSpell(a.best_spell);
        const B = parseBestSpell(b.best_spell);

        if (B.wickets !== A.wickets) return B.wickets - A.wickets;
        if (A.runs !== B.runs) return A.runs - B.runs;

        const wa = safeNum(a.wickets, 0);
        const wb = safeNum(b.wickets, 0);
        if (wb !== wa) return wb - wa;

        return String(a.player_id || '').localeCompare(String(b.player_id || ''));
    });
    const bowlingMap = new Map(bowlingSorted.map((p, i) => [p.player_id, i + 1]));

    const allrounderSorted = [...list].sort((a, b) => {
        const ra = safeNum(a.all_rounder_rating, 0);
        const rb = safeNum(b.all_rounder_rating, 0);
        if (rb !== ra) return rb - ra;

        const ca = safeNum(a.total_runs, 0) + safeNum(a.wickets, 0);
        const cb = safeNum(b.total_runs, 0) + safeNum(b.wickets, 0);
        if (cb !== ca) return cb - ca;

        return String(a.player_id || '').localeCompare(String(b.player_id || ''));
    });
    const allrounderMap = new Map(allrounderSorted.map((p, i) => [p.player_id, i + 1]));

    const sixesSorted = [...list].sort((a, b) => {
        const sa = safeNum(a.sixes, 0);
        const sb = safeNum(b.sixes, 0);
        if (sb !== sa) return sb - sa;
        return safeNum(b.total_runs, 0) - safeNum(a.total_runs, 0);
    });

    const rankedPlayers = list.map(player => ({
        ...player,
        batting_rank: battingMap.get(player.player_id) || null,
        bowling_rank: bowlingMap.get(player.player_id) || null,
        allrounder_rank: allrounderMap.get(player.player_id) || null
    }));

    return {
        rankedPlayers,
        topBatter: battingSorted[0] || null,
        topBowler: bowlingSorted[0] || null,
        topAllrounder: allrounderSorted[0] || null,
        highestSixHitter: sixesSorted[0] || null,
        battingSorted,
        bowlingSorted,
        allrounderSorted,
        sixesSorted
    };
}

function calculateLeader(players) {
    const battingSorted = [...players].sort((a, b) => safeNum(b.total_runs, 0) - safeNum(a.total_runs, 0));
    const bowlingSorted = [...players].sort((a, b) => safeNum(b.wickets, 0) - safeNum(a.wickets, 0));
    const highestSixHitterSorted = [...players].sort((a, b) => safeNum(b.sixes, 0) - safeNum(a.sixes, 0));
    
    return {
        topBatter: battingSorted[0] || null,
        topBowler: bowlingSorted[0] || null,
        highestSixHitter: highestSixHitterSorted[0] || null,
    };
}

async function initHomeStats() {
    const data = await fetchSPLData();
    if (!data) return;

    const players = Array.isArray(data.players) ? data.players : [];

    const {
        rankedPlayers,
        topBatter,
        topBowler,
        topAllrounder,
        highestSixHitter,
        battingSorted,
        bowlingSorted,
        allrounderSorted
    } = calculateRanks(players);

    const lifetimeLeaders = calculateLeader(players);

    const totalTournaments = Array.isArray(data.tournaments) ? data.tournaments.length : 0;
    const totalMatches = (Array.isArray(data.tournaments) ? data.tournaments : [])
        .reduce((sum, t) => sum + (Array.isArray(t.matches) ? t.matches.length : 0), 0);
    const totalPlayers = players.length;

    const setHtml = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    };

    setHtml('total-tournaments', `<h3>${totalTournaments}</h3><p>Total Tournaments</p>`);
    setHtml('total-matches', `<h3>${totalMatches}</h3><p>Total Matches Played</p>`);
    setHtml('total-players', `<h3>${totalPlayers}</h3><p>Total Players Registered</p>`);

    const createLeaderCard = (player, title, statLabel, statValue) => {
        if (!player) return `<h3>${title}</h3><p>No data</p>`;
        const imageUrl = player.profile_image_url || 'images/default_player.jpg';
        return `
            <h3>${title}</h3>
            <div style="display:flex; align-items: center; justify-content: center; flex-direction: column; text-align: center;">
                <img src="${imageUrl}" alt="${player.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; border: 3px solid var(--accent-color); margin-bottom: 10px;">
                <p style="font-size: 1.2em; margin: 0;"><strong>${player.name}</strong></p>
                <p style="font-size: 0.9em; margin-top: 5px; color: var(--accent-color);">${statLabel}: ${statValue}</p>
            </div>
        `;
    };

    setHtml('highest-scorer-card', createLeaderCard(
        lifetimeLeaders.topBatter,
        'Highest Scorer 🏏',
        'Total Runs',
        lifetimeLeaders.topBatter ? safeNum(lifetimeLeaders.topBatter.total_runs, 0) : 0
    ));

    setHtml('top-bowler-card', createLeaderCard(
        lifetimeLeaders.topBowler,
        'Top Wicket Taker 🥎',
        'Total Wickets',
        lifetimeLeaders.topBowler ? safeNum(lifetimeLeaders.topBowler.wickets, 0) : 0
    ));

    setHtml('highest-six-hitter-card', createLeaderCard(
        lifetimeLeaders.highestSixHitter,
        'Highest Six Hitter 💥',
        'Total Sixes',
        lifetimeLeaders.highestSixHitter ? safeNum(lifetimeLeaders.highestSixHitter.sixes, 0) : 0
    ));

    const createRank1Card = (player, rankType, statValue) => {
        if (!player) return `<div class="player-card" style="width:100%;text-align:center;background-color:rgba(2,244,212,0.06);padding:12px;border-radius:8px;"><h3>#1 ${rankType}</h3><p>No data</p></div>`;
        const imageUrl = player.profile_image_url || 'images/default_player.jpg';
        return `
            <div class="player-card" style="width: 100%; text-align: center; background-color: rgba(2, 244, 212, 0.1); padding: 12px; border-radius: 8px;">
                <h3 style="color: white; border-bottom: 1px solid var(--accent-color); padding-bottom: 5px; margin-bottom: 10px;">#1 ${rankType}</h3>
                <img src="${imageUrl}" alt="${player.name}" style="width: 90px; height: 90px; object-fit: cover; border-radius: 50%; border: 4px solid var(--accent-color); margin-bottom: 10px;">
                <p style="font-size: 1.2em; font-weight: bold; margin: 0; color: white;">${player.name}</p>
                <p style="font-size: 1em; color: var(--accent-color); margin-top: 5px;">${statValue}</p>
            </div>
        `;
    };

    setHtml('rank-1-batter-card', createRank1Card(topBatter, 'BATTER', topBatter ? `${safeNum(topBatter.highest_score, 0)} Highest` : '0'));
    setHtml('rank-1-bowler-card', createRank1Card(topBowler, 'BOWLER', topBowler ? `${topBowler.wickets || '0'}` : '0-0'));
    setHtml('rank-1-allrounder-card', createRank1Card(topAllrounder, 'ALL-ROUNDER', topAllrounder ? `${Math.round(safeNum(topAllrounder.all_rounder_rating, 0))} Rating` : '0 Rating'));

    const createRankingList = (playersArray, rankingType) => {
        if (!Array.isArray(playersArray)) return '';
        let listHTML = '';
        playersArray.slice(0, 3).forEach((player, index) => {
            let statValue = '';
            if (rankingType === 'batting') statValue = `${safeNum(player.highest_score, 0)} Highest`;
            else if (rankingType === 'bowling') statValue = `${player.wickets || '0'}`;
            else statValue = `${Math.round(safeNum(player.all_rounder_rating, 0))} Rating`;

            const rankStyle = index === 0 ? 'color: var(--accent-color); font-weight: bold; font-size: 1.05em;' : 'color: white;';
            const rankEmoji = index === 0 ? '🥇' : (index === 1 ? '🥈' : '🥉');

            listHTML += `
                <li style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; justify-content: space-between; align-items: center; ${rankStyle}">
                    <span>${rankEmoji} ${player.name}</span>
                    <span style="font-weight: normal; font-size: 0.95em; color: var(--accent-color);">${statValue}</span>
                </li>
            `;
        });
        return listHTML;
    };

    const setList = (selector, html) => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = html;
    };

    setList('#batting-ranking ul', battingSorted ? createRankingList(battingSorted, 'batting') : '');
    setList('#bowling-ranking ul', bowlingSorted ? createRankingList(bowlingSorted, 'bowling') : '');
    setList('#allrounder-ranking ul', allrounderSorted ? createRankingList(allrounderSorted, 'allrounder') : '');
}

document.addEventListener('DOMContentLoaded', initHomeStats);

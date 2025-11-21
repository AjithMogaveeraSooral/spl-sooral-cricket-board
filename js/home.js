function calculateRanks(players) {
    const battingSorted = [...players].sort((a, b) => b.total_runs - a.total_runs);
    const bowlingSorted = [...players].sort((a, b) => b.wickets - a.wickets);
    const allrounderSorted = [...players].sort((a, b) => b.all_rounder_rating - a.all_rounder_rating);
    
    return {
        topBatter: battingSorted[0],
        topBowler: bowlingSorted[0],
        topAllrounder: allrounderSorted[0],
        battingRanked: battingSorted,
        bowlingRanked: bowlingSorted,
        allrounderRanked: allrounderSorted
    };
}


async function initHomeStats() {
    const data = await fetchSPLData();
    if (!data) return;

    const players = data.players;
    const { topBatter, topBowler, topAllrounder, battingRanked, bowlingRanked, allrounderRanked } = calculateRanks(players);


    const totalTournaments = data.tournaments.length;
    const totalMatches = data.tournaments.reduce((sum, t) => sum + (t.matches ? t.matches.length : 0), 0);
    const totalPlayers = data.players.length;

    document.getElementById('total-tournaments').innerHTML = `<h3>${totalTournaments}</h3><p>Total Tournaments</p>`;
    document.getElementById('total-matches').innerHTML = `<h3>${totalMatches}</h3><p>Total Matches Played</p>`;
    document.getElementById('total-players').innerHTML = `<h3>${totalPlayers}</h3><p>Total Players Registered</p>`;


    const createLeaderCard = (player, title, statLabel, statValue) => {
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

    const highestScorer = players.reduce((max, player) => player.total_runs > max.total_runs ? player : max, players[0]);
    const highestSixHitter = players.reduce((max, player) => player.sixes > max.sixes ? player : max, players[0]);
    
    document.getElementById('highest-scorer-card').innerHTML = createLeaderCard(highestScorer, 'Highest Scorer 🏏', 'Runs', highestScorer.total_runs);
    document.getElementById('top-bowler-card').innerHTML = createLeaderCard(topBowler, 'Top Wicket Taker 🥎', 'Wickets', topBowler.wickets);
    document.getElementById('highest-six-hitter-card').innerHTML = createLeaderCard(highestSixHitter, 'Highest Six Hitter 💥', 'Total Sixes', highestSixHitter.sixes);

    const createRank1Card = (player, rankType, statValue) => {
        const imageUrl = player.profile_image_url || 'images/default_player.jpg';
        return `
            <div class="player-card" style="width: 100%; text-align: center; background-color: rgba(2, 244, 212, 0.1);">
                <h3 style="color: white; border-bottom: 1px solid var(--accent-color); padding-bottom: 5px; margin-bottom: 10px;">#1 ${rankType}</h3>
                <img src="${imageUrl}" alt="${player.name}" style="width: 90px; height: 90px; object-fit: cover; border-radius: 50%; border: 4px solid var(--accent-color); margin-bottom: 10px;">
                <p style="font-size: 1.4em; font-weight: bold; margin: 0; color: white;">${player.name}</p>
                <p style="font-size: 1.1em; color: var(--accent-color); margin-top: 5px;">${statValue}</p>
            </div>
        `;
    };

    document.getElementById('rank-1-batter-card').innerHTML = createRank1Card(topBatter, 'BATTER', `${topBatter.total_runs} Runs`);
    document.getElementById('rank-1-bowler-card').innerHTML = createRank1Card(topBowler, 'BOWLER', `${topBowler.wickets} Wickets`);
    document.getElementById('rank-1-allrounder-card').innerHTML = createRank1Card(topAllrounder, 'ALL-ROUNDER', `${Math.round(topAllrounder.all_rounder_rating)} Rating`);

    const createRankingList = (playersArray, rankingType) => {
        let listHTML = '';
        playersArray.slice(0, 3).forEach((player, index) => {
            let statValue;
            let statLabel;
            if (rankingType === 'batting') {
                statValue = player.total_runs;
                statLabel = 'Runs';
            } else if (rankingType === 'bowling') {
                statValue = player.wickets;
                statLabel = 'Wickets';
            } else if (rankingType === 'allrounder') {
                statValue = Math.round(player.all_rounder_rating);
                statLabel = 'Rating';
            }

            const rankStyle = index === 0 ? 'color: var(--accent-color); font-weight: bold; font-size: 1.1em;' : 'color: white;';
            const rankEmoji = index === 0 ? '🥇' : (index === 1 ? '🥈' : '🥉');

            listHTML += `
                <li style="padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; ${rankStyle}">
                    <span>${rankEmoji} ${player.name}</span>
                    <span style="font-weight: normal; font-size: 0.9em; color: var(--accent-color);">${statValue} ${statLabel}</span>
                </li>
            `;
        });
        return listHTML;
    };

    document.querySelector('#batting-ranking ul').innerHTML = createRankingList(battingRanked, 'batting');
    document.querySelector('#bowling-ranking ul').innerHTML = createRankingList(bowlingRanked, 'bowling');
    document.querySelector('#allrounder-ranking ul').innerHTML = createRankingList(allrounderRanked, 'allrounder');
}

document.addEventListener('DOMContentLoaded', initHomeStats);
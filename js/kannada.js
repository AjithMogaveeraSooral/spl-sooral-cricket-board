const kannadaLabels = {
    'Home': 'ಮುಖಪುಟ', 'Tournaments': 'ಪಂದ್ಯಾವಳಿಗಳು', 'Leaderboard': 'ಅಂಕಪಟ್ಟಿ', 'Players': 'ಆಟಗಾರರು', 'Player Stats': 'ಆಟಗಾರರ ಅಂಕಿಅಂಶಗಳು',
    'Sooral Premier League': 'ಸೂರಾಲ್ ಪ್ರೀಮಿಯರ್ ಲೀಗ್', 'Welcome to the SPL!': 'ಎಸ್‌ಪಿಎಲ್‌ಗೆ ಸ್ವಾಗತ!',
    'The premier cricket tournament in Sooral, featuring 5 seasons of exciting action. All lifetime statistics are updated here.': 'ಸೂರಾಲ್‌ನ ಪ್ರಮುಖ ಕ್ರಿಕೆಟ್ ಪಂದ್ಯಾವಳಿಯ ಐದು ಆವೃತ್ತಿಗಳ ಆಟ ಮತ್ತು ಒಟ್ಟಾರೆ ಅಂಕಿಅಂಶಗಳು ಇಲ್ಲಿವೆ.',
    'Player Statistics': 'ಆಟಗಾರರ ಅಂಕಿಅಂಶಗಳು', 'Explore lifetime records of all SPL players': 'ಎಲ್ಲ ಎಸ್‌ಪಿಎಲ್ ಆಟಗಾರರ ವೃತ್ತಿಜೀವನದ ದಾಖಲೆಗಳು',
    'Tournaments & Matches': 'ಪಂದ್ಯಾವಳಿಗಳು ಮತ್ತು ಪಂದ್ಯಗಳು', 'Explore all SPL seasons and match details': 'ಎಸ್‌ಪಿಎಲ್‌ನ ಎಲ್ಲ ಆವೃತ್ತಿಗಳು ಮತ್ತು ಪಂದ್ಯಗಳ ವಿವರಗಳು',
    'Select Season:': 'ಆವೃತ್ತಿ ಆಯ್ಕೆಮಾಡಿ:', '-- Choose a Season --': '-- ಆವೃತ್ತಿ ಆಯ್ಕೆಮಾಡಿ --', 'Select Tournament': 'ಪಂದ್ಯಾವಳಿ ಆಯ್ಕೆಮಾಡಿ', 'Season': 'ಆವೃತ್ತಿ', 'All seasons': 'ಎಲ್ಲ ಆವೃತ್ತಿಗಳು',
    'Teams': 'ತಂಡಗಳು', 'Matches': 'ಪಂದ್ಯಗಳು', 'Playing XI': 'ಆಡುವ ಹನ್ನೊಂದು ಆಟಗಾರರು', 'Season squad': 'ಆವೃತ್ತಿಯ ತಂಡ', 'Owners:': 'ಮಾಲೀಕರು:', 'Not listed': 'ಮಾಹಿತಿ ಇಲ್ಲ',
    'Squad not entered. Scorecard appearances:': 'ತಂಡದ ಪಟ್ಟಿ ಲಭ್ಯವಿಲ್ಲ. ಸ್ಕೋರ್‌ಕಾರ್ಡ್‌ನಲ್ಲಿ ಕಾಣಿಸಿದ ಆಟಗಾರರು:', 'No appearances recorded.': 'ಆಟಗಾರರ ದಾಖಲೆ ಇಲ್ಲ.', 'Lineup not entered.': 'ಆಟಗಾರರ ಪಟ್ಟಿಯನ್ನು ಇನ್ನೂ ದಾಖಲಿಸಿಲ್ಲ.',
    'Click to view scorecard →': 'ಸ್ಕೋರ್‌ಕಾರ್ಡ್ ನೋಡಿ →', 'Tap for details': 'ವಿವರಗಳನ್ನು ನೋಡಿ', 'View Full Scorecard': 'ಸಂಪೂರ್ಣ ಸ್ಕೋರ್‌ಕಾರ್ಡ್ ನೋಡಿ', 'Match Scorecard': 'ಪಂದ್ಯದ ಸ್ಕೋರ್‌ಕಾರ್ಡ್', 'Scorecard': 'ಸ್ಕೋರ್‌ಕಾರ್ಡ್', 'Summary': 'ಸಾರಾಂಶ', 'Match Result': 'ಪಂದ್ಯದ ಫಲಿತಾಂಶ', 'Man of the Match': 'ಪಂದ್ಯಶ್ರೇಷ್ಠ', 'WINNER': 'ವಿಜೇತ', 'VS': 'ವಿರುದ್ಧ', 'vs': 'ವಿರುದ್ಧ',
    'Match history': 'ಪಂದ್ಯಗಳ ಇತಿಹಾಸ', 'Career totals unavailable': 'ವೃತ್ತಿಜೀವನದ ಅಂಕಿಅಂಶಗಳು ಲಭ್ಯವಿಲ್ಲ', 'No batting or bowling entries in available scorecards.': 'ಲಭ್ಯವಿರುವ ಸ್ಕೋರ್‌ಕಾರ್ಡ್‌ಗಳಲ್ಲಿ ಬ್ಯಾಟಿಂಗ್ ಅಥವಾ ಬೌಲಿಂಗ್ ದಾಖಲೆಗಳಿಲ್ಲ.',
    'Search players...': 'ಆಟಗಾರರನ್ನು ಹುಡುಕಿ...', 'Search players by name...': 'ಹೆಸರಿನಿಂದ ಆಟಗಾರರನ್ನು ಹುಡುಕಿ...', 'Sort By:': 'ವಿಂಗಡಿಸಿ:', 'Sort by': 'ವಿಂಗಡಿಸಿ', 'Name': 'ಹೆಸರು', 'Player Name (A-Z)': 'ಆಟಗಾರರ ಹೆಸರು (A-Z)',
    'Batting': 'ಬ್ಯಾಟಿಂಗ್', 'Bowling': 'ಬೌಲಿಂಗ್', 'Allrounder': 'ಆಲ್‌ರೌಂಡರ್', 'All-rounder': 'ಆಲ್‌ರೌಂಡರ್', 'Bat': 'ಬ್ಯಾಟಿಂಗ್', 'Bowl': 'ಬೌಲಿಂಗ್', 'AllR': 'ಆಲ್‌ರೌಂಡರ್', 'Batter': 'ಬ್ಯಾಟರ್', 'Bowler': 'ಬೌಲರ್', 'Player': 'ಆಟಗಾರ', 'Status': 'ಸ್ಥಿತಿ', 'Innings': 'ಇನಿಂಗ್ಸ್', '1st': 'ಮೊದಲ', '2nd': 'ಎರಡನೇ',
    'Runs': 'ರನ್‌ಗಳು', 'Wickets': 'ವಿಕೆಟ್‌ಗಳು', 'Overs': 'ಓವರ್‌ಗಳು', 'Balls': 'ಚೆಂಡುಗಳು', 'Best': 'ಅತ್ಯುತ್ತಮ', 'Fours': 'ಬೌಂಡರಿಗಳು', 'Sixes': 'ಸಿಕ್ಸರ್‌ಗಳು', 'Economy': 'ಎಕಾನಮಿ', 'Best Bowling': 'ಅತ್ಯುತ್ತಮ ಬೌಲಿಂಗ್', 'High Score': 'ಗರಿಷ್ಠ ಸ್ಕೋರ್', 'Highest Score': 'ಗರಿಷ್ಠ ಸ್ಕೋರ್', 'Total Runs': 'ಒಟ್ಟು ರನ್‌ಗಳು', 'Total Wickets': 'ಒಟ್ಟು ವಿಕೆಟ್‌ಗಳು', 'Batting SR': 'ಬ್ಯಾಟಿಂಗ್ ಸ್ಟ್ರೈಕ್ ರೇಟ್',
    'Batting Rank': 'ಬ್ಯಾಟಿಂಗ್ ಶ್ರೇಣಿ', 'Bowling Rank': 'ಬೌಲಿಂಗ್ ಶ್ರೇಣಿ', 'All-rounder Rank': 'ಆಲ್‌ರೌಂಡರ್ ಶ್ರೇಣಿ', 'Bat Rank': 'ಬ್ಯಾಟಿಂಗ್ ಶ್ರೇಣಿ', 'Bowl Rank': 'ಬೌಲಿಂಗ್ ಶ್ರೇಣಿ', 'AllR Rank': 'ಆಲ್‌ರೌಂಡರ್ ಶ್ರೇಣಿ', 'Batting Stats': 'ಬ್ಯಾಟಿಂಗ್ ಅಂಕಿಅಂಶಗಳು', 'Bowling Stats': 'ಬೌಲಿಂಗ್ ಅಂಕಿಅಂಶಗಳು',
    'Total Tournaments': 'ಒಟ್ಟು ಪಂದ್ಯಾವಳಿಗಳು', 'Total Matches Played': 'ಒಟ್ಟು ಪಂದ್ಯಗಳು', 'Total Players Registered': 'ಒಟ್ಟು ನೋಂದಾಯಿತ ಆಟಗಾರರು', 'League Leaders': 'ಲೀಗ್ ಮುಂಚೂಣಿಗರು', 'League Leaders (Lifetime)': 'ಲೀಗ್ ಮುಂಚೂಣಿಗರು (ಒಟ್ಟಾರೆ)', 'SPL Rank 1 Holders': 'ಎಸ್‌ಪಿಎಲ್ ಪ್ರಥಮ ಶ್ರೇಣಿಯ ಆಟಗಾರರು', 'SPL Rankings': 'ಎಸ್‌ಪಿಎಲ್ ಶ್ರೇಯಾಂಕಗಳು',
    'Top Batting': 'ಅಗ್ರ ಬ್ಯಾಟರ್‌ಗಳು', 'Top Bowling': 'ಅಗ್ರ ಬೌಲರ್‌ಗಳು', 'Top All-rounder': 'ಅಗ್ರ ಆಲ್‌ರೌಂಡರ್‌ಗಳು', 'Season Statistics': 'ಆವೃತ್ತಿಯ ಅಂಕಿಅಂಶಗಳು', 'Top Scorer': 'ಅತಿ ಹೆಚ್ಚು ರನ್ ಗಳಿಸಿದವರು', 'Top Wicket Taker': 'ಅತಿ ಹೆಚ್ಚು ವಿಕೆಟ್ ಪಡೆದವರು', 'Most Runs': 'ಅತಿ ಹೆಚ್ಚು ರನ್‌ಗಳು', 'Most Wickets': 'ಅತಿ ಹೆಚ್ಚು ವಿಕೆಟ್‌ಗಳು', 'Most Fours': 'ಅತಿ ಹೆಚ್ಚು ಬೌಂಡರಿಗಳು', 'Most Sixes': 'ಅತಿ ಹೆಚ್ಚು ಸಿಕ್ಸರ್‌ಗಳು', 'Highest Six Hitter': 'ಅತಿ ಹೆಚ್ಚು ಸಿಕ್ಸರ್ ಬಾರಿಸಿದವರು', 'Highest Fours Hitter': 'ಅತಿ ಹೆಚ್ಚು ಬೌಂಡರಿ ಬಾರಿಸಿದವರು',
    '#1 Ranked Players': 'ಪ್ರಥಮ ಶ್ರೇಣಿಯ ಆಟಗಾರರು', 'Top 5 Rankings': 'ಅಗ್ರ 5 ಶ್ರೇಯಾಂಕಗಳು', 'Batting Rankings': 'ಬ್ಯಾಟಿಂಗ್ ಶ್ರೇಯಾಂಕಗಳು', 'Bowling Rankings': 'ಬೌಲಿಂಗ್ ಶ್ರೇಯಾಂಕಗಳು', 'Allrounder Rankings': 'ಆಲ್‌ರೌಂಡರ್ ಶ್ರೇಯಾಂಕಗಳು',
    'No data': 'ಮಾಹಿತಿ ಇಲ್ಲ', 'No data available': 'ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ', 'No rankings available': 'ಶ್ರೇಯಾಂಕಗಳು ಲಭ್ಯವಿಲ್ಲ', 'No players found': 'ಆಟಗಾರರು ಕಂಡುಬಂದಿಲ್ಲ', 'No matches found': 'ಪಂದ್ಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ', 'Try Again': 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ', 'Try adjusting your search': 'ಬೇರೆ ಹೆಸರು ಹುಡುಕಿ', 'Select a different tournament': 'ಬೇರೆ ಪಂದ್ಯಾವಳಿ ಆಯ್ಕೆಮಾಡಿ', 'Close player history': 'ಪಂದ್ಯಗಳ ಇತಿಹಾಸ ಮುಚ್ಚಿ', 'Go back': 'ಹಿಂದಕ್ಕೆ',
    'Loading Players...': 'ಆಟಗಾರರ ಮಾಹಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...', 'Loading Tournaments...': 'ಪಂದ್ಯಾವಳಿಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...', 'Loading Leaderboard...': 'ಅಂಕಪಟ್ಟಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...', 'Loading SPL Data...': 'ಎಸ್‌ಪಿಎಲ್ ಮಾಹಿತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...', 'pts': 'ಅಂಕಗಳು',
    'Highest Scorer 🏏': 'ಅತಿ ಹೆಚ್ಚು ರನ್ ಗಳಿಸಿದವರು 🏏', 'Top Wicket Taker 🥎': 'ಅತಿ ಹೆಚ್ಚು ವಿಕೆಟ್ ಪಡೆದವರು 🥎', 'Highest Six Hitter 💥': 'ಅತಿ ಹೆಚ್ಚು ಸಿಕ್ಸರ್ ಬಾರಿಸಿದವರು 💥',
    '#1 BATTER': 'ಅಗ್ರ ಬ್ಯಾಟರ್', '#1 BOWLER': 'ಅಗ್ರ ಬೌಲರ್', '#1 ALL-ROUNDER': 'ಅಗ್ರ ಆಲ್‌ರೌಂಡರ್', 'TOP 5': 'ಅಗ್ರ 5',
    'Update Required': 'ನವೀಕರಣ ಅಗತ್ಯ', 'Update Now': 'ಈಗ ನವೀಕರಿಸಿ', 'Current Version:': 'ಪ್ರಸ್ತುತ ಆವೃತ್ತಿ:', 'Latest Version:': 'ಹೊಸ ಆವೃತ್ತಿ:', "What's New:": 'ಹೊಸದೇನು:', 'Bug fixes and improvements': 'ದೋಷ ತಿದ್ದುಪಡಿಗಳು ಮತ್ತು ಸುಧಾರಣೆಗಳು', 'Enhanced performance': 'ಸುಧಾರಿತ ಕಾರ್ಯಕ್ಷಮತೆ', 'New features added': 'ಹೊಸ ಸೌಲಭ್ಯಗಳು',
    '© 2026 Sooral Premier League': '© 2026 ಸೂರಾಲ್ ಪ್ರೀಮಿಯರ್ ಲೀಗ್', 'Made with ❤️ for Cricket': 'ಕ್ರಿಕೆಟ್ ಪ್ರೀತಿಯಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ ❤️'
};

function toKannada(value) {
    if (typeof value !== 'string') return value;
    const text = value.trim();
    const label = text.replace(/^[^\p{L}\p{N}#-]+\s*/u, '');
    const translated = Object.prototype.hasOwnProperty.call(kannadaLabels, text) ? kannadaLabels[text] : Object.prototype.hasOwnProperty.call(kannadaLabels, label) ? text.replace(label, kannadaLabels[label]) : text
        .replace(/^(SPL - |🏏 )?Season (?=\d)/, '$1ಆವೃತ್ತಿ ')
        .replace(/^(Owners|Batting|Bowling|Runs|Wickets|Balls|Overs|Best|Man of the Match):/, key => (kannadaLabels[key] || kannadaLabels[key.slice(0,-1)]) + (key === 'Owners:' ? '' : ':'))
        .replace(/^Career:/, 'ವೃತ್ತಿಜೀವನ:')
        .replace(/(\d+) (matches|runs|wickets|balls|fours|sixes|overs|maidens|Matches|Match)\b/g, (_, count, unit) => `${count} ${{matches:'ಪಂದ್ಯಗಳು',runs:'ರನ್‌ಗಳು',wickets:'ವಿಕೆಟ್‌ಗಳು',balls:'ಚೆಂಡುಗಳು',fours:'ಬೌಂಡರಿಗಳು',sixes:'ಸಿಕ್ಸರ್‌ಗಳು',overs:'ಓವರ್‌ಗಳು',maidens:'ಮೇಡನ್‌ಗಳು',Matches:'ಪಂದ್ಯಗಳು',Match:'ಪಂದ್ಯ'}[unit]}`);
    return translated === text ? value : value.replace(text, () => translated);
}

if (typeof module !== 'undefined') module.exports = { toKannada };
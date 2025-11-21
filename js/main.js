async function fetchSPLData() {
    try {
        const response = await fetch('data/spl_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Could not fetch SPL data:", error);
        return null;
    }
}

async function initAnnouncement() {
    const data = await fetchSPLData();
    const announcementBar = document.getElementById('announcement-bar');
    if (data && data.announcements.length > 0) {
        announcementBar.textContent = data.announcements[0].text;
    } else {
        announcementBar.textContent = "Sooral Premier League - Welcome!";
    }
}

document.addEventListener('DOMContentLoaded', initAnnouncement);
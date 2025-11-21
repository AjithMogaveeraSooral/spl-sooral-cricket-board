// Function to fetch the static JSON data
async function fetchSPLData() {
    try {
        // Use a relative path to the data file
        const response = await fetch('data/spl_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Could not fetch SPL data:", error);
        // Fallback or error display logic can go here
        return null;
    }
}

// Function to populate the announcement bar
async function initAnnouncement() {
    const data = await fetchSPLData();
    const announcementBar = document.getElementById('announcement-bar');
    if (data && data.announcements.length > 0) {
        // Get the latest announcement (assuming the first is the latest)
        announcementBar.textContent = data.announcements[0].text;
    } else {
        announcementBar.textContent = "Sooral Premier League - Welcome!";
    }
}

// Run the announcement initializer on every page load
document.addEventListener('DOMContentLoaded', initAnnouncement);
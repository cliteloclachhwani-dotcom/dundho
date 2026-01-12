let crewMaster = [];
let stationMaster = [];

// 1. Load Master Files on Start
window.onload = function() {
    // Load Stations for Dropdowns
    Papa.parse("master/station.csv", {
        download: true, header: true, skipEmptyLines: true,
        complete: function(results) {
            stationMaster = results.data;
            fillDropdowns();
        }
    });

    // Load Crew Master for Auto-fill [cite: 2026-01-08]
    Papa.parse("master/crew_master.csv", {
        download: true, header: true, skipEmptyLines: true,
        complete: function(results) {
            crewMaster = results.data;
        }
    });
};

function fillDropdowns() {
    const fromSelect = document.getElementById('stn_from');
    const toSelect = document.getElementById('stn_to');
    
    let options = stationMaster.map(stn => {
        let name = stn.Station_Name || stn.STATION || stn.NAME;
        return `<option value="${name}">${name}</option>`;
    }).join('');

    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;
}

function autoFillCrew(type) {
    const idVal = document.getElementById(type + '_id').value.toUpperCase();
    
    // Pure master list se search karein [cite: 2026-01-08]
    const member = crewMaster.find(c => (c.CREW_ID || c.ID) === idVal);

    if (member) {
        document.getElementById(type + '_name').innerText = member.CREW_NAME || member.NAME || "-";
        document.getElementById(type + '_desig').innerText = member.DESIGNATION || member.DESIG || "-";
        document.getElementById(type + '_cli').innerText = member.G_CLI || member.CLI_NAME || "-";
    } else {
        document.getElementById(type + '_name').innerText = "-";
        document.getElementById(type + '_desig').innerText = "-";
        document.getElementById(type + '_cli').innerText = "-";
    }
}

function processAndGo() {
    // Agle page par jane ka logic yahan aayega
    alert("Data saved! Moving to Interactive Map...");
    // window.location.href = "interactive_map.html"; 
}

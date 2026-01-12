let crewMaster = [];
let stationMaster = [];

window.onload = function() {
    // Load Stations for Dropdowns
    Papa.parse("master/station.csv", {
        download: true, header: true, skipEmptyLines: true,
        complete: function(r) { 
            stationMaster = r.data; 
            const selects = [document.getElementById('stn_from'), document.getElementById('stn_to')];
            let options = stationMaster.map(s => `<option value="${s.STATION || s.Station_Name}">${s.STATION || s.Station_Name}</option>`).join('');
            selects.forEach(s => s.innerHTML = options);
        }
    });

    // Load Crew Master [cite: 2026-01-08]
    Papa.parse("master/crew_master.csv", {
        download: true, header: true, skipEmptyLines: true,
        complete: function(r) { crewMaster = r.data; }
    });
};

function autoFillCrew(type) {
    const idVal = document.getElementById(type + '_id').value.toUpperCase().trim();
    const member = crewMaster.find(c => (c.CREW_ID || c.ID || "").toString().toUpperCase() === idVal);
    if (member) {
        document.getElementById(type + '_name').innerText = member.CREW_NAME || member.NAME;
        document.getElementById(type + '_desig').innerText = member.DESIGNATION || member.DESIG;
        document.getElementById(type + '_cli').innerText = member.G_CLI || member.CLI_NAME;
    }
}

function processAndGo() {
    const fileInput = document.getElementById('rtis_file');
    if (!fileInput.files[0]) { alert("RTIS file select karein!"); return; }

    const reader = new FileReader();
    reader.onload = function(e) {
        localStorage.setItem('rtisData', e.target.result);
        localStorage.setItem('auditMeta', JSON.stringify({
            train: document.getElementById('train_no').value,
            lp: document.getElementById('lp_name').innerText
        }));
        window.location.href = "map_view.html";
    };
    reader.readAsText(fileInput.files[0]);
}

let crewMaster = [];
let stationMaster = [];

window.onload = function() {
    // 1. Load Station Master for Dropdowns
    Papa.parse("master/station.csv", {
        download: true, header: true, skipEmptyLines: true,
        complete: function(r) { 
            stationMaster = r.data; 
            fillDropdowns(); 
        }
    });

    // 2. Load Crew Master [cite: 2026-01-08]
    Papa.parse("master/crew_master.csv", {
        download: true, header: true, skipEmptyLines: true,
        complete: function(r) { crewMaster = r.data; }
    });
};

function fillDropdowns() {
    const fromS = document.getElementById('stn_from');
    const toS = document.getElementById('stn_to');
    let options = '<option value="">--Select--</option>' + 
        stationMaster.map(stn => {
            let n = stn.Station_Name || stn.STATION || stn.NAME;
            return `<option value="${n}">${n}</option>`;
        }).join('');
    fromS.innerHTML = options;
    toS.innerHTML = options;
}

function autoFillCrew(type) {
    const idVal = document.getElementById(type + '_id').value.toUpperCase().trim();
    // Crew search across all designations [cite: 2026-01-08]
    const member = crewMaster.find(c => (c.CREW_ID || c.ID || c.CLI_ID || "").toString().toUpperCase().trim() === idVal);

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
    const fileInput = document.getElementById('rtis_file');
    const trainNo = document.getElementById('train_no').value;
    
    if (!fileInput.files[0]) { alert("Pehle RTIS CSV file select karein!"); return; }

    const auditData = {
        train: trainNo,
        lp: document.getElementById('lp_name').innerText,
        alp: document.getElementById('alp_name').innerText,
        from: document.getElementById('stn_from').value,
        to: document.getElementById('stn_to').value
    };

    const reader = new FileReader();
    reader.onload = function(e) {
        localStorage.setItem('rtisData', e.target.result);
        localStorage.setItem('auditMeta', JSON.stringify(auditData));
        window.location.href = "map_view.html";
    };
    reader.readAsText(fileInput.files[0]);
}

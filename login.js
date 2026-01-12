// login.js - Separate Header and Security Logic
const admins = {
    "CLI_HQ": "hq123",
    "SR_DEE_OP": "srdee123",
    "ADEE_OP": "adee123"
};

function createHeader(userName) {
    const header = document.createElement('div');
    header.style = "position:absolute; top:0; left:0; width:100%; background:white; display:flex; align-items:center; padding:5px 15px; border-bottom:3px solid #002f6c; z-index:2000; box-shadow: 0 2px 5px rgba(0,0,0,0.2);";
    
    header.innerHTML = `
        <img src="ir_logo.png" style="height:60px; margin-right:20px;">
        <div style="flex-grow:1;">
            <div style="font-size:22px; font-weight:bold; color:#002f6c;">SOUTH EAST CENTRAL RAILWAY</div>
            <div style="font-size:14px; font-weight:bold; color:#d93025;">ELECTRICAL (OP) DEPARTMENT, RAIPUR</div>
        </div>
        <div style="text-align:right; font-weight:bold;">
            <div style="font-size:10px; color:#666;">LOGGED IN AS:</div>
            <div id="userDisplay" style="color:#002f6c;">${userName}</div>
        </div>
    `;
    document.body.appendChild(header);
}

function showLoginModal() {
    const modal = document.createElement('div');
    modal.id = "loginBox";
    modal.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:3000; display:flex; align-items:center; justify-content:center;";
    
    modal.innerHTML = `
        <div style="background:white; padding:30px; border-radius:10px; width:350px; text-align:center;">
            <img src="ir_logo.png" style="height:50px; margin-bottom:10px;">
            <h3 style="margin-top:0;">SEC RAILWAY - LOGIN</h3>
            <input type="text" id="uid" placeholder="CLI ID or Admin Name" style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ccc; border-radius:4px;">
            <input type="password" id="upass" placeholder="Password" style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ccc; border-radius:4px;">
            <button onclick="attemptLogin()" style="width:100%; background:#002f6c; color:white; padding:12px; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">SIGN IN</button>
            <div id="loginErr" style="color:red; font-size:12px; margin-top:10px;"></div>
        </div>
    `;
    document.body.appendChild(modal);
}

function attemptLogin() {
    const id = document.getElementById('uid').value.toUpperCase();
    const pass = document.getElementById('upass').value;
    const err = document.getElementById('loginErr');

    // 1. Admin Login Check
    if (admins[id] && admins[id] === pass) {
        finishLogin(id);
        return;
    }

    // 2. CLI ID Check from Master [cite: 2026-01-08]
    // Note: crewMaster variable index.html se milega
    let found = crewMaster.find(c => (c.CLI_ID || c.CREW_ID) === id);
    
    // Yahan humne fixed password 'cli123' rakha hai, ise aap badal sakte hain
    if (found && pass === "cli123") {
        finishLogin(found.CLI_NAME || found.CREW_NAME);
    } else {
        err.innerText = "Invalid ID or Password!";
    }
}

function finishLogin(name) {
    document.getElementById('loginBox').remove();
    createHeader(name);
    showUploadControls();
}

function showUploadControls() {
    const controls = document.createElement('div');
    controls.style = "position:absolute; bottom:30px; left:30px; background:white; padding:20px; border-radius:8px; z-index:2000; box-shadow:0 4px 15px rgba(0,0,0,0.3); border-left:5px solid #002f6c;";
    controls.innerHTML = `
        <div style="font-weight:bold; margin-bottom:10px; font-size:12px;">UPLOAD RTIS LOCO FILE</div>
        <input type="file" id="locoFile" accept=".csv" style="margin-bottom:15px;"><br>
        <button id="submitBtn" style="background:#28a745; color:white; border:none; padding:10px 20px; border-radius:4px; font-weight:bold; cursor:pointer; width:100%;">GENERATE AUDIT REPORT</button>
    `;
    document.body.appendChild(controls);
    
    // File upload handler connect karein
    document.getElementById('submitBtn').onclick = () => {
        const fileInput = document.getElementById('locoFile');
        if(fileInput.files[0]) {
            // Hum is function ko index.html mein define karenge
            processLocoData(fileInput.files[0]); 
        } else {
            alert("Please select a file first!");
        }
    };
}

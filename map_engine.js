// map_engine.js - Interactive Map Logic
const map = L.map('map').setView([21.14, 79.08], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// 1. Station Yard & Signals Load Karein (Wahi purana logic)
// ... (Yahan wahi Papa.parse logic aayega jo index.html mein tha)

// 2. RTIS Data Processing (Hover to see Speed/Direction)
function plotRTIS(data) {
    let path = [];
    data.forEach((row, i) => {
        let lat = parseFloat(row.LAT);
        let lng = parseFloat(row.LNG);
        let speed = row.SPEED;
        let heading = row.HEADING || 0; // Direction

        if (lat && lng) {
            path.push([lat, lng]);
            
            // Interactive Point for Hover
            let marker = L.circleMarker([lat, lng], {
                radius: 3,
                color: speed > 0 ? 'blue' : 'red',
                fillOpacity: 0.7
            }).addTo(map);

            marker.bindTooltip(`
                <b>Time:</b> ${row.TIME}<br>
                <b>Speed:</b> ${speed} kmph<br>
                <b>Direction:</b> ${heading}°
            `);
        }
    });

    L.polyline(path, {color: 'black', weight: 2, dashArray: '5, 5'}).addTo(map);
}

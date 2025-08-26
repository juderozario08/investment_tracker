const fs = require('fs');
const path = require("path");
const filePath = path.join(__dirname, 'cibc.pdf');
const pdfBuffer = fs.readFileSync(filePath);

async function sendPDF() {
    try {
        const response = await fetch("http://localhost:5000/pdfToText", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/pdf',
            },
            body: pdfBuffer
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data.pages);
        } else {
            throw new Error(response.text);
        }
    } catch (err) {
        console.error(err);
    }
}

sendPDF()
const fs = require('fs');
let html = fs.readFileSync('c:/Users/SWETHA/Desktop/telecom-final/contact.html', 'utf8');

const dupHeaderStart = html.indexOf('<header>', html.indexOf('</main>'));
if (dupHeaderStart !== -1) {
    const dupHeaderEnd = html.indexOf('</header>', dupHeaderStart) + 9;
    html = html.substring(0, dupHeaderStart) + html.substring(dupHeaderEnd);
    fs.writeFileSync('c:/Users/SWETHA/Desktop/telecom-final/contact.html', html);
    console.log("Removed duplicate header from contact.html");
}

// Remove any duplicate head/body tags that might have been merged
const headBodyStart = html.indexOf('</head>\n<body class="bg-light-gray">', html.indexOf('</main>'));
if (headBodyStart !== -1) {
    html = html.substring(0, headBodyStart) + html.substring(headBodyStart + 35);
    fs.writeFileSync('c:/Users/SWETHA/Desktop/telecom-final/contact.html', html);
}

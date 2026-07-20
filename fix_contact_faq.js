const fs = require('fs');
let html = fs.readFileSync('c:/Users/SWETHA/Desktop/telecom-final/contact.html', 'utf8');

// The file is massively duplicated. Let's find the first </main> and the first footer, and just keep that.
// But wait, the merged support.html was supposed to be inside <main>.
// Let's just fix the duplication by slicing everything from the first </main> to the first <footer 
// Actually, let's just find the first <main> and its closing tag.
const mainStart = html.indexOf('<main>');
// But since the sections were duplicated, there might be multiple <main> tags, or duplicated sections inside <main>.
// Let's find the specific FAQ the user wants to remove and remove all instances of it.

html = html.replace(/<section class="section-padding bg-white border-top">[\s\S]*?<div class="text-center mb-5">[\s\S]*?<h2 class="section-title">Frequently Asked Questions<\/h2>[\s\S]*?<\/section>/g, '');

fs.writeFileSync('c:/Users/SWETHA/Desktop/telecom-final/contact.html', html);
console.log("Removed FAQ");

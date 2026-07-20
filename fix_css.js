const fs = require('fs');
let css = fs.readFileSync('c:/Users/SWETHA/Desktop/telecom-final/assets/css/style.css', 'utf8');

// Remove the messy header { ... } lines I just added
css = css.replace(/header \{ position: sticky; top: 0; z-index: 9999; width: 100%; \}/g, '');
css = css.replace(/body\.no-scroll header \{ position: sticky; top: 0; z-index: 9999; width: 100%; \}/g, '');

// Ensure header is sticky
if (!css.includes('header { position: sticky; top: 0; z-index: 9999; width: 100%; }')) {
    css += '\n\n/* Global Header Sticky Fix */\nheader { position: sticky; top: 0; z-index: 9999; width: 100%; }\n';
}

fs.writeFileSync('c:/Users/SWETHA/Desktop/telecom-final/assets/css/style.css', css);
console.log("CSS updated");

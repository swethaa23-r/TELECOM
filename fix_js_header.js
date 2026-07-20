const fs = require('fs');
let js = fs.readFileSync('c:/Users/SWETHA/Desktop/telecom-final/assets/js/main.min.js', 'utf8');

// Remove the fixed JS logic
js = js.replace(/mainHeader\.style\.position = 'fixed';[\s\S]*?mainHeader\.style\.zIndex = '1050';/g, '');
js = js.replace(/const headerHeight = mainHeader\.offsetHeight;[\s\S]*?document\.body\.style\.paddingTop = headerHeight \+ 'px';/g, '');

// Also, the GSAP opacity: 0 on header might cause issues if they want it permanently visible.
// "gsap.set('header, main, footer', { opacity: 0 });" -> change to main and footer only
js = js.replace(/gsap\.set\('header, main, footer', \{ opacity: 0 \}\);/g, "gsap.set('main, footer', { opacity: 0 });");

// And in the timeline animation
js = js.replace(/\.to\('header', \{ opacity: 1, duration: 0\.6, ease: 'power2\.out' \}, "-=0\.2"\)/g, "");

fs.writeFileSync('c:/Users/SWETHA/Desktop/telecom-final/assets/js/main.min.js', js);
console.log("Updated main.min.js");

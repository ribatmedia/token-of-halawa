const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/DashboardOverview.tsx', 'utf8');

// Replace the string by finding the start and end of it.
const pattern = /const confirmForce = window\.confirm\("à´ˆ à´«àµ‹àµº.*?separate donor profile\?\)"\);/s;
const newConfirm = 'const confirmForce = window.confirm(Buffer.from("4LSIIOC0q+C1i+C1uiDgtKjgtK7gtY3gtKrgtbwg4LSJ4LSq4LSv4LWL4LSX4LS/4LSa4LWN4LSa4LWNIOC0h+C0pOC0v+C0qOC0leC0giDgtJLgtLDgtYEg4LSh4LWL4LSj4LW8IOC0ieC0o+C1jeC0n+C1jS4g4LSO4LSZ4LWN4LSV4LS/4LSy4LWB4LSCIOC0quC1geC0pOC0v+C0r+C1iuC0sOC1gSDgtKHgtYvgtKPgtLHgtL7gtK/gtL8g4LSk4LWB4LSf4LSw4LSj4LSu4LWG4LSo4LWN4LSo4LWB4LSx4LSq4LWN4LSq4LS+4LSj4LWLPw==", "base64").toString("utf8") + "\\n\\n(This phone number is already registered. Are you sure you want to create a new, separate donor profile?)");';

content = content.replace(pattern, newConfirm);

fs.writeFileSync('frontend/src/components/DashboardOverview.tsx', content, 'utf8');
console.log('Fixed confirm dialog string');

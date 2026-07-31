const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/DashboardOverview.tsx', 'utf8');

// 1. Replace "Roll No" with "R.NO" everywhere
content = content.replace(/Roll No/g, "R.NO");
content = content.replace(/Roll Numbers \(R.NO\)/g, "Roll Numbers");

// 2. Replace "HN {c.hn}" with "R.NO {c.hn}"
content = content.replace(/HN \{c.hn\}/g, "R.NO {c.hn}");

// 3. Replace the corrupted "Please select a student from the HN list above"
const warningEmoji = Buffer.from('4pqg77iP', 'base64').toString('utf8');
content = content.replace(/.*?Please select a student from the HN list above/g, `${warningEmoji} Please select a student from the R.NO list above`);

// 4. Fix the corrupted bullet character in "Class: Final Year A R.NO:"
const bullet = Buffer.from('4oCi', 'base64').toString('utf8');
content = content.replace(/A R\.NO:/g, `${bullet} R.NO:`);
content = content.replace(/AÂ· R\.NO:/g, `${bullet} R.NO:`);
content = content.replace(/Â· R\.NO:/g, `${bullet} R.NO:`);
content = content.replace(/A· R\.NO:/g, `${bullet} R.NO:`); // Catch variations of corrupted bullet

fs.writeFileSync('frontend/src/components/DashboardOverview.tsx', content, 'utf8');
console.log("Done");

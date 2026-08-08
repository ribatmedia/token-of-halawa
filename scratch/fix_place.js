const fs = require('fs');
const path = 'frontend/src/components/DashboardOverview.tsx';

let content = fs.readFileSync(path, 'utf8');

const oldStr = "place: item.donor?.category || 'Kerala',";
const newStr = "place: (item.donor?.location && item.donor?.location !== 'GENERAL' ? item.donor?.location : '') || (item.donor?.address && item.donor?.address !== 'GENERAL' ? item.donor?.address : '') || (item.donor?.category && item.donor?.category !== 'GENERAL' ? item.donor?.category : '') || 'Kerala',";

content = content.replaceAll(oldStr, newStr);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated place in DashboardOverview.tsx');

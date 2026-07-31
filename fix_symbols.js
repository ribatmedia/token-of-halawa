const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/DashboardOverview.tsx', 'utf8');

content = content.replace(
    /onChange=\{\(e\) => setAuthPassword\(e\.target\.value\)\}\s+placeholder=".*?"\s+className="w-full/g,
    'onChange={(e) => setAuthPassword(e.target.value)}\n                placeholder="••••••••"\n                className="w-full'
);

content = content.replace(
    /\{paymentReceived \? '.*?Cash Received' : '.*?Cash Pending'\}/g,
    '{paymentReceived ? \'✅ Cash Received\' : \'⏳ Cash Pending\'}'
);

fs.writeFileSync('frontend/src/components/DashboardOverview.tsx', content, 'utf8');
console.log("Done");

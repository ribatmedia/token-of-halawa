const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/DashboardOverview.tsx', 'utf8');

content = content.replace(
    /<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Donor Name \*<\/label>\s*<span className="text-\[9px\] text-slate-400 font-bold uppercase tracking-wider block">.*?<\/span>/,
    '<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Donor Name *</label>\n                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">' + Buffer.from('4LSq4LWH4LSw4LWNIOC0qOC1veC0leC1geC0lQ==', 'base64').toString('utf8') + '</span>'
);

content = content.replace(
    /<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Phone Number \*<\/label>\s*<span className="text-\[9px\] text-slate-400 font-bold uppercase tracking-wider block">.*?<\/span>/,
    '<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Phone Number *</label>\n                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">' + Buffer.from('4LSr4LWL4LW6IOC0qOC0ruC1jeC0quC1vA==', 'base64').toString('utf8') + '</span>'
);

content = content.replace(
    /<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Place<\/label>\s*<span className="text-\[9px\] text-slate-400 font-bold uppercase tracking-wider block">.*?<\/span>/,
    '<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Place</label>\n                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">' + Buffer.from('4LS44LWN4LSl4LSy4LSCIOC0qOC1veC0leC1geC0lQ==', 'base64').toString('utf8') + '</span>'
);

content = content.replace(
    /<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Amount \*<\/label>\s*<span className="text-\[9px\] text-slate-400 font-bold uppercase tracking-wider block">.*?<\/span>/,
    '<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Amount *</label>\n                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">' + Buffer.from('4LSk4LWB4LSVIOC0pOC0v+C0sOC0nuC1jeC0nuC1huC0n+C1geC0leC1jeC0leC1geC0lQ==', 'base64').toString('utf8') + '</span>'
);

content = content.replace(
    /<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">For Month \*<\/label>\s*<span className="text-\[9px\] text-slate-400 block font-bold">.*?<\/span>/,
    '<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">For Month *</label>\n                      <span className="text-[9px] text-slate-400 block font-bold">' + Buffer.from('4LSP4LSk4LWNIOC0ruC0vuC0uOC0pOC1jeC0pOC1hiDgtKrgtKPgtK7gtL7gtKPgtY0/ICjgtK7gtYHgtbvgtJXgtYLgtLHgtL7gtK/gtL8g4LSo4LW94LSV4LS+4LW7IOC0kuC0qOC1jeC0qOC0v+C0suC0p+C0v+C0leC0giDgtK7gtL7gtLjgtIIg4LSk4LS/4LSw4LSe4LWN4LSe4LWG4LSf4LWB4LSV4LWN4LSV4LS+4LSCKQ==', 'base64').toString('utf8') + '</span>'
);

content = content.replace(/â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢/g, '••••••••');
content = content.replace(/â³ Cash Pending/g, '⏳ Cash Pending');

fs.writeFileSync('frontend/src/components/DashboardOverview.tsx', content, 'utf8');
console.log("Done");

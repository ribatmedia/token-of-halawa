const fs = require('fs');

let content = fs.readFileSync('frontend/src/components/DashboardOverview.tsx', 'utf8');

// 1. Auto-detected plan (Line 2318)
content = content.replace(
    /<span className="text-\[9px\] text-emerald-500 font-bold uppercase tracking-wider">.*?<\/span>/,
    '<span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">' + Buffer.from('4LS44LWN4LS14LSv4LSCIOC0leC0o+C1jeC0n+C1huC0pOC1jeC0pOC0v+C0ryDgtKrgtY3gtLLgtL7gtbs=', 'base64').toString('utf8') + '</span>'
);

// 2. Info icon (Line 2327) and description (Line 2328)
content = content.replace(
    /<p className="text-\[10px\] text-sky-600 dark:text-sky-400 font-bold flex items-start gap-1 mt-1">\s*<span>.*?<\/span>\s*<span>.*?<\/span>\s*<\/p>/s,
    '<p className="text-[10px] text-sky-600 dark:text-sky-400 font-bold flex items-start gap-1 mt-1">\n                          <span>' + Buffer.from('4pSW', 'base64').toString('utf8') + '</span>\n                          <span>' + Buffer.from('4LSh4LWL4LSj4LSx4LWB4LSf4LWGIOC0ruC1geC1uyDgtKrgtY3gtLLgtL7gtbsg4LSF4LSo4LWB4LS44LSw4LS/4LSa4LWN4LSa4LWNIOC0pOC1geC0lSDgtLjgtY3gtLXgtK/gtIIg4LS44LWG4LSx4LWN4LSx4LWNIOC0huC0r+C0vy4g4LSu4LS+4LSx4LWN4LSx4LSCIOC0teC1h+C0o+C0ruC1huC0meC1jeC0leC0v+C1vSDgtKTgtL7gtLTgtYYg4LSO4LSh4LS/4LSx4LWN4LSx4LWNIOC0muC1huC0r+C1jeC0r+C0vuC0gi4=', 'base64').toString('utf8') + '</span>\n                        </p>'
);

// 3. Custom amount (Line 2386)
content = content.replace(
    /<span className="text-\[9px\] text-slate-400 block">.*?<\/span>/,
    '<span className="text-[9px] text-slate-400 block">' + Buffer.from('4LSk4LWB4LSVIOC0qOC1veC0leC1geC0lQ==', 'base64').toString('utf8') + '</span>'
);

// 4. Info icon (Line 2452) and description (Line 2453)
content = content.replace(
    /<p className="text-\[10px\] text-sky-600 dark:text-sky-400 font-bold mt-2 flex items-start gap-1">\s*<span>.*?<\/span>\s*<span>.*?<\/span>\s*<\/p>/s,
    '<p className="text-[10px] text-sky-600 dark:text-sky-400 font-bold mt-2 flex items-start gap-1">\n                      <span>' + Buffer.from('4pSW', 'base64').toString('utf8') + '</span>\n                      <span>' + Buffer.from('4LSq4LWN4LSw4LSk4LS/4LSu4LS+4LS4IOC0teC0sOC0v+C0uOC0guC0luC1jeC0r+C0viDgtKrgtY3gtLLgtL7gtbsg4LSk4LS/4LSw4LSe4LWN4LSe4LWG4LSf4LWB4LSV4LWN4LSV4LS+4LSk4LWN4LSk4LS14LW84LSV4LWN4LSV4LWNIE9uZSBUaW1lIFBheW1lbnQg4LSO4LSo4LWN4LSoIOC0k+C0quC1jeC0t+C1uyDgtKTgtL/gtLDgtJ7gtY3gtJ7gtYbgtJ/gtYHgtJXgtY3gtJXgtL7gtIIu', 'base64').toString('utf8') + '</span>\n                    </p>'
);

// 5. Fix bullet in Class: ... R.NO:
content = content.replace(
    /Class: \{\(user as any\)\?\.class \|\| 'Final Year'\}[\s\S]*?R\.NO: \{\(user as any\)\?\.hn \|\| '001'\}/,
    'Class: {(user as any)?.class || \'Final Year\'} ' + Buffer.from('4oCi', 'base64').toString('utf8') + ' R.NO: {(user as any)?.hn || \'001\'}'
);

fs.writeFileSync('frontend/src/components/DashboardOverview.tsx', content, 'utf8');
console.log("Done");

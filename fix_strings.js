const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Malayalam labels in Add Donation form (which are currently corrupted due to node script/multi-replace bug)
    // Replace the corrupted sublabels explicitly
    const donorNameLabel = /<span className="text-\[9px\] text-slate-400 font-bold uppercase tracking-wider block">.*?(?:പേര് നൽകുക)?.*?<\/span>/g;
    // We will do a more targeted replace for the specific block lines to avoid false positives.
    content = content.replace(
        /<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Donor Name \*<\/label>\s*<span className="text-\[9px\] text-slate-400 font-bold uppercase tracking-wider block">.*?<\/span>/,
        '<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Donor Name *</label>\n                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">പേര് നൽകുക</span>'
    );

    content = content.replace(
        /<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Phone Number \*<\/label>\s*<span className="text-\[9px\] text-slate-400 font-bold uppercase tracking-wider block">.*?<\/span>/,
        '<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Phone Number *</label>\n                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">ഫോൺ നമ്പർ</span>'
    );

    content = content.replace(
        /<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Place<\/label>\s*<span className="text-\[9px\] text-slate-400 font-bold uppercase tracking-wider block">.*?<\/span>/,
        '<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Place</label>\n                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">സ്ഥലം നൽകുക</span>'
    );

    content = content.replace(
        /<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Amount \*<\/label>\s*<span className="text-\[9px\] text-slate-400 font-bold uppercase tracking-wider block">.*?<\/span>/,
        '<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Amount *</label>\n                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">തുക തിരഞ്ഞെടുക്കുക</span>'
    );

    content = content.replace(
        /<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">For Month \*<\/label>\s*<span className="text-\[9px\] text-slate-400 block font-bold">.*?<\/span>/,
        '<label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">For Month *</label>\n                      <span className="text-[9px] text-slate-400 block font-bold">ഏത് മാസത്തെ പണമാണ്? (മുൻകൂറായി നൽകാൻ ഒന്നിലധികം മാസം തിരഞ്ഞെടുക്കാം)</span>'
    );

    // 2. Class names rename globally
    content = content.replace(/Degree first year/gi, "D1");
    content = content.replace(/Degree second year/gi, "D2");
    content = content.replace(/Degree Third year/gi, "D3");

    // 3. HN renames (Targeted to UI text only)
    content = content.replace(/>HN</g, ">Roll No<");
    content = content.replace(/HN Code/gi, "Roll No");
    content = content.replace(/HN No/gi, "Roll No");
    content = content.replace(/Hall Numbers \(HN\)/g, "Roll Numbers (Roll No)");
    content = content.replace(/name or HN\.\.\./g, "name or Roll No...");
    content = content.replace(/label: 'HN'/g, "label: 'Roll No'");
    content = content.replace(/ID: \{\(user as any\)\?\.hn/g, "Roll No: {(user as any)?.hn");

    // 4. â‚¹ to ₹
    content = content.replace(/â‚¹/g, "₹");
    content = content.replace(/,1/g, "₹");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

const filesToUpdate = [
    'frontend/src/components/DashboardOverview.tsx',
    'frontend/src/components/ReceiptModal.tsx',
    'frontend/src/app/page.tsx',
    'frontend/src/app/developer/page.tsx',
    'frontend/src/app/leader/page.tsx'
];

filesToUpdate.forEach(f => replaceInFile(path.join(__dirname, f)));

console.log("Done");

const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardOverview.tsx', 'utf-8');

// 1. Clean up duplicated state variables
content = content.replace(
  /  const \[showExportMenu, setShowExportMenu\] = useState\(false\);\s*const \[exportFields, setExportFields\] = useState\(\{ receipt: true, donorDetails: true, planMonths: true, place: true, campaigner: true, amount: true, status: true \}\);\s*const \[donorDirectoryCampaigner, setDonorDirectoryCampaigner\] = useState\('ALL'\);\s*const \[donorDirectoryStatus, setDonorDirectoryStatus\] = useState\('ALL'\);\s*const \[donorDirectoryMonth, setDonorDirectoryMonth\] = useState\('ALL'\);\s*const \[donorDirectoryPlan, setDonorDirectoryPlan\] = useState\('ALL'\);/g,
  `  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportFields, setExportFields] = useState({ receipt: true, donorDetails: true, planMonths: true, place: true, campaigner: true, amount: true, status: true });`
);

// 2. Rewrite the Export Buttons UI
const exportButtonsTarget = `                {/* Export Buttons */}
                <div className="flex gap-2 justify-end mb-6">`;

const exportButtonsReplacement = `                {/* Export Buttons */}
                <div className="absolute top-0 right-0 -mt-[4.5rem]">
                  <div className="relative">
                    <button 
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Report
                    </button>
                    {showExportMenu && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50">
                        <div className="mb-4">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Select fields:</h4>
                          <div className="space-y-1.5">
                            {[
                              { id: 'receipt', label: 'Receipt' },
                              { id: 'donorDetails', label: 'Donor Details' },
                              { id: 'planMonths', label: 'Plan & Months' },
                              { id: 'place', label: 'Place' },
                              { id: 'campaigner', label: 'Campaigner' },
                              { id: 'amount', label: 'Amount' },
                              { id: 'status', label: 'Status' }
                            ].map(field => (
                              <label key={field.id} className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  checked={exportFields[field.id as keyof typeof exportFields]}
                                  onChange={(e) => setExportFields({...exportFields, [field.id]: e.target.checked})}
                                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{field.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <button onClick={handleExportCSV} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"><FileSpreadsheet className="w-3.5 h-3.5" /> CSV</button>
                          <button onClick={handleExportPDF} className="bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"><FileText className="w-3.5 h-3.5" /> PDF</button>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => {}} className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"><List className="w-3.5 h-3.5" /> Copy as Table</button>
                          <button onClick={handleWhatsAppText} className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"><Share2 className="w-3.5 h-3.5" /> Copy for WhatsApp</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="hidden">`;

content = content.replace(exportButtonsTarget, exportButtonsReplacement);

// Remove the old buttons block end
content = content.replace(/<\/button>\s*<\/div>\s*<div className="bg-white\/50/s, '</div>\n\n                <div className="bg-white/50');


// 3. Update handleExportCSV
const oldCsvTarget = /const handleExportCSV = \(\) => \{.*?document\.body\.removeChild\(link\);\s*\};/s;

const newCsvReplacement = `const handleExportCSV = () => {
              const headers: string[] = [];
              if (exportFields.receipt) headers.push('Receipt / REG ID');
              if (exportFields.donorDetails) headers.push('Donor Name', 'Phone', 'Email');
              if (exportFields.planMonths) headers.push('Plan', 'Months');
              if (exportFields.place) headers.push('Place / Category');
              if (exportFields.campaigner) headers.push('Campaigner', 'Class');
              if (exportFields.amount) headers.push('Amount');
              if (exportFields.status) headers.push('Status');
              headers.push('\\n');

              const rows = filteredDonors.map(d => {
                const row: string[] = [];
                if (exportFields.receipt) row.push(\`"\${d.uniqueId || d.id}"\`);
                if (exportFields.donorDetails) row.push(\`"\${d.name}"\`, \`"\${d.phone}"\`, \`"\${d.email || ''}"\`);
                if (exportFields.planMonths) row.push(\`"\${d.detectedPlan}"\`, \`"\${d.paidMonths.join(', ')}"\`);
                if (exportFields.place) row.push(\`"\${d.location || d.category || 'General'}"\`);
                if (exportFields.campaigner) row.push(\`"\${d.campaignerName}"\`, \`"\${d.campaignerClass}"\`);
                if (exportFields.amount) row.push(\`"\${d.totalCollected}"\`);
                if (exportFields.status) row.push(\`"\${d.overallStatus}"\`);
                return row.join(',');
              });

              const blob = new Blob([headers.join(',') + rows.join('\\n')], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', \`donors_registry_\${new Date().toISOString().split('T')[0]}.csv\`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setShowExportMenu(false);
            };`;

content = content.replace(oldCsvTarget, newCsvReplacement);

// 4. Update handleWhatsAppText
const oldWaTarget = /const handleWhatsAppText = \(\) => \{.*?alert\("WhatsApp share text copied to clipboard! You can paste it into any WhatsApp chat\."\);\s*\};/s;

const newWaReplacement = `const handleWhatsAppText = () => {
              const text = \`*Donors Registry Directory*\\n\\n\` + filteredDonors.map((d, i) => {
                let line = \`\${i+1}. \`;
                if (exportFields.donorDetails) line += \`*\${d.name}*\`;
                if (exportFields.receipt) line += \` (\${d.uniqueId || d.id})\`;
                if (exportFields.donorDetails) line += \` - \${d.phone}\`;
                if (exportFields.place) line += \` [\${d.location || d.category || 'General'}]\`;
                if (exportFields.amount) line += \` - ₹\${d.totalCollected}\`;
                if (exportFields.status) line += \` (\${d.overallStatus})\`;
                return line;
              }).join('\\n');
              navigator.clipboard.writeText(text);
              alert("WhatsApp share text copied to clipboard! You can paste it into any WhatsApp chat.");
              setShowExportMenu(false);
            };`;

content = content.replace(oldWaTarget, newWaReplacement);

// Update PDF Export to just close menu for now (or implement similar fields)
const oldPdfTarget = /printWin\.document\.close\(\);\s*\};/s;
const newPdfReplacement = `printWin.document.close();
              setShowExportMenu(false);
            };`;
content = content.replace(oldPdfTarget, newPdfReplacement);


fs.writeFileSync('src/components/DashboardOverview.tsx', content, 'utf-8');
console.log('Done!');

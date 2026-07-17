const fs = require('fs');
let content = fs.readFileSync('src/components/DashboardOverview.tsx', 'utf-8');

// Move popover from the filter row to the header

const headerTarget = `                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                      Donors Registry Directory
                    </h3>
                    <p className="text-xs opacity-60 mt-1">Manage, search, export and merge donor profiles registered under your hub.</p>
                  </div>
                </div>`;

const headerReplacement = `                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                      Donors Registry Directory
                    </h3>
                    <p className="text-xs opacity-60 mt-1">Manage, search, export and merge donor profiles registered under your hub.</p>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold self-start md:self-center shrink-0 shadow-md transition-all"
                    >
                      <Download className="w-4 h-4" /> Download Report
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
                </div>`;

content = content.replace(headerTarget, headerReplacement);

// Delete the old popover hack section
const hackTarget = /\{\/\* Export Buttons \*\/\}\s*<div className="absolute top-0 right-0 -mt-\[4\.5rem\]">.*?<\/div>\s*<\/div>\s*<div className="hidden">/s;
content = content.replace(hackTarget, '');

fs.writeFileSync('src/components/DashboardOverview.tsx', content, 'utf-8');
console.log('Fixed popover placement');

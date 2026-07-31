const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/DashboardOverview.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Using regex to replace the corrupted instructions body
const instructionsBodyRegex = /\{\/\* Body content with Malayalam texts \*\/\}[\s\S]*?\{\/\* Footer OK Button \*\/\}/;
const newInstructionsBody = '{/* Body content with Malayalam texts */}\n' +
'            <div className="p-6 md:p-8 space-y-6 font-medium text-sm md:text-base leading-relaxed text-left text-slate-200 overflow-y-auto max-h-[70vh]">\n' +
'              <div className="flex gap-3">\n' +
'                <span className="font-extrabold text-[#9cd4ff] shrink-0">1.</span>\n' +
'                <p className="font-malayalam text-slate-100 font-bold leading-relaxed">താല്പര്യമുള്ള വരിക്കാരിൽ നിന്നും ഒന്നിലധികം മാസങ്ങളിലെ വരിസംഖ്യ ഒന്നിച്ചു (മുൻകൂറായി) കൈപ്പറ്റാവുന്നതാണ്.</p>\n' +
'              </div>\n' +
'\n' +
'              <div className="flex gap-3">\n' +
'                <span className="font-extrabold text-[#9cd4ff] shrink-0">2.</span>\n' +
'                <div>\n' +
'                  <p className="font-extrabold text-[#9cd4ff] mb-1">Advance Collection:</p>\n' +
'                  <p className="font-malayalam text-slate-100 font-bold leading-relaxed">ഒന്നിലധികം മാസത്തെ തുക മുൻകൂറായി വാങ്ങുകയാണെങ്കിൽ, ഓരോ മാസത്തേക്കും വെവ്വേറെ (ഉദാഹരണത്തിന്: 500 രൂപയുടെ 3 റെസീപ്റ്റുകൾ) ആഡ് ചെയ്യേണ്ടതാണ്.</p>\n' +
'                </div>\n' +
'              </div>\n' +
'\n' +
'              <div className="flex gap-3">\n' +
'                <span className="font-extrabold text-[#9cd4ff] shrink-0">3.</span>\n' +
'                <div>\n' +
'                  <p className="font-extrabold text-[#9cd4ff] mb-1">ഈ ആപ്പ് ഉപയോഗിച്ച് പിരിക്കുന്ന തുക:</p>\n' +
'                  <p className="font-malayalam text-slate-100 font-bold leading-relaxed">കാഷ് ആയി വാങ്ങിയ തുക കാമ്പയിനർമാർ ഈ ആപ്പിൽ ആഡ് ചെയ്ത ശേഷം അഡ്മിനെ നേരിട്ട് ഏൽപ്പിക്കുകയാണെങ്കിൽ അഡ്മിൻ \'Verify Physical\' വഴി അത് അപ്രൂവ് ചെയ്യണം. ഓൺലൈനായി ബാങ്ക് അക്കൗണ്ടിലേക്ക് അയക്കുന്ന തുകയ്ക്ക് ഈ അപ്രൂവൽ ആവശ്യമില്ല.</p>\n' +
'                </div>\n' +
'              </div>\n' +
'            </div>\n' +
'\n' +
'            {/* Footer OK Button */}';

content = content.replace(instructionsBodyRegex, newInstructionsBody);

// Admin Guide replacement
const adminGuideRegex = /<h3 className="text-lg font-black tracking-wide text-slate-900 dark:text-white flex items-center gap-2">[\s\S]*?മനസ്സിലായി \(Close\)/;
const newAdminGuide = '<h3 className="text-lg font-black tracking-wide text-slate-900 dark:text-white flex items-center gap-2">\n' +
'                <BookOpen className="w-5 h-5 text-emerald-500" /> അഡ്മിൻ ഗൈഡ് (Admin Guide)\n' +
'              </h3>\n' +
'              <button onClick={() => setShowAdminGuide(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition duration-200">\n' +
'                <X className="w-5 h-5" />\n' +
'              </button>\n' +
'            </div>\n' +
'            \n' +
'            <div className="p-6 md:p-8 space-y-6 font-malayalam text-sm md:text-base leading-relaxed overflow-y-auto max-h-[70vh]">\n' +
'              <div className="space-y-4">\n' +
'                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">\n' +
'                  <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">1. Analytics (അനലിറ്റിക്സ്)</h4>\n' +
'                  <p>എത്ര രൂപ കളക്ട് ചെയ്തു, ടാർഗെറ്റ് എത്ര ബാക്കിയുണ്ട്, പുതിയ എൻട്രികൾ എന്നിവയുടെ പൂർണ്ണരൂപം ഇവിടെ കാണാം.</p>\n' +
'                </div>\n' +
'\n' +
'                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">\n' +
'                  <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">2. Donation Entries (ഡൊണേഷൻ എൻട്രികൾ)</h4>\n' +
'                  <p>എല്ലാ കുട്ടികളും (ക്യാമ്പയിനർമാർ) ആഡ് ചെയ്ത ഡൊണേഷൻ വിവരങ്ങളും ഇതിന്റെ സ്റ്റാറ്റസും ഇവിടെ പരിശോധിക്കാം. അവർ നേരിട്ട് പണം സ്വീകരിച്ചതാണോ അതോ അക്കൗണ്ടിലേക്ക് അയച്ചതാണോ എന്നും അറിയാൻ കഴിയും.</p>\n' +
'                </div>\n' +
'\n' +
'                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">\n' +
'                  <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">3. Verify Physical (പണം വെരിഫൈ ചെയ്യാൻ)</h4>\n' +
'                  <p>കുട്ടികൾ നേരിട്ട് പണം വാങ്ങിയാൽ (Physical Cash), അവർ ആ പണം അഡ്മിനെ ഏൽപ്പിക്കുമ്പോൾ ഇവിടെ നിന്ന് \'Verify\' ചെയ്യാവുന്നതാണ്. ഇത് വഴി അക്കൗണ്ടിംഗ് കൃത്യമായി നിലനിർത്താം.</p>\n' +
'                </div>\n' +
'\n' +
'                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">\n' +
'                  <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">4. Manage Campaigners (ക്യാമ്പയിനർമാരെ നിയന്ത്രിക്കാൻ)</h4>\n' +
'                  <p>പുതിയ കുട്ടികളെ (ക്യാമ്പയിനർമാരെ) ആഡ് ചെയ്യാനും, എഡിറ്റ് ചെയ്യാനും, ഡിലീറ്റ് ചെയ്യാനും ഈ ഭാഗം ഉപയോഗിക്കാം. അവരുടെ പാസ്സ്‌വേർഡ് റീസെറ്റ് ചെയ്യാനും ഇവിടെ ഓപ്ഷൻ ഉണ്ട്.</p>\n' +
'                </div>\n' +
'\n' +
'                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">\n' +
'                  <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">5. Donors Directory (ഡോണേഴ്സ് ഡയറക്ടറി)</h4>\n' +
'                  <p>ഇതുവരെ സംഭാവന നൽകിയ എല്ലാവരുടെയും വിവരങ്ങൾ ഇവിടെ ലഭിക്കും. ഓരോരുത്തർക്കും പുതിയ റീസിപ്റ്റ് അയക്കാനും, പഴയ പ്ലാൻ പുതുക്കാനും (Renew) \'Add Receipt\' അല്ലെങ്കിൽ \'Renew\' ബട്ടൺ ഉപയോഗിക്കാം.</p>\n' +
'                </div>\n' +
'              </div>\n' +
'            </div>\n' +
'            \n' +
'            <div className="p-6 pt-0 flex justify-end border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 mt-4">\n' +
'              <button\n' +
'                onClick={() => setShowAdminGuide(false)}\n' +
'                className="mt-4 bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-8 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm cursor-pointer"\n' +
'              >\n' +
'                മനസ്സിലായി (Close)';

content = content.replace(adminGuideRegex, newAdminGuide);

const adminButtonRegex = /<BookOpen className="w-3.5 h-3.5" \/> [\s\S]*?<\/button>/;
const newAdminButton = '<BookOpen className="w-3.5 h-3.5" /> അഡ്മിൻ ഗൈഡ്\n              </button>';
content = content.replace(adminButtonRegex, newAdminButton);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Encoding fixed successfully.");

const fs = require('fs');

let content = fs.readFileSync('src/components/DashboardOverview.tsx', 'utf-8');

// 1. Add state variables
const stateVars = `
  const [donorSearchQuery, setDonorSearchQuery] = useState('');
  const [donorFilterCategory, setDonorFilterCategory] = useState('ALL');
  const [donorDirectoryCampaigner, setDonorDirectoryCampaigner] = useState('ALL');
  const [donorDirectoryStatus, setDonorDirectoryStatus] = useState('ALL');
  const [donorDirectoryMonth, setDonorDirectoryMonth] = useState('ALL');
  const [donorDirectoryPlan, setDonorDirectoryPlan] = useState('ALL');
`;
content = content.replace(
  /const \[donorSearchQuery, setDonorSearchQuery\] = useState\(''\);\s*const \[donorFilterCategory, setDonorFilterCategory\] = useState\('ALL'\);/,
  stateVars.trim()
);

// 2. Add mappedDonors logic
const mappingLogic = `
            const mappedDonors = donors.map(d => {
              const donorDonations = verificationQueue.filter(q => q.donorId === d.id || q.donorId === d.uniqueId);
              const lastDonation = donorDonations[0];
              
              let detectedPlan = 'CUSTOM';
              if (lastDonation?.notes) {
                const planMatch = lastDonation.notes.match(/Plan:\\s*([^.]+)/);
                if (planMatch) detectedPlan = planMatch[1].trim().toUpperCase();
              } else if (d.category) {
                detectedPlan = d.category.toUpperCase();
              }

              let campaignerName = 'Admin';
              let campaignerClass = 'NF3';
              
              if (donorDonations.length > 0) {
                const donationWithLogger = donorDonations.find(q => q.notes?.includes('Logged by:'));
                if (donationWithLogger?.notes) {
                  const nameMatch = donationWithLogger.notes.match(/Logged by:\\s*([^.]+)/i);
                  if (nameMatch) campaignerName = nameMatch[1].trim();
                  
                  const classMatch = donationWithLogger.notes.match(/Class:\\s*([^.]+)/i);
                  if (classMatch) {
                    campaignerClass = classMatch[1].trim();
                  }
                }
              }

              const campRecord = campaignersList.find(c => c.name.toLowerCase() === campaignerName.toLowerCase());
              if (campRecord) {
                campaignerClass = campRecord.class;
                campaignerName = campRecord.name;
              }

              const paidMonths = donorDonations
                .filter(q => q.status === 'APPROVED' || q.status === 'PENDING')
                .map(q => {
                  const monthMatch = q.notes?.match(/Month:\\s*([^.]+)/);
                  return monthMatch ? monthMatch[1].trim() : '';
                })
                .filter(Boolean);

              const totalCollected = donorDonations
                .filter(q => q.status === 'APPROVED' || q.status === 'PENDING')
                .reduce((acc, q) => acc + Number(q.amount || 0), 0);

              const hasPending = donorDonations.some(q => q.status === 'PENDING');
              const hasApproved = donorDonations.some(q => q.status === 'APPROVED');
              const overallStatus = hasPending ? 'PENDING' : (hasApproved ? 'RECEIVED' : 'UNPAID');

              return {
                ...d,
                donorDonations,
                detectedPlan,
                campaignerName,
                campaignerClass,
                paidMonths,
                totalCollected,
                overallStatus
              };
            });

            const filteredDonors = mappedDonors.filter(d => {
              const query = donorSearchQuery.toLowerCase().trim();
              const matchesSearch = !query || 
                (d.name || '').toLowerCase().includes(query) ||
                (d.phone || '').includes(query) ||
                (d.id || '').toLowerCase().includes(query) ||
                (d.uniqueId && d.uniqueId.toLowerCase().includes(query));

              const matchesCampaigner = donorDirectoryCampaigner === 'ALL' || d.campaignerName === donorDirectoryCampaigner;
              const matchesStatus = donorDirectoryStatus === 'ALL' || d.overallStatus === donorDirectoryStatus;
              const matchesMonth = donorDirectoryMonth === 'ALL' || d.paidMonths.includes(donorDirectoryMonth);
              const matchesPlan = donorDirectoryPlan === 'ALL' || d.detectedPlan === donorDirectoryPlan;

              return matchesSearch && matchesCampaigner && matchesStatus && matchesMonth && matchesPlan;
            });
`;

content = content.replace(
  /const filteredDonors = donors\.filter\(d => \{[\s\S]*?(?=const handleExportCSV)/,
  mappingLogic + "\n            "
);

// 3. Replace Filters Row
const filtersRowTarget = `                {/* Filters & Search Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                    <input 
                      type="text"
                      placeholder="Search by name, phone or ID..."
                      value={donorSearchQuery}
                      onChange={(e) => setDonorSearchQuery(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                  
                  {/* Export Buttons */}
                  <div className="flex gap-2">`;

const filtersRowReplacement = `                {/* Filters & Search Row */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                  <div className="col-span-2 sm:col-span-1">
                    <select
                      value={donorDirectoryCampaigner}
                      onChange={(e) => setDonorDirectoryCampaigner(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Campaigners</option>
                      {Array.from(new Set(campaignersList.map(c => c.name))).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <select
                      value={donorDirectoryStatus}
                      onChange={(e) => setDonorDirectoryStatus(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Status</option>
                      <option value="RECEIVED">Received</option>
                      <option value="PENDING">Pending</option>
                      <option value="UNPAID">Unpaid</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <select
                      value={donorDirectoryMonth}
                      onChange={(e) => setDonorDirectoryMonth(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Months</option>
                      {['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map(m => (
                        <option key={m} value={m}>{m.substring(0,3)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <select
                      value={donorDirectoryPlan}
                      onChange={(e) => setDonorDirectoryPlan(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Plans</option>
                      <option value="100/MONTH">100/MONTH</option>
                      <option value="200/MONTH">200/MONTH</option>
                      <option value="500/MONTH">500/MONTH</option>
                      <option value="1000/MONTH">1000/MONTH</option>
                      <option value="CUSTOM">CUSTOM</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1 relative flex">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input 
                      type="text"
                      placeholder="Search..."
                      value={donorSearchQuery}
                      onChange={(e) => setDonorSearchQuery(e.target.value)}
                      className="w-full bg-slate-200/50 dark:bg-black/20 border border-slate-350 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-[11px] text-slate-800 dark:text-slate-200 outline-none"
                    />
                  </div>
                </div>
                
                {/* Export Buttons */}
                <div className="flex gap-2 justify-end mb-6">`;
content = content.replace(filtersRowTarget, filtersRowReplacement);

// 4. Replace tbody inside donors view
const tbodyTargetRe = /<tbody>\s*\{filteredDonors\.map\(\(d, index\) => \{[\s\S]*?return \(\s*<tr key=\{d\.id\}/;
const tbodyReplacement = `<tbody>
                        {filteredDonors.map((d: any, index) => {
                          const regDate = new Date(d.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          });

                          return (
                            <tr key={d.id}`;
content = content.replace(tbodyTargetRe, tbodyReplacement);

// 5. Fix references inside the <tr> mapping
content = content.replace(/\{campaignerName\}/g, "{d.campaignerName}");
content = content.replace(/Class: \{campaignerClass\}/g, "Class: {d.campaignerClass}");
content = content.replace(/\{totalCollected\.toLocaleString/g, "{d.totalCollected.toLocaleString");
content = content.replace(/\{detectedPlan\}/g, "{d.detectedPlan}");
content = content.replace(/const isPaid = paidMonths\.includes\(month\);/g, "const isPaid = d.paidMonths.includes(month);");

// 6. Add onClick to month badges to view receipt
const monthBadgeTarget = `<span 
                                          key={month} 
                                          title={isPaid ? \`Paid for \${month}\` : \`Unpaid for \${month}\`}
                                          className={\`px-1.5 py-0.5 rounded text-center transition-all min-w-[34px] uppercase select-none \${
                                            isPaid 
                                              ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm shadow-emerald-500/20' 
                                              : 'bg-slate-200/50 dark:bg-black/25 text-slate-400 dark:text-slate-500 border border-slate-350 dark:border-white/5'
                                          }\`}
                                        >
                                          {shortName}
                                        </span>`;

const monthBadgeReplacement = `<span 
                                          key={month} 
                                          title={isPaid ? \`Paid for \${month}\` : \`Unpaid for \${month}\`}
                                          onClick={() => {
                                            if (isPaid) {
                                              const donation = d.donorDonations.find((q: any) => q.notes?.includes(month));
                                              if (donation) {
                                                setSelectedReceiptData({
                                                  id: donation.id,
                                                  date: donation.date,
                                                  name: d.name,
                                                  phone: d.phone,
                                                  place: d.location || d.category || 'General',
                                                  amount: donation.amount
                                                });
                                                setShowReceiptModal(true);
                                              }
                                            }
                                          }}
                                          className={\`px-1.5 py-0.5 rounded text-center transition-all min-w-[34px] uppercase select-none \${isPaid ? 'cursor-pointer hover:scale-105' : ''} \${
                                            isPaid 
                                              ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm shadow-emerald-500/20' 
                                              : 'bg-slate-200/50 dark:bg-black/25 text-slate-400 dark:text-slate-500 border border-slate-350 dark:border-white/5'
                                          }\`}
                                        >
                                          {shortName}
                                        </span>`;

content = content.replace(monthBadgeTarget, monthBadgeReplacement);

fs.writeFileSync('src/components/DashboardOverview.tsx', content, 'utf-8');
console.log('Done!');

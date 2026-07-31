const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/DashboardOverview.tsx', 'utf8');

content = content.replace(
    /finalDonorName = donors\.find\(d => d\.id === donorIdInput\)\?\.name \|\| 'General Donor';/,
    "finalDonorName = allAvailableDonors.find(d => d.id === donorIdInput)?.name || 'General Donor';"
);

content = content.replace(
    /donor: \{ name: finalDonorName, phone: donorPhoneInput \|\| '', location: donorAddressInput \|\| 'Kerala' \},/,
    "donor: { id: donorIdInput || `dnr-${Date.now()}`, name: finalDonorName, phone: donorPhoneInput || '', location: donorAddressInput || 'Kerala' },"
);

content = content.replace(
    /setDonations\(prev => \[newEntry, \.\.\.prev\]\);/,
    "setDonations(prev => [newEntry, ...(Array.isArray(prev) ? prev : [])]);"
);

fs.writeFileSync('frontend/src/components/DashboardOverview.tsx', content, 'utf8');
console.log('Fixed fallback logging crash');

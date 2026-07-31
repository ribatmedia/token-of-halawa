const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/DashboardOverview.tsx', 'utf8');

const targetStr = 'fetchDatabaseData(); // refresh list';
const optimisticUpdateStr = `
        const newEntry = {
          id: data.donation?.id || data.id,
          amount: Number(donationAmount),
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          donor: { id: donorId, name: finalDonorName, phone: donorPhoneInput || '', location: donorAddressInput || 'Kerala' },
          notes: data.donation?.notes || data.notes || \`Logged by: \${user?.fullName || 'Campaigner'}. Class: \${(user as any)?.class || 'Plus one'}. Month: \${donationMonthInput}. Status: \${amountStatusInput}. Plan: \${monthPlanInput}\`
        };
        setDonations(prev => [newEntry, ...(Array.isArray(prev) ? prev : [])]);
        fetchDatabaseData(); // refresh list
`;

if(content.includes(targetStr)) {
    content = content.replace(targetStr, optimisticUpdateStr);
    fs.writeFileSync('frontend/src/components/DashboardOverview.tsx', content, 'utf8');
    console.log('Added optimistic update');
} else {
    console.log('Target string not found');
}

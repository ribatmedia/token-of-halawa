import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, List, Share2 } from 'lucide-react';

export interface ExportColumn<T> {
  id: string;
  label: string;
  getValue: (row: T) => string | number;
}

interface ExportMenuProps<T> {
  data: T[];
  columns: ExportColumn<T>[];
  filename: string;
  title: string;
}

export function ExportMenu<T>({ data, columns, filename, title }: ExportMenuProps<T>) {
  const [showMenu, setShowMenu] = useState(false);
  
  // Initialize export fields state (all true by default)
  const [exportFields, setExportFields] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columns.forEach(c => initial[c.id] = true);
    return initial;
  });

  const getSelectedColumns = () => columns.filter(c => exportFields[c.id]);

  const handleExportCSV = () => {
    const selectedCols = getSelectedColumns();
    const headers = selectedCols.map(c => c.label);
    const rows = data.map(row => selectedCols.map(c => {
      let val = c.getValue(row);
      // Escape commas and quotes for CSV
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }));
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const handleExportPDF = () => {
    const selectedCols = getSelectedColumns();
    const headersHTML = selectedCols.map(c => `<th>${c.label}</th>`).join('');
    const rowsHTML = data.map(row => {
      const rowHTML = selectedCols.map(c => `<td>${c.getValue(row)}</td>`).join('');
      return `<tr>${rowHTML}</tr>`;
    }).join('');

    const printWin = window.open('', '_blank');
    if (!printWin) return;
    printWin.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            h1 { text-align: center; color: #10b981; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 11px; }
            th { background-color: #f3f4f6; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Total Records: ${data.length} | Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead><tr>${headersHTML}</tr></thead>
            <tbody>${rowsHTML}</tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
    setShowMenu(false);
  };

  const handleCopyTable = () => {
    const selectedCols = getSelectedColumns();
    const headers = selectedCols.map(c => c.label);
    const rows = data.map(row => selectedCols.map(c => c.getValue(row)));
    
    const text = headers.join('\t') + '\n' + rows.map(r => r.join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    alert('Table copied to clipboard! You can paste it into Excel or Google Sheets.');
    setShowMenu(false);
  };

  const handleWhatsAppText = () => {
    const selectedCols = getSelectedColumns();
    const text = `*${title}*\nTotal Records: ${data.length}\nDate: ${new Date().toLocaleDateString()}\n\n` + 
      data.map((row, idx) => {
        let line = `${idx + 1}.`;
        selectedCols.forEach(c => {
          line += ` ${c.label}: ${c.getValue(row)} |`;
        });
        return line.slice(0, -1).trim();
      }).join('\n');
    navigator.clipboard.writeText(text);
    alert("WhatsApp share text copied to clipboard! You can paste it into any WhatsApp chat.");
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold self-start md:self-center shrink-0 shadow-md transition-all"
      >
        <Download className="w-4 h-4" /> Download Report
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 z-50">
          <div className="mb-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Select fields:</h4>
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2">
              {columns.map(field => (
                <label key={field.id} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={exportFields[field.id]}
                    onChange={(e) => setExportFields({...exportFields, [field.id]: e.target.checked})}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {field.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button onClick={handleExportCSV} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"><FileSpreadsheet className="w-3.5 h-3.5" /> CSV</button>
            <button onClick={handleExportPDF} className="bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"><FileText className="w-3.5 h-3.5" /> PDF</button>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={handleCopyTable} className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"><List className="w-3.5 h-3.5" /> Copy as Table</button>
            <button onClick={handleWhatsAppText} className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"><Share2 className="w-3.5 h-3.5" /> Copy for WhatsApp</button>
          </div>
        </div>
      )}
    </div>
  );
}

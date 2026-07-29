'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

interface ReceiptData {
  receiptNo: string;
  date: string;
  name: string;
  place: string;
  phone?: string;
  amount: string | number;
  month?: string;
  plan?: string;
}

interface MahabbaReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
  previewMode?: boolean;
  customLayout?: any;
}

const MONTH_ROWS = [MONTHS.slice(0, 5), MONTHS.slice(5)];

const POS: Record<string, { x: number; y: number; s: number; centered?: boolean }> = {
  receiptNo: { x: 340, y: 210, s: 26 },
  date: { x: 340, y: 252, s: 26 },
  name: { x: 540, y: 400, s: 64, centered: true },
  placePhone: { x: 540, y: 478, s: 34, centered: true },
  amount: { x: 540, y: 560, s: 70, centered: true },
  months: { x: 540, y: 960, s: 16, centered: true },
  plan: { x: 540, y: 1060, s: 22, centered: true },
};

export default function MahabbaReceiptModal({ isOpen, onClose, receiptData, previewMode, customLayout }: MahabbaReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!previewMode && (!isOpen || !receiptData)) return null;

  const formattedDate = new Date(receiptData?.date || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const generateImage = async (): Promise<string | null> => {
    if (!receiptRef.current) return null;
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const dataUrl = await htmlToImage.toPng(receiptRef.current, {
        quality: 1.0, pixelRatio: 2, width: 1080, height: 1350
      });
      return dataUrl;
    } catch (err) {
      console.error('Failed to generate image', err);
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async () => {
    const dataUrl = await generateImage();
    if (dataUrl && receiptData) {
      const link = document.createElement('a');
      link.download = `Receipt_${receiptData.receiptNo}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleWhatsApp = async () => {
    if (!receiptData) return;
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) return;
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `Receipt_${receiptData.receiptNo}.png`, { type: 'image/png' });
      const text = `Receipt: ${receiptData.receiptNo}\nAmount: ₹${receiptData.amount}\nThank you ${receiptData.name}`;
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Donation Receipt', text });
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const selectedMonth = receiptData?.month?.substring(0, 3) || '';
  const lay = customLayout as Record<string, { dx: number; dy: number; size: number }> | undefined;
  const p = (key: string) => {
    const el = lay?.[key];
    const dx = el?.dx ?? 0;
    const dy = el?.dy ?? 0;
    const s = el?.size ?? POS[key]?.s ?? 26;
    const top = `${POS[key].y + dy}px`;
    const fs = `${s}px`;
    if (POS[key].centered) return { top, left: `calc(50% + ${dx}px)`, transform: 'translateX(-50%)', fontSize: fs } as const;
    return { top, left: `${POS[key].x + dx}px`, fontSize: fs } as const;
  };

  const receiptContent = (
    <div className="relative" style={{ width: '1080px', height: '1350px' }}>
      <img
        src="/receipt-template.svg"
        alt="Receipt Template"
        className="absolute inset-0 w-full h-full"
        style={{ width: '1080px', height: '1350px' }}
      />
      <div className="absolute inset-0" style={{ width: '1080px', height: '1350px' }}>
        <div style={{ position: 'absolute', ...p('receiptNo'), fontWeight: 700, color: '#111' }}>
          : {receiptData?.receiptNo || 'N/A'}
        </div>
        <div style={{ position: 'absolute', ...p('date'), fontFamily: "'Nohemi', sans-serif", fontWeight: 700, color: '#111' }}>
          : {formattedDate}
        </div>
        <div style={{ position: 'absolute', ...p('name'), fontFamily: "'Nohemi', sans-serif", fontWeight: 800, color: '#111', textAlign: 'center', width: '100%', padding: '0 60px', lineHeight: 1.1 }}>
          {receiptData?.name || ''}
        </div>
        <div style={{ position: 'absolute', ...p('placePhone'), fontWeight: 500, color: '#333', textAlign: 'center', width: '100%' }}>
          {receiptData?.place || ''}
        </div>
        <div style={{ position: 'absolute', ...p('amount'), color: '#fff', fontWeight: 800, textAlign: 'center' }}>
          ₹ {receiptData?.amount || '0'}
        </div>
        <div style={{ position: 'absolute', ...p('months'), display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', width: '90%' }}>
          {MONTH_ROWS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {row.map(m => (
                <div key={m} style={{
                  backgroundColor: m === selectedMonth ? '#18A66A' : '#eef2f6',
                  color: m === selectedMonth ? 'white' : '#64748b',
                  borderRadius: '10px', padding: '5px 10px', fontSize: `${p('months').fontSize}`, fontWeight: m === selectedMonth ? 700 : 500
                }}>
                  {m}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', ...p('plan'), color: '#555', fontWeight: 500 }}>
          Plan: {receiptData?.plan || 'N/A'}/month
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2 justify-end">
        <button onClick={handleWhatsApp} className="bg-[#25D366] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-[#20bd5a] transition-colors">
          <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp</span>
        </button>
        <button onClick={handleDownload} disabled={isExporting} className="bg-slate-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-slate-900 transition-colors disabled:opacity-50">
          <Download className="w-4 h-4" /> <span className="hidden sm:inline">PNG</span>
        </button>
        <button onClick={onClose} className="bg-white/10 text-white p-2 rounded-xl border border-white/20 hover:bg-white/20 transition-colors ml-2">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div ref={receiptRef} style={{ transform: 'scale(0.4)', transformOrigin: 'top center' }} className="receipt-scaled">
        {receiptContent}
      </div>

      <style>{`
        @media (min-width: 640px) { .receipt-scaled { transform: scale(0.45); } }
        @media (min-width: 768px) { .receipt-scaled { transform: scale(0.55); } }
        @media (min-width: 1024px) { .receipt-scaled { transform: scale(0.6); } }
        @media print {
          body * { visibility: hidden; }
          .receipt-scaled, .receipt-scaled * { visibility: visible; }
          .receipt-scaled { position: absolute; left: 0; top: 0; transform: scale(0.7) !important; transform-origin: top left !important; }
          .fixed { position: absolute !important; }
        }
      `}</style>
    </div>
  );
}

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
  paidMonths?: string[];
  plan?: string;
  status?: string;
  paymentStatus?: string;
  isPending?: boolean;
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
  receiptNo: { x: 340, y: 440, s: 26 },
  date: { x: 340, y: 480, s: 26 },
  name: { x: 540, y: 400, s: 64, centered: true },
  placePhone: { x: 540, y: 468, s: 34, centered: true },
  amount: { x: 540, y: 595, s: 70, centered: true },
  months: { x: 540, y: 725, s: 16, centered: true },
  plan: { x: 540, y: 785, s: 22, centered: true },
};

export default function MahabbaReceiptModal({ isOpen, onClose, receiptData, previewMode, customLayout }: MahabbaReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!previewMode && (!isOpen || !receiptData)) return null;



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

  const normalizeToShortMonth = (str: string): string => {
    if (!str) return '';
    const clean = str.trim().toLowerCase();
    if (clean.includes('jun')) return 'Jun';
    if (clean.includes('jul')) return 'Jul';
    if (clean.includes('aug')) return 'Aug';
    if (clean.includes('sep')) return 'Sep';
    if (clean.includes('oct')) return 'Oct';
    if (clean.includes('nov')) return 'Nov';
    if (clean.includes('dec')) return 'Dec';
    if (clean.includes('jan')) return 'Jan';
    if (clean.includes('feb')) return 'Feb';
    if (clean.includes('mar')) return 'Mar';
    return str.trim().substring(0, 3);
  };

  // Parse current months being paid in this specific receipt
  const currentMonthsList = (receiptData?.month || '')
    .replace('Custom:', '')
    .split(',')
    .map(s => normalizeToShortMonth(s))
    .filter(Boolean);

  // Parse all previously paid months for this donor
  const paidMonthsList = (receiptData?.paidMonths || [])
    .flatMap(m => typeof m === 'string' ? m.replace('Custom:', '').split(',') : [])
    .map(s => normalizeToShortMonth(s))
    .filter(Boolean);

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

  const receiptDateObj = receiptData?.date ? new Date(receiptData.date) : new Date();
  const formattedDate = (isNaN(receiptDateObj.getTime()) ? new Date() : receiptDateObj).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const isPending = receiptData?.status === 'PENDING' || receiptData?.status === 'NOT_GIVEN' || receiptData?.isPending === true || receiptData?.paymentStatus === 'NOT_GIVEN';

  const receiptContent = (
    <div className="relative" style={{ width: '1080px', height: '1350px' }}>
      <img
        src="/receipt-template.svg"
        alt="Receipt Template"
        className="absolute inset-0 w-full h-full"
        style={{ width: '1080px', height: '1350px' }}
      />
      <div className="absolute inset-0" style={{ width: '1080px', height: '1350px' }}>
        {isPending && (
          <div style={{
            position: 'absolute',
            top: '300px',
            left: '695px',
            width: '270px',
            height: '78px',
            backgroundColor: '#ffffff',
            borderRadius: '32px',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '0 8px',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)'
          }}>
            <span style={{
              color: '#ef4444',
              fontWeight: 800,
              fontSize: '15px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              fontFamily: "'Inter', sans-serif"
            }}>
              PAYMENT PENDING
            </span>
          </div>
        )}

        <div style={{ position: 'absolute', ...p('receiptNo'), fontWeight: 400, color: '#111' }}>
          {receiptData?.receiptNo || 'N/A'}
        </div>
        <div style={{ position: 'absolute', ...p('date'), fontFamily: "'Nohemi', sans-serif", fontWeight: 400, color: '#111' }}>
          {formattedDate}
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
              {row.map(m => {
                const isCurrentMonth = currentMonthsList.includes(m);
                const isPaidMonth = paidMonthsList.includes(m);

                let bgColor = '#eef2f6';
                let textColor = '#64748b';
                let fontWeight: number | string = 500;
                let border = 'none';

                if (isCurrentMonth) {
                  // Current month being paid in this receipt -> Dark Green
                  bgColor = '#15803D';
                  textColor = '#ffffff';
                  fontWeight = 800;
                  border = '1.5px solid #14532D';
                } else if (isPaidMonth) {
                  // Previously paid month for donor -> Light Green
                  bgColor = '#86EFAC';
                  textColor = '#14532D';
                  fontWeight = 700;
                  border = '1px solid #4ADE80';
                }

                return (
                  <div key={m} style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    borderRadius: '10px',
                    padding: '5px 10px',
                    fontSize: `${p('months').fontSize}`,
                    fontWeight: fontWeight,
                    border: border
                  }}>
                    {m}
                  </div>
                );
              })}
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

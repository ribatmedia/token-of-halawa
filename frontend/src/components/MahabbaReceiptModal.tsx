'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import {
  ReceiptData,
  POS,
  MONTHS,
  MONTH_ROWS,
  normalizeToShortMonth,
  generateReceiptBlob,
  downloadReceiptBlob,
  shareReceiptWhatsApp
} from '../utils/receiptGenerator';

export type { ReceiptData };

interface MahabbaReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
  previewMode?: boolean;
  customLayout?: any;
}

export default function MahabbaReceiptModal({
  isOpen,
  onClose,
  receiptData,
  previewMode,
  customLayout
}: MahabbaReceiptModalProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!previewMode && (!isOpen || !receiptData)) return null;

  const currentMonthsList = (receiptData?.month || '')
    .replace('Custom:', '')
    .split(',')
    .map(s => normalizeToShortMonth(s))
    .filter(Boolean);

  const paidMonthsList = (receiptData?.paidMonths || [])
    .flatMap(m => typeof m === 'string' ? m.replace('Custom:', '').split(',') : [])
    .map(s => normalizeToShortMonth(s))
    .filter(Boolean);

  const handleDownload = async () => {
    if (!receiptData || isExporting) return;
    setIsExporting(true);
    try {
      const blob = await generateReceiptBlob(receiptData, customLayout, exportRef.current);
      downloadReceiptBlob(blob, `Receipt_${receiptData.receiptNo}.png`);
    } catch (err) {
      console.error('Failed to download receipt:', err);
      alert('Failed to generate receipt image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleWhatsApp = async () => {
    if (!receiptData || isExporting) return;
    setIsExporting(true);
    try {
      const blob = await generateReceiptBlob(receiptData, customLayout, exportRef.current);
      await shareReceiptWhatsApp(blob, receiptData);
    } catch (error) {
      console.error('Share error:', error);
      alert('Failed to share receipt. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const lay = customLayout as Record<string, { dx: number; dy: number; size: number }> | undefined;
  const p = (key: string) => {
    const el = lay?.[key];
    const dx = el?.dx ?? 0;
    const dy = el?.dy ?? 0;
    const s = el?.size ?? POS[key]?.s ?? 26;
    const top = `${POS[key].y + dy}px`;
    const fs = `${s}px`;
    if (POS[key].centered) return { top, left: `calc(50% + ${dx}px)`, transform: 'translate(-50%, -50%)', fontSize: fs } as const;
    return { top, left: `${POS[key].x + dx}px`, transform: 'translateY(-50%)', fontSize: fs } as const;
  };

  const receiptDateObj = receiptData?.date ? new Date(receiptData.date) : new Date();
  const formattedDate = (isNaN(receiptDateObj.getTime()) ? new Date() : receiptDateObj).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const isPending = receiptData?.status === 'PENDING' || receiptData?.status === 'NOT_GIVEN' || receiptData?.isPending === true || receiptData?.paymentStatus === 'NOT_GIVEN';

  const cleanAmount = String(receiptData?.amount || '0')
    .replace(/\u00E2\u201A\u00B9/g, '')
    .replace(/â‚¹/g, '')
    .replace(/\u20B9/g, '')
    .replace(/₹/g, '')
    .trim();
  const rupeeSymbol = '\u20B9';

  const rawPlan = receiptData?.plan || '';
  const cleanPlan = rawPlan
    .replace(/\u00E2\u201A\u00B9/g, '\u20B9')
    .replace(/â‚¹/g, '\u20B9')
    .trim();
  const hasPlan = Boolean(cleanPlan && cleanPlan !== 'N/A' && cleanPlan.toLowerCase() !== 'general');
  const planText = cleanPlan.toLowerCase().startsWith('plan:') ? cleanPlan : `Plan: ${cleanPlan}`;

  const hasMonths = currentMonthsList.length > 0 || paidMonthsList.length > 0;

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
            top: '413px',
            left: '698px',
            width: '266px',
            height: '88px',
            backgroundColor: '#dc2626',
            borderRadius: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            boxShadow: '0 4px 14px rgba(220, 38, 38, 0.45)'
          }}>
            <span style={{
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '22px',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              fontFamily: "'Inter', sans-serif"
            }}>
              AMOUNT PENDING
            </span>
          </div>
        )}

        <div style={{ position: 'absolute', ...p('receiptNo'), fontWeight: 400, color: '#111' }}>
          {receiptData?.receiptNo || 'N/A'}
        </div>
        <div style={{ position: 'absolute', ...p('date'), fontFamily: "'Nohemi', sans-serif", fontWeight: 400, color: '#111' }}>
          {formattedDate}
        </div>
        <div style={{ position: 'absolute', ...p('name'), fontFamily: "'Nohemi', 'Anek Malayalam', sans-serif", fontWeight: 800, color: '#111', textAlign: 'center', width: '940px', lineHeight: 1.1 }}>
          {receiptData?.name || ''}
        </div>
        <div style={{ position: 'absolute', ...p('placePhone'), fontFamily: "'Inter', 'Anek Malayalam', sans-serif", fontWeight: 500, color: '#333', textAlign: 'center', width: '850px' }}>
          {receiptData?.place && receiptData.place !== 'GENERAL' && receiptData.place !== 'General' ? receiptData.place : 'Kerala'}
        </div>
        {hasPlan && (
          <div style={{ position: 'absolute', ...p('plan'), color: '#334155', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '30px', padding: '6px 20px', fontWeight: 800, whiteSpace: 'nowrap' }}>
            {planText}
          </div>
        )}
        <div style={{ position: 'absolute', ...p('amount'), color: '#fff', fontWeight: 800, textAlign: 'center' }}>
          {rupeeSymbol} {cleanAmount}
        </div>
        {hasMonths && (
          <div style={{
            position: 'absolute',
            ...p('months'),
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: '4px 10px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
          }}>
            {MONTHS.map(m => {
              const isCurrentMonth = currentMonthsList.includes(m);
              const isPaidMonth = paidMonthsList.includes(m);

              let bgColor = '#f8fafc';
              let textColor = '#64748b';
              let fontWeight: number | string = 500;
              let border = '1px solid #e2e8f0';

              if (isCurrentMonth) {
                bgColor = '#15803D';
                textColor = '#ffffff';
                fontWeight = 800;
                border = '1.5px solid #14532D';
              } else if (isPaidMonth) {
                bgColor = '#86EFAC';
                textColor = '#14532D';
                fontWeight = 700;
                border = '1px solid #4ADE80';
              }

              return (
                <div key={m} style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  borderRadius: '6px',
                  padding: '2px 6px',
                  width: '58px',
                  textAlign: 'center',
                  fontSize: `${POS.months.s + (lay?.months?.size || 0)}px`,
                  fontWeight: fontWeight,
                  border: border
                }}>
                  {m}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2 justify-end">
        <button
          onClick={handleWhatsApp}
          disabled={isExporting}
          className="bg-[#25D366] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-[#20bd5a] transition-colors disabled:opacity-50"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">{isExporting ? 'Preparing...' : 'WhatsApp'}</span>
        </button>
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="bg-slate-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-slate-900 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">{isExporting ? 'Generating...' : 'PNG'}</span>
        </button>
        <button
          onClick={onClose}
          className="bg-white/10 text-white p-2 rounded-xl border border-white/20 hover:bg-white/20 transition-colors ml-2"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div ref={exportRef} style={{ transform: 'scale(0.4)', transformOrigin: 'top center' }} className="receipt-scaled">
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

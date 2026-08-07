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

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
  customLayout?: any;
  previewMode?: boolean;
  autoShareWhatsApp?: boolean;
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

export default function ReceiptModal({ isOpen, onClose, receiptData, customLayout, previewMode, autoShareWhatsApp }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const autoShareTriggered = React.useRef(false);

  React.useEffect(() => {
    if (autoShareWhatsApp && isOpen && receiptData && !autoShareTriggered.current) {
      autoShareTriggered.current = true;
      const timer = setTimeout(() => { handleWhatsAppShare(); }, 800);
      return () => clearTimeout(timer);
    }
    if (!isOpen) autoShareTriggered.current = false;
  }, [isOpen, autoShareWhatsApp, receiptData]);

  if (!previewMode && (!isOpen || !receiptData)) return null;

  const formattedDate = new Date(receiptData?.date || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

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

  const currentMonthsList = (receiptData?.month || '')
    .replace('Custom:', '')
    .split(',')
    .map(s => normalizeToShortMonth(s))
    .filter(Boolean);

  const paidMonthsList = (receiptData?.paidMonths || [])
    .flatMap(m => typeof m === 'string' ? m.replace('Custom:', '').split(',') : [])
    .map(s => normalizeToShortMonth(s))
    .filter(Boolean);

  const generateImage = async (): Promise<string | null> => {
    if (!receiptRef.current) return null;
    setIsExporting(true);
    try {
      const el = receiptRef.current;
      const origWidth = el.style.width;
      el.style.width = '1080px';
      await new Promise(resolve => setTimeout(resolve, 150));
      const dataUrl = await htmlToImage.toPng(el, { quality: 1.0, pixelRatio: 2 });
      el.style.width = origWidth;
      return dataUrl;
    } catch (err) {
      console.error('Failed to generate image', err);
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPNG = async () => {
    const dataUrl = await generateImage();
    if (dataUrl && receiptData) {
      const link = document.createElement('a');
      link.download = `Receipt_${receiptData.receiptNo}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleWhatsAppShare = async () => {
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

  const ReceiptInner = ({ width }: { width: string }) => {
    const lay = customLayout as Record<string, { dx: number; dy: number; size: number }> | undefined;
    const p = (key: string) => {
      const el = lay?.[key];
      const dx = el?.dx ?? 0;
      const dy = el?.dy ?? 0;
      const s = el?.size ?? POS[key]?.s ?? 26;
      const top = `${((POS[key].y + dy) / 1350) * 100}%`;
      const fs = `${(s / 1080) * 100}cqw`;
      if (POS[key].centered) return { top, left: `calc(50% + ${dx / 10.8}%)`, transform: 'translateX(-50%)', fontSize: fs } as const;
      return { top, left: `${((POS[key].x + dx) / 1080) * 100}%`, fontSize: fs } as const;
    };
    const receiptDateObj = receiptData?.date ? new Date(receiptData.date) : new Date();
    const formattedDate = (isNaN(receiptDateObj.getTime()) ? new Date() : receiptDateObj).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const isPending = receiptData?.status === 'PENDING' || receiptData?.status === 'NOT_GIVEN' || receiptData?.isPending === true || receiptData?.paymentStatus === 'NOT_GIVEN';

    return (
      <div
        ref={receiptRef}
        className="relative bg-white overflow-hidden rounded-xl shadow-2xl"
        style={{
          containerType: 'size',
          width: '100%',
          maxWidth: width,
          aspectRatio: '1080 / 1350'
        }}
      >
        <img src="/receipt-template.svg" alt="" className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0">
          {isPending && (
            <div style={{
              position: 'absolute',
              top: '22.2%',
              left: '64.5%',
              width: '25%',
              height: '5.8%',
              backgroundColor: '#ffffff',
              borderRadius: '3cqw',
              border: '0.2cqw solid #ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4cqw',
              padding: '0 0.8cqw',
              zIndex: 10,
              boxShadow: '0 0.1cqw 0.4cqw rgba(239, 68, 68, 0.15)'
            }}>
              <span style={{
                color: '#ef4444',
                fontWeight: 800,
                fontSize: '1.35cqw',
                letterSpacing: '0.04cqw',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                fontFamily: "'Inter', sans-serif"
              }}>
                PAYMENT PENDING
              </span>
            </div>
          )}
          <div style={{ position: 'absolute', ...p('receiptNo'), fontWeight: 700, color: '#111', whiteSpace: 'nowrap' }}>
            {receiptData?.receiptNo || 'N/A'}
          </div>
          <div style={{ position: 'absolute', ...p('date'), fontFamily: "'Nohemi', sans-serif", fontWeight: 700, color: '#111', whiteSpace: 'nowrap' }}>
            {formattedDate}
          </div>
          <div style={{ position: 'absolute', ...p('name'), fontFamily: "'Nohemi', 'Anek Malayalam', sans-serif", fontWeight: 800, color: '#111', textAlign: 'center', width: '90%', lineHeight: 1.1 }}>
            {receiptData?.name || ''}
          </div>
          <div style={{ position: 'absolute', ...p('placePhone'), fontFamily: "'Inter', 'Anek Malayalam', sans-serif", fontWeight: 500, color: '#333', textAlign: 'center', width: '80%' }}>
            {receiptData?.place || ''}
          </div>
          <div style={{ position: 'absolute', ...p('amount'), color: '#fff', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>
            ₹ {receiptData?.amount || '0'}
          </div>
          <div style={{ position: 'absolute', ...p('months'), display: 'flex', flexDirection: 'column', gap: '0.5cqw', alignItems: 'center', width: '90%' }}>
            {MONTH_ROWS.map((row, ri) => (
              <div key={ri} style={{ display: 'flex', gap: '0.7cqw', justifyContent: 'center' }}>
                {row.map(m => {
                  const isCurrentMonth = currentMonthsList.includes(m);
                  const isPaidMonth = paidMonthsList.includes(m);

                  let bgColor = '#eef2f6';
                  let textColor = '#64748b';
                  let fontWeight: number | string = 500;
                  let border = 'none';

                  if (isCurrentMonth) {
                    bgColor = '#15803D';
                    textColor = '#ffffff';
                    fontWeight = 800;
                    border = '0.15cqw solid #14532D';
                  } else if (isPaidMonth) {
                    bgColor = '#86EFAC';
                    textColor = '#14532D';
                    fontWeight = 700;
                    border = '0.1cqw solid #4ADE80';
                  }

                  return (
                    <div key={m} style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      borderRadius: '0.9cqw',
                      padding: '0.5cqw 0.9cqw',
                      fontSize: `${(POS.months.s / 1080) * 100}cqw`,
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
          <div style={{ position: 'absolute', ...p('plan'), color: '#334155', backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '4cqw', padding: '0.8cqw 2.5cqw', fontWeight: 800, whiteSpace: 'nowrap' }}>
            Plan: {receiptData?.plan || 'N/A'}
          </div>
        </div>
      </div>
    );
  };

  if (previewMode) {
    return (
      <div className="flex justify-center items-center pointer-events-none w-full" style={{ height: '500px' }}>
        <div style={{ width: '345px', height: '432px', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
          <ReceiptInner width="100%" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2 justify-end">
        <button onClick={handleWhatsAppShare} className="bg-[#25D366] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-[#20bd5a] transition-colors">
          <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp</span>
        </button>
        <button onClick={handleDownloadPNG} disabled={isExporting} className="bg-slate-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-slate-900 transition-colors disabled:opacity-50">
          <Download className="w-4 h-4" /> <span className="hidden sm:inline">PNG</span>
        </button>
        <button onClick={onClose} className="bg-white/10 text-white p-2 rounded-xl border border-white/20 hover:bg-white/20 transition-colors ml-2">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="flex items-center justify-center w-full h-full">
        <ReceiptInner width="min(calc(75vh * 0.8), calc(100vw - 48px))" />
      </div>
    </div>
  );
}

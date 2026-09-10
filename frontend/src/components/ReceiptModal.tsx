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

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
  customLayout?: any;
  previewMode?: boolean;
  autoShareWhatsApp?: boolean;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  receiptData,
  customLayout,
  previewMode,
  autoShareWhatsApp
}: ReceiptModalProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const autoShareTriggered = useRef(false);

  React.useEffect(() => {
    if (autoShareWhatsApp && isOpen && receiptData && !autoShareTriggered.current) {
      autoShareTriggered.current = true;
      const timer = setTimeout(() => {
        handleWhatsAppShare();
      }, 800);
      return () => clearTimeout(timer);
    }
    if (!isOpen) autoShareTriggered.current = false;
  }, [isOpen, autoShareWhatsApp, receiptData]);

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

  const handleDownloadPNG = async () => {
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

  const handleWhatsAppShare = async () => {
    if (!receiptData || isExporting) return;
    setIsExporting(true);
    try {
      const blob = await generateReceiptBlob(receiptData, customLayout, exportRef.current);
      await shareReceiptWhatsApp(blob, receiptData);
    } catch (err) {
      console.error('Failed to share receipt:', err);
      alert('Failed to share receipt. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const receiptDateObj = receiptData?.date ? new Date(receiptData.date) : new Date();
  const formattedDate = (isNaN(receiptDateObj.getTime()) ? new Date() : receiptDateObj).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const isPending = receiptData?.status === 'PENDING' || receiptData?.status === 'NOT_GIVEN' || receiptData?.isPending === true || receiptData?.paymentStatus === 'NOT_GIVEN';

  const lay = customLayout as Record<string, { dx: number; dy: number; size: number }> | undefined;

  // Responsive styling for on-screen modal display
  const p = (key: string) => {
    const el = lay?.[key];
    const dx = el?.dx ?? 0;
    const dy = el?.dy ?? 0;
    const s = el?.size ?? POS[key]?.s ?? 26;
    const top = `${((POS[key].y + dy) / 1350) * 100}%`;
    const fs = `${(s / 1080) * 100}cqw`;
    const posX = POS[key]?.x ?? 540;
    if (POS[key]?.centered) return { top, left: `calc(${posX / 10.8}% + ${dx / 10.8}%)`, transform: 'translate(-50%, -50%)', fontSize: fs } as const;
    return { top, left: `${((posX + dx) / 1080) * 100}%`, transform: 'translateY(-50%)', fontSize: fs } as const;
  };

  // Fixed pixel positioning for offscreen 1080x1350 DOM export fallback
  const pFixed = (key: string) => {
    const el = lay?.[key];
    const dx = el?.dx ?? 0;
    const dy = el?.dy ?? 0;
    const s = el?.size ?? POS[key]?.s ?? 26;
    const top = `${POS[key].y + dy}px`;
    const fs = `${s}px`;
    const posX = POS[key]?.x ?? 540;
    if (POS[key]?.centered) return { top, left: `${posX + dx}px`, transform: 'translate(-50%, -50%)', fontSize: fs } as const;
    return { top, left: `${posX + dx}px`, transform: 'translateY(-50%)', fontSize: fs } as const;
  };

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
  const hasPlan = previewMode || Boolean(cleanPlan && cleanPlan !== 'N/A' && cleanPlan.toLowerCase() !== 'general');
  const planDisplay = (previewMode && (!cleanPlan || cleanPlan === 'N/A' || cleanPlan.toLowerCase() === 'general'))
    ? 'Plan: \u20B9500/Month'
    : (cleanPlan.toLowerCase().startsWith('plan:') ? cleanPlan : `Plan: ${cleanPlan}`);

  const hasMonths = previewMode || currentMonthsList.length > 0 || paidMonthsList.length > 0;
  const effectiveCurrentMonths = (previewMode && currentMonthsList.length === 0 && paidMonthsList.length === 0)
    ? ['Sep']
    : currentMonthsList;
  const effectivePaidMonths = (previewMode && currentMonthsList.length === 0 && paidMonthsList.length === 0)
    ? ['Jun', 'Jul', 'Aug']
    : paidMonthsList;

  // Screen preview inner
  const ReceiptInner = ({ width }: { width: string }) => {
    return (
      <div
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
              top: '30.6%',
              left: '64.6%',
              width: '24.6%',
              height: '6.5%',
              backgroundColor: '#dc2626',
              borderRadius: '3.3cqw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              boxShadow: '0 0.3cqw 1cqw rgba(220, 38, 38, 0.45)'
            }}>
              <span style={{
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1.7cqw',
                letterSpacing: '0.05cqw',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                fontFamily: "'Inter', sans-serif"
              }}>
                AMOUNT PENDING
              </span>
            </div>
          )}
          <div style={{ position: 'absolute', ...p('receiptNo'), fontWeight: 400, color: '#111', whiteSpace: 'nowrap' }}>
            {receiptData?.receiptNo || 'N/A'}
          </div>
          <div style={{ position: 'absolute', ...p('date'), fontFamily: "'Nohemi', sans-serif", fontWeight: 400, color: '#111', whiteSpace: 'nowrap' }}>
            {formattedDate}
          </div>
          <div style={{ position: 'absolute', ...p('name'), fontFamily: "'Nohemi', 'Anek Malayalam', sans-serif", fontWeight: 800, color: '#111', textAlign: 'center', width: '90%', lineHeight: 1.1 }}>
            {receiptData?.name || ''}
          </div>
          <div style={{ position: 'absolute', ...p('placePhone'), fontFamily: "'Inter', 'Anek Malayalam', sans-serif", fontWeight: 500, color: '#333', textAlign: 'center', width: '80%' }}>
            {receiptData?.place && receiptData.place !== 'GENERAL' && receiptData.place !== 'General' ? receiptData.place : 'Kerala'}
          </div>
          {hasPlan && (
            <div style={{ position: 'absolute', ...p('plan'), color: '#334155', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4cqw', padding: '0.6cqw 2cqw', fontWeight: 800, whiteSpace: 'nowrap' }}>
              {planDisplay}
            </div>
          )}
          <div style={{ position: 'absolute', ...p('amount'), color: '#fff', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>
            {rupeeSymbol} {cleanAmount}
          </div>
          {hasMonths && (
            <div style={{
              position: 'absolute',
              ...p('months'),
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4cqw',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              padding: '0.5cqw 0.8cqw',
              borderRadius: '0.8cqw',
              border: '0.1cqw solid #e2e8f0',
              boxShadow: '0 0.2cqw 0.8cqw rgba(0,0,0,0.06)'
            }}>
              {MONTH_ROWS.map((row, ri) => (
                <div key={ri} style={{ display: 'flex', gap: '0.5cqw', justifyContent: 'center' }}>
                  {row.map(m => {
                    const isCurrentMonth = effectiveCurrentMonths.includes(m);
                    const isPaidMonth = effectivePaidMonths.includes(m);

                    let bgColor = '#f8fafc';
                    let textColor = '#64748b';
                    let fontWeight: number | string = 500;
                    let border = '0.1cqw solid #e2e8f0';

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
                        borderRadius: '0.5cqw',
                        padding: '0.2cqw 0.4cqw',
                        width: '5.2cqw',
                        textAlign: 'center',
                        fontSize: `${((lay?.months?.size ?? POS.months.s) / 1080) * 100}cqw`,
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
          )}
        </div>
      </div>
    );
  };

  // Dedicated offscreen 1080x1350 container with explicit pixels for DOM export
  const ReceiptExportDOM = () => (
    <div
      ref={exportRef}
      style={{
        position: 'fixed',
        left: '-99999px',
        top: 0,
        width: '1080px',
        height: '1350px',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -9999,
      }}
    >
      <img
        src="/receipt-template.svg"
        alt=""
        crossOrigin="anonymous"
        style={{ position: 'absolute', inset: 0, width: '1080px', height: '1350px' }}
      />
      <div style={{ position: 'absolute', inset: 0, width: '1080px', height: '1350px' }}>
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

        <div style={{ position: 'absolute', ...pFixed('receiptNo'), fontWeight: 400, color: '#111', whiteSpace: 'nowrap' }}>
          {receiptData?.receiptNo || 'N/A'}
        </div>
        <div style={{ position: 'absolute', ...pFixed('date'), fontFamily: "'Nohemi', sans-serif", fontWeight: 400, color: '#111', whiteSpace: 'nowrap' }}>
          {formattedDate}
        </div>
        <div style={{ position: 'absolute', ...pFixed('name'), fontFamily: "'Nohemi', 'Anek Malayalam', sans-serif", fontWeight: 800, color: '#111', textAlign: 'center', width: '940px', lineHeight: 1.1 }}>
          {receiptData?.name || ''}
        </div>
        <div style={{ position: 'absolute', ...pFixed('placePhone'), fontFamily: "'Inter', 'Anek Malayalam', sans-serif", fontWeight: 500, color: '#333', textAlign: 'center', width: '850px' }}>
          {receiptData?.place && receiptData.place !== 'GENERAL' && receiptData.place !== 'General' ? receiptData.place : 'Kerala'}
        </div>
        {hasPlan && (
          <div style={{ position: 'absolute', ...pFixed('plan'), color: '#334155', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '30px', padding: '6px 20px', fontWeight: 800, whiteSpace: 'nowrap' }}>
            {planDisplay}
          </div>
        )}
        <div style={{ position: 'absolute', ...pFixed('amount'), color: '#fff', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>
          {rupeeSymbol} {cleanAmount}
        </div>
        {hasMonths && (
          <div style={{
            position: 'absolute',
            ...pFixed('months'),
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
          }}>
            {MONTH_ROWS.map((row, ri) => (
              <div key={ri} style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                {row.map(m => {
                  const isCurrentMonth = effectiveCurrentMonths.includes(m);
                  const isPaidMonth = effectivePaidMonths.includes(m);

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
                      borderRadius: '5px',
                      padding: '2px 4px',
                      width: '58px',
                      textAlign: 'center',
                      fontSize: `${lay?.months?.size ?? POS.months.s}px`,
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
        )}
      </div>
    </div>
  );

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
        <button
          onClick={handleWhatsAppShare}
          disabled={isExporting}
          className="bg-[#25D366] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-[#20bd5a] transition-colors disabled:opacity-50"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">{isExporting ? 'Preparing...' : 'WhatsApp'}</span>
        </button>
        <button
          onClick={handleDownloadPNG}
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

      <div className="flex items-center justify-center w-full h-full">
        <ReceiptInner width="min(calc(75vh * 0.8), calc(100vw - 48px))" />
      </div>

      {/* Hidden offscreen element rendered for high-res fallback export */}
      <ReceiptExportDOM />
    </div>
  );
}

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

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
  customLayout?: any;
  previewMode?: boolean;
  autoShareWhatsApp?: boolean;
}

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

  const generateImage = async (): Promise<string | null> => {
    if (!receiptRef.current) return null;
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return await htmlToImage.toPng(receiptRef.current, { quality: 1.0, pixelRatio: 2, width: 1080, height: 1350 });
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

  const selectedMonth = receiptData?.month?.substring(0, 3) || '';

  const receiptContent = (
    <>
      <style>{`
        .receipt-scale { transform-origin: top center; transform: scale(0.35); }
        @media (min-width: 640px) { .receipt-scale { transform: scale(0.45); } }
        @media (min-width: 768px) { .receipt-scale { transform: scale(0.55); } }
        @media print {
          body * { visibility: hidden; }
          .receipt-scale, .receipt-scale * { visibility: visible; }
          .receipt-scale { position: absolute; left: 0; top: 0; transform: scale(0.7) !important; transform-origin: top left !important; }
        }
      `}</style>

      <div className="receipt-scale" style={previewMode ? { transform: 'scale(0.32)', transformOrigin: 'top left' } : {}}>
        <div ref={receiptRef} className="relative bg-white" style={{ width: '1080px', height: '1350px' }}>
          {/* SVG Template Background */}
          <img src="/receipt-template.svg" alt="" className="absolute inset-0 w-full h-full" style={{ width: '1080px', height: '1350px' }} />

          {/* Overlay Data */}
          <div className="absolute inset-0" style={{ width: '1080px', height: '1350px' }}>
            <div style={{ position: 'absolute', top: '305px', left: '340px', fontSize: '26px', fontWeight: 700, color: '#111' }}>
              : {receiptData?.receiptNo || 'N/A'}
            </div>
            <div style={{ position: 'absolute', top: '349px', left: '340px', fontSize: '26px', fontWeight: 700, color: '#111' }}>
              : {formattedDate}
            </div>
            <div style={{
              position: 'absolute', top: '400px', left: '50%', transform: 'translateX(-50%)',
              fontSize: '64px', fontWeight: 800, color: '#111', textAlign: 'center', width: '100%', padding: '0 60px',
              lineHeight: 1.1
            }}>
              {receiptData?.name || ''}
            </div>
            <div style={{
              position: 'absolute', top: '478px', left: '50%', transform: 'translateX(-50%)',
              fontSize: '34px', fontWeight: 500, color: '#333', textAlign: 'center', width: '100%'
            }}>
              {receiptData?.place || ''}
            </div>
            <div style={{
              position: 'absolute', top: '560px', left: '50%', transform: 'translateX(-50%)',
              backgroundColor: '#18A66A', borderRadius: '60px', padding: '14px 70px',
              color: 'white', fontSize: '70px', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap'
            }}>
              ₹ {receiptData?.amount || '0'}
            </div>
            <div style={{
              position: 'absolute', top: '660px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '8px', justifyContent: 'center'
            }}>
              {MONTHS.map(m => (
                <div key={m} style={{
                  backgroundColor: m === selectedMonth ? '#18A66A' : '#eef2f6',
                  color: m === selectedMonth ? 'white' : '#64748b',
                  borderRadius: '10px', padding: '5px 10px', fontSize: '16px', fontWeight: m === selectedMonth ? 700 : 500
                }}>
                  {m}
                </div>
              ))}
            </div>
            <div style={{
              position: 'absolute', top: '720px', left: '50%', transform: 'translateX(-50%)',
              fontSize: '22px', color: '#555', fontWeight: 500
            }}>
              Plan: {receiptData?.plan || 'N/A'}/month
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (previewMode) {
    return (
      <div className="flex justify-center items-center pointer-events-none w-full" style={{ height: '500px' }}>
        <div style={{ width: '345px', height: '432px', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
          {receiptContent}
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
      {receiptContent}
    </div>
  );
}

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

  const selectedMonth = receiptData?.month?.substring(0, 3) || '';

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

  const ReceiptInner = () => (
    <div
      ref={receiptRef}
      className="relative bg-white overflow-hidden rounded-xl shadow-2xl"
      style={{
        containerType: 'size',
        width: '100%',
        maxWidth: 'min(calc(75vh * 0.8), calc(100vw - 48px))',
        aspectRatio: '1080 / 1350'
      }}
    >
      <img src="/receipt-template.svg" alt="" className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0">
        <div style={{ position: 'absolute', left: '31.5%', top: '22.6%', fontSize: '2.4cqw', fontWeight: 700, color: '#111', whiteSpace: 'nowrap' }}>
          : {receiptData?.receiptNo || 'N/A'}
        </div>
        <div style={{ position: 'absolute', left: '31.5%', top: '25.85%', fontSize: '2.4cqw', fontWeight: 700, color: '#111', whiteSpace: 'nowrap' }}>
          : {formattedDate}
        </div>
        <div style={{ position: 'absolute', top: '29.6%', left: '50%', transform: 'translateX(-50%)', fontSize: '5.9cqw', fontWeight: 800, color: '#111', textAlign: 'center', width: '90%', lineHeight: 1.1 }}>
          {receiptData?.name || ''}
        </div>
        <div style={{ position: 'absolute', top: '35.4%', left: '50%', transform: 'translateX(-50%)', fontSize: '3.1cqw', fontWeight: 500, color: '#333', textAlign: 'center', width: '80%' }}>
          {receiptData?.place || ''}
        </div>
        <div style={{ position: 'absolute', top: '41.5%', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#18A66A', borderRadius: '5.6cqw', padding: '1.3cqw 6.5cqw', color: 'white', fontSize: '6.5cqw', fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>
          ₹ {receiptData?.amount || '0'}
        </div>
        <div style={{ position: 'absolute', top: '48.9%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.7cqw', justifyContent: 'center', width: '90%', flexWrap: 'wrap' }}>
          {MONTHS.map(m => (
            <div key={m} style={{ backgroundColor: m === selectedMonth ? '#18A66A' : '#eef2f6', color: m === selectedMonth ? 'white' : '#64748b', borderRadius: '0.9cqw', padding: '0.5cqw 0.9cqw', fontSize: '1.5cqw', fontWeight: m === selectedMonth ? 700 : 500 }}>
              {m}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', top: '53.3%', left: '50%', transform: 'translateX(-50%)', fontSize: '2cqw', color: '#555', fontWeight: 500, whiteSpace: 'nowrap' }}>
          Plan: {receiptData?.plan || 'N/A'}/month
        </div>
      </div>
    </div>
  );

  if (previewMode) {
    return (
      <div className="flex justify-center items-center pointer-events-none w-full" style={{ height: '500px' }}>
        <div style={{ width: '345px', height: '432px', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
          <div className="w-full h-full" style={{ containerType: 'size' }}>
            <ReceiptInner />
          </div>
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
        <ReceiptInner />
      </div>
    </div>
  );
}

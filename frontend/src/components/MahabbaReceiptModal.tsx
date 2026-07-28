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
}

export default function MahabbaReceiptModal({ isOpen, onClose, receiptData, previewMode }: MahabbaReceiptModalProps) {
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

  const receiptContent = (
    <div className="relative" style={{ width: '1080px', height: '1350px' }}>
      {/* SVG Background */}
      <img
        src="/receipt-template.svg"
        alt="Receipt Template"
        className="absolute inset-0 w-full h-full"
        style={{ width: '1080px', height: '1350px' }}
      />

      {/* Overlay Text - positioned to match SVG template */}
      <div className="absolute inset-0" style={{ width: '1080px', height: '1350px' }}>
        {/* Receipt No */}
        <div style={{ position: 'absolute', top: '210px', left: '340px', fontSize: '26px', fontWeight: 700, color: '#111' }}>
          : {receiptData?.receiptNo || 'N/A'}
        </div>

        {/* Date */}
        <div style={{ position: 'absolute', top: '252px', left: '340px', fontSize: '26px', fontWeight: 700, color: '#111' }}>
          : {formattedDate}
        </div>

        {/* Donor Name - large centered */}
        <div style={{
          position: 'absolute', top: '400px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '64px', fontWeight: 800, color: '#111', textAlign: 'center', width: '100%', padding: '0 60px',
          lineHeight: 1.1, fontFamily: "'Outfit', sans-serif"
        }}>
          {receiptData?.name || ''}
        </div>

        {/* Place */}
        <div style={{
          position: 'absolute', top: '478px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '34px', fontWeight: 500, color: '#333', textAlign: 'center', width: '100%'
        }}>
          {receiptData?.place || ''}
        </div>

        {/* Amount */}
        <div style={{
          position: 'absolute', top: '560px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#18A66A', borderRadius: '60px', padding: '14px 70px',
          color: 'white', fontSize: '70px', fontWeight: 800, textAlign: 'center'
        }}>
          ₹ {receiptData?.amount || '0'}
        </div>

        {/* Month Badges */}
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

        {/* Plan */}
        <div style={{
          position: 'absolute', top: '720px', left: '50%', transform: 'translateX(-50%)',
          fontSize: '22px', color: '#555', fontWeight: 500
        }}>
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

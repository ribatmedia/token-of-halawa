import React, { useRef, useState } from 'react';
import { X, Download, Share2, Printer, CheckCircle2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import Image from 'next/image';

interface ReceiptData {
  receiptNo: string;
  date: string;
  name: string;
  place: string;
  phone?: string;
  amount: string | number;
  plan?: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
}

export default function ReceiptModal({ isOpen, onClose, receiptData }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !receiptData) return null;

  // Format date to e.g. "17 Jul 2026"
  const formattedDate = new Date(receiptData.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const generateImage = async (): Promise<string | null> => {
    if (!receiptRef.current) return null;
    setIsExporting(true);
    try {
      // Small delay to ensure fonts/images are loaded
      await new Promise(resolve => setTimeout(resolve, 300));
      const dataUrl = await htmlToImage.toPng(receiptRef.current, {
        quality: 1.0,
        pixelRatio: 2, // High resolution
        width: 1080,
        height: 1350,
      });
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
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `Receipt_${receiptData.receiptNo}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    const dataUrl = await generateImage();
    if (dataUrl) {
      // 1080x1350 is a 4:5 aspect ratio. Standard A4 is 210x297mm.
      // We will create a PDF that perfectly fits the receipt dimensions.
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1080, 1350]
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 1080, 1350);
      pdf.save(`Receipt_${receiptData.receiptNo}.pdf`);
    }
  };

  const handleWhatsAppShare = async () => {
    try {
      setIsExporting(true);
      const dataUrl = await generateImage();
      if (!dataUrl) return;
      
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `Receipt_${receiptData.receiptNo}.png`, { type: 'image/png' });
      
      const text = `*Thank you for your generous contribution!*\n\n*Receipt No:* ${receiptData.receiptNo}\n*Amount:* ₹${receiptData.amount}\n*Name:* ${receiptData.name}`;

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Donation Receipt',
          text: text
        });
      } else {
        // Fallback for browsers that don't support file sharing
        const encodedText = encodeURIComponent(text);
        const waUrl = `https://wa.me/?text=${encodedText}`;
        window.open(waUrl, '_blank');
        alert("Your browser does not support sharing the image directly to WhatsApp. A text message was opened instead. You can download the receipt PNG and share it manually.");
      }
    } catch (error) {
      console.error("Error sharing to WhatsApp:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Action Bar (Mobile Responsive) */}
      <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2 justify-end">
         <button onClick={handleWhatsAppShare} className="bg-[#25D366] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-[#20bd5a] transition-colors">
            <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp</span>
         </button>
         <button onClick={handleDownloadPDF} disabled={isExporting} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">PDF</span>
         </button>
         <button onClick={handleDownloadPNG} disabled={isExporting} className="bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-slate-900 transition-colors disabled:opacity-50">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">PNG</span>
         </button>
         <button onClick={onClose} className="bg-white/10 text-white p-2 rounded-xl border border-white/20 hover:bg-white/20 transition-colors ml-2">
            <X className="w-6 h-6" />
         </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;600;700;800;900&display=swap');
        
        .receipt-wrapper {
          /* Scale down the 1080x1350 container to fit the screen */
          transform-origin: top center;
          transform: scale(0.35); /* default for mobile */
        }
        @media (min-width: 640px) { .receipt-wrapper { transform: scale(0.45); transform-origin: center center; } }
        @media (min-width: 768px) { .receipt-wrapper { transform: scale(0.5); transform-origin: center center; } }
        @media (min-width: 1024px) { .receipt-wrapper { transform: scale(0.55); transform-origin: center center; } }
        
        /* Hide everything else when printing */
        @media print {
           body * { visibility: hidden; }
           .receipt-wrapper, .receipt-wrapper * { visibility: visible; }
           .receipt-wrapper { 
              position: absolute; 
              left: 0; 
              top: 0; 
              transform: scale(0.7) !important; 
              transform-origin: top left !important;
           }
        }
      `}} />

      <div className="receipt-wrapper">
        {/* The Actual Receipt Template - 1080x1350 exactly */}
        <div 
          ref={receiptRef}
          className="bg-white shadow-2xl relative overflow-hidden"
          style={{ width: '1080px', height: '1350px', fontFamily: "'Inter', sans-serif" }}
        >
          {/* Header Title Section */}
          <div className="text-center" style={{ marginTop: '90px' }}>
             <div style={{ color: '#18A06A', fontSize: '50px', fontFamily: "'Great Vibes', cursive", marginBottom: '-20px' }}>
               Token of
             </div>
             <h1 style={{ color: '#18A06A', fontSize: '120px', fontWeight: 900, lineHeight: 1.1, margin: 0, letterSpacing: '-2px' }}>
               Halawa
             </h1>
             <h2 style={{ color: '#222', fontSize: '52px', fontWeight: 800, margin: 0 }}>
               Working Fund
             </h2>
          </div>

          {/* Receipt Details Meta */}
          <div style={{ position: 'absolute', top: '390px', left: '120px' }}>
            <div className="flex items-center gap-4 mb-2">
               <p style={{ fontSize: '32px', color: '#555', margin: 0, fontWeight: 600, width: '180px' }}>Receipt No</p>
               <span style={{ fontSize: '32px', color: '#222', fontWeight: 800 }}>: {receiptData.receiptNo}</span>
            </div>
            <div className="flex items-center gap-4">
               <p style={{ fontSize: '32px', color: '#555', margin: 0, fontWeight: 600, width: '180px' }}>Date</p>
               <span style={{ fontSize: '32px', color: '#222', fontWeight: 800 }}>: {formattedDate}</span>
            </div>
          </div>

          {/* Payment Badge */}
          <div style={{ 
            position: 'absolute', top: '380px', right: '120px', 
            border: '4px solid #18A06A', borderRadius: '50px', 
            padding: '10px 30px', display: 'flex', alignItems: 'center', gap: '15px' 
          }}>
            <div style={{ backgroundColor: '#18A06A', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={24} />
            </div>
            <div style={{ color: '#18A06A', fontSize: '28px', fontWeight: 800, lineHeight: 1.1, textAlign: 'center' }}>
               PAYMENT<br/>RECEIVED
            </div>
          </div>

          {/* Main Body (Donor Info) */}
          <div className="w-full text-center flex flex-col items-center" style={{ marginTop: '220px' }}>
             
             <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '80px', color: '#222', marginBottom: '20px' }}>
               Thank you
             </div>

             <h3 style={{ fontSize: '62px', fontWeight: 800, color: '#222', margin: 0, textTransform: 'uppercase' }}>
               {receiptData.name}
             </h3>
             
             <p style={{ fontSize: '44px', color: '#555', margin: '0 0 30px 0', fontWeight: 600 }}>
               {receiptData.place || 'Kerala'} {receiptData.phone ? `(${receiptData.phone})` : ''}
             </p>

             <div style={{ fontSize: '40px', color: '#444', marginBottom: '40px' }}>
               for your kind contribution of
             </div>

             {/* Amount Box */}
             <div style={{ 
               width: '560px', height: '140px', 
               backgroundColor: '#169C69', borderRadius: '70px',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               color: 'white', fontSize: '90px', fontWeight: 900,
               boxShadow: '0 20px 40px rgba(22, 156, 105, 0.3)'
             }}>
               ₹{receiptData.amount}
             </div>

             <div style={{ marginTop: '50px', fontSize: '32px', color: '#555', fontFamily: "'Great Vibes', cursive", lineHeight: 1.4 }}>
               Towards Inyaasunna Working Fund<br/>
               <span style={{ fontSize: '36px' }}>Your Support Makes a Real Difference.</span>
             </div>

          </div>

          {/* Footer */}
          <div style={{ 
            height: '200px', backgroundColor: '#169C69', 
            position: 'absolute', bottom: 0, width: '100%',
            display: 'flex', alignItems: 'center', padding: '0 80px', gap: '40px'
          }}>
             <div style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/ribat-logo.png" alt="Logo" width={120} height={120} style={{ objectFit: 'contain' }} priority />
             </div>
             <div style={{ color: 'white' }}>
               <h4 style={{ fontSize: '42px', fontWeight: 800, margin: 0 }}>RIBAT Students Union</h4>
               <p style={{ fontSize: '28px', margin: 0, opacity: 0.9 }}>Green Valley, Pantheerankavu, Kozhikode - 19</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

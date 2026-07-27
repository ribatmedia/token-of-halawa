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

  const defaultReceiptLayout = {
    receiptNo: { dx: 0, dy: 0, size: 28 },
    date: { dx: 0, dy: 0, size: 28 },
    name: { dx: 0, dy: 0, size: 72 },
    placePhone: { dx: 0, dy: 0, size: 52 },
    amount: { dx: 0, dy: 0, size: 78 }
  };
  const [layout, setLayout] = useState(customLayout || defaultReceiptLayout);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !customLayout) {
      const savedLayout = localStorage.getItem('receipt_layout_settings');
      if (savedLayout) {
        try {
          setLayout(JSON.parse(savedLayout));
        } catch (e) {}
      }
    }
  }, [isOpen, customLayout]);

  // Auto-trigger WhatsApp share when modal opens with autoShareWhatsApp prop
  React.useEffect(() => {
    if (autoShareWhatsApp && isOpen && receiptData && !autoShareTriggered.current) {
      autoShareTriggered.current = true;
      // Small delay to ensure receipt is fully rendered before capturing
      const timer = setTimeout(() => {
        handleWhatsAppShare();
      }, 800);
      return () => clearTimeout(timer);
    }
    if (!isOpen) {
      autoShareTriggered.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, autoShareWhatsApp, receiptData]);

  if (!previewMode && (!isOpen || !receiptData)) return null;

  // Format date to e.g. "17 Jul 2026"
  const formattedDate = new Date(receiptData?.date || Date.now()).toLocaleDateString('en-GB', {
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
    if (dataUrl && receiptData) {
      const link = document.createElement('a');
      link.download = `Receipt_${receiptData.receiptNo}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    const dataUrl = await generateImage();
    if (dataUrl && receiptData) {
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
    if (!receiptData) return;
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

  const receiptContent = (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Satisfy&family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        
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

      <div className="receipt-wrapper" style={previewMode ? { transform: 'scale(0.32)', transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 } : {}}>
        {/* The Actual Receipt Template - 1080x1350 exactly */}
        <div 
          ref={receiptRef}
          className="bg-white shadow-2xl relative overflow-hidden"
          style={{ width: '1080px', height: '1350px', fontFamily: "'Inter', sans-serif" }}
        >
          {/* Header Title Section */}
          <div className="text-center" style={{ paddingTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <div style={{ color: '#18A66A', fontSize: '64px', fontFamily: "'Satisfy', cursive", fontWeight: 400, lineHeight: 1, marginBottom: '-5px', zIndex: 10, position: 'relative' }}>
               Token of
             </div>
             <h1 style={{ color: '#18A66A', fontSize: '130px', fontWeight: 900, lineHeight: 1, margin: 0, letterSpacing: '-3px' }}>
               Halawa
             </h1>
             <h2 style={{ color: '#111', fontSize: '56px', fontFamily: "'Anek Malayalam', sans-serif", fontWeight: 800, lineHeight: 1, margin: '5px 0 0 0', letterSpacing: '-1px' }}>
               പ്രവർത്തന ഫണ്ട്
             </h2>
          </div>

          {/* Receipt Meta & Badge Row */}
          <div style={{ marginTop: '40px', padding: '0 100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Receipt Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="flex items-center gap-4">
                 <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '28px', color: '#111', margin: 0, fontWeight: 500, width: '160px' }}>Receipt No</p>
                 <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '28px', color: '#111', fontWeight: 700, display: 'inline-block' }}>: {receiptData?.receiptNo || 'RC-00000'}</span>
              </div>
              <div className="flex items-center gap-4">
                 <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '28px', color: '#111', margin: 0, fontWeight: 500, width: '160px' }}>Date</p>
                 <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '28px', color: '#111', fontWeight: 700, display: 'inline-block' }}>: {formattedDate}</span>
              </div>
            </div>

            {/* Payment Badge */}
            <div style={{ 
              border: '3px solid #18A66A', borderRadius: '45px', 
              padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '12px',
              backgroundColor: 'white'
            }}>
              <CheckCircle2 size={32} color="#18A66A" />
              <div style={{ color: '#18A66A', fontSize: '22px', fontWeight: 800, lineHeight: 1.1, textAlign: 'left' }}>
                 PAYMENT<br/>RECEIVED
              </div>
            </div>
          </div>

          {/* Main Body (Donor Info) */}
          <div className="w-full text-center flex flex-col items-center" style={{ marginTop: '30px' }}>
             
             <div style={{ fontFamily: "'Satisfy', cursive", fontSize: '72px', color: '#111', lineHeight: 1, marginBottom: '15px' }}>
               Thank you
             </div>

             <h3 style={{ fontSize: '76px', fontWeight: 800, color: '#111', margin: 0, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '8px', display: 'inline-block' }}>
               {receiptData?.name || 'Dummy Name'}
             </h3>
             
             <p style={{ fontSize: '38px', color: '#333', margin: 0, fontWeight: 500, lineHeight: 1, marginBottom: '20px', display: 'inline-block' }}>
               {receiptData?.place || 'Kerala'}
             </p>

             <div style={{ fontSize: '42px', color: '#111', fontWeight: 500, lineHeight: 1, marginBottom: '20px', letterSpacing: '-0.5px' }}>
               for your kind contribution of
             </div>

             {/* Amount Box */}
             <div style={{ 
               padding: '18px 80px', 
               backgroundColor: '#18A66A', borderRadius: '60px',
               display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
               color: 'white', fontSize: '78px', fontWeight: 800,
               marginBottom: '20px',
               letterSpacing: '-1px'
             }}>
               ₹ {receiptData?.amount || '0'}
             </div>

             <div style={{ fontSize: '32px', color: '#333', fontFamily: "'Satisfy', cursive", lineHeight: 1.3 }}>
               towards Token of Halawa <span style={{ fontFamily: "'Anek Malayalam', sans-serif" }}>പ്രവർത്തന ഫണ്ട്</span> 2026-27<br/>
               Your Support Makes a Real Difference.
             </div>

          </div>

          {/* Widgets Row (Months, Seal, Plan) */}
          <div style={{
             display: 'flex', justifyContent: 'space-between', alignItems: 'center',
             padding: '0 80px', marginTop: '25px'
          }}>
             {/* Months Grid */}
             <div style={{ width: '280px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                   {['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map(m => {
                      const selectedMonthShort = receiptData?.month ? receiptData.month.substring(0, 3) : '';
                      const isSelected = selectedMonthShort === m;
                      return (
                         <div key={m} style={{ 
                           backgroundColor: isSelected ? '#18A66A' : '#eef2f6',
                           color: isSelected ? 'white' : '#64748b',
                           borderRadius: '12px', padding: '6px 0',
                           textAlign: 'center', fontSize: '18px', fontWeight: isSelected ? 700 : 500
                         }}>
                           {m}
                         </div>
                      );
                   })}
                </div>
             </div>

             {/* Seal/Logo */}
             <div style={{ 
                width: '140px', height: '140px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'white',
             }}>
                <Image src="/ribat-logo.png" alt="Seal" width={110} height={110} style={{ objectFit: 'contain' }} />
             </div>

             {/* Plan Button */}
             <div style={{ 
                backgroundColor: '#18A66A', color: 'white', 
                borderRadius: '30px', padding: '12px 28px', 
                fontSize: '26px', fontWeight: 600, width: '280px', textAlign: 'center'
             }}>
                Plan: {receiptData?.plan || '100'}/month
             </div>
          </div>

          {/* Footer */}
          <div style={{ 
            height: '140px', backgroundColor: '#18A66A', 
            position: 'absolute', bottom: 0, width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px'
          }}>
             <div style={{ color: 'white', textAlign: 'left' }}>
               <h4 style={{ fontSize: '38px', fontWeight: 700, margin: 0, lineHeight: 1.1, marginBottom: '2px' }}>RIBAT Students Union</h4>
               <p style={{ fontSize: '20px', fontWeight: 400, margin: 0, opacity: 0.9 }}>Green Valley, Pantheerankavu, Kozhikode - 19</p>
             </div>
             
             {/* Fake Social Icons (Since we don't have images for them, just using text or basic shapes) */}
             <div style={{ color: 'white', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                   {/* Simplified social icons placeholder */}
                   <div style={{ width: '30px', height: '30px', backgroundColor: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18A66A', fontWeight: 'bold', fontSize: '18px' }}>f</div>
                   <div style={{ width: '30px', height: '30px', backgroundColor: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18A66A', fontWeight: 'bold', fontSize: '18px' }}>in</div>
                   <div style={{ width: '30px', height: '30px', backgroundColor: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18A66A', fontWeight: 'bold', fontSize: '18px' }}>X</div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 500 }}>@ribatstudents</div>
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

      {receiptContent}
    </div>
  );
}

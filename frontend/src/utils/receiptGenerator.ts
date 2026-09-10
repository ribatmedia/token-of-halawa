import * as htmlToImage from 'html-to-image';

export const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
export const MONTH_ROWS = [MONTHS.slice(0, 5), MONTHS.slice(5)];

export interface ReceiptData {
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

export const POS: Record<string, { x: number; y: number; s: number; centered?: boolean }> = {
  receiptNo: { x: 320, y: 442, s: 26 },
  date: { x: 320, y: 480, s: 26 },
  name: { x: 540, y: 610, s: 52, centered: true },
  placePhone: { x: 540, y: 655, s: 28, centered: true },
  amount: { x: 540, y: 821, s: 66, centered: true },
  months: { x: 270, y: 1055, s: 12, centered: true },
  plan: { x: 810, y: 1055, s: 22, centered: true },
};

export const normalizeToShortMonth = (str: string): string => {
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

export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

function drawRoundRectFallback(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * High-precision HTML5 Canvas Receipt Renderer
 * Draws template and text directly into 1080x1350 canvas for 100% reliable binary PNG output.
 */
export async function renderReceiptToCanvas(
  data: ReceiptData,
  customLayout?: any
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get 2d context for canvas');

  // Fill crisp white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1080, 1350);

  // Load and draw SVG template
  let templateDrawn = false;
  try {
    const svgRes = await fetch('/receipt-template.svg');
    if (svgRes.ok) {
      const svgText = await svgRes.text();
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });
      ctx.drawImage(img, 0, 0, 1080, 1350);
      URL.revokeObjectURL(url);
      templateDrawn = true;
    }
  } catch (e) {
    console.warn('Could not draw SVG via blob, attempting direct Image load', e);
  }

  if (!templateDrawn) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = '/receipt-template.svg';
      });
      ctx.drawImage(img, 0, 0, 1080, 1350);
      templateDrawn = true;
    } catch (e2) {
      console.error('Failed to draw template image', e2);
    }
  }

  // Ensure fonts are loaded if available
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 400))]);
    } catch {}
  }

  let lay = customLayout as Record<string, { dx: number; dy: number; size: number }> | undefined;
  if (!lay && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('receipt_layout_settings');
      if (saved) lay = JSON.parse(saved);
    } catch {}
  }
  const getLayout = (key: string) => {
    const el = lay?.[key];
    const dx = el?.dx ?? 0;
    const dy = el?.dy ?? 0;
    const s = el?.size ?? POS[key]?.s ?? 26;
    return {
      x: (POS[key]?.x ?? 540) + dx,
      y: (POS[key]?.y ?? 500) + dy,
      size: s,
      centered: POS[key]?.centered
    };
  };

  const receiptDateObj = data.date ? new Date(data.date) : new Date();
  const formattedDate = (isNaN(receiptDateObj.getTime()) ? new Date() : receiptDateObj).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const isPending = data.status === 'PENDING' || data.status === 'NOT_GIVEN' || data.isPending === true || data.paymentStatus === 'NOT_GIVEN';

  // 1. AMOUNT PENDING Badge (if pending)
  if (isPending) {
    ctx.save();
    ctx.fillStyle = '#dc2626';
    ctx.shadowColor = 'rgba(220, 38, 38, 0.45)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    const bx = 698;
    const by = 413;
    const bw = 266;
    const bh = 88;
    const br = 44;
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(bx, by, bw, bh, br);
    } else {
      drawRoundRectFallback(ctx, bx, by, bw, bh, br);
    }
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AMOUNT PENDING', bx + bw / 2, by + bh / 2);
    ctx.restore();
  }

  // 2. Receipt No
  const rPos = getLayout('receiptNo');
  ctx.save();
  ctx.fillStyle = '#111111';
  ctx.font = `400 ${rPos.size}px "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.receiptNo || 'N/A', rPos.x, rPos.y);
  ctx.restore();

  // 3. Date
  const dPos = getLayout('date');
  ctx.save();
  ctx.fillStyle = '#111111';
  ctx.font = `400 ${dPos.size}px "Nohemi", "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(formattedDate, dPos.x, dPos.y);
  ctx.restore();

  // 4. Name
  const nPos = getLayout('name');
  ctx.save();
  ctx.fillStyle = '#111111';
  ctx.font = `800 ${nPos.size}px "Nohemi", "Anek Malayalam", "Inter", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const nameText = data.name || '';
  const maxNameWidth = 940;
  const nameMetrics = ctx.measureText(nameText);
  if (nameMetrics.width > maxNameWidth && nameMetrics.width > 0) {
    const scale = maxNameWidth / nameMetrics.width;
    ctx.font = `800 ${Math.max(26, Math.floor(nPos.size * scale))}px "Nohemi", "Anek Malayalam", "Inter", sans-serif`;
  }
  ctx.fillText(nameText, nPos.x, nPos.y);
  ctx.restore();

  // 5. Place / Location
  const pPos = getLayout('placePhone');
  const placeText = data.place && data.place !== 'GENERAL' && data.place !== 'General' ? data.place : 'Kerala';
  ctx.save();
  ctx.fillStyle = '#333333';
  ctx.font = `500 ${pPos.size}px "Inter", "Anek Malayalam", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(placeText, pPos.x, pPos.y);
  ctx.restore();

  // 6. Plan Pill (rendered if a specific plan exists)
  const rawPlan = data.plan || '';
  const cleanPlan = rawPlan
    .replace(/\u00E2\u201A\u00B9/g, '\u20B9')
    .replace(/â‚¹/g, '\u20B9')
    .trim();
  const hasPlan = Boolean(cleanPlan && cleanPlan !== 'N/A' && cleanPlan.toLowerCase() !== 'general');

  if (hasPlan) {
    const plPos = getLayout('plan');
    const planText = cleanPlan.toLowerCase().startsWith('plan:') ? cleanPlan : `Plan: ${cleanPlan}`;
    ctx.save();
    ctx.font = `800 ${plPos.size}px "Inter", sans-serif`;
    const pMetrics = ctx.measureText(planText);
    const pPillWidth = pMetrics.width + 44;
    const pPillHeight = plPos.size + 14;
    const pX = plPos.x - pPillWidth / 2;
    const pY = plPos.y - pPillHeight / 2;

    ctx.fillStyle = '#f1f5f9';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(pX, pY, pPillWidth, pPillHeight, pPillHeight / 2);
    } else {
      drawRoundRectFallback(ctx, pX, pY, pPillWidth, pPillHeight, pPillHeight / 2);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(planText, plPos.x, plPos.y);
    ctx.restore();
  }

  // 7. Amount (centered in green template pill at y: 821)
  const aPos = getLayout('amount');
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${aPos.size}px "Nohemi", "Inter", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cleanAmount = String(data.amount || '0')
    .replace(/\u00E2\u201A\u00B9/g, '')
    .replace(/â‚¹/g, '')
    .replace(/\u20B9/g, '')
    .replace(/₹/g, '')
    .trim();
  const rupeeSymbol = '\u20B9';
  ctx.fillText(`${rupeeSymbol} ${cleanAmount}`, aPos.x, aPos.y);
  ctx.restore();

  // 8. Months Grid (rendered if months are specified)
  const currentMonthsList = (data.month || '')
    .replace('Custom:', '')
    .split(',')
    .map(s => normalizeToShortMonth(s))
    .filter(Boolean);

  const paidMonthsList = (data.paidMonths || [])
    .flatMap(m => typeof m === 'string' ? m.replace('Custom:', '').split(',') : [])
    .map(s => normalizeToShortMonth(s))
    .filter(Boolean);

  const hasMonths = currentMonthsList.length > 0 || paidMonthsList.length > 0;

  if (hasMonths) {
    const mPos = getLayout('months');
    const mSize = mPos.size;
    const pillW = 58;
    const pillH = 22;
    const pillGap = 6;
    const rowGap = 5;
    const rowW = 5 * pillW + 4 * pillGap;
    const totalH = pillH * 2 + rowGap;
    const cardPadX = 10;
    const cardPadY = 6;
    const cardW = rowW + cardPadX * 2;
    const cardH = totalH + cardPadY * 2;
    const cardX = mPos.x - cardW / 2;
    const cardY = mPos.y - cardH / 2;

    // Subtle background card behind months to ensure no clash with template text
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 1;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(cardX, cardY, cardW, cardH, 8);
    } else {
      drawRoundRectFallback(ctx, cardX, cardY, cardW, cardH, 8);
    }
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    MONTH_ROWS.forEach((row, ri) => {
      let startX = mPos.x - rowW / 2;
      const rowY = (mPos.y - totalH / 2) + ri * (pillH + rowGap);
      row.forEach((m) => {
        const isCurrent = currentMonthsList.includes(m);
        const isPaid = paidMonthsList.includes(m);

        let bg = '#f8fafc';
        let tc = '#64748b';
        let bc = '#e2e8f0';
        let fw = 500;

        if (isCurrent) {
          bg = '#15803D';
          tc = '#ffffff';
          bc = '#14532D';
          fw = 800;
        } else if (isPaid) {
          bg = '#86EFAC';
          tc = '#14532D';
          bc = '#4ADE80';
          fw = 700;
        }

        ctx.save();
        ctx.fillStyle = bg;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(startX, rowY, pillW, pillH, 5);
        } else {
          drawRoundRectFallback(ctx, startX, rowY, pillW, pillH, 5);
        }
        ctx.fill();

        ctx.strokeStyle = bc;
        ctx.lineWidth = isCurrent ? 1.5 : 1;
        ctx.stroke();

        ctx.fillStyle = tc;
        ctx.font = `${fw} ${mSize}px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(m, startX + pillW / 2, rowY + pillH / 2);
        ctx.restore();

        startX += pillW + pillGap;
      });
    });
  }

  // Export to Blob
  return new Promise<Blob>((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob && blob.size > 1000) {
          resolve(blob);
        } else {
          // Fallback to dataURL conversion
          try {
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            if (dataUrl && dataUrl.length > 500) {
              const b = dataUrlToBlob(dataUrl);
              if (b.size > 1000) {
                resolve(b);
                return;
              }
            }
          } catch {}
          reject(new Error('Canvas generated empty or corrupted image'));
        }
      }, 'image/png', 1.0);
    } catch (canvasErr) {
      try {
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        if (dataUrl && dataUrl.length > 500) {
          const b = dataUrlToBlob(dataUrl);
          if (b.size > 1000) {
            resolve(b);
            return;
          }
        }
      } catch {}
      reject(canvasErr);
    }
  });
}

/**
 * DOM export fallback using html-to-image on an offscreen 1080x1350 element
 */
export async function renderReceiptFromDOM(el: HTMLElement): Promise<Blob> {
  try {
    const blob = await htmlToImage.toBlob(el, {
      quality: 1.0,
      pixelRatio: 1,
      width: 1080,
      height: 1350,
      skipAutoScale: true,
      cacheBust: true,
    });
    if (blob && blob.size > 1000) {
      return blob;
    }
  } catch (e) {
    console.warn('htmlToImage.toBlob failed, trying toPng fallback', e);
  }

  const dataUrl = await htmlToImage.toPng(el, {
    quality: 1.0,
    pixelRatio: 1,
    width: 1080,
    height: 1350,
    skipAutoScale: true,
    cacheBust: true,
  });

  if (!dataUrl || dataUrl.length < 500 || dataUrl === 'data:,') {
    throw new Error('htmlToImage generated empty image');
  }

  const convertedBlob = dataUrlToBlob(dataUrl);
  if (convertedBlob.size < 1000) {
    throw new Error('Generated image is too small or corrupted');
  }
  return convertedBlob;
}

/**
 * Master generator function with dual-engine fallback:
 * 1. Tries pixel-perfect HTML5 Canvas engine
 * 2. Falls back to DOM export if canvas fails
 */
export async function generateReceiptBlob(
  data: ReceiptData,
  customLayout?: any,
  exportEl?: HTMLElement | null
): Promise<Blob> {
  // Strategy 1: HTML5 Canvas (100% reliable binary PNG)
  try {
    const blob = await renderReceiptToCanvas(data, customLayout);
    if (blob && blob.size > 1000) {
      return blob;
    }
  } catch (err) {
    console.warn('Canvas receipt generation failed, attempting DOM export fallback:', err);
  }

  // Strategy 2: Offscreen 1080x1350 DOM container
  if (exportEl) {
    try {
      const domBlob = await renderReceiptFromDOM(exportEl);
      if (domBlob && domBlob.size > 1000) {
        return domBlob;
      }
    } catch (domErr) {
      console.error('DOM export failed as well:', domErr);
    }
  }

  throw new Error('Receipt generation failed on all available renderers');
}

/**
 * Downloads a blob as a file via temporary object URL
 */
export function downloadReceiptBlob(blob: Blob, filename: string): void {
  if (!blob || blob.size === 0) {
    console.error('Refusing to download empty blob');
    alert('Failed to generate receipt image. Please try again.');
    return;
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 2000);
}

/**
 * Shares receipt via Web Share API or falls back to downloading the file and opening WhatsApp
 */
export async function shareReceiptWhatsApp(blob: Blob, data: ReceiptData): Promise<void> {
  const filename = `Receipt_${data.receiptNo}.png`;
  const file = new File([blob], filename, { type: 'image/png' });
  const text = `Receipt: ${data.receiptNo}\nAmount: ₹${data.amount}\nThank you ${data.name}`;

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'Donation Receipt',
        text: text,
      });
      return;
    } catch (e: any) {
      if (e.name === 'AbortError') return; // User cancelled share dialog
      console.warn('Navigator share error, falling back:', e);
    }
  }

  // Fallback: download the receipt image to user's device and open WhatsApp with message
  downloadReceiptBlob(blob, filename);
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

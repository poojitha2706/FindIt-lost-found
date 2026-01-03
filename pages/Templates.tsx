import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/mockDatabase';
import { Item, QRTemplate } from '../types';
import { QR_TEMPLATES } from '../constants';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';

const Templates: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const stickerRef = useRef<HTMLDivElement>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<QRTemplate>(QR_TEMPLATES[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (itemId) {
        const found = await db.items.getById(itemId);
        if (found) setItem(found);
        else navigate('/dashboard');
        setIsLoading(false);
      }
    };
    fetchData();
  }, [itemId, navigate]);

  const handleDownload = async () => {
    if (stickerRef.current === null || !item) return;

    setIsDownloading(true);
    try {
      // Delay to ensure rendering is complete
      await new Promise(r => setTimeout(r, 600));
      
      const dataUrl = await toPng(stickerRef.current, { 
        quality: 1,
        pixelRatio: 3, 
        backgroundColor: '#ffffff',
        skipFonts: true
      });
      
      const link = document.createElement('a');
      link.download = `FindIt_${item.name.replace(/\s+/g, '_')}_QR.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
      alert('Sticker generation failed. You can still take a screenshot of the QR code below.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <i className="fas fa-spinner fa-spin text-4xl text-brand-blue"></i>
    </div>
  );
  
  if (!item) return null;

  /**
   * ULTIMATE ROBUST URL GENERATION
   * We get the current URL, remove everything after the first '#' (the hash),
   * and replace it with the new finder route.
   */
  const getFinderUrl = () => {
    const fullUrl = window.location.href;
    const baseUrl = fullUrl.split('#')[0];
    // Ensure baseUrl doesn't have trailing garbage but has proper structure
    return `${baseUrl}#/found/${item.id}`;
  };

  const finderUrl = getFinderUrl();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <header className="px-4 md:px-0">
        <button onClick={() => navigate(-1)} className="text-brand-blue mb-4 flex items-center font-bold">
          <i className="fas fa-arrow-left mr-2"></i> Back
        </button>
        <h1 className="text-3xl font-black text-brand-dark tracking-tight">QR Sticker Pack</h1>
        <p className="text-gray-500">Scan-to-Return technology for your {item.name}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-0">
        {/* Preview Area */}
        <div className="flex flex-col items-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 mb-8 overflow-hidden">
            <div 
              ref={stickerRef}
              className={`relative w-64 h-64 rounded-3xl p-6 flex flex-col items-center justify-between transition-colors duration-300 ${selectedTemplate.bgColor} ${selectedTemplate.textColor}`}
            >
              <div className="text-center">
                <div className="text-[10px] uppercase font-black tracking-widest opacity-70">If Found Scan Me</div>
                <div className="text-lg font-black leading-tight italic">RETURN TO OWNER</div>
              </div>
              
              <div className="bg-white p-2 rounded-xl shadow-lg">
                 <QRCodeSVG 
                    value={finderUrl} 
                    size={130}
                    level="H"
                    includeMargin={false}
                    fgColor={selectedTemplate.textColor.includes('white') ? '#000000' : selectedTemplate.accentColor}
                 />
              </div>

              <div className="text-center w-full">
                <div className="text-[9px] font-bold opacity-50 uppercase tracking-tighter">Powered by FindIt</div>
                <div className="text-sm font-black truncate px-2">{item.name.toUpperCase()}</div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full max-w-sm bg-brand-blue text-white py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-brand-dark transition active:scale-95 disabled:opacity-50"
          >
            {isDownloading ? (
              <><i className="fas fa-spinner fa-spin mr-3"></i>Generating...</>
            ) : (
              <><i className="fas fa-download mr-3"></i>Save Sticker PNG</>
            )}
          </button>
          
          <div className="mt-6 bg-white/50 p-4 rounded-xl border border-dashed border-gray-200 w-full max-w-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Landing URL (QR Encoded):</p>
            <code className="text-[10px] text-brand-blue break-all block leading-tight">{finderUrl}</code>
          </div>
        </div>

        {/* Templates */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Select Style</h3>
          <div className="grid grid-cols-2 gap-4">
            {QR_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center group ${selectedTemplate.id === template.id ? 'border-brand-blue bg-white shadow-lg' : 'border-transparent bg-white/50'}`}
              >
                <div className={`w-full h-12 rounded-xl mb-2 ${template.bgColor} border border-black/5`}></div>
                <span className="text-xs font-black text-gray-700">{template.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-brand-yellow/10 p-6 rounded-3xl border border-brand-yellow/20">
            <h4 className="font-black text-brand-blue text-sm uppercase flex items-center">
              <i className="fas fa-lightbulb mr-2"></i>
              Printing Guide
            </h4>
            <ul className="text-xs text-brand-dark/70 space-y-2 mt-3 list-disc pl-4">
              <li>Use <b>waterproof vinyl paper</b> for chargers and water bottles.</li>
              <li>Stick it on a flat, clean surface for better scanning.</li>
              <li>A 2" x 2" size works best for most items.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
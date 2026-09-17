import React, { useState } from 'react';
import { X, Check, Copy } from 'lucide-react';

interface NielitGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string) => void;
}

interface MediaItem {
  id: string;
  title: string;
  url: string;
  alt: string;
}

const GALLERY_IMAGES: MediaItem[] = [
  {
    id: 'img-1',
    title: 'Warm Winter Jacket & Cap',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    alt: 'Person wearing warm knit hat and jacket'
  },
  {
    id: 'img-2',
    title: 'Microscopic Virus Graphic',
    url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=600&q=80',
    alt: 'Red microscopic virus cell structure'
  },
  {
    id: 'img-3',
    title: 'Molecular Structure Hands',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    alt: 'Hands holding colorful chemistry molecular models'
  },
  {
    id: 'img-4',
    title: 'Chemistry Test Tubes',
    url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
    alt: 'Scientist holding laboratory test tubes with green liquid'
  },
  {
    id: 'img-5',
    title: 'Laboratory Microscope',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    alt: 'High power laboratory optical microscope'
  },
  {
    id: 'img-6',
    title: 'Blue Chemical Solutions',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    alt: 'Laboratory test tubes filled with bright blue solutions'
  }
];

export const NielitGalleryModal: React.FC<NielitGalleryModalProps> = ({ isOpen, onClose, onSelectImage }) => {
  const [activeTab, setActiveTab] = useState<'Images' | 'Video' | 'Audio'>('Images');
  const [copiedId, setCopiedId] = useState<{ id: string; type: 'url' | 'img' } | null>(null);

  if (!isOpen) return null;

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId({ id: item.id, type: 'url' });
    setTimeout(() => setCopiedId(null), 2000);
    if (onSelectImage) onSelectImage(item.url);
  };

  const handleCopyImage = (item: MediaItem) => {
    const htmlTag = `<img src="${item.url}" alt="${item.alt}" style="max-width: 100%; height: auto; border-radius: 4px;" />`;
    navigator.clipboard.writeText(htmlTag);
    setCopiedId({ id: item.id, type: 'img' });
    setTimeout(() => setCopiedId(null), 2000);
    if (onSelectImage) onSelectImage(item.url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between select-none">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">
            Gallery (Insert Media)
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Tabs */}
        <div className="px-5 pt-3 pb-2 flex items-center gap-2 border-b border-slate-100 bg-slate-50/50">
          {(['Images', 'Video', 'Audio'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#2B56C6] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'Images' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {GALLERY_IMAGES.map((img) => {
                const isCopiedUrl = copiedId?.id === img.id && copiedId.type === 'url';
                const isCopiedImg = copiedId?.id === img.id && copiedId.type === 'img';

                return (
                  <div
                    key={img.id}
                    className="border border-slate-200 rounded overflow-hidden bg-white flex flex-col group shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    {/* Top Copy URL Button */}
                    <button
                      onClick={() => handleCopyUrl(img)}
                      className={`w-full py-1 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        isCopiedUrl
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#2B56C6] text-white hover:bg-[#1E3A8A]'
                      }`}
                    >
                      {isCopiedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopiedUrl ? 'Copied!' : 'Copy URL'}</span>
                    </button>

                    {/* Image Preview */}
                    <div className="h-28 w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Bottom Copy Image Button */}
                    <button
                      onClick={() => handleCopyImage(img)}
                      className={`w-full py-1 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        isCopiedImg
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#2B56C6] text-white hover:bg-[#1E3A8A]'
                      }`}
                    >
                      {isCopiedImg ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopiedImg ? 'Copied!' : 'Copy Image'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              No {activeTab.toLowerCase()} files required for this practical exam paper. Use the Images gallery for practical tasks.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Click "Copy URL" or "Copy Image" and paste into your code/document.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

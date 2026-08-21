import React from 'react';
import { X, Download, ExternalLink, FileText, Share2, Printer } from 'lucide-react';
import { DynamicResource } from '../types/database';
import { resourceService } from '../services/resourceService';

interface PdfViewerModalProps {
  resource: DynamicResource | null;
  onClose: () => void;
}

export function PdfViewerModal({ resource, onClose }: PdfViewerModalProps) {
  if (!resource) return null;

  const directUrl = resource.directPdfUrl || resource.downloadUrl;
  const isWebUrl = directUrl && (directUrl.startsWith('http://') || directUrl.startsWith('https://'));

  const handleDownload = () => {
    resourceService.recordDownload(resource.id);
    if (isWebUrl) {
      window.open(directUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: `Download free NIELIT study material: ${resource.title}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-800/90 border-b border-slate-700 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                  {resource.categoryLabel || resource.category}
                </span>
                {resource.moduleCode && (
                  <span className="text-[10px] font-bold bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                    {resource.moduleCode}
                  </span>
                )}
                <span className="text-xs text-slate-400 hidden sm:inline">• {resource.fileSize}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-lg mt-0.5">
                {resource.title}
              </h3>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              title="Share"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {isWebUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => resourceService.recordDownload(resource.id)}
                className="hidden sm:inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-slate-600"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </a>
            )}

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content / PDF Frame */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center">
          {isWebUrl ? (
            <iframe
              src={directUrl}
              title={resource.title}
              className="w-full h-full border-0 bg-white"
              allow="autoplay"
            />
          ) : (
            <div className="text-center p-8 max-w-md space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-blue-400 flex items-center justify-center mx-auto border border-slate-700 shadow-inner">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">{resource.title}</h4>
                {resource.hindiTitle && (
                  <p className="text-sm text-slate-400 mb-3">{resource.hindiTitle}</p>
                )}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resource ({resource.fileSize})</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Uploaded and verified by Skilldotpy. Direct download without third-party redirection.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="px-4 py-2 bg-slate-850 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Tags:</span>
            <div className="flex flex-wrap gap-1">
              {resource.tags?.map((t, idx) => (
                <span key={idx} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                  #{t}
                </span>
              ))}
            </div>
          </div>
          <span className="text-slate-500">
            {typeof resource.downloadCount === 'number' ? `${resource.downloadCount} downloads` : resource.downloadCount}
          </span>
        </div>

      </div>
    </div>
  );
}

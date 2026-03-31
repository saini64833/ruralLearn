import { useState, useCallback } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfSection = ({ pdfs = [] }) => {
  const [previewPdf, setPreviewPdf] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const openPdf = useCallback((pdf, index) => {
    setPreviewPdf(pdf);
    setPreviewIndex(index);
    setLoadError(false);
    setIsFullscreen(false);
  }, []);

  const closePdf = useCallback(() => {
    setPreviewPdf(null);
    setPreviewIndex(null);
    setLoadError(false);
    setIsFullscreen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const goNext = useCallback(() => {
    if (previewIndex < pdfs.length - 1) {
      setPreviewPdf(pdfs[previewIndex + 1]);
      setPreviewIndex(previewIndex + 1);
      setLoadError(false);
    }
  }, [previewIndex, pdfs]);

  const goPrev = useCallback(() => {
    if (previewIndex > 0) {
      setPreviewPdf(pdfs[previewIndex - 1]);
      setPreviewIndex(previewIndex - 1);
      setLoadError(false);
    }
  }, [previewIndex, pdfs]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") isFullscreen ? setIsFullscreen(false) : closePdf();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    },
    [closePdf, goNext, goPrev, toggleFullscreen, isFullscreen]
  );

  if (!pdfs.length) {
    return (
      <div className="mb-6">
        <SectionHeader count={0} />
        <div className="flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
          <FileIcon className="w-10 h-10 mb-2 opacity-30" />
          <p className="text-sm font-medium">No PDFs attached</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <SectionHeader count={pdfs.length} />

      {/* PDF Grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pdfs.map((pdf, i) => (
          <li key={i}>
            <button
              onClick={() => openPdf(pdf, i)}
              className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:border-red-200 hover:bg-red-50 hover:shadow-md transition-all duration-200 text-left"
            >
              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                <FileIcon className="w-5 h-5 text-red-500" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  Document {i + 1}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Click to preview</p>
              </div>

              {/* Arrow */}
              <ChevronIcon className="w-4 h-4 text-gray-300 group-hover:text-red-400 shrink-0 transition-colors" />
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {previewPdf && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePdf}
          />

          {/* Modal Panel */}
          <div className={`relative z-10 bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isFullscreen ? "w-screen h-screen rounded-none" : "w-full max-w-4xl h-[90vh] rounded-2xl"}`}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50 shrink-0">
              <div className="flex items-center gap-2">
                <FileIcon className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-gray-700 text-sm">
                  Document {previewIndex + 1}
                  <span className="text-gray-400 font-normal"> of {pdfs.length}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Download */}
                <a
                  href={previewPdf}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  title="Download PDF"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download
                </a>

                {/* Nav buttons */}
                {pdfs.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={goPrev}
                      disabled={previewIndex === 0}
                      className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Previous (←)"
                    >
                      <ArrowLeftIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={goNext}
                      disabled={previewIndex === pdfs.length - 1}
                      className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Next (→)"
                    >
                      <ArrowRightIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                )}

                {/* Fullscreen toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
                  title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
                >
                  {isFullscreen ? (
                    <ExitFullscreenIcon className="w-4 h-4" />
                  ) : (
                    <FullscreenIcon className="w-4 h-4" />
                  )}
                </button>

                {/* Close */}
                <button
                  onClick={closePdf}
                  className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                  title="Close (Esc)"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewer */}
            <div className="flex-1 overflow-hidden">
              {loadError ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                  <FileIcon className="w-14 h-14 opacity-20" />
                  <p className="text-sm font-medium">Failed to load PDF</p>
                  <a
                    href={previewPdf}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-red-500 underline"
                  >
                    Open in new tab instead
                  </a>
                </div>
              ) : (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={previewPdf}
                    plugins={[defaultLayoutPluginInstance]}
                    onDocumentLoadFailure={() => setLoadError(true)}
                  />
                </Worker>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Sub-components ── */

const SectionHeader = ({ count }) => (
  <h2 className="font-semibold mb-3 flex items-center gap-2 text-base text-gray-800">
    <FileIcon className="w-5 h-5 text-red-500" />
    PDFs
    {count > 0 && (
      <span className="ml-1 text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </h2>
);

/* ── Inline SVG Icons (no extra deps) ── */

const FileIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline strokeLinecap="round" strokeLinejoin="round" points="14 2 14 8 20 8" />
    <line strokeLinecap="round" x1="16" y1="13" x2="8" y2="13" />
    <line strokeLinecap="round" x1="16" y1="17" x2="8" y2="17" />
    <polyline strokeLinecap="round" points="10 9 9 9 8 9" />
  </svg>
);

const ChevronIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline strokeLinecap="round" strokeLinejoin="round" points="7 10 12 15 17 10" />
    <line strokeLinecap="round" x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const FullscreenIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const ExitFullscreenIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="10" y1="14" x2="3" y2="21" />
    <line x1="21" y1="3" x2="14" y2="10" />
  </svg>
);

export default PdfSection;
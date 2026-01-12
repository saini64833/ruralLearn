import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfSection = ({ pdfs }) => {
  const [previewPdf, setPreviewPdf] = useState(null);

  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-3 flex items-center gap-2 text-lg">
        <FaFilePdf className="text-red-500" />
        PDFs
      </h2>

      <ul className="space-y-2">
        {pdfs?.map((pdf, i) => (
          <li key={i}>
            <button
              onClick={() => setPreviewPdf(pdf)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-red-50 transition w-full text-left"
            >
              <FaFilePdf className="text-red-500" />
              <span className="font-medium text-gray-700">PDF {i + 1}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* PDF Modal */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPreviewPdf(null)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-3xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <button
              onClick={() => setPreviewPdf(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl z-10"
            >
              ✕
            </button>

            {/* PDF Viewer */}
            <div className="w-full h-full">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                <Viewer fileUrl={previewPdf} />
              </Worker>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfSection;

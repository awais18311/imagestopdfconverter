import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { supabase } from '../supabaseClient';
import Header from './Header';
import Footer from './Footer';

const LandingPage = () => {
  const [images, setImages] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [session, setSession] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages(previews);
    setPdfUrl(null);
  };

  const convertToPDF = async () => {
    setIsConverting(true);
    const doc = new jsPDF();

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await new Promise((resolve) => {
        const image = new Image();
        image.src = img.url;
        image.onload = () => {
          const width = doc.internal.pageSize.getWidth();
          const height = doc.internal.pageSize.getHeight();
          doc.addImage(image, 'JPEG', 0, 0, width, height);
          if (i < images.length - 1) doc.addPage();
          resolve();
        };
      });
    }

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setIsConverting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-grow p-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">🖼️ Images to PDF</h2>
          <p className="text-gray-600">Upload images and convert them into a single PDF document.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label
            htmlFor="upload"
            className="block w-full border-2 border-dashed border-blue-400 rounded-md p-8 text-center text-blue-500 hover:bg-blue-50 cursor-pointer transition"
          >
            <span className="text-lg font-semibold">Click or drag & drop to upload images</span>
            <input
              id="upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {images.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {images.map((img, i) => (
                <div key={i} className="border rounded shadow-sm overflow-hidden">
                  <img src={img.url} alt={`preview-${i}`} className="object-cover h-40 w-full" />
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={convertToPDF}
                disabled={isConverting}
                className={`${
                  isConverting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-semibold py-2 px-6 rounded transition duration-300`}
              >
                {isConverting ? '⏳ Converting...' : '📄 Convert to PDF'}
              </button>
            </div>
          </>
        )}

        {pdfUrl && !isConverting && (
          <div className="text-center mt-8">
            {session ? (
              <a
                href={pdfUrl}
                download="converted.pdf"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition"
              >
                ⬇️ Download PDF
              </a>
            ) : (
              <p className="text-red-600 font-semibold mt-2">
                🚫 Please <span className="underline">sign in</span> to download the PDF.
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;

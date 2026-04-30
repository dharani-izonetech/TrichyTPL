import { useEffect, useRef, useState } from "react";
import { deleteMediaImage, uploadMediaImages } from "../../services/api";
import useAdminPanelContext from "./useAdminPanelContext";

export default function AdminMediaPage() {
  const { mediaImages, withFeedback, loading } = useAdminPanelContext();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedFiles.length) {
      setPreviews([]);
      return;
    }

    const objectUrls = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setPreviews(objectUrls);

    return () => objectUrls.forEach((item) => URL.revokeObjectURL(item.url));
  }, [selectedFiles]);

  const removeSelectedFile = (index) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
    if (updated.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section className="space-y-6 md:space-y-10">
      <div className="panel border-slate-700/50 bg-panel/40 backdrop-blur-xl shadow-2xl p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">Media <span className="text-accent">Uploads</span></h2>
            <p className="mt-2 text-xs md:text-sm font-medium text-slate-400 max-w-xl">
              Manage your tournament gallery. All images uploaded here are instantly optimized for the high-end collage on the home and gallery pages.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
             <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 md:flex-none rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/10 hover:border-accent"
            >
              Choose
            </button>
            <button
              type="button"
              disabled={selectedFiles.length === 0}
              onClick={() =>
                withFeedback(async () => {
                  await uploadMediaImages(selectedFiles);
                  setSelectedFiles([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }, "Images uploaded successfully.")
              }
              className="flex-1 md:flex-none rounded-xl bg-accent px-8 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-accent/20 transition hover:bg-accent/80 disabled:opacity-30"
            >
              Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
          className="hidden"
        />

        {previews.length > 0 && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-4 w-1 rounded-full bg-amber-400"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Upload Queue</span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {previews.map((preview, index) => (
                <div key={index} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-xl md:rounded-2xl">
                  <img src={preview.url} alt="Queue" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeSelectedFile(index)}
                    className="absolute inset-0 flex items-center justify-center bg-red-600/60 opacity-0 transition duration-300 group-hover:opacity-100"
                  >
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {mediaImages.map((image) => (
            <article key={image.id} className="group relative overflow-hidden rounded-[1.5rem] border border-white/5 bg-slate-950/40 p-1.5 shadow-2xl transition duration-500 hover:border-accent/40 md:rounded-[2rem] md:p-2">
              <div 
                className="relative cursor-pointer overflow-hidden rounded-[1.25rem] bg-slate-900 aspect-[4/3] md:rounded-[1.5rem]" 
                onClick={() => setPreviewImage(image)}
              >
                <img 
                  src={image.full_url} 
                  alt={image.original_name} 
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-center justify-center">
                  <div className="rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md md:px-6 md:py-2 md:text-[10px]">
                    Preview
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-3 p-3 md:gap-4 md:p-4">
                <div className="flex flex-col min-w-0">
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-accent mb-0.5 md:mb-1">Asset</span>
                  <p className="truncate text-[10px] md:text-xs font-bold text-slate-300" title={image.original_name}>
                    {image.original_name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => withFeedback(() => deleteMediaImage(image.id), "Image deleted.")}
                  className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-400 transition hover:bg-red-500 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          
          {mediaImages.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 rounded-[2rem] border border-dashed border-white/5 bg-white/2 md:py-20 md:rounded-[2.5rem]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest md:text-sm">No Media Assets</p>
            </div>
          )}
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-h-full max-w-6xl w-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
            <button
              className="absolute -top-12 right-0 rounded-full bg-white/10 p-3 text-white/70 hover:bg-accent md:-top-16 md:-right-20 md:top-0"
              onClick={() => setPreviewImage(null)}
            >
              <svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={previewImage.full_url}
              alt={previewImage.original_name}
              className="max-h-[75vh] w-auto max-w-full rounded-[1.5rem] shadow-2xl ring-1 ring-white/10 object-contain md:max-h-[85vh] md:rounded-[2.5rem]"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-6 rounded-full bg-white/5 border border-white/10 px-6 py-2 md:mt-8 md:px-8 md:py-3">
              <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-300">{previewImage.original_name}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
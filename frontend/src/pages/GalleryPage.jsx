import { useEffect, useState } from "react";
import { listMediaImages } from "../services/api";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchOffset, setTouchOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      try {
        const rows = await listMediaImages();
        if (!isMounted) return;
        setImages(rows);
      } catch {
        // Keep existing images if refresh fails.
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadImages();
    const timer = setInterval(loadImages, 12000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    if (images.length === 0) {
      setActiveIndex(null);
      return;
    }
    if (activeIndex >= images.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, images]);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null) return null;
          return (current + 1) % images.length;
        });
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null) return null;
          return (current - 1 + images.length) % images.length;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, images.length]);

  const modalOpen = activeIndex !== null;

  const goToNext = () => {
    if (!images.length) return;
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current + 1) % images.length;
    });
  };

  const goToPrevious = () => {
    if (!images.length) return;
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current - 1 + images.length) % images.length;
    });
  };

  const handleTouchStart = (event) => {
    setIsDragging(true);
    setTouchStartX(event.touches[0].clientX);
    setTouchOffset(0);
  };

  const handleTouchMove = (event) => {
    if (!isDragging) return;
    const nextOffset = event.touches[0].clientX - touchStartX;
    setTouchOffset(nextOffset);
  };

  const handleTouchEnd = () => {
    const threshold = 60;
    if (touchOffset <= -threshold) {
      goToNext();
    } else if (touchOffset >= threshold) {
      goToPrevious();
    }
    setIsDragging(false);
    setTouchOffset(0);
  };

  return (
    <section className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1.5 rounded-full bg-accent"></div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">Moments <span className="text-accent">Gallery</span></h1>
        </div>
        <p className="text-slate-400 font-medium">A professional collection of tournament highlights, perfectly fitted for every orientation.</p>
      </div>

      {/* Professional Masonry Collage */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((image, index) => (
          <article
            key={image.id}
            className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl transition duration-500 hover:-translate-y-2 hover:border-accent/50 cursor-pointer break-inside-avoid"
            onClick={() => setActiveIndex(index)}
          >
            <img
              src={image.full_url}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-auto transition duration-700 group-hover:scale-[1.05]"
            />
            {/* Professional Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Tournament Moment</p>
              <h3 className="mt-1 text-xl font-black uppercase tracking-tight text-white">
                View Full Moment
              </h3>
            </div>
          </article>
        ))}
      </div>

      {!loading && images.length === 0 ? (
        <div className="rounded-[2.5rem] border border-white/5 bg-panelSoft/30 p-20 text-center backdrop-blur-sm">
          <p className="text-slate-400">No images found. Upload moments from the Admin Panel.</p>
        </div>
      ) : null}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-3 md:p-6 flex items-center justify-center">
          <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-5 w-1 rounded-full bg-accent"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-white">Detail View</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="rounded-full bg-white/5 border border-white/10 px-6 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-accent hover:border-accent"
              >
                Close
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/50 shadow-2xl">
              <div
                className={`flex h-full ${isDragging ? "" : "transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)"}`}
                style={{
                  transform: `translateX(calc(-${activeIndex * 100}% + ${touchOffset}px))`
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {images.map((image, index) => (
                  <div key={image.id} className="h-full min-w-full flex items-center justify-center p-4">
                    <img
                      src={image.full_url}
                      alt={`Gallery slide ${index + 1}`}
                      className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                    />
                  </div>
                ))}
              </div>

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-5 text-white transition hover:bg-accent hover:border-accent md:left-8"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-5 text-white transition hover:bg-accent hover:border-accent md:right-8"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

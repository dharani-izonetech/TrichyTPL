import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import pic1 from "../../pics/pic1.jpeg";
import pic3 from "../../pics/pic3.jpg";
import pic4 from "../../pics/pic4.jpg";

const defaultSlides = [
  {
    image: pic1,
    title: "Feel The Pulse",
    subtitle: "Every over matters in the Trichy Player League Championship."
  },
  {
    image: pic3,
    title: "Sunset Battles",
    subtitle: "Real-time scores and match momentum at your fingertips."
  },
  {
    image: pic4,
    title: "Infinite Energy",
    subtitle: "From the first toss to the final trophy missing nothing."
  }
];

const AUTO_SLIDE_MS = 7000;

export default function HeroCarousel({ uploadedImages = [], useUploadedHero = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = useMemo(() => {
    if (useUploadedHero && uploadedImages.length > 0) {
      return uploadedImages.map((image, index) => ({
        image: image.full_url,
        title: image.original_name || `Match Moment ${index + 1}`,
        subtitle: "Live tournament visual highlights."
      }));
    }
    return defaultSlides;
  }, [uploadedImages, useUploadedHero]);

  const total = slides.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [total, useUploadedHero]);

  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((current) => (current + 1) % total);
  };

  const previousSlide = () => {
    setDirection(-1);
    setActiveIndex((current) => (current - 1 + total) % total);
  };

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = setInterval(nextSlide, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [isPaused, total, activeIndex]);

  const slideVariants = {
    enter: (direction) => ({
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      opacity: 1,
    },
    exit: {
      zIndex: 0,
      opacity: 0,
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // expo out
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section
      className="relative h-[calc(100dvh-72px)] w-full overflow-hidden bg-slate-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={activeIndex}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
        >
          {/* Background Image Layer */}
          <motion.div
            initial={{ scale: 1.2, filter: "blur(4px)" }}
            animate={{ scale: 1.05, filter: "blur(0px)" }}
            transition={{ duration: 12, ease: "linear" }}
            className="absolute inset-0 h-full w-full"
          >
            <img src={slides[activeIndex].image} alt={slides[activeIndex].title} className="h-full w-full object-cover brightness-[0.6]" />
          </motion.div>

          {/* Atmospheric Layering */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />

          {/* Spatial Bloom */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-20 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]"
          />

          {/* Main Content */}
          <div className="absolute inset-0 flex items-center justify-start px-8 md:px-24">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              key={`content-${activeIndex}`}
              className="relative z-20"
            >
              <motion.div variants={letterVariants} className="flex items-center gap-3">
                <span className="h-px w-8 bg-accent" />
                <p className="text-xs font-black uppercase tracking-[0.5em] text-accent">
                  TPL CHAMPIONSHIP
                </p>
              </motion.div>

              <motion.h1
                variants={letterVariants}
                className="mt-6 flex flex-col font-black uppercase leading-none tracking-tighter text-white"
              >
                <span className="text-4xl md:text-7xl lg:text-8xl opacity-90">
                  Trichy
                </span>
                <span className="relative text-5xl md:text-8xl lg:text-[8rem] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30">
                  Player
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                    className="absolute -bottom-2 left-0 h-1 bg-accent/60 md:-bottom-4"
                  />
                </span>
                <span className="text-4xl md:text-7xl lg:text-8xl text-accent">
                  League
                </span>
              </motion.h1>

              <motion.p variants={letterVariants} className="mt-10 max-w-lg text-lg font-medium tracking-wide text-slate-300 md:text-xl">
                {slides[activeIndex].subtitle}
              </motion.p>

              <motion.div variants={letterVariants} className="mt-12">
                <Link
                  to="/live-match"
                  className="group relative flex items-center gap-4 overflow-hidden rounded-full border border-white/20 bg-white/5 px-10 py-5 text-sm font-black tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-white hover:text-black w-fit"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                    WATCH LIVE
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-0 w-full bg-white transition-all group-hover:h-full" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Vertical Navigation */}
      <div className="absolute left-8 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-8 md:flex">
        <p className="text-xs font-bold uppercase tracking-[0.4em] [writing-mode:vertical-lr] text-white/20">
          Scroll to explore
        </p>
        <div className="h-24 w-px bg-gradient-to-b from-white/20 to-transparent" />
      </div>

      {/* Discrete Corner Controls */}
      <div className="absolute bottom-12 right-12 z-40 hidden flex-row items-end gap-12 md:flex">
        <div className="flex flex-col items-end gap-2">
          <p className="text-5xl font-black italic tracking-tighter text-white/10">0{activeIndex + 1}</p>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === activeIndex ? 32 : 8,
                  backgroundColor: i === activeIndex ? "rgba(239, 68, 68, 1)" : "rgba(255, 255, 255, 0.2)"
                }}
                className="h-1 rounded-full cursor-pointer"
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={previousSlide}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-xl transition hover:border-white hover:bg-white hover:text-black"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-accent bg-accent text-white transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Only Indicators */}
      <div className="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 gap-2 md:hidden">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-8 bg-accent" : "w-2 bg-white/20"}`}
          />
        ))}
      </div>
    </section>
  );
}

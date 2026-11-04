import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { shouldPlayBackgroundVideo } from '../utils/media-playback.js';

const USER_LOGO_URL = "https://i.postimg.cc/xj33dFYd/Picsart-26-01-31-03-15-31-627.png";
const LOCAL_LOGO_FALLBACK = "/favicon.png";
const FOOTER_VIDEO_POSTER = "https://res.cloudinary.com/dhktkzpap/video/upload/f_auto,q_auto,w_960,so_0/171262654_1788182400783352_jlqkjm.jpg";
const FOOTER_VIDEO_WEBM = "https://res.cloudinary.com/dhktkzpap/video/upload/q_auto,w_960/171262654_1788182400783352_jlqkjm.webm";
const FOOTER_VIDEO_MP4 = "https://res.cloudinary.com/dhktkzpap/video/upload/q_auto,w_960/171262654_1788182400783352_jlqkjm.mp4";

export const BrandLogo: React.FC<{ className?: string; showGlow?: boolean; imgStyle?: React.CSSProperties; eager?: boolean }> = ({
  className = "w-20 h-20",
  showGlow = true,
  imgStyle,
  eager = false
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [logoSrc, setLogoSrc] = useState<string>(USER_LOGO_URL || LOCAL_LOGO_FALLBACK);
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <motion.div
      animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
      transition={prefersReducedMotion ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`${className} relative flex items-center justify-center overflow-visible group transition-transform duration-700`}
    >
      {showGlow && (
        <div className="absolute inset-0 bg-[#c5a059]/10 blur-[30px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      )}

      {!logoFailed ? (
        <img
          src={logoSrc}
          alt="شعار ملوك السعادة"
          width={256}
          height={256}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          onError={() => {
            if (logoSrc !== LOCAL_LOGO_FALLBACK) {
              setLogoSrc(LOCAL_LOGO_FALLBACK);
            } else {
              setLogoFailed(true);
            }
          }}
          style={imgStyle}
        />
      ) : (
        <span className="text-[#c5a059] font-bold text-sm sm:text-base font-header">ملوك السعادة</span>
      )}
    </motion.div>
  );
};

export const LazyFooterVideo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isNearViewport = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [saveDataEnabled] = useState(() => {
    if (typeof navigator === 'undefined') return false;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    return Boolean(conn?.saveData);
  });

  useEffect(() => {
    if (prefersReducedMotion || saveDataEnabled) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const syncPlayback = () => {
      const video = videoRef.current;
      if (!video) return;
      if (shouldPlayBackgroundVideo(isNearViewport.current, !document.hidden)) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isNearViewport.current = entry.isIntersecting;
        if (entry.isIntersecting) setShouldLoadVideo(true);
        syncPlayback();
      },
      { rootMargin: '350px 0px', threshold: 0.01 }
    );

    observer.observe(node);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      isNearViewport.current = false;
      videoRef.current?.pause();
    };
  }, [prefersReducedMotion, saveDataEnabled]);

  useEffect(() => {
    if (shouldLoadVideo && videoRef.current && shouldPlayBackgroundVideo(isNearViewport.current, !document.hidden)) {
      videoRef.current.play().catch(() => {});
    }
  }, [shouldLoadVideo]);

  return (
    <div ref={containerRef} aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
      <img
        src={FOOTER_VIDEO_POSTER}
        alt=""
        width={960}
        height={540}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ filter: 'brightness(0.65)' }}
      />
      {shouldLoadVideo && !prefersReducedMotion && !saveDataEnabled && (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="metadata"
          poster={FOOTER_VIDEO_POSTER}
          className="relative z-[1] w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.65)' }}
        >
          <source src={FOOTER_VIDEO_WEBM} type="video/webm" />
          <source src={FOOTER_VIDEO_MP4} type="video/mp4" />
        </video>
      )}
    </div>
  );
};


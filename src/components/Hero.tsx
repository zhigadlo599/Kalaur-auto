import React, { useEffect, useRef, useCallback, memo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles, ArrowDown, LucideIcon, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: LucideIcon;
  text: string;
  index: number;
}

const FeatureCard = memo(({ icon: Icon, text, index }: FeatureCardProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-4 bg-black/30 backdrop-blur-lg p-5 rounded-xl border border-white/10 hover:border-emerald-400 group transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-all duration-300">
        <Icon className="h-5 w-5 text-emerald-300" />
      </div>
      <span className="text-white font-medium text-sm sm:text-base">{text}</span>
    </motion.div>
  );
});
FeatureCard.displayName = 'FeatureCard';

const Hero = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  const scrollToNextSection = useCallback(() => {
    const nextSection = document.getElementById('services');
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleFreeDiagnosticsClick = useCallback(() => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Fallback: update URL to include the hash (works even if user is on another route)
    if (window.location.pathname !== '/') {
      window.location.href = '/#contact';
      return;
    }

    window.location.hash = 'contact';
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      const spans = titleRef.current.querySelectorAll('.reveal-text');
      spans.forEach((span, i) => {
        (span as HTMLElement).style.transitionDelay = `${i * 0.1}s`;
        setTimeout(() => span.classList.add('revealed'), 100 + i * 100);
      });
    }
  }, []);

  // Video autoplay with mobile support - simplified approach
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set critical attributes ONCE - don't call load() as it can break autoplay
    video.muted = true;
    video.volume = 0;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;

    // Simple play attempt after short delay to let browser settle
    const timer = setTimeout(() => {
      video.play().catch(() => {
        // If autoplay blocked, show play button
        setShowPlayButton(true);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Manual play handler for mobile
  const handlePlayClick = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.volume = 0;
      video.play().then(() => {
        setShowPlayButton(false);
      }).catch(() => {});
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        {/* Video element (visible to browser for autoplay) */}
        <video
          ref={videoRef}
          className={`hero-video absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 opacity-100`}
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          x5-video-player-type="h5"
          x5-video-player-fullscreen="true"
          src="/111-silent.mp4"
        />
        
        {/* Play button for mobile fallback */}
        {showPlayButton && (
          <button
            onClick={handlePlayClick}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5] w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
            aria-label="Відтворити відео"
          >
            <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" fill="white" />
          </button>
        )}
        
        {/* Overlay: darken video for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 pointer-events-none z-[1]" />
      </div>

      <div className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center transition-all duration-1000 ease-out ${
        'opacity-100 translate-y-0'
      }`}>
        <div className="flex flex-col items-center text-center">

          <motion.h1
            ref={titleRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4"
          >
            <span className="reveal-text inline-block translate-y-8 opacity-0 transition-all duration-700 ease-out">Ремонт</span>{' '}
            <span className="inline-block relative text-emerald-300">
              Вантажних Автомобілів
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-emerald-400/50 rounded-full scale-x-0 origin-left transition-transform delay-1000 duration-700 ease-out reveal-underline" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.8 } }}
            className="text-xl sm:text-2xl text-white font-semibold tracking-wide mt-2"
          >
            Професійний сервіс | Надійність | Якість
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.8 } }}
            className="text-lg text-white text-center mt-6 max-w-2xl px-4"
          >
            Повний спектр послуг з обслуговування та ремонту вантажної техніки. Досвідчені майстри, сучасне обладнання, оригінальні запчастини.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-10 w-full max-w-4xl px-4">
            <FeatureCard icon={CheckCircle} text="Діагностика за 30 хвилин" index={0} />
            <FeatureCard icon={Sparkles} text="Гарантія на всі роботи" index={1} />
            <FeatureCard icon={CheckCircle} text="Цілодобовий сервіс" index={2} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.8 } }}
            className="mt-10 flex flex-col items-center gap-6"
          >
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full px-8 py-6 shadow-lg transition-all hover:shadow-emerald-400/30 hover:translate-y-0.5"
              aria-label="Безкоштовна діагностика"
              onClick={handleFreeDiagnosticsClick}
            >
              Безкоштовна діагностика
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <button
              onClick={scrollToNextSection}
              className="text-white hover:text-emerald-300 transition-colors flex flex-col items-center mt-6 group"
              aria-label="Переглянути послуги"
            >
              <span className="text-sm mb-1 tracking-wide">Дізнатися більше</span>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                <ArrowDown className="h-5 w-5 animate-bounce" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);
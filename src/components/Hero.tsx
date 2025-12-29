import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles, ArrowDown, LucideIcon } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// FeatureCard - Épuré et animé
const FeatureCard = memo(({ icon: Icon, text, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ 
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6, 
          delay: 0.15 * index,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="flex items-center gap-4 bg-black/30 backdrop-blur-lg p-5 rounded-xl border border-white/10 hover:border-emerald-400 group transition-all duration-300 shadow-md hover:shadow-lg"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-all duration-300">
        <Icon className="h-5 w-5 text-emerald-300" />
      </div>
      <span className="text-white font-medium text-sm sm:text-base">{text}</span>
    </motion.div>
  );
});

FeatureCard.displayName = 'FeatureCard';

interface FeatureCardProps {
  icon: LucideIcon;
  text: string;
  index: number;
}

// Hero Section - Design Pro & Senior Friendly
const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll();
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const scrollToNextSection = useCallback(() => {
    const nextSection = document.getElementById('services');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Animation de reveal pour le titre
  useEffect(() => {
    if (titleRef.current) {
      const spans = titleRef.current.querySelectorAll('.reveal-text');
      spans.forEach((span, i) => {
        (span as HTMLElement).style.transitionDelay = `${i * 0.1}s`;
        setTimeout(() => {
          span.classList.add('revealed');
        }, 100 + i * 100);
      });
    }
  }, []);

  return (
    <motion.section 
      ref={heroRef}
      style={{ opacity, scale }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%'
          }}
        >
          <source src="/grok-video-73dac3bc-eeac-4e66-b4f0-61cd6b523eff.mp4" type="video/mp4" />
        </video>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-400/20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: Math.random() * 5 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto relative z-10 py-16 sm:py-24 max-w-6xl">
        <div className="flex flex-col items-center text-center">

          {/* Title */}
          <motion.h1 
            ref={titleRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4"
          >
            <span className="reveal-text inline-block translate-y-8 opacity-0 transition-all duration-700 ease-out">Ремонт</span>{' '}
            <span className="inline-block relative text-emerald-300">
              Вантажних Автомобілів
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-emerald-400/50 rounded-full scale-x-0 origin-left transition-transform delay-1000 duration-700 ease-out reveal-underline"></span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.8 } }}
            className="text-xl sm:text-2xl text-white font-semibold tracking-wide mt-2"
          >
            Професійний сервіс | Надійність | Якість
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.8 } }}
            className="text-lg text-white text-center mt-6 max-w-2xl px-4"
          >
            Повний спектр послуг з обслуговування та ремонту вантажної техніки. Досвідчені майстри, сучасне обладнання, оригінальні запчастини.
          </motion.p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-10 w-full max-w-4xl px-4">
            <FeatureCard icon={CheckCircle} text="Діагностика за 30 хвилин" index={0} />
            <FeatureCard icon={Sparkles} text="Гарантія на всі роботи" index={1} />
            <FeatureCard icon={CheckCircle} text="Цілодобовий сервіс" index={2} />
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.8 } }}
            className="mt-10 flex flex-col items-center gap-6"
          >
            <Button 
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full px-8 py-6 shadow-lg transition-all hover:shadow-emerald-400/30 hover:translate-y-0.5"
              aria-label="Безкоштовна діагностика"
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
    </motion.section>
  );
};

export default memo(Hero);
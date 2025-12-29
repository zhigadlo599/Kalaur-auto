import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import * as THREE from 'three';

const testimonials = [
  {
    name: 'Олександр Петренко',
    role: 'Власник транспортної компанії',
    content: 'Швидко зробили діагностику та усунули проблему з двигуном. Пояснили причину, показали деталі й дали гарантію — без зайвих “накруток”.',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&auto=format'
  },
  {
    name: 'Сергій Коваленко',
    role: 'Водій-далекобійник',
    content:
      'Звернувся в дорозі з проблемою по гальмам — прийняли без тяганини та зробили все в той же день. Після ремонту машина йде рівно, сторонніх шумів немає.',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format'
  },
  {
    name: 'Ірина Мороз',
    role: 'Керівник автопарку',
    content:
      'Обслуговуємо тут автопарк: ТО, підвіска, електрика. Завжди тримають терміни, дають зрозумілий кошторис і нормально комунікують по запчастинах.',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format'
  }
];

const TestimonialsFixed: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slideRef = useRef<HTMLDivElement | null>(null);
  const [slideHeight, setSlideHeight] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const particlesCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x7dd3fc, size: 0.06, transparent: true, opacity: 0.18 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let rafId = 0;
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const animate = () => {
      points.rotation.y += 0.0008;
      points.rotation.x += 0.0004;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      scene.clear();
      if (renderer.domElement && container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      if (slideRef.current) {
        const rect = slideRef.current.getBoundingClientRect();
        setSlideHeight(rect.height);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [currentIndex]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isAutoPlaying) timer = setInterval(() => setCurrentIndex((p) => (p + 1) % testimonials.length), 4000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying]);

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0, scale: 0.95 })
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((p) => (p + 1) % testimonials.length);
  };
  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((p) => (p - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-b from-eco-green-50/30 to-white">
      <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-eco-green-100/50 text-eco-green-700 font-medium text-sm mb-4 shadow-sm">
            <Quote className="mr-2 h-4 w-4" />
            <span>Відгуки</span>
          </motion.div>

          <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Що говорять наші клієнти
          </motion.h2>
        </motion.div>

        <div className="relative max-w-2xl mx-auto" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)} style={{ minHeight: slideHeight || undefined }}>
          <AnimatePresence initial={false} custom={currentIndex}>
            <motion.div key={currentIndex} ref={slideRef} custom={currentIndex} variants={slideVariants as any} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45 }} className="absolute top-0 left-0 w-full">
              <Card className="bg-white/90 backdrop-blur-xl border-eco-green-100/50 shadow-xl">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-eco-green-100 shadow-lg flex-shrink-0">
                      <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} className="w-full h-full object-cover" loading="eager" />
                    </div>
                    <div className="flex-1 text-center md:text-left min-w-0 px-2 sm:px-0">
                      <div className="flex justify-center md:justify-start gap-1 mb-2 sm:mb-3">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-eco-green-500 text-eco-green-500" />
                        ))}
                      </div>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 sm:mb-4 italic leading-relaxed break-words max-w-[280px] sm:max-w-none mx-auto md:mx-0">"{testimonials[currentIndex].content}"</p>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl mb-1">{testimonials[currentIndex].name}</h4>
                        <p className="text-eco-green-600 text-xs sm:text-sm md:text-base">{testimonials[currentIndex].role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-col items-center z-20">
          <div className="flex gap-4">
            <Button onClick={handlePrev} variant="outline" size="icon" className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-eco-green-200 hover:border-eco-green-500 hover:bg-eco-green-50">
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-eco-green-600" />
            </Button>
            <Button onClick={handleNext} variant="outline" size="icon" className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-eco-green-200 hover:border-eco-green-500 hover:bg-eco-green-50">
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-eco-green-600" />
            </Button>
          </div>

          <div className="mt-4 flex gap-2" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(i);
                }}
                className={`h-3 w-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-eco-green-300 ${currentIndex === i ? 'bg-eco-green-600' : 'bg-eco-green-50 border border-eco-green-200'}`}
                aria-current={currentIndex === i ? 'true' : undefined}
                aria-label={`Перейти до відгуку ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsFixed;

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import * as THREE from 'three';

const testimonials = [
  {
    name: "Софія Мартін",
    role: "Директор закладу",
    content: "Винятковий сервіс! Команда професійна, результати — бездоганні. Рекомендую.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format"
  },
  {
    name: "Томас Дюбуа",
    role: "Керівник ресторану",
    content: "Ефективні екологічні рішення та дуже компетентний персонал. Наш ресторан ніколи не був таким чистим!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format"
  },
  {
    name: "Марі Лоран",
    role: "Власник клініки",
    content: "Надійний партнер для прибирання нашої клініки. Ідеальна гігієна та дотримання протоколів.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&auto=format"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement | null>(null);
  const [slideHeight, setSlideHeight] = useState<number>(0);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.z = 8;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    });
    rendererRef.current = renderer;
    
    // Ajuster la taille du renderer à la taille de la section
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      if (cameraRef.current) {
        cameraRef.current.aspect = rect.width / rect.height;
        cameraRef.current.updateProjectionMatrix();
      }
    };
    
    updateSize();
    containerRef.current.appendChild(renderer.domElement);

    // Create bubbles
    const bubblesGeometry = new THREE.BufferGeometry();
    const bubbleCount = 50;
    const positions = new Float32Array(bubbleCount * 3);
    const sizes = new Float32Array(bubbleCount);
    const speeds = new Float32Array(bubbleCount);
    const offsets = new Float32Array(bubbleCount);

    for (let i = 0; i < bubbleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      sizes[i] = 0.1 + Math.random() * 0.2;
      speeds[i] = 0.2 + Math.random() * 0.3;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    bubblesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    bubblesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    bubblesGeometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    bubblesGeometry.setAttribute('offset', new THREE.BufferAttribute(offsets, 1));

    const bubbleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x4ade80) }
      },
      vertexShader: `
        attribute float size;
        attribute float speed;
        attribute float offset;
        uniform float time;
        
        varying vec3 vColor;
        
        void main() {
          vColor = vec3(0.3, 0.8, 0.4);
          
          vec3 pos = position;
          pos.y += sin(time * speed + offset) * 0.5;
          pos.x += cos(time * speed + offset) * 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const bubbles = new THREE.Points(bubblesGeometry, bubbleMaterial);
    particlesRef.current = bubbles;
    scene.add(bubbles);

    // Create water surface
    const waterGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    const waterMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x4ade80) }
      },
      vertexShader: `
        uniform float time;
        
        void main() {
          vec3 pos = position;
          pos.z = sin(pos.x * 2.0 + time) * 0.1 + sin(pos.y * 2.0 + time * 0.8) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        
        void main() {
          gl_FragColor = vec4(color, 0.1);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });

    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -2;
    scene.add(water);

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const targetRotation = new THREE.Vector2();
    const currentRotation = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      targetRotation.x = mouse.y * 0.5;
      targetRotation.y = mouse.x * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      if (bubbleMaterial.uniforms) {
        bubbleMaterial.uniforms.time.value = time;
      }
      if (waterMaterial.uniforms) {
        waterMaterial.uniforms.time.value = time;
      }

      // Smooth camera rotation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
      
      camera.position.x = Math.sin(currentRotation.y) * 5;
      camera.position.y = Math.sin(currentRotation.x) * 2;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      updateSize();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      bubblesGeometry.dispose();
      bubbleMaterial.dispose();
      waterGeometry.dispose();
      waterMaterial.dispose();
    };
  }, []);

  // Measure slide height so container keeps stable height during animations
  useLayoutEffect(() => {
    const measure = () => {
      if (slideRef.current) {
        const h = slideRef.current.getBoundingClientRect().height;
        setSlideHeight(h);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [currentIndex]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      filter: 'blur(10px)'
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)'
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      filter: 'blur(10px)'
    })
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-b from-eco-green-50/30 to-white">
      {/* 3D Background */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ 
          zIndex: 0,
          height: '100%',
          width: '100%'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-eco-green-100/50 text-eco-green-700 font-medium text-sm mb-4 shadow-sm"
          >
            <Quote className="mr-2 h-4 w-4" />
            <span>Відгуки</span>
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900"
          >
            Що говорять наші клієнти
          </motion.h2>
        </motion.div>
        
        <div 
          className="relative max-w-2xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          style={{ minHeight: slideHeight || undefined }}
        >
          <AnimatePresence initial={false} custom={currentIndex}>
            <motion.div
              ref={slideRef}
              key={currentIndex}
              custom={currentIndex}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
          
          {/* Controls moved below the carousel to avoid overlapping other blocks */}
        </div>
        <div className="mt-6 flex flex-col items-center z-20">
          <div className="flex gap-4">
            <Button
              onClick={handlePrev}
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-eco-green-200 hover:border-eco-green-500 hover:bg-eco-green-50"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-eco-green-600" />
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-eco-green-200 hover:border-eco-green-500 hover:bg-eco-green-50"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-eco-green-600" />
            </Button>
          </div>

          <div className="mt-4 flex gap-2" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setIsAutoPlaying(false); setCurrentIndex(i); }}
                className={`h-3 w-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-eco-green-300 ${currentIndex === i ? 'bg-eco-green-600' : 'bg-eco-green-50 border border-eco-green-200'}`}
                aria-current={currentIndex === i ? 'true' : undefined}
                aria-label={`Перейти до відгуку ${i + 1}`}
              />
            ))}
          </div>
        </div>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={handlePrev}
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-eco-green-200 hover:border-eco-green-500 hover:bg-eco-green-50"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-eco-green-600" />
            </Button>
            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12 border-eco-green-200 hover:border-eco-green-500 hover:bg-eco-green-50"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-eco-green-600" />
            </Button>
          </div>
          
        </div>
        {/* Dots navigation (placed below the testimonial container) */}
        <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setIsAutoPlaying(false); setCurrentIndex(i); }}
              className={`h-3 w-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-eco-green-300 ${currentIndex === i ? 'bg-eco-green-600' : 'bg-eco-green-50 border border-eco-green-200'}`}
              aria-current={currentIndex === i ? 'true' : undefined}
              aria-label={`Перейти до відгуку ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
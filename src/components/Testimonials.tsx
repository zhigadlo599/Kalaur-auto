export { default } from './TestimonialsFixed';

const testimonials = [
  {
    name: "Олександр Петренко",
    role: "Власник транспортної компанії",
    content: "Відмінний сервіс! Команда професіоналів швидко та якісно виконала капітальний ремонт двигуна. Автомобіль працює як новий!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format"
  },
  {
    name: "Сергій Коваленко",
    role: "Водій-далекобійник",
    content: "Звертаюся до Kalaur Service вже 3 роки. Завжди якісний ремонт, чесні ціни та дотримання термінів. Рекомендую!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format"
  },
  {
    name: "Ірина Морозова",
    role: "Керівник автопарку",
    content: "Надійний партнер для обслуговування нашого автопарку. Професійний підхід, сучасне обладнання та гарантія якості.",
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
                  Відгуки наших клієнтів
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
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },

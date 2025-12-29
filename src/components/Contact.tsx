import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, Sparkles, Leaf, ChevronRight, Building2 } from 'lucide-react';
import * as THREE from 'three';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const services = [
  { id: "diagnostics", name: "Комп'ютерна діагностика", icon: Building2 },
  { id: "engine-repair", name: "Ремонт двигуна", icon: Building2 },
  { id: "transmission", name: "Ремонт трансмісії", icon: Building2 },
  { id: "brake-system", name: "Ремонт гальмівної системи", icon: Building2 },
  { id: "suspension", name: "Ремонт підвіски", icon: Building2 },
  { id: "electrical", name: "Ремонт електрообладнання", icon: Building2 },
  { id: "maintenance", name: "ТО та обслуговування", icon: Building2 }
];

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create soap bubbles
    const bubbles: THREE.Mesh[] = [];
    const bubbleCount = 15;
    const bubbleGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const bubbleMaterial = new THREE.MeshPhongMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.3,
      shininess: 100,
      specular: 0xffffff
    });

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      bubble.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      bubble.userData = {
        speed: Math.random() * 0.02 + 0.01,
        rotationSpeed: Math.random() * 0.02 + 0.01,
        amplitude: Math.random() * 2 + 1
      };
      bubbles.push(bubble);
      scene.add(bubble);
    }

    // Create cleaning waves
    const waveGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    const waveMaterial = new THREE.MeshPhongMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const wave = new THREE.Mesh(waveGeometry, waveMaterial);
    wave.rotation.x = -Math.PI / 2;
    wave.position.y = -2;
    scene.add(wave);

    // Camera position
    camera.position.z = 8;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Update bubbles
      bubbles.forEach((bubble, index) => {
        const time = Date.now() * 0.001;
        const userData = bubble.userData;
        
        // Floating motion
        bubble.position.y += userData.speed;
        bubble.position.x += Math.sin(time + index) * 0.01;
        bubble.position.z += Math.cos(time + index) * 0.01;
        
        // Rotation
        bubble.rotation.x += userData.rotationSpeed;
        bubble.rotation.y += userData.rotationSpeed;

        // Reset position if bubble goes too high
        if (bubble.position.y > 5) {
          bubble.position.y = -5;
          bubble.position.x = (Math.random() - 0.5) * 10;
          bubble.position.z = (Math.random() - 0.5) * 10;
        }
      });

      // Update wave
      const time = Date.now() * 0.001;
      const positions = waveGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] = Math.sin(x * 0.5 + time) * Math.cos(z * 0.5 + time) * 0.5;
      }
      waveGeometry.attributes.position.needsUpdate = true;

      // Camera movement
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      bubbles.forEach(bubble => {
        scene.remove(bubble);
        bubble.geometry.dispose();
      });
      wave.geometry.dispose();
      wave.material.dispose();
      bubbleMaterial.dispose();
      bubbleGeometry.dispose();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', service: '', message: '', date: '' });
      setSelectedService(null);
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      service: value
    }));
    setSelectedService(value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const cardHover = {
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  return (
    <section id="contact" className="relative py-28 overflow-hidden bg-gradient-to-b from-white to-eco-green-50/30">
      {/* 3D Background */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header section */}
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-eco-green-100/50 text-eco-green-700 font-medium text-sm mb-4 shadow-sm"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Зв'яжіться з нами</span>
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
          >
            Готові перетворити ваш простір?
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Наша команда готова відповісти на всі ваші запитання та підготувати індивідуальне рішення.
          </motion.p>
        </motion.div>
        
        {/* Main content with glass effect */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {/* Contact info card */}
          <motion.div 
            variants={itemVariants}
            className="h-full"
          >
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="h-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-eco-green-500/5 to-eco-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="p-8 sm:p-10 relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full bg-gradient-to-b from-eco-green-500 to-eco-green-600" />
                  Наші контакти
                </h3>
                
                <div className="space-y-6">
                  {[
                    { icon: Phone, label: "Телефон", value: "095 683 72 38" },
                    { icon: Mail, label: "Електронна пошта", value: "info@kalaur-service.com" },
                    { icon: MapPin, label: "Адреса", value: "Житомир, вул. Парникова, 27" },
                    { icon: Clock, label: "Графік роботи", value: "09:00 – 18:00 (Вт – Сб)" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                    >
                      <div className="bg-eco-green-50 p-3 rounded-lg group-hover:bg-eco-green-100 transition-colors duration-300 flex-shrink-0">
                        <item.icon className="h-5 w-5 text-eco-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                        <p className="font-medium text-gray-900">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          </motion.div>

          {/* Contact form card */}
          <motion.div 
            variants={itemVariants}
          >
            <motion.div
              variants={cardHover}
              whileHover="hover"
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden group relative"
            >
              <CardContent className="p-8 sm:p-10 relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full bg-gradient-to-b from-eco-green-500 to-eco-green-600" />
                  Надішліть нам повідомлення
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Input 
                        type="text"
                        name="name"
                        placeholder="Ваше повне ім'я"
                        value={formData.name}
                        onChange={handleChange}
                        className="h-12 bg-gray-50/50 border-gray-200 focus:border-eco-green-500 focus:ring-eco-green-500/20"
                        required
                      />
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Input 
                        type="email"
                        name="email"
                        placeholder="Ваш email"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12 bg-gray-50/50 border-gray-200 focus:border-eco-green-500 focus:ring-eco-green-500/20"
                        required
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Input 
                        type="tel"
                        name="phone"
                        placeholder="Ваш телефон"
                        value={formData.phone}
                        onChange={handleChange}
                        className="h-12 bg-gray-50/50 border-gray-200 focus:border-eco-green-500 focus:ring-eco-green-500/20"
                        required
                      />
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Input 
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="h-12 bg-gray-50/50 border-gray-200 focus:border-eco-green-500 focus:ring-eco-green-500/20"
                        required
                      />
                    </motion.div>
                  </div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Select onValueChange={handleServiceChange} value={formData.service}>
                        <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 focus:border-eco-green-500 focus:ring-eco-green-500/20">
                        <SelectValue placeholder="Оберіть послугу" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem 
                            key={service.id} 
                            value={service.id}
                            className="flex items-center gap-2"
                          >
                            <service.icon className="h-4 w-4 text-eco-green-600" />
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                      <Textarea 
                      name="message"
                      placeholder="Ваше повідомлення"
                      value={formData.message}
                      onChange={handleChange}
                      className="min-h-[150px] bg-gray-50/50 border-gray-200 focus:border-eco-green-500 focus:ring-eco-green-500/20"
                      required
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-eco-green-600 hover:bg-eco-green-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Clock className="h-5 w-5" />
                        </motion.div>
                      ) : isSubmitted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          Повідомлення надіслано!
                        </motion.div>
                      ) : (
                        <motion.div
                          className="flex items-center gap-2"
                          whileHover={{ x: 5 }}
                        >
                          Надіслати повідомлення
                          <Send className="h-5 w-5" />
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-eco-green-100/20">
            <div className="p-6 bg-gradient-to-r from-eco-green-500 to-eco-green-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">Наша адреса</h3>
                  <p className="text-white/90 text-sm">м. Житомир, вул. Парникова 27</p>
                </div>
              </div>
            </div>
            <div className="relative w-full h-[400px] md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2541.324!2d28.646701897539774!3d50.28672249798844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNTDCsDE3JzEyLjIiTiAyOMKwMzgnNDguMSJF!5e0!3m2!1suk!2sua!4v1640000000000!5m2!1suk!2sua"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kalaur Service Location"
              />
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-eco-green-100 rounded-lg">
                    <Phone className="h-5 w-5 text-eco-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Телефон</p>
                    <a href="tel:+380956837238" className="text-eco-green-600 hover:text-eco-green-700 font-medium">
                      095 683 72 38
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-eco-green-100 rounded-lg">
                    <Mail className="h-5 w-5 text-eco-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Email</p>
                    <a href="mailto:info@kalaur-service.com" className="text-eco-green-600 hover:text-eco-green-700 font-medium">
                      info@kalaur-service.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-eco-green-100 rounded-lg">
                    <Clock className="h-5 w-5 text-eco-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Графік роботи</p>
                    <p className="text-gray-600">Вт-Сб: 09:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
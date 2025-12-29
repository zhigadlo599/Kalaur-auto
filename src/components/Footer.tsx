import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Twitter, ArrowRight, Mail, Phone, MapPin, Clock, Sparkles, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface FooterLink {
  label: string;
  href: string;
}

const Footer: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const calculateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', calculateScrollProgress);
    return () => window.removeEventListener('scroll', calculateScrollProgress);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getProgressColor = () => {
    if (scrollProgress < 25) return '#4ade80'; // eco-green-500
    if (scrollProgress < 50) return '#22c55e'; // eco-green-600
    if (scrollProgress < 75) return '#16a34a'; // eco-green-700
    return '#15803d'; // eco-green-800
  };

  const services: FooterLink[] = [
    { label: "Комп'ютерна діагностика", href: "/services/diagnostics" },
    { label: "Ремонт двигуна", href: "/services/engine-repair" },
    { label: "Ремонт трансмісії", href: "/services/transmission" },
    { label: "Гальмівна система", href: "/services/brake-system" },
    { label: "ТО та обслуговування", href: "/services/maintenance" }
  ];

  const usefulLinks: FooterLink[] = [
    { label: "Про нас", href: "/#about" },
    { label: "Відгуки", href: "/#testimonials" },
    { label: "Контакти", href: "/#contact" },
    { label: "Безкоштовна діагностика", href: "/#contact" }
  ];

  const handleNavigation = (href: string) => {
    // Якщо це посилання на головну сторінку
    if (href === '/') {
      navigate('/');
      return;
    }

    // Якщо це посилання з хешем (секція на головній сторінці)
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      
      // Якщо ми не на головній сторінці, спочатку переходимо на неї
      if (location.pathname !== '/') {
        navigate('/');
        // Attendre que la page soit chargée avant de scroller
        // Зачекати, поки сторінка завантажиться, перед скролом
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Якщо ми вже на головній сторінці, скролимо напряму
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    // Для інших посилань (сторінки послуг)
    navigate(href);
  };

  return (
    <footer className="bg-gradient-to-br from-eco-green-800 to-eco-green-900 text-white pt-20 pb-8 relative overflow-hidden">
      {/* Back to Top Button with circular progress */}
      <AnimatePresence>
        {scrollProgress > 5 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <motion.button
              onClick={scrollToTop}
              className="relative p-3 rounded-full bg-eco-green-500 text-white shadow-lg z-50"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-12 h-12">
                {/* Circular Progress Background */}
                <svg className="absolute inset-0 -rotate-90 w-full h-full">
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-eco-green-200/20"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="22"
                    stroke={getProgressColor()}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: scrollProgress / 100 }}
                    transition={{ duration: 0.1 }}
                  />
                </svg>
                
                {/* Button Content */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    y: isHovered ? -2 : 0,
                    rotate: isHovered ? 360 : 0,
                  }}
                  transition={{
                    y: { duration: 0.2 },
                    rotate: { duration: 0.5 }
                  }}
                >
                  <ArrowUp className="h-6 w-6" />
                </motion.div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-eco-green-700/20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-eco-green-600/10 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 right-1/4 w-20 h-20 rounded-full bg-eco-green-500/20 animate-float" style={{ animationDelay: '1s' }}></div>
        
        {/* Add geometric patterns */}
        <div className="absolute top-1/3 left-1/4 w-64 h-1 bg-eco-green-600/20 rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-1 bg-eco-green-600/20 rotate-45"></div>
        <div className="absolute top-20 right-20 w-20 h-20 border border-eco-green-500/20 rounded-lg rotate-12"></div>
      </div>

      {/* Top section with logo and social */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-eco-green-700 pb-8">
          <div className="mb-8 md:mb-0 flex items-center">
            <div className="h-14 w-14 mr-4 bg-gradient-to-br from-eco-green-400 via-eco-green-500 to-eco-green-700 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
              <svg className="w-9 h-9 text-white relative z-10" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="48" r="7" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                <circle cx="20" cy="48" r="3" fill="currentColor"/>
                <circle cx="60" cy="48" r="7" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                <circle cx="60" cy="48" r="3" fill="currentColor"/>
                
                <path d="M 13 48 L 13 38 L 8 38 L 8 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M 27 48 L 27 38 L 53 38 L 53 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M 67 48 L 67 38 L 72 38 L 72 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                
                <rect x="8" y="20" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                <line x1="20" y1="20" x2="20" y2="38" stroke="currentColor" strokeWidth="2.5"/>
                
                <rect x="10" y="23" width="8" height="10" rx="1" fill="currentColor" opacity="0.4"/>
                <rect x="22" y="23" width="8" height="10" rx="1" fill="currentColor" opacity="0.4"/>
                
                <rect x="34" y="15" width="38" height="23" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                <line x1="48" y1="15" x2="48" y2="38" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                <line x1="58" y1="15" x2="58" y2="38" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                
                <path d="M 8 20 L 12 12 L 28 12 L 32 20" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">Kalaur <span className="text-eco-green-300">Service</span></h2>
              <p className="text-eco-green-200 max-w-md">
                Професійний сервіс з ремонту та обслуговування вантажних автомобілів.
                Ваш надійний партнер у технічному обслуговуванні та ремонті вантажівок.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            {[
              { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
              { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
              { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
              { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" }
            ].map((social, index) => (
              <a 
                key={index}
                href="#" 
                aria-label={social.label}
                className="group"
              >
                <div className="bg-eco-green-700/30 hover:bg-eco-green-600/50 p-3 rounded-full transition-all duration-300 hover:scale-110 relative overflow-hidden">
                  <div className="absolute inset-0 bg-eco-green-500/0 group-hover:bg-eco-green-500/30 transition-all duration-300"></div>
                  {social.icon}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">Контакт</span>
              <span className="absolute bottom-0 left-0 h-1 w-12 bg-eco-green-500"></span>
            </h3>
            
            <div className="flex items-start space-x-4 group hover-lift">
              <div className="p-2 bg-eco-green-700/30 rounded-full group-hover:bg-eco-green-600/50 transition-all duration-300">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-eco-green-100">Житомир, вул. Парникова, 27</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 group hover-lift">
              <div className="p-2 bg-eco-green-700/30 rounded-full group-hover:bg-eco-green-600/50 transition-all duration-300">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-eco-green-100">095 683 72 38</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 group hover-lift">
              <div className="p-2 bg-eco-green-700/30 rounded-full group-hover:bg-eco-green-600/50 transition-all duration-300">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-eco-green-100">info@kalaur-service.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 group hover-lift">
              <div className="p-2 bg-eco-green-700/30 rounded-full group-hover:bg-eco-green-600/50 transition-all duration-300">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-eco-green-100">
                  09:00 – 18:00 (Вівторок – Субота)
                </p>
              </div>
            </div>
          </div>
          
          <div>
              <h3 className="text-xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">Послуги</span>
              <span className="absolute bottom-0 left-0 h-1 w-12 bg-eco-green-500"></span>
            </h3>
            
            <ul className="space-y-3">
              {services.map((item, index) => (
                <li key={index} className="transform transition-transform duration-300 hover:translate-x-2">
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className="text-eco-green-200 hover:text-white transition-colors flex items-center group w-full text-left"
                  >
                    <span className="w-5 h-5 mr-2 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-eco-green-400 rounded-full group-hover:scale-125 transition-transform duration-300"></span>
                    </span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
              <h3 className="text-xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">Корисні посилання</span>
              <span className="absolute bottom-0 left-0 h-1 w-12 bg-eco-green-500"></span>
            </h3>
            
            <ul className="space-y-3">
              {usefulLinks.map((item, index) => (
                <li key={index} className="transform transition-transform duration-300 hover:translate-x-2">
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className="text-eco-green-200 hover:text-white transition-colors flex items-center group w-full text-left"
                  >
                    <span className="w-5 h-5 mr-2 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-eco-green-400 rounded-full group-hover:scale-125 transition-transform duration-300"></span>
                    </span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
              <h3 className="text-xl font-bold mb-6 relative inline-block">
              <span className="relative z-10">Розсилка</span>
              <span className="absolute bottom-0 left-0 h-1 w-12 bg-eco-green-500"></span>
            </h3>
            
            <div className="p-6 bg-eco-green-800/50 backdrop-blur-sm rounded-xl border border-eco-green-700/50 hover-glow">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-eco-green-500/20 flex items-center justify-center mr-3">
                  <Sparkles className="h-5 w-5 text-eco-green-300" />
                </div>
                <h4 className="font-semibold">Будьте в курсі</h4>
              </div>
              
                <p className="text-eco-green-200 mb-4 text-sm">
                Підпишіться, щоб отримувати спеціальні пропозиції та новини про наші послуги.
              </p>
              
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="Ваш email" 
                  className="bg-eco-green-700/30 border-eco-green-700 text-white placeholder:text-eco-green-300 pr-12 focus:ring-eco-green-500 focus:border-eco-green-500"
                />
                <Button 
                  size="icon"
                  className="absolute right-1 top-1 bottom-1 bg-eco-green-500 hover:bg-eco-green-400"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
                <div className="mt-4 flex items-center text-xs text-eco-green-300">
                <span>Будьте в курсі нових акцій та пропозицій</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-eco-green-700 pt-8 flex flex-col md:flex-row justify-center items-center">
            <p className="text-eco-green-300 text-center">
            &copy; {new Date().getFullYear()} Kalaur Service. Всі права захищені.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

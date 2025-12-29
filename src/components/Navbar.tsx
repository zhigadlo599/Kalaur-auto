import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { services } from '@/data/services';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Set scrolled state
      setScrolled(window.scrollY > 20);
      
      // Determine active section
      const sections = ['services', 'about', 'testimonials', 'contact'];
      let currentSection = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { label: "Головна", href: "/" },
    { label: "Про нас", href: "/#about" },
    { 
      label: "Послуги", 
      dropdown: [
        { label: "Прибирання паркінгів", href: "/services/parking" },
        { label: "Прибирання офісів", href: "/services/bureaux" },
        { label: "Прибирання клінік", href: "/services/cliniques" },
        { label: "Миття вітрин", href: "/services/vitrerie" },
        { label: "Прибирання після аварій", href: "/services/sinistres" },
        { label: "Прибирання на будмайданчику", href: "/services/chantier" },
        { label: "Дезінфекція та дератизація", href: "/services/desinfection" }
      ]
    },
    { label: "Блог", href: "/blog" },
    { label: "Відгуки", href: "/#testimonials" },
    { label: "Контакт", href: "/#contact" }
  ];

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    
    // Si c'est un lien vers la page d'accueil
    if (href === '/') {
      navigate('/');
      return;
    }

    // Si c'est un lien avec un hash (section de la page d'accueil)
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      
      // Si nous ne sommes pas sur la page d'accueil, on y va d'abord
      if (location.pathname !== '/') {
        navigate('/');
        // Attendre que la page soit chargée avant de scroller
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Si nous sommes déjà sur la page d'accueil, on scrolle directement
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    // Pour les autres liens (pages de services)
    navigate(href);
  };

  const handleBack = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full px-4 py-3 sm:py-4 transition-all duration-500 z-[100] bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border-b border-eco-green-100/20"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-4">
          {location.pathname !== '/' && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBack}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full transition-all duration-300 text-eco-green-600 hover:bg-eco-green-50/80 text-xs sm:text-sm hover:shadow-md"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium">Назад</span>
            </motion.button>
          )}
          <Link to="/" className="flex items-center group">
            <motion.div 
              className="h-8 sm:h-10 md:h-12 w-auto relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute inset-0 bg-eco-green-500/10 rounded-full blur-xl group-hover:bg-eco-green-500/20 transition-all duration-300"></div>
              <img src="/logo.png" alt="EcoClean ProMax Logo" className="h-full relative z-10" />
            </motion.div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item, index) => (
            item.dropdown ? (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center space-x-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 group text-sm",
                      activeSection === item.label.toLowerCase() 
                        ? "text-eco-green-600 bg-eco-green-50/80 shadow-sm" 
                        : "text-gray-700 hover:text-eco-green-600 hover:bg-eco-green-50/50 hover:shadow-sm"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 p-2 bg-white/95 backdrop-blur-xl border border-eco-green-100/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-xl"
                >
                  {item.dropdown.map((subItem, subIndex) => (
                    <DropdownMenuItem 
                      key={subIndex} 
                      asChild
                      className="rounded-lg hover:bg-eco-green-50/80 transition-colors duration-200"
                    >
                      <Link to={subItem.href} className="cursor-pointer py-2 px-3 text-sm">
                        {subItem.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.button
                key={index}
                onClick={() => handleNavigation(item.href)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300",
                  activeSection === item.label.toLowerCase() 
                    ? "text-eco-green-600 bg-eco-green-50/80 shadow-sm" 
                    : "text-gray-700 hover:text-eco-green-600 hover:bg-eco-green-50/50 hover:shadow-sm"
                )}
              >
                {item.label}
              </motion.button>
            )
          ))}
          <div className="hidden lg:flex items-center ml-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost"
                className="flex items-center rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 text-eco-green-600 hover:bg-eco-green-50/80 text-sm hover:shadow-sm"
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden xl:inline">+33 (0) 7 44 53 10 08</span>
                <span className="xl:hidden">07 44 53 10 08</span>
              </Button>
            </motion.div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => handleNavigation('/#contact')}
              className="ml-2 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 transition-all duration-300 flex items-center bg-eco-green-500 hover:bg-eco-green-600 text-white shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] text-sm"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Безкоштовний кошторис
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="lg:hidden focus:outline-none transition-colors duration-300 p-1.5 sm:p-2 rounded-lg text-foreground hover:bg-eco-green-50/80 hover:shadow-sm"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-[60px] sm:top-[72px] left-0 right-0 bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-y-auto max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-72px)] border-t border-eco-green-100/20"
          >
            <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
              {/* Головна та Про нас першими */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => handleNavigation('/')}
                  className="block text-sm sm:text-base font-medium text-gray-900 hover:text-eco-green-600 transition-colors duration-200 w-full text-left py-1.5 hover:bg-eco-green-50/50 rounded-lg px-2"
                >
                  Головна
                </motion.button>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => handleNavigation('/#about')}
                  className="block text-sm sm:text-base font-medium text-gray-900 hover:text-eco-green-600 transition-colors duration-200 w-full text-left py-1.5 hover:bg-eco-green-50/50 rounded-lg px-2"
                >
                  Про нас
                </motion.button>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => handleNavigation('/blog')}
                  className="block text-sm sm:text-base font-medium text-gray-900 hover:text-eco-green-600 transition-colors duration-200 w-full text-left py-1.5 hover:bg-eco-green-50/50 rounded-lg px-2"
                >
                  Блог
                </motion.button>
              </div>

              {/* Témoignages et Contact */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => handleNavigation('/#testimonials')}
                  className="block text-sm sm:text-base font-medium text-gray-900 hover:text-eco-green-600 transition-colors duration-200 w-full text-left py-1.5 hover:bg-eco-green-50/50 rounded-lg px-2"
                >
                  Відгуки
                </motion.button>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => handleNavigation('/#contact')}
                  className="block text-sm sm:text-base font-medium text-gray-900 hover:text-eco-green-600 transition-colors duration-200 w-full text-left py-1.5 hover:bg-eco-green-50/50 rounded-lg px-2"
                >
                  Контакт
                </motion.button>
              </div>

              {/* Services avec déroulant */}
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <div className="font-medium text-gray-900 text-sm sm:text-base px-2">Послуги</div>
                <div className="pl-4 space-y-2">
                  {navItems.find(item => item.label === "Services")?.dropdown?.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.href}
                      className="block text-xs sm:text-sm text-gray-600 hover:text-eco-green-600 transition-colors duration-200 py-1.5 hover:bg-eco-green-50/50 rounded-lg px-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Contact et Devis en bas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center py-2 border-t border-gray-100"
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-eco-green-500" />
                <span className="text-xs sm:text-sm text-gray-600">+33 (0) 7 44 53 10 08</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="sticky bottom-0 bg-white/95 backdrop-blur-xl py-4 border-t border-gray-100"
              >
                <Button 
                  onClick={() => handleNavigation('/#contact')}
                  className="w-full bg-eco-green-500 hover:bg-eco-green-600 text-white shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 text-sm sm:text-base py-2 sm:py-2.5"
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Devis Gratuit
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

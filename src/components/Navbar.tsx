import React, { useMemo, useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone, Sparkles, ArrowLeft, ShoppingCart, LockKeyhole, LogOut } from 'lucide-react';
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
import { useCart } from '@/contexts/CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { clearAdminAuthed, isAdminAuthed, setAdminAuthed, verifyAdminCredentials } from '@/lib/adminAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();

  const cartCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthed, setAdminAuthedState] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    setAdminAuthedState(isAdminAuthed());
  }, []);

  const handleAdminLogin = () => {
    setAdminError(null);

    (async () => {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username: adminUsername, password: adminPassword }),
        });

        if (!res.ok) {
          // Local fallback (e.g. Vite dev without Vercel functions)
          if (import.meta.env.DEV && verifyAdminCredentials(adminUsername, adminPassword)) {
            setAdminAuthed();
            setAdminAuthedState(true);
            setAdminOpen(false);
            setIsOpen(false);
            navigate('/admin');
            return;
          }

          setAdminError('Невірний логін або пароль');
          return;
        }

        setAdminAuthed();
        setAdminAuthedState(true);
        setAdminOpen(false);
        setIsOpen(false);
        navigate('/admin');
      } catch {
        // Local fallback (e.g. Vite dev without Vercel functions)
        if (!verifyAdminCredentials(adminUsername, adminPassword)) {
          setAdminError('Невірний логін або пароль');
          return;
        }
        setAdminAuthed();
        setAdminAuthedState(true);
        setAdminOpen(false);
        setIsOpen(false);
        navigate('/admin');
      }
    })();
  };

  const handleAdminLogout = () => {
    (async () => {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          credentials: 'include',
        });
      } catch {
        // ignore
      } finally {
        clearAdminAuthed();
        setAdminAuthedState(false);
        setAdminUsername('');
        setAdminPassword('');
        setAdminError(null);
      }
    })();
  };

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
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) setMobileServicesOpen(false);
      return next;
    });
  };

  const navItems = [
    { label: "Головна", href: "/" },
    { label: "Магазин", href: "/shop" },
    { label: "Кошик", href: "/cart" },
    { label: "Про нас", href: "/#about" },
    { 
      label: "Послуги", 
      dropdown: [
        { label: "Комп'ютерна діагностика", href: "/services/diagnostics" },
        { label: "Ремонт двигуна", href: "/services/engine-repair" },
        { label: "Ремонт трансмісії", href: "/services/transmission" },
        { label: "Гальмівна система", href: "/services/brake-system" },
        { label: "Ремонт підвіски", href: "/services/suspension" },
        { label: "Електрообладнання", href: "/services/electrical" },
        { label: "ТО та обслуговування", href: "/services/maintenance" }
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
      if (location.pathname !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Si c'est un lien avec un hash (section de la page d'accueil)
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      
      // Si nous ne sommes pas sur la page d'accueil, on y va d'abord
      if (location.pathname !== '/') {
        // Navigate with hash so ScrollManager can reliably scroll after render
        navigate(`${path}#${hash}`);
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
              className="h-8 sm:h-10 md:h-12 flex items-center gap-2 relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute inset-0 bg-eco-green-500/10 rounded-2xl blur-xl group-hover:bg-eco-green-500/20 transition-all duration-300"></div>
              <div className="relative z-10 flex items-center gap-2">
                <div className="h-8 sm:h-10 md:h-12 w-8 sm:w-10 md:w-12 bg-gradient-to-br from-eco-green-400 via-eco-green-500 to-eco-green-700 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden group-hover:shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white relative z-10" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold text-gray-900 leading-tight tracking-tight">Kalaur</span>
                  <span className="text-[10px] sm:text-xs font-semibold text-eco-green-600 leading-tight tracking-wider">SERVICE</span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.filter((item) => item.href !== '/cart').map((item, index) => (
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
            <Dialog
              open={adminOpen}
              onOpenChange={(open) => {
                setAdminOpen(open);
                if (open) setAdminError(null);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="mr-2 flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 text-gray-700 hover:text-eco-green-600 hover:bg-eco-green-50/80 text-sm hover:shadow-sm"
                >
                  <LockKeyhole className="h-4 w-4" />
                  <span>{adminAuthed ? 'Адмін' : 'Вхід'}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{adminAuthed ? 'Адмін доступ' : 'Вхід в адмінку'}</DialogTitle>
                </DialogHeader>

                {adminAuthed ? (
                  <div className="flex items-center justify-between gap-2">
                    <Button onClick={() => { setAdminOpen(false); navigate('/admin'); }} className="rounded-full">В адмінку</Button>
                    <Button variant="outline" onClick={() => { handleAdminLogout(); setAdminOpen(false); }} className="rounded-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Вийти
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={adminUsername}
                        onChange={(e) => {
                          setAdminUsername(e.target.value);
                          setAdminError(null);
                        }}
                        placeholder="Логін"
                        autoComplete="off"
                      />
                      <Input
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value);
                          setAdminError(null);
                        }}
                        placeholder="Пароль"
                        type="password"
                        autoComplete="off"
                      />
                    </div>
                    {adminError ? <div className="text-sm text-destructive">{adminError}</div> : null}
                    <Button onClick={handleAdminLogin} className="rounded-full w-full">Увійти</Button>
                    <div className="text-xs text-gray-500">
                      Вхід встановлює cookie-сесію (або локальний fallback в dev).
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost"
                className="flex items-center rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 text-eco-green-600 hover:bg-eco-green-50/80 text-sm hover:shadow-sm"
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  <span className="hidden xl:inline">+380 95 683 72 38</span>
                  <span className="xl:hidden">095 683 72 38</span>
              </Button>
            </motion.div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-2"
          >
            <Link
              to="/cart"
              aria-label="Відкрити кошик"
              className="relative inline-flex items-center justify-center focus:outline-none transition-colors duration-300 p-2 rounded-full text-foreground hover:bg-eco-green-50/80 hover:shadow-sm"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-white text-eco-green-700 text-[10px] font-bold flex items-center justify-center border border-eco-green-100">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => handleNavigation('/#contact')}
              className="ml-2 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 transition-all duration-300 flex items-center bg-eco-green-500 hover:bg-eco-green-600 text-white shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] text-sm"
            >
              Безкоштовна діагностика
            </Button>
          </motion.div>
        </div>

        {/* Mobile actions (Cart + Menu) */}
        <div className="lg:hidden flex items-center gap-2">
          <Dialog
            open={adminOpen}
            onOpenChange={(open) => {
              setAdminOpen(open);
              if (open) setAdminError(null);
            }}
          >
            <DialogTrigger asChild>
              <button
                aria-label={adminAuthed ? 'Адмін' : 'Вхід в адмінку'}
                className="relative inline-flex items-center justify-center focus:outline-none transition-colors duration-300 p-1.5 sm:p-2 rounded-lg text-foreground hover:bg-eco-green-50/80 hover:shadow-sm"
              >
                <LockKeyhole size={20} className="sm:w-6 sm:h-6" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{adminAuthed ? 'Адмін доступ' : 'Вхід в адмінку'}</DialogTitle>
              </DialogHeader>

              {adminAuthed ? (
                <div className="flex items-center justify-between gap-2">
                  <Button onClick={() => { setAdminOpen(false); setIsOpen(false); navigate('/admin'); }} className="rounded-full">В адмінку</Button>
                  <Button variant="outline" onClick={() => { handleAdminLogout(); setAdminOpen(false); }} className="rounded-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Вийти
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      value={adminUsername}
                      onChange={(e) => {
                        setAdminUsername(e.target.value);
                        setAdminError(null);
                      }}
                      placeholder="Логін"
                      autoComplete="off"
                    />
                    <Input
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setAdminError(null);
                      }}
                      placeholder="Пароль"
                      type="password"
                      autoComplete="off"
                    />
                  </div>
                  {adminError ? <div className="text-sm text-destructive">{adminError}</div> : null}
                  <Button onClick={handleAdminLogin} className="rounded-full w-full">Увійти</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Link
            to="/cart"
            aria-label="Відкрити кошик"
            className="relative inline-flex items-center justify-center focus:outline-none transition-colors duration-300 p-1.5 sm:p-2 rounded-lg text-foreground hover:bg-eco-green-50/80 hover:shadow-sm"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-white text-eco-green-700 text-[10px] font-bold flex items-center justify-center border border-eco-green-100">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="focus:outline-none transition-colors duration-300 p-1.5 sm:p-2 rounded-lg text-foreground hover:bg-eco-green-50/80 hover:shadow-sm"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
          </motion.button>
        </div>
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
                  onClick={() => handleNavigation('/shop')}
                  className="block text-sm sm:text-base font-medium text-gray-900 hover:text-eco-green-600 transition-colors duration-200 w-full text-left py-1.5 hover:bg-eco-green-50/50 rounded-lg px-2"
                >
                  Магазин
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
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((v) => !v)}
                  className="w-full flex items-center justify-between font-medium text-gray-900 text-sm sm:text-base px-2 py-1.5 rounded-lg hover:bg-eco-green-50/50 transition-colors"
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mobile-services"
                >
                  <span>Послуги</span>
                  <ChevronDown className={cn('h-4 w-4 transition-transform', mobileServicesOpen ? 'rotate-180' : '')} />
                </button>

                {mobileServicesOpen ? (
                  <div id="mobile-services" className="pl-4 space-y-2">
                    {navItems.find(item => item.label === "Послуги")?.dropdown?.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.href}
                        className="block text-xs sm:text-sm text-gray-600 hover:text-eco-green-600 transition-colors duration-200 py-1.5 hover:bg-eco-green-50/50 rounded-lg px-2"
                        onClick={() => {
                          setIsOpen(false);
                          setMobileServicesOpen(false);
                        }}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
              
              {/* Contact et Devis en bas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center py-2 border-t border-gray-100"
              >
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-eco-green-500" />
                <span className="text-xs sm:text-sm text-gray-600">+380 95 683 72 38</span>
                            <div className="flex flex-col gap-1 mt-2 text-xs sm:text-sm text-gray-600">
                              <div><span className="font-semibold">Адреса:</span> м. Житомир, вул. Парникова 27</div>
                              <div><span className="font-semibold">Email:</span> info@kalaur-service.com</div>
                            </div>
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
                  Безкоштовна діагностика
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

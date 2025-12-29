import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  Briefcase,
  Stethoscope,
  Wind,
  Flame,
  HardHat,
  Bug,
  Shield,
  ArrowRight,
  Leaf,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { services } from '@/data/services'; // Assurez-vous que ce chemin est correct

const Services: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Observer pour l'animation d'apparition au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05 }
    );

    const sectionElement = document.getElementById('services');
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  // Variants д'animation pour la grille de services
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <section
      id="services"
      className="section-gap py-24 relative overflow-hidden"
    >
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-40 left-10 w-64 h-64 rounded-full bg-eco-green-100/50 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-eco-green-50/80 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 relative z-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isVisible ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.05, duration: 0.45 }}
            className="inline-flex items-center bg-eco-green-100 px-4 py-1.5 rounded-full text-eco-green-700 font-medium text-sm mb-4"
          >
            <span>Наші послуги</span>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={isVisible ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Рішення, що відповідають вашим потребам
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            animate={isVisible ? { width: '5rem' } : {}}
            transition={{ delay: 0.11, duration: 0.45 }}
            className="h-1 bg-eco-green-500 mx-auto mb-6"
          />

            <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={isVisible ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.14, duration: 0.45 }}
            className="text-muted-foreground text-center"
          >
            Дізнайтеся про наш повний спектр професійних послуг, створених для задоволення всіх ваших потреб у прибиранні та обслуговуванні.
          </motion.p>
        </motion.div>

        {/* Grille de services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
            >
              <Card
                className={cn(
                  'border-none shadow-lg hover:shadow-xl transition-all duration-500 h-full overflow-hidden group relative bg-white/80 backdrop-blur-sm',
                  'hover:scale-[1.02] hover:-translate-y-1',
                  'rounded-xl'
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Section icône */}
                <motion.div
                  className={cn(
                    'bg-gradient-to-br p-8 flex justify-center items-center transition-all duration-500',
                    service.color,
                    'h-48'
                  )}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="rounded-full bg-white/20 w-28 h-28 flex items-center justify-center transform transition-transform duration-500 relative"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    {React.createElement(service.icon, {
                      className: 'h-12 w-12 text-white',
                    })}
                    <AnimatePresence>
                      {hoveredIndex === index && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute inset-0 rounded-full border-4 border-white/20"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>

                {/* Titre & Description */}
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-2xl font-bold text-center mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-center text-foreground/80 text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                {/* Liste des fonctionnalités */}
                <CardContent>
                  <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 text-eco-green-600 mb-4">
                      <Info className="h-5 w-5" />
                      <span className="font-medium">Ключові моменти</span>
                    </div>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start"
                        >
                          <div className="mr-3 mt-1.5 flex items-center justify-center">
                            <div
                              className="h-2 w-2 rounded-full bg-eco-green-500"
                            />
                          </div>
                          <span className="text-sm text-foreground/80">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bouton CTA */}
                  <motion.div
                    className="text-center mt-6"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to={`/services/${service.id}`}>
                          <Button className="bg-eco-green-500 hover:bg-eco-green-600 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full">
                        <span className="text-sm font-medium">
                          {service.cta}
                        </span>
                        <motion.div
                          animate={hoveredIndex === index ? { x: 5 } : { x: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </motion.div>
                      </Button>
                    </Link>
                  </motion.div>
                </CardContent>

                {/* Effet décoratif au survol */}
                <motion.div
                  className="absolute top-32 right-0 w-32 h-32 bg-eco-green-100 rounded-full opacity-10 transform translate-x-16 translate-y-8"
                  animate={hoveredIndex === index ? { rotate: 360 } : {}}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Indicateur de hover */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-eco-green-500 to-transparent"
                    />
                  )}
                </AnimatePresence>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
import React from 'react';
import { useParams } from 'react-router-dom';
import { services } from '@/data/services';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Sparkles, 
  ArrowDown,
  Leaf
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  bannerImage: string;
  benefits: string[];
  process: string[];
  features: string[];
  equipment: string[];
  category?: string;
  shortDescription?: string;
}

const ServicePage = () => {
  const { id } = useParams();
  const service = services.find(s => s.id === id) as Service | undefined;

  if (!service) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center max-w-md p-8 rounded-xl bg-white shadow-lg border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Service non trouvé</h1>
          <p className="text-slate-600 mb-6">Le service que vous recherchez n'existe pas ou a été déplacé.</p>
          <Link to="/">
            <Button variant="outline" className="gap-2 group">
              Retour à l'accueil
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#FCFCFC] pt-4 sm:pt-8 md:pt-12 lg:pt-16 overflow-x-hidden"
    >
      {/* Hero Section with Glassmorphism */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-2 sm:pt-4 md:pt-6">
        <motion.div 
          variants={itemVariants}
          className="relative rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div 
            className="min-h-[320px] h-auto sm:h-[40vh] md:h-[45vh] lg:h-[55vh] xl:h-[60vh] w-full overflow-hidden relative"
            style={{
              backgroundImage: `url('${service.bannerImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Gradient Overlay - Plus foncé sur mobile pour une meilleure lisibilité */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/95" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end pb-4 sm:pb-6 md:pb-8 lg:pb-12">
              <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
                  <div className="flex h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-eco-green-500 shadow-lg">
                    <Leaf className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-wide text-white backdrop-blur-sm px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full bg-black/50 border border-white/20">
                    Service
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="bg-black/40 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl mb-2 sm:mb-3 md:mb-4 min-h-[110px] flex flex-col justify-center"
                >
                  <motion.h1 
                    variants={itemVariants}
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-lg"
                  >
                    {service.title}
                  </motion.h1>
                  <motion.p 
                    variants={fadeIn}
                    className="text-xs sm:text-sm md:text-base lg:text-lg text-white leading-relaxed max-w-2xl drop-shadow-md mt-2 sm:mt-3"
                  >
                    {service.longDescription}
                  </motion.p>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="mt-3 sm:mt-4 md:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4"
                >
                  <Link to="/contact" className="w-full sm:w-auto">
                    <Button 
                      size="default"
                      className="w-full sm:w-auto bg-white hover:bg-white/90 text-eco-green-800 rounded-full px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                        Отримати кошторис
                        <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </Link>
                  
                  <Link to="#process" className="w-full sm:w-auto">
                    <Button 
                      variant="outline"
                      size="default"
                      className="w-full sm:w-auto bg-black/50 hover:bg-black/60 border border-white/50 text-white rounded-full px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base font-medium transition-all duration-300 group"
                    >
                      <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                        Découvrir le Processus
                        <ArrowDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 transition-transform group-hover:translate-y-1" />
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-1 h-12 rounded-full bg-white/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-white animate-scroll-down" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Key Benefits Highlight */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
        >
          {service.benefits.slice(0, 3).map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md hover:shadow-lg border border-slate-100 transition-all duration-200"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-eco-green-50 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-eco-green-600" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base md:text-lg text-slate-800">Avantage {index + 1}</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-slate-600">{benefit}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Main Content with Notion-like Cards */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - Benefits & Process */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
            {/* All Benefits Card - Notion Style */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-eco-green-50 flex items-center justify-center">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-eco-green-600" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">Nos Avantages Clés</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                {service.benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-1.5 sm:gap-2 md:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-white flex items-center justify-center mt-0.5 shadow-sm border border-slate-100">
                      <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 text-eco-green-600" />
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-slate-700">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Process Card with Timeline - Notion Style */}
            <motion.div 
              id="process"
              variants={itemVariants}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-eco-green-50 flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-eco-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Notre Processus</h2>
              </div>
              
              <div className="relative">
                {/* Timeline */}
                <div className="absolute left-3 sm:left-4 lg:left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
                <ul className="space-y-6 sm:space-y-8 lg:space-y-12">
                  {service.process.map((step, index) => (
                    <motion.li 
                      key={index}
                      variants={itemVariants}
                      className="relative pl-8 sm:pl-10 lg:pl-12"
                    >
                      <div className="absolute left-0 top-1 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full bg-white border-2 border-eco-green-100 flex items-center justify-center shadow-sm z-10">
                        <span className="text-eco-green-700 font-medium text-xs sm:text-sm lg:text-base">{index + 1}</span>
                      </div>
                      <div className="bg-slate-50 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:bg-slate-100 transition-all duration-200">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1 sm:mb-2">
                          Étape {index + 1}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600">{step}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 lg:sticky lg:top-24 lg:self-start">
            {/* Features Card - Notion Style */}
            <motion.div 
              variants={itemVariants}
              className="bg-eco-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-eco-green-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-eco-green-600" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">Ce service comprend</h2>
              </div>
              
              <ul className="space-y-2 sm:space-y-3">
                {service.features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-2 sm:gap-3 text-slate-700 group"
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-eco-green-600" />
                    </div>
                    <span className="text-sm sm:text-base group-hover:text-slate-900 transition-colors duration-200">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Equipment Card - Notion Style */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-eco-green-50 flex items-center justify-center">
                  <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-eco-green-600" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">Nos Outils Professionnels</h2>
              </div>
              
              <div className="grid gap-2 sm:gap-3">
                {service.equipment.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl transition-all duration-200 hover:bg-slate-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-eco-green-500" />
                    <span className="text-sm sm:text-base text-slate-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom Animation for Page */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        .animate-scroll-down {
          animation: scroll-down 1.5s ease-in-out infinite;
        }
      `}} />
    </motion.div>
  );
};

export default ServicePage;
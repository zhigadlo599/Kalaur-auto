import React, { useState, useMemo, useEffect } from 'react';
import { Leaf, Search, Calendar, User } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Дані статей (можна замінити на API пізніше)
const blogPosts = [
  {
    title: "Як правильно обслуговувати дизельний двигун вантажівки",
    author: "Сергій Коваленко",
    date: "15 Грудня 2025",
    category: "Технічне обслуговування",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1920",
    slug: "diesel-engine-maintenance",
    excerpt: "Регулярне ТО дизельного двигуна - запорука довгого терміну служби вашої вантажівки. Поради від експертів."
  },
  {
    title: "Ознаки зношування гальмівної системи: коли час на ремонт",
    author: "Олексій Мельник",
    date: "10 Грудня 2025",
    category: "Безпека",
    image: "https://images.unsplash.com/photo-1632823469850-464a8be0496b?auto=format&fit=crop&q=80&w=1920",
    slug: "brake-system-warning-signs",
    excerpt: "Дізнайтеся про критичні симптоми проблем з гальмами, які не можна ігнорувати."
  },
  {
    title: "Вибір правильного моторного масла для вантажного автомобіля",
    author: "Ігор Петренко",
    date: "5 Грудня 2025",
    category: "Технічне обслуговування",
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=1920",
    slug: "choosing-engine-oil",
    excerpt: "Від правильного вибору масла залежить ресурс двигуна. Гід по вибору оптимального мастила."
  },
  {
    title: "Топ-5 причин несправностей турбокомпресора",
    author: "Максим Ткаченко",
    date: "1 Грудня 2025",
    category: "Діагностика",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1920",
    slug: "turbo-problems",
    excerpt: "Турбіна - дороге обладнання. Дізнайтеся про основні причини виходу з ладу та як їх запобігти."
  },
  {
    title: "Підготовка вантажівки до зими: чек-лист",
    author: "Андрій Савченко",
    date: "28 Листопада 2025",
    category: "Сезонне обслуговування",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=1920",
    slug: "winter-truck-preparation",
    excerpt: "Повний чек-лист підготовки вантажного автомобіля до зимової експлуатації."
  },
  {
    title: "Діагностика пневматичної підвіски: що потрібно знати",
    author: "Віталій Романенко",
    date: "22 Листопада 2025",
    category: "Діагностика",
    image: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&q=80&w=1920",
    slug: "pneumatic-suspension-diagnostics",
    excerpt: "Особливості діагностики та ремонту пневмопідвіски вантажних автомобілів."
  },
  {
    title: "Коли потрібна заміна зчеплення: симптоми і рекомендації",
    author: "Дмитро Кравченко",
    date: "18 Листопада 2025",
    category: "Ремонт",
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1920",
    slug: "clutch-replacement-signs",
    excerpt: "Як розпізнати зношене зчеплення та чому важливо не затягувати з ремонтом."
  },
  {
    title: "Економія палива: 10 практичних порад для водіїв вантажівок",
    author: "Юрій Семенов",
    date: "12 Листопада 2025",
    category: "Економія",
    image: "https://images.unsplash.com/photo-1632823470677-9d1337baf635?auto=format&fit=crop&q=80&w=1920",
    slug: "fuel-economy-tips",
    excerpt: "Перевірені способи зменшення витрати палива без втрати продуктивності."
  },
  {
    title: "Електрична система вантажівки: найчастіші несправності",
    author: "Володимир Лисенко",
    date: "8 Листопада 2025",
    category: "Діагностика",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1920",
    slug: "electrical-system-problems",
    excerpt: "Огляд типових електричних проблем та методів їх вирішення."
  },
  {
    title: "Важливість регулярного технічного огляду для вантажівок",
    author: "Олександр Бондаренко",
    date: "2 Листопада 2025",
    category: "Технічне обслуговування",
    image: "https://images.unsplash.com/photo-1632823469850-464a8be0496b?auto=format&fit=crop&q=80&w=1920",
    slug: "importance-of-regular-maintenance",
    excerpt: "Чому регулярне ТО економить ваші гроші та продовжує термін служби техніки."
  }
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("Всі категорії");
  const [searchQuery, setSearchQuery] = useState("");
  const [isChrome, setIsChrome] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Виявлення Chrome
    const isChromeBrowser = /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
    setIsChrome(isChromeBrowser);
    setMounted(true);
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(blogPosts.map(post => post.category));
    return ["Всі категорії", ...Array.from(uniqueCategories)];
  }, []);

  const filteredPosts = useMemo(() => {
    if (!mounted) return [];
    
    return blogPosts.filter(post => {
      const matchesCategory = selectedCategory === "Всі категорії" || post.category === selectedCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.category.toLowerCase().includes(searchLower);
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, mounted]);

  const handleCategoryChange = (value: string) => {
    if (isChrome) {
      // Pour Chrome, on utilise requestAnimationFrame pour éviter les problèmes de rendu
      requestAnimationFrame(() => {
        setSelectedCategory(value);
      });
    } else {
      setSelectedCategory(value);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isChrome) {
      requestAnimationFrame(() => {
        setSearchQuery(e.target.value);
      });
    } else {
      setSearchQuery(e.target.value);
    }
  };

  const handleResetFilters = () => {
    if (isChrome) {
      requestAnimationFrame(() => {
        setSelectedCategory("Всі категорії");
        setSearchQuery("");
      });
    } else {
      setSelectedCategory("Всі категорії");
      setSearchQuery("");
    }
  };

  // Si le composant n'est pas encore monté, on affiche un état de chargement
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-eco-green-50/30 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-eco-green-50/30 pt-24">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-20 md:py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center bg-eco-green-100 px-4 py-2 rounded-full text-eco-green-700 font-medium text-sm mb-4">
              <Leaf className="mr-2 h-4 w-4" />
              <span>Наш блог</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Статті та новини
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Останні статті про екологічне прибирання, професійні методики та інновації галузі.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Пошук статті..."
                  className="pl-10 bg-white/80 backdrop-blur-sm border-eco-green-100 focus:border-eco-green-300"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Select 
                value={selectedCategory} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full sm:w-[200px] bg-white/80 backdrop-blur-sm border-eco-green-100 focus:border-eco-green-300">
                  <SelectValue placeholder="Категорія" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className={isChrome ? "will-change-transform" : ""}>
          {filteredPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-sm text-white/90 mb-2">{post.category}</div>
                        <h2 className="text-xl font-semibold text-white line-clamp-2">
                          {post.title}
                        </h2>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <Button
                        variant="ghost"
                        className="text-eco-green-600 hover:text-eco-green-700 hover:bg-eco-green-50/50"
                      >
                        Читати далі
                      </Button>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-600 text-lg mb-4">
                Немає статей, що відповідають вашому запиту.
              </p>
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="text-eco-green-600 hover:text-eco-green-700"
              >
                Скинути фільтри
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog; 
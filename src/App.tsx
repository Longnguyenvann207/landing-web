/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, createContext, useContext, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";
import { CookieConsent } from './components/CookieConsent';
import ReCAPTCHA from 'react-google-recaptcha';
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  TrendingUp, 
  Users, 
  Wrench, 
  CheckCircle2, 
  MessageCircle, 
  MessageSquare,
  Search,
  HelpCircle,
  Plus,
  Minus,
  Send,
  Phone,
  User,
  Settings,
  Menu,
  X,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ClipboardList,
  Headphones,
  Award,
  ArrowRight,
  AlertCircle,
  Clock,
  Globe,
  ArrowUp,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from './translations';

// --- Types ---
type Language = 'vi' | 'en';
type Theme = 'dark' | 'light';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => any;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

// --- Constants ---
const ZALO_LINK = 'https://zalo.me/0334063029';
const PHONE_NUMBER = '0334063029';

const TESTIMONIALS = [
  {
    name: "Trần Minh Tâm",
    role: "Kinh doanh Online",
    content: "Dịch vụ unlock tài khoản cực nhanh. Mình bị khóa FB Ads mà team xử lý chỉ trong 15 phút. Rất chuyên nghiệp!",
    rating: 5
  },
  {
    name: "Lê Hoàng Nam",
    role: "TikToker",
    content: "Kênh TikTok của mình tăng trưởng vượt bậc sau khi sử dụng dịch vụ seeding và tư vấn của Sky Luxury Media. Cảm ơn team!",
    rating: 5
  },
  {
    name: "Nguyễn Thùy Chi",
    role: "Chủ Shop Thời Trang",
    content: "Bảo mật thông tin tuyệt đối là điều mình thích nhất ở đây. Tool MMO chạy rất mượt, giúp mình tiết kiệm nhiều thời gian.",
    rating: 5
  }
];

const STATS = [
  { label: "Tài khoản mở khóa", value: "5,000+", icon: <Lock size={24} /> },
  { label: "Chiến dịch seeding", value: "10,000+", icon: <Users size={24} /> },
  { label: "Hỗ trợ kỹ thuật", value: "24/7", icon: <Headphones size={24} /> },
  { label: "Khách hàng hài lòng", value: "99%", icon: <Award size={24} /> },
];

const PROCESS = [
  { title: "Tiếp nhận", desc: "Kiểm tra tình trạng tài khoản/yêu cầu.", icon: <ClipboardList size={28} /> },
  { title: "Tư vấn", desc: "Đưa ra giải pháp & báo giá chi tiết.", icon: <MessageCircle size={28} /> },
  { title: "Xử lý", desc: "Kỹ thuật viên thực hiện (5-30 phút).", icon: <Zap size={28} /> },
  { title: "Bàn giao", desc: "Kiểm tra kết quả & bảo hành.", icon: <CheckCircle2 size={28} /> },
];

const FAQS = [
  { 
    q: "Làm sao để tin tưởng giao tài khoản?", 
    a: "Chúng tôi cam kết bảo mật tuyệt đối thông tin khách hàng. Sử dụng tool riêng chuyên dụng, không qua trung gian, đảm bảo an toàn 100% cho tài khoản của bạn." 
  },
  { 
    q: "Nếu không thành công có mất tiền không?", 
    a: "Sky Luxury Media cam kết: Không thành công - Không thu phí. Chúng tôi sẽ hoàn trả 100% số tiền ngay lập tức nếu không xử lý được vấn đề." 
  },
  { 
    q: "Thời gian xử lý trung bình là bao lâu?", 
    a: "Thời gian xử lý trung bình từ 5–30 phút tùy vào tình trạng tài khoản và độ phức tạp của yêu cầu." 
  },
  { 
    q: "Có bảo hành sau khi mở khóa không?", 
    a: "Tất cả các dịch vụ tại Sky Luxury Media đều có chế độ bảo hành và hỗ trợ kỹ thuật sau khi bàn giao để khách hàng yên tâm sử dụng." 
  }
];

const SOCIAL_PROOFS = [
  "Anh Nam vừa mở khóa thành công tài khoản Facebook - 2 phút trước",
  "Chị Lan vừa tăng 5,000 follow TikTok - 5 phút trước",
  "Anh Tuấn vừa mua Tool MMO Pro - 10 phút trước",
  "Shop Bé Xinh vừa hoàn thành gói Seeding - 15 phút trước"
];

const TopBanner = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-luxury-gold text-luxury-black py-2 overflow-hidden whitespace-nowrap relative z-[101]">
      <div className="flex animate-marquee-text">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-xs font-black uppercase tracking-widest px-8">
            {t('topBanner')}
          </span>
        ))}
      </div>
    </div>
  );
};

const BackgroundParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const count = 30;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(particle);
    }
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
};

const BentoGrid = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase">{t('bento.title')}</h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Large Item */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 lg:row-span-2 bento-item bg-luxury-gold/5 border-luxury-gold/20 tilt-card"
          >
            <div className="p-4 bg-luxury-gold/10 rounded-2xl w-fit mb-6 text-luxury-gold">
              <ShieldCheck size={40} />
            </div>
            <div>
              <h3 className="text-3xl font-black mb-4">{t('bento.exclusiveTool')}</h3>
              <p className="text-white/60 text-lg leading-relaxed">
                {t('bento.exclusiveToolDesc')}
              </p>
            </div>
          </motion.div>

          {/* Medium Item */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bento-item tilt-card"
          >
            <div className="flex items-center gap-6">
              <div className="p-3 bg-luxury-neon/10 rounded-2xl text-luxury-neon">
                <Clock size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black">{t('bento.fastProcess')}</h3>
                <p className="text-white/40 text-sm">{t('bento.fastProcessDesc')}</p>
              </div>
            </div>
          </motion.div>

          {/* Small Item */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bento-item tilt-card"
          >
            <div className="p-3 bg-white/5 rounded-2xl w-fit text-white mb-4">
              <Globe size={24} />
            </div>
            <h3 className="text-lg font-black">{t('bento.globalSupport')}</h3>
          </motion.div>

          {/* Small Item */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bento-item tilt-card"
          >
            <div className="p-3 bg-luxury-gold/10 rounded-2xl w-fit text-luxury-gold mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-lg font-black">{t('bento.experience')}</h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const KeySellingPointsBento = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase">{t('keySellingPoints.title')}</h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: t('keySellingPoints.professionalTeam'), desc: t('keySellingPoints.professionalTeamDesc'), icon: <Users size={32} /> },
            { title: t('keySellingPoints.fastDelivery'), desc: t('keySellingPoints.fastDeliveryDesc'), icon: <Zap size={32} /> },
            { title: t('keySellingPoints.competitivePricing'), desc: t('keySellingPoints.competitivePricingDesc'), icon: <TrendingUp size={32} /> },
            { title: t('keySellingPoints.dedicatedSupport'), desc: t('keySellingPoints.dedicatedSupportDesc'), icon: <Headphones size={32} /> },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bento-item tilt-card"
            >
              <div className="p-4 bg-luxury-gold/10 rounded-2xl w-fit mb-6 text-luxury-gold">
                {item.icon}
              </div>
              <h3 className="text-xl font-black mb-2">{item.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MockTool = () => {
  const [inputValue, setInputValue] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<null | 'success' | 'warning'>(null);
  const { t } = useTranslation();

  const handleCheck = () => {
    if (!inputValue) return;
    setIsChecking(true);
    setResult(null);
    
    setTimeout(() => {
      setIsChecking(false);
      const isSuccess = Math.random() > 0.3;
      setResult(isSuccess ? 'success' : 'warning');
      
      if (isSuccess) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#00F3FF', '#FFFFFF']
        });
      }
    }, 3000);
  };

  return (
    <section className="py-24 bg-luxury-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-glass p-8 md:p-12 rounded-[3rem] border-luxury-neon/20 relative overflow-hidden">
          {isChecking && <div className="animate-scanning-bar" />}
          
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Search size={120} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4 flex items-center gap-3">
              <Search className="text-luxury-neon" />
              {t('mockTool.title')}
            </h2>
            <p className="text-white/50 mb-8">{t('mockTool.desc')}</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder={t('mockTool.placeholder')}
                aria-label="Enter account link or ID"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-luxury-neon outline-none transition-all"
              />
              <button 
                onClick={handleCheck}
                disabled={isChecking}
                className="px-8 py-4 bg-luxury-neon text-luxury-black font-black rounded-2xl glow-neon hover:scale-105 transition-all disabled:opacity-50"
              >
                {isChecking ? t('mockTool.btnAnalyze') : t('mockTool.btnCheck')}
              </button>
            </div>

            <AnimatePresence>
              {isChecking && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 p-6 bg-luxury-neon/5 border border-luxury-neon/20 rounded-2xl flex items-center gap-4"
                >
                  <div className="w-6 h-6 border-4 border-luxury-neon/30 border-t-luxury-neon rounded-full animate-spin" />
                  <span className="text-luxury-neon font-bold">{t('mockTool.scanning')}</span>
                </motion.div>
              )}

              {result === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-luxury-green/10 border border-luxury-green/20 rounded-2xl flex items-center gap-4"
                >
                  <CheckCircle2 className="text-luxury-green" size={28} />
                  <div>
                    <h4 className="text-luxury-green font-black">{t('mockTool.successTitle')}</h4>
                    <p className="text-white/50 text-sm">{t('mockTool.successDesc')}</p>
                  </div>
                </motion.div>
              )}

              {result === 'warning' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-luxury-gold/10 border border-luxury-gold/20 rounded-2xl flex items-center gap-4"
                >
                  <AlertCircle className="text-luxury-gold" size={28} />
                  <div>
                    <h4 className="text-luxury-gold font-black">{t('mockTool.warningTitle')}</h4>
                    <p className="text-white/50 text-sm">{t('mockTool.warningDesc')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Components ---

const PRICING = [
  {
    name: "Cơ bản",
    price: "500.000đ",
    features: ["Mở khóa 1 tài khoản", "Hỗ trợ 24/7", "Bảo hành 7 ngày", "Tư vấn bảo mật"],
    isPopular: false
  },
  {
    name: "Chuyên nghiệp",
    price: "1.500.000đ",
    features: ["Mở khóa 3 tài khoản", "Ưu tiên xử lý nhanh", "Bảo hành 30 ngày", "Tặng Tool Seeding", "Tư vấn xây kênh"],
    isPopular: true
  },
  {
    name: "Doanh nghiệp",
    price: "Liên hệ",
    features: ["Số lượng không giới hạn", "Kỹ thuật viên riêng", "Bảo hành vĩnh viễn", "Hệ thống Tool MMO Pro", "Hỗ trợ API"],
    isPopular: false
  }
];

const PAYMENTS = [
  { name: "Vietcombank", logo: "https://img.mservice.com.vn/app/img/payment/vcb.png" },
  { name: "Momo", logo: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" },
  { name: "MB Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_MB_Bank.png/1200px-Logo_MB_Bank.png" },
  { name: "Binance", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Binance_Logo.png/1200px-Binance_Logo.png" },
];

const SOCIAL_LINKS = [
  { name: 'Facebook', Icon: Facebook, href: 'https://facebook.com/skyluxurymedia' },
  { name: 'Instagram', Icon: Instagram, href: 'https://instagram.com/skyluxurymedia' },
  { name: 'LinkedIn', Icon: Linkedin, href: 'https://linkedin.com/company/skyluxurymedia' },
  { name: 'Twitter', Icon: Twitter, href: 'https://twitter.com/skyluxurymedia' },
];

// --- Components ---

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setTimeout(() => {
        setDotPosition({ x: e.clientX, y: e.clientY });
      }, 50);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div className="hidden lg:block">
      <div 
        className="custom-cursor" 
        style={{ left: `${position.x}px`, top: `${position.y}px`, transform: 'translate(-50%, -50%)' }}
      />
      <div 
        className="custom-cursor-dot" 
        style={{ left: `${dotPosition.x}px`, top: `${dotPosition.y}px`, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
};

const ScrollProgress = () => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScroll(scrolled);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="scroll-progress">
      <div className="scroll-progress-bar" style={{ width: `${scroll}%` }} />
    </div>
  );
};

const ReadingProgressBar = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollProgress = (totalScroll / windowHeight) * 100;
      setWidth(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-1 bg-luxury-gold z-[1000] transition-all duration-300" style={{ width: `${width}%` }} />
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '#home' },
    { name: t('nav.services'), href: '#services' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-luxury-black/80 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="#" className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <Zap className="text-luxury-gold" size={28} />
          <span>SKY LUXURY <span className="text-luxury-gold">MEDIA</span></span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-bold uppercase tracking-widest hover:text-luxury-gold transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-white/10 pl-10">
            {/* Language Switcher */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setLang('vi')}
                aria-label="Switch language to Vietnamese"
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'vi' ? 'bg-luxury-gold text-luxury-black shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                VN
              </button>
              <button 
                onClick={() => setLang('en')}
                aria-label="Switch language to English"
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${lang === 'en' ? 'bg-luxury-gold text-luxury-black shadow-lg' : 'text-white/40 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 bg-white/5 rounded-xl border border-white/5 text-luxury-gold hover:scale-110 transition-all"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Social Icons (Desktop) */}
            <div className="hidden xl:flex items-center gap-3 border-l border-white/10 pl-4">
              {SOCIAL_LINKS.map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${social.name} page`}
                  className="text-white/40 hover:text-luxury-gold transition-all hover:scale-110"
                >
                  <social.Icon size={20} />
                </a>
              ))}
            </div>

            <a 
              href="#contact" 
              className="px-6 py-3 bg-luxury-gold text-luxury-black font-black text-xs rounded-xl uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-luxury-gold/20"
            >
              {t('nav.support')}
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-luxury-black border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xl font-black uppercase tracking-widest text-center"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex justify-center gap-4 pt-4">
                <button onClick={() => setLang('vi')} className={`px-4 py-2 rounded-xl font-black ${lang === 'vi' ? 'bg-luxury-gold text-luxury-black' : 'bg-white/5'}`}>VN</button>
                <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-xl font-black ${lang === 'en' ? 'bg-luxury-gold text-luxury-black' : 'bg-white/5'}`}>EN</button>
                <button onClick={toggleTheme} className="p-3 bg-white/5 rounded-xl text-luxury-gold">
                  {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                </button>
              </div>

              {/* Social Icons (Mobile) */}
              <div className="flex justify-center gap-6 pt-4">
                {SOCIAL_LINKS.map((social) => (
                  <a 
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-luxury-gold transition-all"
                  >
                    <social.Icon size={28} />
                  </a>
                ))}
              </div>

              <a 
                href="#contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full py-5 bg-luxury-gold text-luxury-black font-black text-center rounded-2xl uppercase tracking-widest"
              >
                {t('nav.support')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const PricingSection = () => {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(false);
  const plans = t('pricing.plans');
  
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter">{t('pricing.title')}</h2>
          
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-bold ${!isYearly ? 'text-luxury-gold' : 'text-white/40'}`}>{t('pricing.monthly')}</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              role="switch"
              aria-checked={isYearly}
              aria-label="Toggle between monthly and yearly pricing"
              className="w-16 h-8 bg-white/5 border border-white/10 rounded-full relative p-1 transition-all"
            >
              <motion.div 
                animate={{ x: isYearly ? 32 : 0 }}
                className="w-6 h-6 bg-luxury-gold rounded-full shadow-lg"
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${isYearly ? 'text-luxury-gold' : 'text-white/40'}`}>{t('pricing.yearly')}</span>
              <span className="px-2 py-1 bg-luxury-gold/10 text-luxury-gold text-[10px] font-black rounded-lg uppercase tracking-widest animate-pulse">
                {t('pricing.save')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 rounded-[3rem] border ${i === 1 ? 'bg-luxury-gold/5 border-luxury-gold glow-gold' : 'bg-glass border-white/5'} relative flex flex-col group hover:border-luxury-gold/30 transition-all`}
            >
              {i === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-luxury-gold text-luxury-black text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-xl">
                  {t('pricing.popular')}
                </div>
              )}
              <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter">{plan.name}</h3>
              <div className="mb-8">
                <span className="text-5xl font-black text-luxury-gold tracking-tighter">
                  {isYearly ? plan.priceYearly : plan.priceMonthly}
                </span>
                {plan.priceMonthly !== t('pricing.contact') && (
                  <span className="text-white/40 text-sm font-bold ml-2 uppercase tracking-widest">
                    / {isYearly ? t('pricing.yearly') : t('pricing.monthly')}
                  </span>
                )}
              </div>
              <ul className="space-y-5 mb-12 flex-grow">
                {plan.features.map((f: string, j: number) => (
                  <li key={j} className="flex items-center gap-4 text-white/60 group-hover:text-white transition-colors">
                    <div className="w-5 h-5 rounded-full bg-luxury-gold/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={12} className="text-luxury-gold" />
                    </div>
                    <span className="text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <a 
                href="#contact"
                className={`w-full py-5 rounded-2xl font-black text-center transition-all uppercase tracking-widest text-sm ${i === 1 ? 'bg-luxury-gold text-luxury-black shadow-lg shadow-luxury-gold/20 hover:scale-[1.02]' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
              >
                {t('pricing.btnSelect')}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PaymentSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 border-t border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {PAYMENTS.map((p, i) => (
            <img key={i} src={p.logo} alt={p.name} className="h-8 md:h-12 object-contain" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
          ))}
        </div>
      </div>
    </section>
  );
};

const TrustSection = () => {
  const { t } = useTranslation();
  const logos = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png",
    "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/1200px-TikTok_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/1200px-2021_Facebook_icon.svg.png"
  ];

  return (
    <section className="py-20 border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-black text-luxury-gold uppercase tracking-[0.3em] mb-4">{t('trust.title')}</h2>
          <p className="text-white/40 text-xs uppercase tracking-widest">{t('trust.subtitle')}</p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          {logos.map((logo, i) => (
            <img key={i} src={logo} alt="Partner" className="h-8 md:h-10 object-contain" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
          ))}
        </div>
      </div>
    </section>
  );
};

const CaseStudiesSection = () => {
  const { t } = useTranslation();
  const cases = t('caseStudies.items');

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">{t('caseStudies.title')}</h2>
          <p className="text-white/40 uppercase tracking-widest text-xs">{t('caseStudies.desc')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((c: any, i: number) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 bg-glass rounded-[3rem] border border-white/5 group hover:border-luxury-gold/30 transition-all"
            >
              <div className="w-12 h-12 bg-luxury-gold/10 text-luxury-gold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-black mb-4">{c.title}</h3>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-green/10 text-luxury-green rounded-full text-xs font-bold">
                <CheckCircle2 size={14} />
                {c.result}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BlogSection = () => {
  const { t } = useTranslation();
  const posts = t('blog.posts');

  return (
    <section className="py-24 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">{t('blog.title')}</h2>
            <div className="w-24 h-1 bg-luxury-gold rounded-full" />
          </div>
          <button className="flex items-center gap-2 text-luxury-gold font-bold hover:gap-4 transition-all uppercase tracking-widest text-sm">
            {t('blog.viewAll')} <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden mb-6">
                <img 
                  src={`https://picsum.photos/seed/blog${i}/800/450`} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-6 left-6 px-4 py-2 bg-luxury-black/60 backdrop-blur-md rounded-xl text-[10px] font-black text-luxury-gold uppercase tracking-widest">
                  {post.date}
                </div>
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-luxury-gold transition-colors">{post.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{post.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY') {
        throw new Error('GEMINI_API_KEY is not configured');
      }
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Use a sliding window for history to avoid token limit issues
      const history = messages.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are Sky Luxury Media's AI assistant. You help customers with social media services (unlocking FB/TikTok, seeding, MMO tools). Be professional, elite, and helpful. Keep answers concise. If asked about prices, refer to the pricing section. If asked for direct support, suggest Zalo or the contact form.",
          maxOutputTokens: 1000
        },
        history: history
      });

      const response = await chat.sendMessage({ message: userMsg });
      
      setMessages(prev => [...prev, { role: 'ai', text: response.text || t('aiChat.error') }]);
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      let errorMsg = t('aiChat.error');
      if (error.message?.includes('Failed to fetch')) {
        errorMsg = t('aiChat.networkError') || 'Network error. Please check your connection.';
      } else if (error.message?.includes('not configured')) {
        errorMsg = t('aiChat.configError') || 'AI service is not configured yet.';
      }
      setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-8 z-[100] w-16 h-16 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all glow-gold"
      >
        <MessageSquare size={32} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[110] w-[350px] md:w-[400px] h-[500px] bg-luxury-black border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            <div className="p-6 bg-luxury-gold text-luxury-black flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-luxury-black rounded-lg flex items-center justify-center">
                  <Zap size={18} className="text-luxury-gold" />
                </div>
                <span className="font-black text-sm uppercase tracking-widest">{t('aiChat.title')}</span>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={24} /></button>
            </div>

            <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 custom-scrollbar">
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-sm text-white/80">
                {t('aiChat.welcome')}
              </div>
              
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-luxury-gold text-luxury-black rounded-tr-none font-bold' : 'bg-white/5 text-white/80 rounded-tl-none'}`}>
                    <div className="markdown-body">
                      <Markdown>{m.text}</Markdown>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-xs text-white/40 italic">
                    {t('aiChat.thinking')}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('aiChat.placeholder')}
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-luxury-gold transition-all"
              />
              <button 
                onClick={handleSend}
                className="w-10 h-10 bg-luxury-gold text-luxury-black rounded-xl flex items-center justify-center hover:scale-105 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HumanSupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'support', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isConnecting]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    // Simulate support response
    setIsConnecting(true);
    setTimeout(() => {
        setIsConnecting(false);
        setMessages(prev => [...prev, { role: 'support', text: "Thank you for your message. An agent will be with you shortly." }]);
    }, 2000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-8 z-[100] w-16 h-16 bg-luxury-gold text-luxury-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all glow-gold"
      >
        <Headphones size={32} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-48 right-8 z-[100] w-96 h-[500px] bg-luxury-black border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <span className="font-black text-sm uppercase tracking-widest">{t('humanSupport.title')}</span>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white"><X size={20} /></button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-4" ref={scrollRef}>
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none max-w-[80%]">{t('humanSupport.welcome')}</div>
              {messages.map((m, i) => (
                <div key={i} className={`p-4 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-luxury-gold text-luxury-black ml-auto rounded-tr-none' : 'bg-white/5 rounded-tl-none'}`}>
                  {m.text}
                </div>
              ))}
              {isConnecting && <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none max-w-[80%]">{t('humanSupport.connecting')}</div>}
            </div>
            <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('humanSupport.placeholder')}
                className="flex-grow bg-transparent outline-none text-sm"
              />
              <button onClick={handleSend} className="text-luxury-gold"><Send size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !localStorage.getItem('exit_intent_shown')) {
        setIsVisible(true);
        localStorage.setItem('exit_intent_shown', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-luxury-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-glass border border-luxury-gold/30 p-10 rounded-[3rem] text-center relative overflow-hidden"
      >
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-luxury-gold/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-luxury-gold/10 rounded-full blur-3xl" />
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-20 h-20 bg-luxury-gold/10 text-luxury-gold rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Zap size={40} fill="currentColor" />
        </div>

        <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">{t('exitIntent.title')}</h2>
        <p className="text-white/60 mb-8 leading-relaxed">{t('exitIntent.desc')}</p>

        <div className="bg-white/5 border border-dashed border-luxury-gold/40 p-6 rounded-2xl mb-8">
          <span className="text-sm text-white/40 uppercase tracking-widest block mb-2">Mã ưu đãi</span>
          <span className="text-3xl font-black text-luxury-gold tracking-widest">{t('exitIntent.code')}</span>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="w-full py-5 bg-luxury-gold text-luxury-black font-black text-xl rounded-2xl glow-gold hover:scale-[1.02] transition-all mb-4"
        >
          {t('exitIntent.cta')}
        </button>
        
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/30 text-sm font-bold hover:text-white transition-colors uppercase tracking-widest"
        >
          {t('exitIntent.close')}
        </button>
      </motion.div>
    </div>
  );
};

const Hero = memo(() => {
  const title = "SKY LUXURY MEDIA";
  const { t } = useTranslation();
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Video Background */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-gold-particles-moving-slowly-32616-large.mp4" type="video/mp4" />
      </video>
      
      {/* Overlays */}
      <div className="absolute inset-0 video-overlay z-[1]" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-[2]" />
      
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[120px] animate-pulse z-[3]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-luxury-neon/5 rounded-full blur-[120px] animate-pulse z-[3]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-block mb-8 px-6 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-full backdrop-blur-md"
        >
          <span className="text-luxury-gold font-bold tracking-widest text-xs uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-luxury-gold rounded-full animate-ping" />
            {t('hero.tag')}
          </span>
        </motion.div>

        <div className="mb-8">
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black leading-tight tracking-tighter flex flex-wrap justify-center gap-x-4"
          >
            {title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                className={word === "MEDIA" ? "text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold text-glow-gold" : (useTheme().theme === 'light' ? 'text-luxury-black' : 'text-white')}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
        >
          {t('hero.desc')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a 
            href="#contact" 
            className="group relative px-12 py-6 bg-luxury-gold text-luxury-black font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 animate-shimmer shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('hero.ctaConsult')} <ArrowRight size={20} />
            </span>
          </a>
          <a 
            href="#services" 
            className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            {t('hero.ctaServices')}
          </a>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-8 text-white/40 text-sm font-bold uppercase tracking-widest"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-luxury-green rounded-full" />
            <span>1,240 {t('hero.statsOnline')}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
            <span>98% {t('hero.statsSuccess')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

const ExploreServicesCTA = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-luxury-gold/5 border-y border-luxury-gold/10">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">
          {t('ctaSection.title')}
        </h2>
        <p className="text-xl text-white/60 mb-10 leading-relaxed">
          {t('ctaSection.desc')}
        </p>
        <a 
          href="#services" 
          className="inline-block px-12 py-6 bg-luxury-gold text-luxury-black font-black rounded-2xl hover:scale-105 transition-all shadow-lg shadow-luxury-gold/20 uppercase tracking-widest"
        >
          {t('ctaSection.btn')}
        </a>
      </div>
    </section>
  );
};

const QuickService = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-luxury-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-glass p-8 md:p-12 rounded-[2rem] border-luxury-gold/20 relative overflow-hidden"
        >
          {/* Online Status */}
          <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-luxury-green/10 border border-luxury-green/20 rounded-full">
            <div className="w-2.5 h-2.5 bg-luxury-green rounded-full relative">
              <div className="absolute inset-0 bg-luxury-green rounded-full animate-pulse-ring" />
            </div>
            <span className="text-xs font-bold text-luxury-green uppercase tracking-wider">{t('quickService.online')}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                {t('quickService.title')} <br />
                <span className="text-luxury-gold">{t('quickService.time')}</span>
              </h2>
              <p className="text-white/60 mb-8 text-lg">
                {t('quickService.desc')}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {['Facebook', 'TikTok', 'Gmail', 'Ads'].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <CheckCircle2 className="text-luxury-gold" size={20} />
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-5 p-6 bg-luxury-gold/5 rounded-3xl border border-luxury-gold/10">
                <div className="p-3 bg-luxury-gold/20 rounded-2xl text-luxury-gold">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1">{t('quickService.refund')}</h4>
                  <p className="text-white/50 text-sm">{t('quickService.refundDesc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-6 bg-luxury-neon/5 rounded-3xl border border-luxury-neon/10">
                <div className="p-3 bg-luxury-neon/20 rounded-2xl text-luxury-neon">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1">{t('quickService.security')}</h4>
                  <p className="text-white/50 text-sm">{t('quickService.securityDesc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="p-3 bg-white/10 rounded-2xl text-white">
                  <Settings size={24} />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1">{t('quickService.tool')}</h4>
                  <p className="text-white/50 text-sm">{t('quickService.toolDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const { t } = useTranslation();
  const services = [
    {
      title: t('services.unlock.title'),
      desc: t('services.unlock.desc'),
      features: t('services.unlock.features'),
      icon: <Lock size={32} />,
      color: "luxury-gold"
    },
    {
      title: t('services.tiktok.title'),
      desc: t('services.tiktok.desc'),
      features: t('services.tiktok.features'),
      icon: <TrendingUp size={32} />,
      color: "luxury-neon"
    },
    {
      title: t('services.seeding.title'),
      desc: t('services.seeding.desc'),
      features: t('services.seeding.features'),
      icon: <Users size={32} />,
      color: "luxury-gold"
    },
    {
      title: t('services.mmo.title'),
      desc: t('services.mmo.desc'),
      features: t('services.mmo.features'),
      icon: <Wrench size={32} />,
      color: "white"
    }
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">{t('services.title')}</h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 bg-glass rounded-[2.5rem] border border-white/5 hover:border-luxury-gold/40 transition-all group flex flex-col h-full"
            >
              <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-${s.color} group-hover:scale-110 transition-transform shadow-xl`}>
                {s.icon}
              </div>
              <h3 className="text-2xl font-black mb-4">{s.title}</h3>
              <p className="text-white/50 leading-relaxed mb-6 text-sm">
                {s.desc}
              </p>
              
              <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
                {Array.isArray(s.features) && s.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-bold text-white/70">
                    <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();
  const testimonials = t('testimonials.list');

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase">{t('testimonials.title')}</h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-glass p-10 md:p-16 rounded-[3rem] border-white/5 relative text-center"
            >
              <Quote className="absolute top-8 left-8 text-luxury-gold/20" size={60} />
              
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="fill-luxury-gold text-luxury-gold" />
                ))}
              </div>

              <p className="text-xl md:text-2xl italic text-white/80 mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>

              <div>
                <h4 className="text-xl font-black text-luxury-gold">{testimonials[currentIndex].name}</h4>
                <p className="text-white/40 uppercase tracking-widest text-xs mt-1">{testimonials[currentIndex].role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center gap-6 mt-12">
            <button 
              onClick={prev}
              className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-luxury-gold hover:text-luxury-black transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={next}
              className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-luxury-gold hover:text-luxury-black transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-luxury-gold' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Unlock tài khoản'
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; recaptcha?: string }>({});
  const { t } = useTranslation();

  const validate = () => {
    const newErrors: { name?: string; phone?: string; recaptcha?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = t('contact.errorName');
    }
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!formData.phone.trim()) {
      newErrors.phone = t('contact.errorPhoneEmpty');
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = t('contact.errorPhoneInvalid');
    }
    if (import.meta.env.VITE_RECAPTCHA_SITE_KEY && !recaptchaToken) {
      newErrors.recaptcha = 'Vui lòng xác thực reCAPTCHA';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, recaptchaToken})
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', service: 'Unlock tài khoản' });
        setRecaptchaToken(null);
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        setStatus('error');
      }
    } catch (err) {
      console.error('Contact Form Error:', err);
      setStatus('error');
    } finally {
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className="py-24 bg-luxury-black relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-glass p-10 md:p-16 rounded-[3rem] border-white/5 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 uppercase">{t('contact.title')}</h2>
            <p className="text-white/50">{t('contact.desc') || 'Để lại thông tin, chúng tôi sẽ liên hệ lại ngay lập tức.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">{t('contact.name')}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                  <input 
                    required
                    type="text" 
                    placeholder={t('contact.placeholderName') || 'Nguyễn Văn A'}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      if (errors.name) setErrors({...errors, name: undefined});
                    }}
                    className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-2xl py-4 pl-12 pr-4 focus:border-luxury-gold outline-none transition-all`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase tracking-widest">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">{t('contact.phone')}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                  <input 
                    required
                    type="tel" 
                    placeholder={t('contact.placeholderPhone') || '0334xxxxxx'}
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({...formData, phone: e.target.value});
                      if (errors.phone) setErrors({...errors, phone: undefined});
                    }}
                    className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-2xl py-4 pl-12 pr-4 focus:border-luxury-gold outline-none transition-all`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase tracking-widest">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-2">{t('contact.service')}</label>
              <select 
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-luxury-gold outline-none transition-all appearance-none"
              >
                <option className="bg-luxury-black" value="Unlock tài khoản">Unlock tài khoản</option>
                <option className="bg-luxury-black" value="Tăng trưởng TikTok">Tăng trưởng TikTok</option>
                <option className="bg-luxury-black" value="Seeding Facebook">Seeding Facebook</option>
                <option className="bg-luxury-black" value="Tool MMO">Tool MMO</option>
              </select>
            </div>

            {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
              <div className="space-y-2">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={setRecaptchaToken}
                  theme="dark"
                />
                {errors.recaptcha && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase tracking-widest">{errors.recaptcha}</p>}
              </div>
            ) : (
              <p className="text-red-500 text-xs mt-2">reCAPTCHA chưa được cấu hình. Vui lòng liên hệ quản trị viên.</p>
            )}

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-5 bg-luxury-gold text-luxury-black font-black text-xl rounded-2xl glow-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <div className="w-6 h-6 border-4 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
              ) : (
                <>
                  {t('contact.btnSend')}
                  <Send size={24} />
                </>
              )}
            </button>

            {status === 'success' && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-luxury-green font-bold"
              >
                {t('contact.success')}
              </motion.p>
            )}
            {status === 'error' && (
              <p className="text-center text-red-500 font-bold">{t('contact.error') || 'Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ Zalo.'}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

const ZaloButton = () => {
  return (
    <a 
      href={ZALO_LINK} 
      target="_blank" 
      rel="noreferrer"
      className="fixed bottom-8 right-8 z-[100] group"
    >
      <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse-ring opacity-30" />
      <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-glow-pulse group-hover:scale-110 transition-transform animate-shake">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png" 
          alt="Zalo" 
          className="w-10 h-10"
          referrerPolicy="no-referrer"
          decoding="async"
        />
      </div>
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-blue-600 px-4 py-2 rounded-xl font-black text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none">
        Chat Zalo ngay!
      </div>
    </a>
  );
};

const StatsSection = () => {
  const { t } = useTranslation();
  const stats = [
    { label: t('stats.unlocked'), value: "10,000+", icon: <Lock size={24} /> },
    { label: t('stats.seeding'), value: "500+", icon: <Users size={24} /> },
    { label: t('stats.support'), value: "24/7", icon: <MessageSquare size={24} /> },
    { label: t('stats.satisfied'), value: "98%", icon: <Star size={24} /> }
  ];

  return (
    <section className="py-20 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex p-4 bg-luxury-gold/10 rounded-2xl text-luxury-gold mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const { t } = useTranslation();
  const steps = t('process.steps');
  const icons = [
    <MessageSquare size={24} />,
    <Search size={24} />,
    <Zap size={24} />,
    <CheckCircle2 size={24} />
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase">{t('process.title')}</h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
          
          {Array.isArray(steps) && steps.map((step: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10 p-8 bg-glass rounded-[2.5rem] border-white/5 text-center group hover:border-luxury-gold/30 transition-all"
            >
              <div className="w-16 h-16 bg-luxury-gold text-luxury-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                {icons[i] || <CheckCircle2 size={24} />}
              </div>
              <div className="text-xs font-black text-luxury-gold mb-2 uppercase tracking-widest">{t('process.step')} {i + 1}</div>
              <h3 className="text-xl font-black mb-3">{step.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();
  const faqs = t('faq.list');

  return (
    <section className="py-24 bg-white/[0.01]" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">{t('faq.title')}</h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full" />
        </div>

        <div className="space-y-4">
          {Array.isArray(faqs) && faqs.map((faq: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <motion.div 
                key={i}
                initial={false}
                animate={{ 
                  backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                  borderColor: isOpen ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                }}
                className="bg-glass rounded-[2rem] border overflow-hidden transition-all duration-500"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-8 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-luxury-gold text-luxury-black' : 'bg-white/5 text-luxury-gold'}`}>
                      <HelpCircle size={24} />
                    </div>
                    <span className={`text-xl font-black transition-colors duration-500 ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                      {faq.q}
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${isOpen ? 'border-luxury-gold text-luxury-gold rotate-180' : 'border-white/10 text-white/40'}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                      }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-8 pb-8 pl-[5.5rem] text-white/50 text-lg leading-relaxed">
                        <div className="w-full h-px bg-white/5 mb-6" />
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface SocialProofProps {
  config?: {
    showSignups?: boolean;
    showPurchases?: boolean;
  };
}

const SocialProof = ({ config = { showSignups: true, showPurchases: true } }: SocialProofProps) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const { lang, t } = useTranslation();
  
  const allProofs = translations[lang].socialProofs.map((content, i) => ({
    type: i % 2 === 0 ? 'signup' : 'purchase', // Mocking types based on index for now
    content
  }));
  
  const proofs = allProofs.filter(p => {
    if (p.type === 'signup' && !config.showSignups) return false;
    if (p.type === 'purchase' && !config.showPurchases) return false;
    return true;
  });

  useEffect(() => {
    if (proofs.length === 0) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % proofs.length);
        setVisible(true);
      }, 500);
    }, 10000);
    return () => clearInterval(interval);
  }, [proofs.length]);

  if (proofs.length === 0) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.8 }}
          className="fixed bottom-8 left-8 z-[90] hidden md:flex items-center gap-4 p-4 bg-luxury-black/80 backdrop-blur-xl rounded-2xl border border-luxury-gold/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-xs"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-luxury-gold to-luxury-gold-light rounded-2xl flex items-center justify-center text-luxury-black shrink-0 shadow-lg">
              <CheckCircle2 size={24} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-luxury-green rounded-full border-2 border-luxury-black animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-luxury-gold font-black uppercase tracking-widest mb-1">{t('socialProofTag')}</p>
            <p className="text-xs font-bold leading-tight text-white/90">
              {proofs[index].content}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      setVisible(scrolled > 500);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-28 right-8 z-[90] w-12 h-12 bg-luxury-black/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-luxury-gold hover:text-luxury-black transition-all shadow-xl"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const SupportBubble = () => {
  const { t } = useTranslation();
  return (
    <div className="fixed bottom-8 right-28 z-[90] hidden lg:block">
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="bg-glass px-4 py-2 rounded-full border border-luxury-neon/30 text-[10px] font-black text-luxury-neon uppercase tracking-widest mb-2 text-center"
      >
        {t('supportOnline')}
      </motion.div>
    </div>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-glass p-12 rounded-[3rem] border-luxury-gold/20 text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-luxury-gold/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-luxury-neon/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4 uppercase">{t('newsletter.title')}</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">{t('newsletter.desc')}</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input 
                type="email" 
                required
                placeholder={t('newsletter.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:border-luxury-gold outline-none transition-all"
              />
              <button 
                type="submit"
                className="px-10 py-4 bg-luxury-gold text-luxury-black font-black rounded-2xl glow-gold hover:scale-105 transition-all"
              >
                {t('newsletter.btn')}
              </button>
            </form>
            
            <AnimatePresence>
              {subscribed && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-luxury-green font-bold"
                >
                  {t('newsletter.success')}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-luxury-black pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black mb-6 tracking-tighter">
              SKY LUXURY <span className="text-luxury-gold">MEDIA</span>
            </h2>
            <p className="text-white/50 mb-8 max-w-md leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              {/* Trust Badges */}
              <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <ShieldCheck size={16} className="text-luxury-green" />
                <span className="text-[10px] font-bold uppercase tracking-widest">SSL Secured</span>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <CheckCircle2 size={16} className="text-luxury-gold" />
                <span className="text-[10px] font-bold uppercase tracking-widest">DMCA Protected</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-luxury-gold font-black mb-6 uppercase tracking-widest text-sm">{t('footer.quickLinks')}</h3>
            <ul className="space-y-4 text-white/50">
              <li><a href="#" className="hover:text-luxury-gold transition-colors">{t('nav.home')}</a></li>
              <li><a href="#services" className="hover:text-luxury-gold transition-colors">{t('nav.services')}</a></li>
              <li><a href="#pricing" className="hover:text-luxury-gold transition-colors">{t('footer.pricing')}</a></li>
              <li><a href="#contact" className="hover:text-luxury-gold transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-luxury-gold font-black mb-6 uppercase tracking-widest text-sm">{t('footer.contactInfo')}</h3>
            <ul className="space-y-4 text-white/50">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-luxury-gold" />
                <span>{PHONE_NUMBER}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-luxury-gold" />
                <span>contact@skyluxury.media</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-luxury-gold" />
                <span>{t('footer.address')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-sm">
          <p>© 2024 SKY LUXURY MEDIA. {t('footer.copyright')}</p>
          
          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a 
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-luxury-gold transition-all hover:scale-110"
                title={social.name}
              >
                <social.Icon size={20} />
              </a>
            ))}
          </div>

          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Preloader = () => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] bg-luxury-black flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-black tracking-tighter text-luxury-gold text-glow-gold mb-8"
      >
        SKY LUXURY <span className="text-white">MEDIA</span>
      </motion.div>
      
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute top-0 left-0 h-full bg-luxury-gold shadow-[0_0_15px_rgba(212,175,55,1)]"
        />
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]"
      >
        {t('preloader')}
      </motion.p>
    </motion.div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('vi');
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const t = (path: string) => {
    const keys = path.split('.');
    let result: any = (translations as any)[lang];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={`min-h-screen selection:bg-luxury-gold/30 cursor-none lg:cursor-auto transition-colors duration-500 ${theme === 'light' ? 'bg-white text-luxury-black' : 'bg-luxury-black text-white'}`}>
          <AnimatePresence>
            {loading && <Preloader />}
          </AnimatePresence>
          
          <ReadingProgressBar />
          <TopBanner />
          <ScrollProgress />
          <CustomCursor />
          <BackgroundParticles />
          <Navbar />
          <main>
            <Hero />
            <ExploreServicesCTA />
            <TrustSection />
            <StatsSection />
            <MockTool />
            <QuickService />
            <BentoGrid />
            <CaseStudiesSection />
            <ProcessSection />
            <Services />
            <KeySellingPointsBento />
            <PricingSection />
            <BlogSection />
            <Testimonials />
            <FAQSection />
            <Newsletter />
            <PaymentSection />
            <ContactForm />
          </main>
          <Footer />
          <ZaloButton />
          <AIChatAssistant />
          <HumanSupportChat />
          <ExitIntentPopup />
          <SocialProof config={{ showSignups: true, showPurchases: true }} />
          <BackToTop />
          <SupportBubble />
          <CookieConsent />
        </div>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
}

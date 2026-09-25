import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, 
  Sparkles, 
  Gift, 
  ChevronDown, 
  ChevronUp, 
  Minimize2, 
  Maximize2,
  Zap
} from 'lucide-react';

interface FloatingActionDockProps {
  onOpenVietQr: () => void;
  onOpenLuckyWheel: () => void;
  onOpenReferral: () => void;
  t: (key: string) => any;
}

export const FloatingActionDock: React.FC<FloatingActionDockProps> = ({
  onOpenVietQr,
  onOpenLuckyWheel,
  onOpenReferral,
  t
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 120);
      setIsScrolling(true);

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // When scrolling, if not hovered, auto-shrink to compact mode
  const shouldShrink = (isScrolled || isScrolling) && !isHovered && !isCollapsed;

  return (
    <div 
      className={`fixed transition-all duration-300 z-[90] ${
        shouldShrink ? 'bottom-4 left-4' : 'bottom-6 left-6'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        {/* State 1: Manually collapsed or super compact pill */}
        {isCollapsed ? (
          <motion.div
            key="collapsed-dock"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="group flex items-center gap-2 px-3 py-2 bg-luxury-black/90 hover:bg-luxury-gold backdrop-blur-xl border border-luxury-gold/50 rounded-full shadow-[0_8px_25px_rgba(212,175,55,0.3)] transition-all duration-300"
              title="Mở rộng 3 tiện ích nhanh"
            >
              <div className="w-6 h-6 rounded-full bg-luxury-gold/20 group-hover:bg-luxury-black/20 flex items-center justify-center text-luxury-gold group-hover:text-luxury-black transition-colors">
                <Zap size={14} className="animate-pulse" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-luxury-gold group-hover:text-luxury-black transition-colors">
                3 Tiện Ích
              </span>
              <div className="flex -space-x-1 ml-0.5">
                <span className="w-2 h-2 rounded-full bg-luxury-gold animate-ping" />
                <span className="w-2 h-2 rounded-full bg-luxury-gold" />
              </div>
              <ChevronUp size={14} className="text-luxury-gold group-hover:text-luxury-black ml-1 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </motion.div>
        ) : (
          /* State 2: Expanded or Auto-shrunk when scrolling */
          <motion.div
            key="expanded-dock"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: shouldShrink ? 0.78 : 1, 
              opacity: shouldShrink ? 0.72 : 1 
            }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`flex flex-col gap-2.5 p-2 rounded-2xl bg-luxury-black/75 backdrop-blur-xl border border-luxury-gold/30 shadow-[0_12px_36px_rgba(0,0,0,0.6)] group/dock transition-all ${
              shouldShrink ? 'hover:scale-100 hover:opacity-100 hover:shadow-[0_15px_40px_rgba(212,175,55,0.35)]' : ''
            }`}
          >
            {/* Dock Mini Header / Collapse Button */}
            <div className="flex items-center justify-between px-1 pb-1 border-b border-white/10 text-[9px] font-bold text-white/50 tracking-wider">
              <span className="flex items-center gap-1 text-luxury-gold text-[9px] font-black uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-luxury-neon animate-pulse" />
                3 TAP
              </span>
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-1 hover:text-luxury-gold transition-colors rounded hover:bg-white/5"
                title="Thu nhỏ thanh tiện ích"
              >
                <Minimize2 size={11} />
              </button>
            </div>

            {/* Tap Button 1: VietQR Checkout */}
            <div className="relative group/btn flex items-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onOpenVietQr}
                className="w-11 h-11 bg-luxury-black border-2 border-luxury-gold text-luxury-gold rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] relative overflow-hidden transition-all"
                title="Quét VietQR Thanh Toán"
              >
                <div className="absolute inset-0 bg-luxury-gold/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                <QrCode size={19} className="relative z-10" />
              </motion.button>
              
              {/* Tooltip Label */}
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-luxury-black/95 border border-luxury-gold/40 text-luxury-gold text-[10px] font-black uppercase tracking-wider rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity duration-200">
                VietQR 24/7
              </div>
            </div>

            {/* Tap Button 2: Lucky Wheel */}
            <div className="relative group/btn flex items-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onOpenLuckyWheel}
                className="w-11 h-11 bg-gradient-to-br from-luxury-gold via-luxury-gold-light to-luxury-gold text-luxury-black rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(212,175,55,0.4)] hover:shadow-[0_0_22px_rgba(212,175,55,0.8)] border border-white/20 relative overflow-hidden transition-all"
                title={t('luckyWheel.floatingBtn') || 'Vòng quay VIP'}
              >
                <div className="absolute inset-0 bg-white/30 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                <Sparkles size={20} className="relative z-10 animate-spin" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-neon opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-luxury-neon"></span>
                </span>
              </motion.button>

              {/* Tooltip Label */}
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-luxury-black/95 border border-luxury-gold/40 text-luxury-gold text-[10px] font-black uppercase tracking-wider rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity duration-200">
                {t('luckyWheel.floatingBtn') || 'Vòng Quay VIP'}
              </div>
            </div>

            {/* Tap Button 3: Referral Gift */}
            <div className="relative group/btn flex items-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onOpenReferral}
                className="w-11 h-11 bg-luxury-gold text-luxury-black rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] relative overflow-hidden transition-all"
                title={t('referral.title') || 'Giới thiệu nhận quà'}
              >
                <div className="absolute inset-0 bg-white/25 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                <Gift size={20} className="relative z-10" />
              </motion.button>

              {/* Tooltip Label */}
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-luxury-black/95 border border-luxury-gold/40 text-luxury-gold text-[10px] font-black uppercase tracking-wider rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/btn:opacity-100 pointer-events-none transition-opacity duration-200">
                {t('referral.title') || 'Giới Thiệu Nhận Quà'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Sparkles, Check, Copy, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Prize {
  id: string;
  name: string;
  code: string;
  color: string;
  textColor: string;
}

const PRIZES: Prize[] = [
  { id: '1', name: 'Giảm 20% Dịch Vụ', code: 'SKYVIP20', color: '#D4AF37', textColor: '#050505' },
  { id: '2', name: 'Tặng 500 Like / Tim', code: 'FREE500LIKE', color: '#1a1a1a', textColor: '#D4AF37' },
  { id: '3', name: 'Giảm 15% Toàn Sàn', code: 'SKYLUXURY15', color: '#FFD700', textColor: '#050505' },
  { id: '4', name: 'Giảm 100.000đ', code: 'GIAM100K', color: '#0d0d0d', textColor: '#FFFFFF' },
  { id: '5', name: 'Free Check 1 - 1', code: 'CHECKFREE', color: '#D4AF37', textColor: '#050505' },
  { id: '6', name: 'Giảm 10% Tool MMO', code: 'TOOL10', color: '#1a1a1a', textColor: '#D4AF37' },
];

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (code: string) => void;
  t: (key: string) => any;
}

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  onApplyCoupon,
  t
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [copied, setCopied] = useState(false);

  const numSlices = PRIZES.length;
  const sliceAngle = 360 / numSlices;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWonPrize(null);

    // Pick a random prize
    const prizeIndex = Math.floor(Math.random() * numSlices);
    const selected = PRIZES[prizeIndex];

    // Compute rotation target: several full spins (5-8) + slice offset
    // Target slice at pointer (at top: 270 deg or pointer at 0 deg)
    const baseSpins = 360 * 6;
    // Pointer is typically at top (90 deg from center-right)
    const targetOffset = 360 - (prizeIndex * sliceAngle + sliceAngle / 2);
    const totalRotation = rotation + baseSpins + (targetOffset - (rotation % 360));

    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(selected);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFD700', '#FFFFFF', '#00F3FF']
      });
    }, 4500);
  };

  const handleCopyCode = () => {
    if (!wonPrize) return;
    navigator.clipboard.writeText(wonPrize.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToCalc = () => {
    if (!wonPrize) return;
    onApplyCoupon(wonPrize.code);
    onClose();
    const el = document.getElementById('pricing-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-luxury-black/95 border border-luxury-gold/40 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_70px_rgba(212,175,55,0.25)] overflow-hidden text-center z-10"
          >
            {/* Top Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="w-14 h-14 bg-luxury-gold/15 text-luxury-gold rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Gift size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                {t('luckyWheel.title')}
              </h3>
              <p className="text-xs text-white/50 max-w-xs mx-auto mt-1">
                {t('luckyWheel.desc')}
              </p>
            </div>

            {/* Wheel Canvas Area */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-4 flex items-center justify-center">
              {/* Pointer at top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
                <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-luxury-gold" />
              </div>

              {/* The Spinning Wheel */}
              <motion.div
                animate={{ rotate: rotation }}
                transition={{
                  duration: 4.5,
                  ease: [0.15, 0.9, 0.25, 1]
                }}
                className="w-full h-full rounded-full border-4 border-luxury-gold/60 shadow-[0_0_30px_rgba(212,175,55,0.3)] relative overflow-hidden"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {PRIZES.map((prize, idx) => {
                    const startAngle = idx * sliceAngle;
                    const endAngle = startAngle + sliceAngle;
                    const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                    const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                    const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                    const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                    const path = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                    // Text rotation & position
                    const textAngle = startAngle + sliceAngle / 2;
                    const rad = (Math.PI * textAngle) / 180;
                    const tx = 50 + 32 * Math.cos(rad);
                    const ty = 50 + 32 * Math.sin(rad);

                    return (
                      <g key={prize.id}>
                        <path d={path} fill={prize.color} stroke="#050505" strokeWidth="0.8" />
                        <text
                          x={tx}
                          y={ty}
                          fill={prize.textColor}
                          fontSize="4"
                          fontWeight="900"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                        >
                          {prize.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Center Badge */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-luxury-black border-2 border-luxury-gold flex items-center justify-center z-10 shadow-lg">
                  <Sparkles size={18} className="text-luxury-gold" />
                </div>
              </motion.div>
            </div>

            {/* Spin CTA Button */}
            {!wonPrize && (
              <div className="mt-6">
                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={handleSpin}
                  className="w-full py-4 bg-luxury-gold text-luxury-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all glow-gold disabled:opacity-50"
                >
                  {isSpinning ? t('luckyWheel.spinning') : t('luckyWheel.btnSpin')}
                </button>
                <p className="text-[10px] text-white/40 mt-3">{t('luckyWheel.limitNote')}</p>
              </div>
            )}

            {/* Won Prize Details Card */}
            <AnimatePresence>
              {wonPrize && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-5 bg-luxury-gold/10 border border-luxury-gold/40 rounded-2xl space-y-4"
                >
                  <div>
                    <span className="text-xs font-black text-luxury-gold uppercase tracking-wider block">
                      {t('luckyWheel.congratulations')}
                    </span>
                    <h4 className="text-lg font-black text-white mt-1">
                      {wonPrize.name}
                    </h4>
                  </div>

                  <div className="p-3 bg-luxury-black/80 rounded-xl border border-dashed border-luxury-gold/50 flex items-center justify-between px-4">
                    <span className="font-mono text-sm font-black text-luxury-gold tracking-widest">
                      {wonPrize.code}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-xs font-bold text-white/70 hover:text-white flex items-center gap-1"
                    >
                      {copied ? <Check size={14} className="text-luxury-green" /> : <Copy size={14} />}
                      <span>{copied ? t('luckyWheel.copied') : t('luckyWheel.btnCopy')}</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleApplyToCalc}
                      className="flex-1 py-3 bg-luxury-gold text-luxury-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Zap size={14} />
                      {t('luckyWheel.btnApplyCalc')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Check, 
  Copy, 
  Zap, 
  ShieldCheck, 
  Tag, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Layers,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ServiceOption {
  id: string;
  name: string;
  basePrice: number; // in VND
  unit: string;
  defaultQty: number;
  minQty: number;
  maxQty: number;
  stepQty: number;
  eta: string;
  description: string;
}

interface PlatformData {
  id: string;
  name: string;
  icon: string;
  services: ServiceOption[];
}

const PLATFORMS: PlatformData[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    services: [
      {
        id: 'fb-unlock-282',
        name: 'Mở khóa Checkpoint 282 / 956 Két sắt',
        basePrice: 500000,
        unit: 'tài khoản',
        defaultQty: 1,
        minQty: 1,
        maxQty: 10,
        stepQty: 1,
        eta: '15 - 45 phút',
        description: 'Bypass quét ảnh mặt, két sắt tím 956, vượt xác minh 2FA và đổi mật khẩu spam'
      },
      {
        id: 'fb-follow',
        name: 'Tăng Follow Fanpage / Profile Real',
        basePrice: 150, // 150 VND per follow
        unit: 'follow',
        defaultQty: 2000,
        minQty: 1000,
        maxQty: 50000,
        stepQty: 500,
        eta: '2 - 6 giờ',
        description: 'Người dùng thật tại Việt Nam, tương tác tự nhiên, bảo hành tụt trọn đời'
      },
      {
        id: 'fb-seeding',
        name: 'Gói Seeding Bài Viết & Đánh Giá 5 Sao',
        basePrice: 250000,
        unit: 'gói bài',
        defaultQty: 1,
        minQty: 1,
        maxQty: 20,
        stepQty: 1,
        eta: '1 - 2 giờ',
        description: 'Combo 50 bình luận điều hướng kịch bản mua hàng + 300 like cảm xúc tự nhiên'
      },
      {
        id: 'fb-live',
        name: 'Tăng Mắt Xem Livestream Chống Tụt',
        basePrice: 200000,
        unit: 'gói live',
        defaultQty: 1,
        minQty: 1,
        maxQty: 10,
        stepQty: 1,
        eta: 'Ngay lập tức',
        description: 'Duy trì 300-500 mắt xem ổn định suốt 90 phút live bán hàng'
      }
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    services: [
      {
        id: 'tt-unlock',
        name: 'Khôi phục tài khoản TikTok bị đình chỉ',
        basePrice: 800000,
        unit: 'kênh',
        defaultQty: 1,
        minQty: 1,
        maxQty: 5,
        stepQty: 1,
        eta: '2 - 12 giờ',
        description: 'Kháng nghị chuyên sâu cho kênh dính vi phạm cộng đồng, quét nhầm bản quyền hoặc đóng băng tiền TikTok Shop'
      },
      {
        id: 'tt-follow',
        name: 'Tăng Follow TikTok Real Chuẩn Đề Xuất',
        basePrice: 180, // 180 VND per follow
        unit: 'follow',
        defaultQty: 1500,
        minQty: 1000,
        maxQty: 100000,
        stepQty: 500,
        eta: '3 - 8 giờ',
        description: 'Follow người thật mở tính năng Livestream và TikTok Shop cho kênh mới'
      },
      {
        id: 'tt-combo-viral',
        name: 'Combo View + Tim + Share Đẩy Xu Hướng',
        basePrice: 300000,
        unit: 'video',
        defaultQty: 1,
        minQty: 1,
        maxQty: 15,
        stepQty: 1,
        eta: '30 - 60 phút',
        description: '50.000 view + 2.000 tim + 300 share kích hoạt thuật toán FYP TikTok'
      },
      {
        id: 'tt-channel-build',
        name: 'Xây Kênh Triệu View Từ Con Số 0',
        basePrice: 3500000,
        unit: 'gói trọn gói',
        defaultQty: 1,
        minQty: 1,
        maxQty: 3,
        stepQty: 1,
        eta: '15 - 30 ngày',
        description: 'Định hướng nội dung, viết kịch bản viral, tối ưu SEO kênh và cam kết đạt 100k follow'
      }
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    services: [
      {
        id: 'ig-unlock',
        name: 'Mở khóa tài khoản IG vô hiệu hóa 180 ngày',
        basePrice: 600000,
        unit: 'tài khoản',
        defaultQty: 1,
        minQty: 1,
        maxQty: 5,
        stepQty: 1,
        eta: '1 - 6 giờ',
        description: 'Kháng án tài khoản bị quét spam hoặc báo cáo mạo danh bản quyền'
      },
      {
        id: 'ig-followers',
        name: 'Tăng Follow Instagram Active',
        basePrice: 160,
        unit: 'follow',
        defaultQty: 1000,
        minQty: 1000,
        maxQty: 30000,
        stepQty: 500,
        eta: '2 - 4 giờ',
        description: 'Tăng uy tín thương hiệu cá nhân và trang bán hàng thời trang, mỹ phẩm'
      }
    ]
  },
  {
    id: 'mmo',
    name: 'Tool MMO',
    icon: '⚡',
    services: [
      {
        id: 'tool-fb-pro',
        name: 'Tool Nuôi Nick & Auto Seeding FB Pro',
        basePrice: 1200000,
        unit: 'bản quyền 6 tháng',
        defaultQty: 1,
        minQty: 1,
        maxQty: 5,
        stepQty: 1,
        eta: 'Kích hoạt ngay',
        description: 'Hỗ trợ nuôi hàng nghìn tài khoản, đổi IP đa luồng, auto tương tác và kết bạn'
      },
      {
        id: 'tool-tiktok-auto',
        name: 'Tool Reup & Quản Lý Kênh TikTok Shop',
        basePrice: 1500000,
        unit: 'bản quyền 6 tháng',
        defaultQty: 1,
        minQty: 1,
        maxQty: 5,
        stepQty: 1,
        eta: 'Kích hoạt ngay',
        description: 'Tự động tải video không logo, lách âm thanh bản quyền và hẹn giờ đăng bài'
      },
      {
        id: 'proxy-clean',
        name: 'Gói Proxy Tĩnh Sạch IPv4 Chuyên MMO',
        basePrice: 250000,
        unit: 'gói 5 proxy / tháng',
        defaultQty: 1,
        minQty: 1,
        maxQty: 20,
        stepQty: 1,
        eta: 'Kích hoạt ngay',
        description: 'Proxy dân cư sạch chưa từng dính blacklist, tối ưu chống checkpoint tuyệt đối'
      }
    ]
  }
];

const COUPONS: Record<string, { discountPercent?: number; discountAmount?: number; label: string }> = {
  'SKYLUXURY15': { discountPercent: 15, label: 'Giảm 15% tổng hóa đơn' },
  'SKYVIP20': { discountPercent: 20, label: 'Giảm 20% đặc quyền VIP' },
  'VIP20': { discountPercent: 20, label: 'Giảm 20% đặc quyền VIP' },
  'GIAM100K': { discountAmount: 100000, label: 'Giảm trực tiếp 100.000đ' },
  'VIP100K': { discountAmount: 100000, label: 'Giảm trực tiếp 100.000đ' },
  'FREE500LIKE': { discountAmount: 80000, label: 'Tặng tương đương gói 500 Like' },
  'CHECKFREE': { discountAmount: 50000, label: 'Miễn phí kiểm tra chuyên sâu' },
  'TOOL10': { discountPercent: 10, label: 'Giảm 10% Tool MMO' }
};

interface PricingCalculatorProps {
  t: (key: string) => any;
  zaloLink: string;
  externalCoupon?: string;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ t, zaloLink, externalCoupon }) => {
  const [selectedPlatformId, setSelectedPlatformId] = useState('facebook');
  const [selectedServiceId, setSelectedServiceId] = useState('fb-unlock-282');
  const [quantity, setQuantity] = useState(1);
  const [isVipSpeed, setIsVipSpeed] = useState(false);
  const [isVipWarranty, setIsVipWarranty] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent?: number; amount?: number } | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Auto-fill and apply when externalCoupon is passed from Lucky Wheel
  useEffect(() => {
    if (externalCoupon && COUPONS[externalCoupon]) {
      setCouponInput(externalCoupon);
      const c = COUPONS[externalCoupon];
      setAppliedCoupon({
        code: externalCoupon,
        percent: c.discountPercent,
        amount: c.discountAmount
      });
      setCouponMessage({
        text: `Đã áp dụng mã quà tặng "${externalCoupon}": ${c.label}!`,
        isError: false
      });
    }
  }, [externalCoupon]);

  const currentPlatform = PLATFORMS.find(p => p.id === selectedPlatformId) || PLATFORMS[0];
  const currentService = currentPlatform.services.find(s => s.id === selectedServiceId) || currentPlatform.services[0];

  // Adjust quantity when service changes
  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const targetService = currentPlatform.services.find(s => s.id === serviceId);
    if (targetService) {
      setQuantity(targetService.defaultQty);
    }
  };

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatformId(platformId);
    const targetPlatform = PLATFORMS.find(p => p.id === platformId) || PLATFORMS[0];
    const defaultSvc = targetPlatform.services[0];
    setSelectedServiceId(defaultSvc.id);
    setQuantity(defaultSvc.defaultQty);
  };

  // Calculations
  const baseTotal = currentService.basePrice * quantity;
  const speedCost = isVipSpeed ? Math.round(baseTotal * 0.2) : 0;
  const warrantyCost = isVipWarranty ? 150000 : 0;
  const subtotalBeforeDiscount = baseTotal + speedCost + warrantyCost;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.percent) {
      discountAmount = Math.round((subtotalBeforeDiscount * appliedCoupon.percent) / 100);
    } else if (appliedCoupon.amount) {
      discountAmount = Math.min(appliedCoupon.amount, subtotalBeforeDiscount);
    }
  }

  const finalTotal = Math.max(0, subtotalBeforeDiscount - discountAmount);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = couponInput.trim().toUpperCase();
    if (!clean) return;

    if (COUPONS[clean]) {
      const c = COUPONS[clean];
      setAppliedCoupon({
        code: clean,
        percent: c.discountPercent,
        amount: c.discountAmount
      });
      setCouponMessage({
        text: `${t('pricingCalculator.couponSuccess')} (${c.label})`,
        isError: false
      });
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      setCouponMessage({
        text: t('pricingCalculator.couponError'),
        isError: true
      });
    }
  };

  const handleOrder = () => {
    const summaryText = `[ĐƠN HÀNG SKY LUXURY MEDIA]
- Nền tảng: ${currentPlatform.name}
- Dịch vụ: ${currentService.name}
- Số lượng: ${quantity.toLocaleString()} ${currentService.unit}
- Tốc độ: ${isVipSpeed ? 'Hỏa tốc VIP (15-30 phút)' : 'Tiêu chuẩn (2-6 giờ)'}
- Gói bảo hành: ${isVipWarranty ? 'Bảo hiểm Vàng VIP 60 ngày' : 'Tiêu chuẩn 7 ngày'}
${appliedCoupon ? `- Mã giảm giá: ${appliedCoupon.code} (-${formatVND(discountAmount)})` : ''}
- TỔNG THANH TOÁN: ${formatVND(finalTotal)}
- Ước tính bàn giao: ${isVipSpeed ? '15 - 30 phút' : currentService.eta}`;

    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setIsCopied(false);
      const encodedMsg = encodeURIComponent(summaryText);
      window.open(`${zaloLink}?text=${encodedMsg}`, '_blank');
    }, 1500);
  };

  return (
    <section id="pricing-calculator" className="py-24 relative overflow-hidden bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-4">
            <Calculator size={16} className="text-luxury-gold" />
            <span className="text-luxury-gold text-xs font-black uppercase tracking-widest">
              Instant Quote Engine
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
            {t('pricingCalculator.title')}
          </h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full mb-4" />
          <p className="text-white/60 max-w-2xl mx-auto text-base">
            {t('pricingCalculator.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Configuration Column */}
          <div className="lg:col-span-7 space-y-8 bg-glass p-8 md:p-10 rounded-[2.5rem] border border-white/10">
            {/* Step 1: Platforms */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-3">
                {t('pricingCalculator.platformLabel')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PLATFORMS.map((platform) => {
                  const isSelected = platform.id === selectedPlatformId;
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => handlePlatformChange(platform.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-black shadow-lg shadow-luxury-gold/20'
                          : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl">{platform.icon}</span>
                      <span className="text-xs font-bold truncate">{platform.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Service Selection */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-3">
                {t('pricingCalculator.serviceLabel')}
              </label>
              <div className="space-y-2.5">
                {currentPlatform.services.map((svc) => {
                  const isSelected = svc.id === selectedServiceId;
                  return (
                    <div
                      key={svc.id}
                      onClick={() => handleServiceChange(svc.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-luxury-gold/10 border-luxury-gold text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                          : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            {isSelected && <CheckCircle2 size={16} className="text-luxury-gold shrink-0" />}
                            {svc.name}
                          </h4>
                          <p className="text-xs text-white/50 leading-relaxed">{svc.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-luxury-gold block">
                            {formatVND(svc.basePrice)}
                          </span>
                          <span className="text-[10px] text-white/30 uppercase tracking-widest">
                            / {svc.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Quantity */}
            <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-black uppercase tracking-widest text-white/60">
                  {t('pricingCalculator.quantityLabel')}
                </label>
                <div className="text-sm font-black text-luxury-gold">
                  {quantity.toLocaleString()} <span className="text-white/40 text-xs font-bold uppercase">{currentService.unit}</span>
                </div>
              </div>

              <input
                type="range"
                min={currentService.minQty}
                max={currentService.maxQty}
                step={currentService.stepQty}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-luxury-gold cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-white/30 mt-2 font-mono">
                <span>Min: {currentService.minQty.toLocaleString()}</span>
                <span>Max: {currentService.maxQty.toLocaleString()}</span>
              </div>
            </div>

            {/* Step 4 & 5: Options (Speed & Warranty) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Speed Option */}
              <div 
                onClick={() => setIsVipSpeed(!isVipSpeed)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isVipSpeed 
                    ? 'bg-luxury-gold/10 border-luxury-gold' 
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl ${isVipSpeed ? 'bg-luxury-gold text-luxury-black' : 'bg-white/5 text-white/40'}`}>
                    <Zap size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-white uppercase tracking-wider">Hỏa tốc VIP (+20%)</h5>
                    <span className="text-[10px] text-white/40">15 - 30 phút ưu tiên máy chủ riêng</span>
                  </div>
                </div>
                <div className="text-[10px] text-luxury-gold font-bold">
                  {isVipSpeed ? '✓ Đã kích hoạt chế độ siêu tốc' : '+ Thêm ưu tiên hỏa tốc'}
                </div>
              </div>

              {/* Warranty Option */}
              <div 
                onClick={() => setIsVipWarranty(!isVipWarranty)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isVipWarranty 
                    ? 'bg-luxury-gold/10 border-luxury-gold' 
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-xl ${isVipWarranty ? 'bg-luxury-gold text-luxury-black' : 'bg-white/5 text-white/40'}`}>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-white uppercase tracking-wider">Bảo hiểm Vàng 60 ngày</h5>
                    <span className="text-[10px] text-white/40">+150.000đ (Chống khóa lại 100%)</span>
                  </div>
                </div>
                <div className="text-[10px] text-luxury-gold font-bold">
                  {isVipWarranty ? '✓ Đã kích hoạt bảo hiểm VIP' : '+ Nâng cấp gói bảo hiểm'}
                </div>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                {t('pricingCalculator.couponLabel')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={t('pricingCalculator.couponPlaceholder')}
                  className="flex-grow bg-white/5 border border-white/10 focus:border-luxury-gold text-white rounded-xl py-3 px-4 text-xs font-mono uppercase outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="px-6 py-3 bg-white/10 hover:bg-luxury-gold hover:text-luxury-black font-black rounded-xl text-xs uppercase tracking-widest transition-all shrink-0"
                >
                  {t('pricingCalculator.btnApplyCoupon')}
                </button>
              </div>
              {couponMessage && (
                <p className={`text-xs mt-2 font-bold ${couponMessage.isError ? 'text-red-400' : 'text-luxury-green'}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>
          </div>

          {/* Right Quote Summary Card */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-glass p-8 md:p-10 rounded-[2.5rem] border border-luxury-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-luxury-gold block mb-1">
                    ESTIMATED QUOTE
                  </span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    {t('pricingCalculator.summaryTitle')}
                  </h3>
                </div>
                <div className="p-3 bg-luxury-gold/10 rounded-2xl text-luxury-gold">
                  <Sparkles size={24} />
                </div>
              </div>

              {/* Service details recap */}
              <div className="space-y-4 mb-6 text-xs text-white/70">
                <div className="flex justify-between py-1">
                  <span className="text-white/40">{t('pricingCalculator.subtotal')}</span>
                  <span className="font-bold text-white font-mono">{formatVND(baseTotal)}</span>
                </div>

                {isVipSpeed && (
                  <div className="flex justify-between py-1 text-luxury-gold">
                    <span>{t('pricingCalculator.vipSpeedCost')}</span>
                    <span className="font-bold font-mono">+{formatVND(speedCost)}</span>
                  </div>
                )}

                {isVipWarranty && (
                  <div className="flex justify-between py-1 text-luxury-gold">
                    <span>{t('pricingCalculator.warrantyCost')}</span>
                    <span className="font-bold font-mono">+{formatVND(warrantyCost)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between py-1 text-luxury-green font-bold">
                    <span>{t('pricingCalculator.discount')}</span>
                    <span className="font-mono">-{formatVND(discountAmount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-luxury-gold" />
                    {t('pricingCalculator.estCompletion')}
                  </span>
                  <strong className="text-white">{isVipSpeed ? '15 - 30 phút' : currentService.eta}</strong>
                </div>
              </div>

              {/* Total Price Callout */}
              <div className="p-6 bg-gradient-to-br from-luxury-gold/15 to-transparent rounded-2xl border border-luxury-gold/40 mb-6 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 block mb-1">
                  {t('pricingCalculator.total')}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold text-glow-gold tracking-tight font-mono">
                  {formatVND(finalTotal)}
                </span>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleOrder}
                className="w-full py-5 bg-luxury-gold text-luxury-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all glow-gold flex items-center justify-center gap-2"
              >
                {isCopied ? (
                  <>
                    <Check size={18} />
                    {t('pricingCalculator.btnCopied')}
                  </>
                ) : (
                  <>
                    <ArrowRight size={18} />
                    {t('pricingCalculator.btnOrder')}
                  </>
                )}
              </button>

              <p className="text-[11px] text-white/40 text-center mt-4 leading-relaxed">
                {t('pricingCalculator.directConsult')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

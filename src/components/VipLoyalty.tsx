import React from 'react';
import { motion } from 'motion/react';
import { 
  Crown, 
  Sparkles, 
  Check, 
  Zap, 
  ShieldCheck, 
  Users, 
  Server, 
  Headphones, 
  ArrowRight,
  Award
} from 'lucide-react';

interface VipLoyaltyProps {
  t: (key: string) => any;
  zaloLink: string;
}

interface Tier {
  id: string;
  name: string;
  badge: string;
  threshold: string;
  discount: string;
  priority: string;
  warranty: string;
  isPopular?: boolean;
  color: string;
  features: string[];
}

export const VipLoyalty: React.FC<VipLoyaltyProps> = ({ t, zaloLink }) => {
  const tiers: Tier[] = [
    {
      id: 'silver',
      name: t('vipLoyalty.tierSilver'),
      badge: 'MEMBER',
      threshold: 'Từ 1 - 3 đơn đầu tiên',
      discount: '5% cho mọi dịch vụ',
      priority: 'Tiêu chuẩn (2 - 6 giờ)',
      warranty: '7 ngày chống khóa lại',
      color: 'border-white/10 text-white/70',
      features: [
        'Hỗ trợ kỹ thuật qua Zalo giờ hành chính',
        'Bảo hành tiêu chuẩn 7 ngày cho mọi đơn',
        'Miễn phí kiểm tra tình trạng tài khoản',
        'Tích lũy doanh số lên hạng Vàng'
      ]
    },
    {
      id: 'gold',
      name: t('vipLoyalty.tierGold'),
      badge: 'VIP GOLD',
      threshold: 'Chi tiêu từ 3.000.000đ hoặc 5 đơn',
      discount: '15% TRỌN ĐỜI',
      priority: 'Hỏa tốc ưu tiên (15 - 30 phút)',
      warranty: '45 ngày chống khóa lại',
      isPopular: true,
      color: 'border-luxury-gold shadow-[0_0_30px_rgba(212,175,55,0.25)] text-luxury-gold',
      features: [
        'Giảm vĩnh viễn 15% cho tất cả đơn hàng sau',
        'Kênh xử lý riêng bypass hàng đợi thông thường',
        'Tặng bộ Proxy IPv4 dân cư sạch tốc độ cao',
        'Bảo hành Vàng 45 ngày 1 đổi 1 hoặc hoàn tiền',
        'Hỗ trợ 24/7 cả ban đêm và ngày Lễ'
      ]
    },
    {
      id: 'diamond',
      name: t('vipLoyalty.tierDiamond'),
      badge: 'SVIP AGENCY',
      threshold: 'Đại lý / Chi tiêu từ 10.000.000đ',
      discount: '30% - 40% GIÁ SỈ',
      priority: 'Máy chủ riêng - Cấp tốc 10 phút',
      warranty: 'Bảo hiểm VIP 90 ngày',
      color: 'border-luxury-neon/50 text-luxury-neon shadow-[0_0_30px_rgba(0,243,255,0.2)]',
      features: [
        'Giá sỉ đại lý chiết khấu sâu tới 40%',
        '1 Kỹ thuật viên Master phụ trách 1 kèm 1',
        'Cung cấp API / Webhook đẩy đơn tự động cho web riêng',
        'Trọn bộ bản quyền Tool MMO Pro vĩnh viễn',
        'Hỗ trợ setup hệ thống nuôi tài khoản doanh nghiệp'
      ]
    }
  ];

  return (
    <section id="loyalty" className="py-24 relative overflow-hidden bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-4">
            <Crown size={16} className="text-luxury-gold" />
            <span className="text-luxury-gold text-xs font-black uppercase tracking-widest">
              {t('vipLoyalty.badge')}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
            {t('vipLoyalty.title')}
          </h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full mb-4" />
          <p className="text-white/60 max-w-2xl mx-auto text-base">
            {t('vipLoyalty.desc')}
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => {
            return (
              <div
                key={tier.id}
                className={`bg-glass rounded-[2.5rem] p-8 md:p-10 border transition-all relative flex flex-col justify-between ${tier.color} ${
                  tier.isPopular ? 'scale-[1.03] bg-luxury-gold/[0.03]' : ''
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-luxury-gold text-luxury-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {t('vipLoyalty.recommended')}
                  </div>
                )}

                <div>
                  {/* Tier Title */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">
                        {tier.badge}
                      </span>
                      <h3 className="text-2xl font-black text-white">
                        {tier.name}
                      </h3>
                      <span className="text-xs text-white/50 block mt-1">
                        {tier.threshold}
                      </span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl">
                      <Crown size={22} className={tier.isPopular ? 'text-luxury-gold' : 'text-white/60'} />
                    </div>
                  </div>

                  {/* Discount Highlight */}
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-6 text-center">
                    <span className="text-[10px] uppercase font-bold text-white/40 block mb-1">
                      {t('vipLoyalty.perkDiscount')}
                    </span>
                    <span className="text-2xl font-black text-white tracking-tight">
                      {tier.discount}
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3 mb-8 text-xs text-white/70">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/40">{t('vipLoyalty.perkPriority')}</span>
                      <strong className="text-white">{tier.priority}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-white/40">{t('vipLoyalty.perkWarranty')}</span>
                      <strong className="text-luxury-gold">{tier.warranty}</strong>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    {tier.features.map((ft, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                        <div className="p-1 rounded-full bg-luxury-gold/20 text-luxury-gold shrink-0 mt-0.5">
                          <Check size={12} />
                        </div>
                        <span className="leading-relaxed">{ft}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <a
                  href={`${zaloLink}?text=${encodeURIComponent(
                    `Chào Sky Luxury Media, tôi muốn tư vấn gia nhập và đăng ký gói [${tier.name}] để nhận ưu đãi đặc quyền!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    tier.isPopular
                      ? 'bg-luxury-gold text-luxury-black hover:scale-105 glow-gold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <ArrowRight size={14} />
                  <span>{t('vipLoyalty.btnRegisterTier')}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

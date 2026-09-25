import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Layers, 
  Star, 
  Sliders, 
  MessageSquare, 
  TrendingUp, 
  Flame,
  Award
} from 'lucide-react';

interface CaseStudy {
  id: string;
  category: 'facebook' | 'tiktok' | 'mmo';
  title: string;
  client: string;
  platform: string;
  recoveryTime: string;
  before: {
    title: string;
    description: string;
    badge: string;
    details: string[];
    simulatedUI: string;
  };
  after: {
    title: string;
    description: string;
    badge: string;
    details: string[];
    simulatedUI: string;
  };
}

const CASES: CaseStudy[] = [
  {
    id: 'case-1',
    category: 'facebook',
    title: 'Mở khóa Checkpoint 282 (Yêu cầu ảnh mặt) - Nick Idol 320k Follow',
    client: 'Diễn viên N.T.T (Hà Nội)',
    platform: 'Facebook Personal Page',
    recoveryTime: '22 phút',
    before: {
      title: 'Tài khoản bị tạm ngưng - Quét 282',
      badge: 'BỊ KHÓA 180 NGÀY',
      description: 'Nick tick xanh bị quét nhầm thuật toán Meta, kẹt ở bước tải video khuôn mặt không thể bypass.',
      details: ['Mất quyền truy cập Fanpage công ty', 'Quảng cáo bị gián đoạn hoàn toàn', 'Dễ bị Meta xóa vĩnh viễn sau 180 ngày'],
      simulatedUI: 'Checkpoint 282: "Chúng tôi đã tạm ngừng tài khoản của bạn. Bạn còn 180 ngày để phản đối quyết định này..."'
    },
    after: {
      title: 'Tài khoản về chính chủ - Bảo mật 2FA Vàng',
      badge: 'ĐÃ MỞ KHÓA 100%',
      description: 'Kỹ thuật viên Sky Luxury nạp phôi cccd chuẩn phông và bypass bot Meta, nick về hoàn toàn nguyên vẹn.',
      details: ['Fanpage & Ads Manager hoạt động lại bình thường', 'Bảo hiểm chống khóa lại 60 ngày', 'Cấp bộ IP dân cư sạch'],
      simulatedUI: 'Bảng tin Facebook: "Chào mừng trở lại! Trang cá nhân tick xanh 320.000 người theo dõi đã được xác thực an toàn."'
    }
  },
  {
    id: 'case-2',
    category: 'facebook',
    title: 'Phá két sắt tím 956 & Khôi phục nick bị Hacker đổi Email',
    client: 'Chủ chuỗi Shop Thời Trang (TP.HCM)',
    platform: 'Facebook Business Admin',
    recoveryTime: '15 phút',
    before: {
      title: 'Kẹt Két sắt tím 956 - Mất SĐT cũ',
      badge: 'MẤT QUYỀN TRUY CẬP',
      description: 'Tài khoản bị hacker đổi sạch số điện thoại và email, dính két sắt bắt gửi mã về số của kẻ gian.',
      details: ['Mã OTP gửi về SĐT hacker', 'Đổi mật khẩu bị khóa spam', 'Không có tùy chọn xác minh khác'],
      simulatedUI: 'Facebook Security: "Tài khoản của bạn đã bị khóa. Ngày khóa: 12/09. Bấm bắt đầu để mở khóa két sắt..."'
    },
    after: {
      title: 'Đá dạng OTP sang Mail mới & Gỡ 2FA Hacker',
      badge: 'KHÔI PHỤC THÀNH CÔNG',
      description: 'Sử dụng Tool độc quyền đá dạng két sắt tím về xác minh ngày tháng năm sinh và gửi mã về email chính chủ.',
      details: ['Đã gỡ triệt để mã 2FA của hacker', 'Liên kết email doanh nghiệp mới', 'Tài khoản an toàn tuyệt đối'],
      simulatedUI: 'Facebook Account: "Xác minh danh tính hoàn tất. Mật khẩu mới đã được cập nhật thành công."'
    }
  },
  {
    id: 'case-3',
    category: 'tiktok',
    title: 'Gỡ cấm vĩnh viễn & Rã đông 180 triệu TikTok Shop',
    client: 'Kênh TikToker 850k Follow (Đà Nẵng)',
    platform: 'TikTok Creator & Shop VN',
    recoveryTime: '4 giờ',
    before: {
      title: 'Tài khoản bị cấm vĩnh viễn (Banned)',
      badge: 'ĐÓNG BĂNG TIỀN SHOP',
      description: 'Bị đối thủ chơi xấu report vi phạm bản quyền hàng loạt, hệ thống TikTok quét cấm tài khoản và treo tiền bán hàng.',
      details: ['Ví tiền TikTok Shop bị đóng băng', 'Mất giỏ hàng affiliate', 'Đơn kháng tự động bị bot từ chối'],
      simulatedUI: 'TikTok Notice: "Tài khoản của bạn đã bị cấm vĩnh viễn do vi phạm nghiêm trọng Tiêu chuẩn cộng đồng..."'
    },
    after: {
      title: 'Khôi phục kênh & Mở khóa rút tiền thành công',
      badge: 'TIỀN VỀ TÀI KHOẢN',
      description: 'Soạn bộ hồ sơ pháp lý đối soát vận đơn gửi trực tiếp phòng kiểm duyệt TikTok Singapore, gỡ sạch điểm vi phạm.',
      details: ['Ví Shop mở lại - rút toàn bộ 180 triệu', 'Kênh phục hồi lượng traffic đề xuất', 'Kèm gói bảo kê bản quyền'],
      simulatedUI: 'TikTok Shop Seller: "Đơn khiếu nại thành công. Điểm vi phạm đã được hủy bỏ. Doanh thu sẵn sàng rút."'
    }
  }
];

const FEEDBACKS = [
  {
    id: 'fb-1',
    user: 'Lê Hoàng Đ.',
    service: 'Mở khóa 282 Facebook',
    amount: '+1.500.000đ',
    quote: 'Quá nhanh quá nguy hiểm! Tưởng mất luôn nick làm ăn 7 năm nay rồi, team Sky Luxury làm chưa đầy 20 phút nick đã về. Đỉnh chóp!',
    stars: 5,
    tag: 'Xác thực MB Bank'
  },
  {
    id: 'fb-2',
    user: 'Thảo My Store',
    service: 'Cứu TikTok Shop',
    amount: '+4.200.000đ',
    quote: 'Tiền trong ví 120 củ bị đóng băng lo mất ăn mất ngủ. Nhờ anh Long và đội ngũ can thiệp hồ sơ bên Singapore mà rã đông ngay trong ngày.',
    stars: 5,
    tag: 'Xác thực Vietcombank'
  },
  {
    id: 'fb-3',
    user: 'Team MMO Pro',
    service: 'Gói Tool Nuôi Nick 500 Acc',
    amount: '+15.000.000đ',
    quote: 'Tool nuôi nick mượt mà, lướt đa luồng IP chuẩn không dính checkpoint nào. Đã giới thiệu thêm 3 anh em trong team cùng mua.',
    stars: 5,
    tag: 'Đại lý SVIP'
  }
];

interface ProofOfWorkProps {
  t: (key: string) => any;
  zaloLink: string;
}

export const ProofOfWork: React.FC<ProofOfWorkProps> = ({ t, zaloLink }) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeCase = CASES[activeCaseIndex];

  const handlePointerMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handlePointerMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    handlePointerMove(e.touches[0].clientX);
  };

  return (
    <section id="proof-of-work" className="py-24 relative overflow-hidden bg-luxury-black/90">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-luxury-gold/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-luxury-neon/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-4">
            <Award size={16} className="text-luxury-gold" />
            <span className="text-luxury-gold text-xs font-black uppercase tracking-widest">
              {t('proofOfWork.badge')}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
            {t('proofOfWork.title')}
          </h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full mb-4" />
          <p className="text-white/60 max-w-2xl mx-auto text-base">
            {t('proofOfWork.desc')}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          <div className="p-6 bg-glass rounded-2xl border border-white/10 text-center">
            <span className="text-3xl sm:text-4xl font-black text-luxury-gold font-mono block mb-1">
              {t('proofOfWork.statSuccess')}
            </span>
            <span className="text-xs uppercase tracking-wider text-white/50 font-bold">
              {t('proofOfWork.statSuccessLabel')}
            </span>
          </div>

          <div className="p-6 bg-glass rounded-2xl border border-white/10 text-center">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono block mb-1">
              {t('proofOfWork.statSatisfaction')}
            </span>
            <span className="text-xs uppercase tracking-wider text-white/50 font-bold">
              {t('proofOfWork.statSatisfactionLabel')}
            </span>
          </div>

          <div className="p-6 bg-glass rounded-2xl border border-white/10 text-center">
            <span className="text-3xl sm:text-4xl font-black text-luxury-green font-mono block mb-1">
              {t('proofOfWork.statRefund')}
            </span>
            <span className="text-xs uppercase tracking-wider text-white/50 font-bold">
              {t('proofOfWork.statRefundLabel')}
            </span>
          </div>
        </div>

        {/* Case Studies Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CASES.map((cs, idx) => (
            <button
              key={cs.id}
              type="button"
              onClick={() => {
                setActiveCaseIndex(idx);
                setSliderPos(50);
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border ${
                activeCaseIndex === idx
                  ? 'bg-luxury-gold text-luxury-black border-luxury-gold shadow-lg shadow-luxury-gold/20 scale-105'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cs.title}
            </button>
          ))}
        </div>

        {/* Interactive Before / After Comparison Slider */}
        <div className="bg-glass p-6 md:p-10 rounded-[2.5rem] border border-luxury-gold/30 shadow-2xl mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10 mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold block mb-1">
                CASE STUDY THỰC TẾ #{activeCaseIndex + 1}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {activeCase.title}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/50">
              <div>
                <span className="block text-white/30 uppercase tracking-widest">Khách hàng:</span>
                <strong className="text-white">{activeCase.client}</strong>
              </div>
              <div className="border-l border-white/10 pl-4">
                <span className="block text-white/30 uppercase tracking-widest">Thời gian cứu:</span>
                <strong className="text-luxury-gold">{activeCase.recoveryTime}</strong>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-white/40 mb-4 flex items-center justify-center gap-2">
            <Sliders size={14} className="text-luxury-gold" />
            {t('proofOfWork.dragHint')}
          </p>

          {/* Slider Container */}
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full h-[380px] sm:h-[420px] rounded-3xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-inner"
          >
            {/* AFTER Layer (Full Background) */}
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-zinc-900 to-black p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-luxury-green/20 text-luxury-green border border-luxury-green/40">
                    {t('proofOfWork.afterTag')}
                  </span>
                  <span className="text-xs font-mono font-bold text-luxury-gold">
                    ✓ BẢN QUYỀN SKY LUXURY
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-black text-white mb-2">
                  {activeCase.after.title}
                </h4>
                <p className="text-xs sm:text-sm text-white/70 max-w-md leading-relaxed mb-4">
                  {activeCase.after.description}
                </p>
                <div className="p-4 bg-luxury-green/10 border border-luxury-green/30 rounded-2xl max-w-lg">
                  <span className="text-[10px] uppercase font-bold text-luxury-green block mb-1">
                    Giao diện thực tế sau khi khôi phục:
                  </span>
                  <p className="text-xs text-white/90 font-mono italic">
                    "{activeCase.after.simulatedUI}"
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {activeCase.after.details.map((dt, i) => (
                  <span key={i} className="text-[11px] font-bold text-luxury-green flex items-center gap-1">
                    <CheckCircle size={12} /> {dt}
                  </span>
                ))}
              </div>
            </div>

            {/* BEFORE Layer (Clipped by slider position) */}
            <div
              style={{ width: `${sliderPos}%` }}
              className="absolute inset-0 overflow-hidden bg-gradient-to-br from-red-950/90 via-black to-zinc-950 p-6 sm:p-10 flex flex-col justify-between border-r-2 border-luxury-gold z-10"
            >
              <div className="w-[1000px] max-w-none">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-red-500/20 text-red-400 border border-red-500/40">
                    {t('proofOfWork.beforeTag')}
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-black text-white mb-2">
                  {activeCase.before.title}
                </h4>
                <p className="text-xs sm:text-sm text-white/70 max-w-md leading-relaxed mb-4">
                  {activeCase.before.description}
                </p>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-lg">
                  <span className="text-[10px] uppercase font-bold text-red-400 block mb-1">
                    Trạng thái màn hình lỗi trước can thiệp:
                  </span>
                  <p className="text-xs text-white/80 font-mono italic">
                    "{activeCase.before.simulatedUI}"
                  </p>
                </div>
              </div>

              <div className="w-[1000px] flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {activeCase.before.details.map((dt, i) => (
                  <span key={i} className="text-[11px] font-bold text-red-400">
                    ✕ {dt}
                  </span>
                ))}
              </div>
            </div>

            {/* Drag Handle Bar */}
            <div
              style={{ left: `${sliderPos}%` }}
              className="absolute top-0 bottom-0 -ml-4 w-8 flex items-center justify-center pointer-events-none z-20"
            >
              <div className="w-8 h-8 rounded-full bg-luxury-gold text-luxury-black font-black flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,1)]">
                <Sliders size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Real Customer Bank & Feedback Cards */}
        <div>
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-luxury-gold">
              VERIFIED REVIEWS & TRANSACTIONS
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              Phản Hồi & Biến Động Số Dư Thực Tế
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEEDBACKS.map((item) => (
              <div
                key={item.id}
                className="bg-glass p-6 rounded-3xl border border-white/10 hover:border-luxury-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-black text-white">{item.user}</h4>
                      <span className="text-[10px] text-white/40 block">{item.service}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-luxury-green/10 text-luxury-green border border-luxury-green/30 rounded-xl text-xs font-mono font-black">
                      {item.amount}
                    </span>
                  </div>

                  <p className="text-xs text-white/70 italic leading-relaxed mb-4">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[10px] text-white/40">
                  <div className="flex text-luxury-gold gap-0.5">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <span className="font-bold text-luxury-gold">{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

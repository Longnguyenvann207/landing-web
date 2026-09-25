import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Search, 
  MessageCircle, 
  X, 
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  serviceName: string;
  amount?: number;
  phone?: string;
  zaloLink: string;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderId,
  serviceName,
  amount,
  phone,
  zaloLink,
  onTrackOrder
}) => {
  const [copied, setCopied] = useState(false);

  const formatVND = (val?: number) => {
    if (!val) return 'Theo báo giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrackNow = () => {
    onTrackOrder(orderId);
    onClose();
  };

  const handleZaloChat = () => {
    const msg = `Chào Sky Luxury Media, tôi vừa tạo đơn dịch vụ:
- Mã đơn hàng: ${orderId}
- Dịch vụ: ${serviceName}
${amount ? `- Số tiền: ${formatVND(amount)}` : ''}
Nhờ Kỹ thuật viên hỗ trợ kiểm tra tiến độ giúp tôi!`;
    window.open(`${zaloLink}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-luxury-black border border-luxury-gold/40 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_80px_rgba(212,175,55,0.3)] overflow-hidden z-10 text-center"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Success icon */}
            <div className="w-16 h-16 rounded-2xl bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/50 flex items-center justify-center mx-auto mb-4 relative shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <CheckCircle2 size={32} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-green rounded-full animate-ping" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full text-luxury-gold text-xs font-bold mb-2">
              <Sparkles size={14} />
              <span>ĐÃ KHỞI TẠO ĐƠN HÀNG THÀNH CÔNG</span>
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
              Mã Đơn Hàng Của Bạn
            </h3>

            <p className="text-xs text-white/60 mb-6 max-w-md mx-auto leading-relaxed">
              Vui lòng sao chép hoặc ghi nhớ mã bên dưới để theo dõi từng bước xử lý thực tế của Kỹ thuật viên trên hệ thống Live Tracker.
            </p>

            {/* ORDER CODE HIGHLIGHT CARD */}
            <div className="bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5 p-5 rounded-3xl border-2 border-luxury-gold/60 mb-6 shadow-inner relative">
              <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-1">
                MÃ TRA CỨU TIẾN ĐỘ CHÍNH THỨC
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-3xl sm:text-4xl font-black text-luxury-gold tracking-tight drop-shadow-md">
                  {orderId}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2.5 bg-luxury-gold text-luxury-black rounded-xl hover:scale-110 active:scale-95 transition-all shadow-md"
                  title="Sao chép mã đơn"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="block text-xs font-bold text-luxury-green mt-1"
                >
                  ✓ Đã sao chép mã {orderId} vào bộ nhớ tạm!
                </motion.span>
              )}

              {/* Service details badge */}
              <div className="mt-4 pt-3 border-t border-luxury-gold/20 text-xs text-white/70 flex justify-between items-center text-left">
                <span className="truncate max-w-[200px] font-bold text-white">{serviceName}</span>
                {amount && <span className="font-mono font-bold text-luxury-gold">{formatVND(amount)}</span>}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              {/* PRIMARY ACTION: TRACK NOW */}
              <button
                type="button"
                onClick={handleTrackNow}
                className="w-full py-4 bg-luxury-gold text-luxury-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all glow-gold flex items-center justify-center gap-2"
              >
                <Search size={18} />
                <span>KIỂM TRA TIẾN ĐỘ ĐƠN HÀNG NÀY NGAY</span>
                <ArrowRight size={16} />
              </button>

              {/* SECONDARY ACTION: ZALO KTV */}
              <button
                type="button"
                onClick={handleZaloChat}
                className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-wider text-xs rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} className="text-[#0068ff]" />
                <span>Gửi mã đơn cho KTV qua Zalo</span>
              </button>
            </div>

            <p className="text-[11px] text-white/40 mt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} className="text-luxury-green" />
              <span>Tiến độ cập nhật thời gian thực 24/7 • Cam kết bảo mật 100%</span>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VietQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: {
    caseId?: string;
    amount?: number;
    serviceName?: string;
    phone?: string;
  };
  t: (key: string) => any;
  zaloLink: string;
}

const BANKS = [
  { id: 'MB', name: 'MB Bank (Quân Đội)', bin: '970422', accountNo: '0334063029', owner: 'NGUYEN VAN LONG' },
  { id: 'VCB', name: 'Vietcombank', bin: '970436', accountNo: '0334063029', owner: 'NGUYEN VAN LONG' },
  { id: 'TCB', name: 'Techcombank', bin: '970407', accountNo: '0334063029', owner: 'NGUYEN VAN LONG' },
  { id: 'MOMO', name: 'Ví MoMo', bin: 'MOMO', accountNo: '0334063029', owner: 'NGUYEN VAN LONG' }
];

export const VietQrModal: React.FC<VietQrModalProps> = ({
  isOpen,
  onClose,
  orderData,
  t,
  zaloLink
}) => {
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes countdown
  const [isConfirmed, setIsConfirmed] = useState(false);

  const amount = orderData?.amount && orderData.amount > 0 ? orderData.amount : 500000;
  const caseId = orderData?.caseId || `SKY-${Math.floor(1000 + Math.random() * 9000)}`;
  const transferContent = `${caseId.replace('-', '')} DICHVU`;

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(15 * 60);
    setIsConfirmed(false);
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Generate real standard VietQR image url
  const qrUrl = `https://img.vietqr.io/image/${selectedBank.id}-${selectedBank.accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(selectedBank.owner)}`;

  const handleConfirmPaid = () => {
    setIsConfirmed(true);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    const msg = `[XÁC NHẬN CHUYỂN KHOẢN TỰ ĐỘNG]
- Mã đơn/Case: ${caseId}
- Số tiền: ${formatVND(amount)}
- Ngân hàng: ${selectedBank.name}
- Nội dung CK: ${transferContent}
Tôi đã quét mã VietQR và hoàn tất giao dịch. Nhờ kỹ thuật viên kiểm tra sao kê và kích hoạt xử lý ngay!`;

    setTimeout(() => {
      window.open(`${zaloLink}?text=${encodeURIComponent(msg)}`, '_blank');
      onClose();
    }, 1600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-luxury-black/95 border border-luxury-gold/40 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_70px_rgba(212,175,55,0.25)] overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header & FOMO countdown */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full text-luxury-gold text-xs font-bold mb-2">
                <QrCode size={14} />
                <span>VietQR 24/7 Fast Checkout</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                {t('vietQr.title')}
              </h3>
              <p className="text-xs text-white/50 max-w-md mx-auto mt-1">
                {t('vietQr.desc')}
              </p>

              {/* Countdown Alert */}
              <div className="mt-4 p-3 bg-luxury-gold/10 border border-luxury-gold/30 rounded-2xl inline-flex items-center gap-2 text-xs text-luxury-gold font-bold">
                <Clock size={16} className="animate-spin" />
                <span>{t('vietQr.countdownNotice')}</span>
                <span className="font-mono text-white bg-black/60 px-2 py-0.5 rounded-lg border border-luxury-gold/40">
                  {formattedTime}
                </span>
              </div>
            </div>

            {/* Bank Selector Tabs */}
            <div className="mb-6">
              <label className="block text-[11px] font-black uppercase tracking-widest text-white/40 mb-2">
                {t('vietQr.selectBank')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BANKS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBank(b)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                      selectedBank.id === b.id
                        ? 'bg-luxury-gold text-luxury-black border-luxury-gold shadow-md shadow-luxury-gold/20'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {b.id}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Card & Info Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-white/[0.02] p-6 rounded-3xl border border-white/10 mb-6">
              {/* Left: QR Image */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center">
                <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-luxury-gold/40 relative">
                  <img
                    src={qrUrl}
                    alt="VietQR Code"
                    className="w-48 h-48 object-contain"
                  />
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-luxury-black text-luxury-gold text-[10px] font-black rounded-full border border-luxury-gold/50 shadow whitespace-nowrap">
                    QUÉT TỰ ĐỘNG
                  </div>
                </div>
                <span className="text-[10px] text-white/40 mt-3 text-center">
                  Mở App Ngân hàng bất kỳ để quét
                </span>
              </div>

              {/* Right: Bank Details with 1-click copy */}
              <div className="sm:col-span-7 space-y-3 text-xs">
                {/* Account Number */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase tracking-wider">{t('vietQr.accountNumber')}</span>
                    <strong className="text-sm font-mono text-luxury-gold">{selectedBank.accountNo}</strong>
                    <span className="block text-[10px] text-white/50">{selectedBank.owner}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedBank.accountNo, 'acc')}
                    className="px-3 py-1.5 bg-white/10 hover:bg-luxury-gold hover:text-luxury-black rounded-lg font-bold text-[10px] transition-all flex items-center gap-1"
                  >
                    {copiedField === 'acc' ? <Check size={12} className="text-luxury-green" /> : <Copy size={12} />}
                    {copiedField === 'acc' ? t('vietQr.copySuccess') : t('vietQr.btnCopy')}
                  </button>
                </div>

                {/* Amount */}
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] text-white/40 uppercase tracking-wider">{t('vietQr.amountLabel')}</span>
                    <strong className="text-sm font-mono text-white">{formatVND(amount)}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(String(amount), 'amount')}
                    className="px-3 py-1.5 bg-white/10 hover:bg-luxury-gold hover:text-luxury-black rounded-lg font-bold text-[10px] transition-all flex items-center gap-1"
                  >
                    {copiedField === 'amount' ? <Check size={12} className="text-luxury-green" /> : <Copy size={12} />}
                    {copiedField === 'amount' ? t('vietQr.copySuccess') : t('vietQr.btnCopy')}
                  </button>
                </div>

                {/* Content */}
                <div className="p-3 bg-luxury-gold/10 rounded-xl border border-luxury-gold/30 flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] text-luxury-gold uppercase tracking-wider">{t('vietQr.contentLabel')}</span>
                    <strong className="text-sm font-mono text-luxury-gold">{transferContent}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(transferContent, 'content')}
                    className="px-3 py-1.5 bg-luxury-gold text-luxury-black rounded-lg font-black text-[10px] transition-all flex items-center gap-1 hover:scale-105"
                  >
                    {copiedField === 'content' ? <Check size={12} /> : <Copy size={12} />}
                    {copiedField === 'content' ? t('vietQr.copySuccess') : t('vietQr.btnCopy')}
                  </button>
                </div>
              </div>
            </div>

            {/* Confirmation CTA */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleConfirmPaid}
                className="w-full py-4 bg-luxury-gold text-luxury-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all glow-gold flex items-center justify-center gap-2"
              >
                {isConfirmed ? (
                  <>
                    <CheckCircle2 size={18} />
                    ĐÃ XÁC NHẬN! ĐANG KẾT NỐI KTV...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    {t('vietQr.btnConfirmPaid')}
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-white/40 leading-relaxed">
                <ShieldCheck size={14} className="inline mr-1 text-luxury-green" />
                {t('vietQr.guaranteeText')}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

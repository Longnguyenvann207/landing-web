import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  MessageCircle, 
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Sliders,
  Check,
  Copy,
  Zap,
  Tag
} from 'lucide-react';
import { OrderCase } from '../types/order';
import { 
  findOrder, 
  getStoredOrders, 
  subscribeOrders, 
  getRecentOrderCode 
} from '../services/orderStore';

interface OrderTrackerProps {
  t: (key: string) => any;
  zaloLink: string;
  externalSearchCode?: string;
  onOpenAdminEdit?: (orderId: string) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ 
  t, 
  zaloLink, 
  externalSearchCode,
  onOpenAdminEdit 
}) => {
  const [query, setQuery] = useState('');
  const [searchedCase, setSearchedCase] = useState<OrderCase | null>(null);
  const [hasSearched, setHasSearched] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [recentCode, setRecentCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Initialize with recent order or default sample order
  useEffect(() => {
    const recent = getRecentOrderCode();
    setRecentCode(recent);

    const initialCase = recent 
      ? findOrder(recent) || findOrder('SKY-8821') 
      : findOrder('SKY-8821') || getStoredOrders()[0];

    if (initialCase) {
      setSearchedCase(initialCase);
      setQuery(initialCase.id);
    }
  }, []);

  // Sync external search trigger
  useEffect(() => {
    if (externalSearchCode) {
      setQuery(externalSearchCode);
      handleSearch(externalSearchCode);
    }
  }, [externalSearchCode]);

  // Subscribe to live order updates from Admin or Checkout
  useEffect(() => {
    const unsub = subscribeOrders(() => {
      // Re-fetch current searched case so live changes appear immediately
      setSearchedCase((prev) => {
        if (!prev) return null;
        const fresh = findOrder(prev.id);
        return fresh || prev;
      });
      setRecentCode(getRecentOrderCode());
    });
    return () => unsub();
  }, []);

  const handleSearch = (codeToSearch?: string) => {
    const rawCode = (codeToSearch ?? query).trim();
    if (!rawCode) return;

    setIsSearching(true);
    setTimeout(() => {
      let match = findOrder(rawCode);

      // If not exact in store, check if query looks like valid phone or code to generate a live demo case
      if (!match) {
        const cleanDigits = rawCode.replace(/\D/g, '');
        if (cleanDigits.length >= 9) {
          match = {
            id: `SKY-${cleanDigits.slice(-4)}`,
            phone: rawCode,
            customerName: `Khách hàng (***${cleanDigits.slice(-4)})`,
            platform: 'Facebook / TikTok',
            service: 'Mở khóa tài khoản & Bảo mật 2 lớp',
            status: 'processing',
            progress: 65,
            technician: 'Kỹ thuật viên Trực ban 24/7',
            lastUpdate: 'Vừa xong',
            eta: '~20 - 30 phút',
            techNote: 'Hồ sơ đã được tiếp nhận qua hotline, kỹ thuật viên đang tiến hành kiểm tra mã lỗi và nạp tool bypass.',
            currentStepIndex: 1
          };
        }
      }

      setSearchedCase(match || null);
      setHasSearched(true);
      setIsSearching(false);
    }, 350);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStatusBadge = (status: OrderCase['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-luxury-green/10 text-luxury-green border border-luxury-green/30">
            <span className="w-2 h-2 rounded-full bg-luxury-green animate-pulse" />
            {t('orderTracker.statusCompleted')}
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30">
            <span className="w-2 h-2 rounded-full bg-luxury-gold animate-ping" />
            {t('orderTracker.statusProcessing')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-white/10 text-white/70 border border-white/20">
            <Clock size={12} />
            {t('orderTracker.statusPending')}
          </span>
        );
    }
  };

  const steps = t('orderTracker.steps') || [
    { title: 'Tiếp nhận', desc: 'Hồ sơ được số hóa và đưa vào hệ thống xử lý' },
    { title: 'Xác thực & Soạn phôi', desc: 'KTV chuẩn bị tài liệu kỹ thuật và bypass checkpoint' },
    { title: 'Can thiệp máy chủ', desc: 'Gửi webhook & can thiệp cấp quyền AI Meta / TikTok' },
    { title: 'Bàn giao & Bảo hành', desc: 'Kiểm tra bảo mật, kích hoạt bảo hiểm chống khóa lại' }
  ];

  const allStored = getStoredOrders();
  const sampleCodes = ['SKY-8821', 'SKY-9562', 'SKY-4410', '0334063029'];

  return (
    <section id="tracking" className="py-24 relative overflow-hidden bg-luxury-black/60">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-luxury-neon/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-4">
            <ShieldCheck size={16} className="text-luxury-gold" />
            <span className="text-luxury-gold text-xs font-black uppercase tracking-widest">
              Live Case Tracker 24/7
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
            {t('orderTracker.title')}
          </h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full mb-4" />
          <p className="text-white/60 max-w-2xl mx-auto text-base">
            {t('orderTracker.desc')}
          </p>
        </div>

        {/* Search input card */}
        <div className="bg-glass p-6 md:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl mb-8 relative">
          {/* Admin shortcut button */}
          {onOpenAdminEdit && (
            <button
              type="button"
              onClick={() => onOpenAdminEdit(searchedCase?.id || '')}
              className="absolute top-6 right-6 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-luxury-gold/10 hover:bg-luxury-gold hover:text-luxury-black border border-luxury-gold/30 text-luxury-gold text-xs font-bold transition-all"
              title="Mở Bảng Admin để chỉnh sửa tiến độ đơn này"
            >
              <Sliders size={14} />
              <span>Admin chỉnh sửa tiến độ</span>
            </button>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }} 
            className="flex flex-col sm:flex-row gap-3 pt-1"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('orderTracker.placeholder') || "Nhập Mã Case (ví dụ: SKY-8821) hoặc SĐT..."}
                className="w-full bg-white/5 border border-white/10 focus:border-luxury-gold text-white rounded-2xl py-4 pl-14 pr-4 outline-none transition-all placeholder:text-white/30 text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-8 py-4 bg-luxury-gold text-luxury-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all glow-gold flex items-center justify-center gap-2 uppercase tracking-widest text-xs shrink-0 disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  {t('orderTracker.btnSearch')}
                </>
              ) : (
                <>
                  <Search size={16} />
                  {t('orderTracker.btnSearch')}
                </>
              )}
            </button>
          </form>

          {/* Customer Recent Order Chip & Sample Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-white/5 text-xs text-white/40">
            {recentCode && (
              <div className="flex items-center gap-2 mr-2 bg-luxury-gold/15 border border-luxury-gold/50 px-3 py-1.5 rounded-xl">
                <span className="font-bold text-luxury-gold flex items-center gap-1">
                  <Tag size={13} />
                  Mã đơn gần nhất của bạn:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(recentCode);
                    handleSearch(recentCode);
                  }}
                  className="font-mono font-black text-white hover:text-luxury-gold underline transition-all"
                >
                  #{recentCode}
                </button>
              </div>
            )}

            <span className="font-bold flex items-center gap-1 text-white/60">
              <Sparkles size={14} className="text-luxury-gold" />
              {t('orderTracker.sampleCodes')}
            </span>

            {/* List sample codes + any user created codes */}
            {Array.from(new Set([...sampleCodes, ...allStored.map(o => o.id)])).slice(0, 6).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setQuery(code);
                  handleSearch(code);
                }}
                className={`px-3 py-1 rounded-xl border transition-all font-mono font-bold ${
                  searchedCase?.id === code || searchedCase?.phone === code
                    ? 'bg-luxury-gold/20 border-luxury-gold text-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                    : 'bg-white/5 border-white/10 text-white/70 hover:border-luxury-gold/50 hover:text-white'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Case result dashboard */}
        <AnimatePresence mode="wait">
          {hasSearched && searchedCase && (
            <motion.div
              key={searchedCase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-glass p-8 md:p-12 rounded-[2.5rem] border border-luxury-gold/20 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />

              {/* Case Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-2xl sm:text-3xl font-black text-luxury-gold tracking-tight">
                      #{searchedCase.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(searchedCase.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                      title="Sao chép mã đơn"
                    >
                      {copiedCode ? <Check size={16} className="text-luxury-green" /> : <Copy size={16} />}
                    </button>
                    {getStatusBadge(searchedCase.status)}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white/90">
                    {searchedCase.service}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-xs text-white/50">
                  <div>
                    <span className="block text-white/30 uppercase tracking-widest">{t('orderTracker.platform')}</span>
                    <span className="font-bold text-white text-sm">{searchedCase.platform}</span>
                  </div>
                  <div>
                    <span className="block text-white/30 uppercase tracking-widest">{t('orderTracker.customer')}</span>
                    <span className="font-bold text-white text-sm">{searchedCase.customerName}</span>
                  </div>
                  {onOpenAdminEdit && (
                    <button
                      type="button"
                      onClick={() => onOpenAdminEdit(searchedCase.id)}
                      className="px-3 py-1.5 rounded-xl bg-luxury-gold/20 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 border border-luxury-gold/40"
                    >
                      <Sliders size={12} />
                      <span>Admin chỉnh sửa</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar & ETA */}
              <div className="py-6">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2">
                  <span className="text-white/60">{t('orderTracker.progress')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px]">Thời gian thực</span>
                    <span className="text-luxury-gold font-mono text-base font-black">{searchedCase.progress}%</span>
                  </div>
                </div>
                <div className="w-full h-3.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${searchedCase.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.8)] relative"
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                  </motion.div>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-2 mt-3 text-xs text-white/50">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-luxury-gold" />
                    <span>{t('orderTracker.estimatedTime')} <strong className="text-white">{searchedCase.eta}</strong></span>
                  </div>
                  <div>
                    <span>{t('orderTracker.lastUpdate')} <strong className="text-white/80">{searchedCase.lastUpdate}</strong></span>
                  </div>
                </div>
              </div>

              {/* 4-Step Interactive Stepper */}
              <div className="py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                  {steps.map((st: any, idx: number) => {
                    const isDone = idx < searchedCase.currentStepIndex;
                    const isCurrent = idx === searchedCase.currentStepIndex;
                    return (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border transition-all ${
                          isDone
                            ? 'bg-luxury-gold/5 border-luxury-gold/40 text-white'
                            : isCurrent
                            ? 'bg-luxury-gold/10 border-luxury-gold text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                            : 'bg-white/[0.02] border-white/5 text-white/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                              isDone
                                ? 'bg-luxury-gold text-luxury-black'
                                : isCurrent
                                ? 'bg-luxury-gold text-luxury-black animate-pulse'
                                : 'bg-white/5 text-white/30'
                            }`}
                          >
                            {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                          </div>
                          <span className="font-bold text-sm leading-tight">{st.title}</span>
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed">{st.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Technician Notes Card & Action */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-black text-luxury-gold uppercase tracking-widest">
                    <UserCheck size={16} />
                    <span>{t('orderTracker.technician')} <strong className="text-white">{searchedCase.technician}</strong></span>
                  </div>
                  <p className="text-xs md:text-sm text-white/80 italic leading-relaxed">
                    "{searchedCase.techNote}"
                  </p>
                </div>

                <a
                  href={`${zaloLink}?text=${encodeURIComponent(
                    `Chào Sky Luxury Media, tôi muốn kiểm tra tiến độ case: ${searchedCase.id} (${searchedCase.service})`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full md:w-auto px-6 py-4 bg-luxury-gold text-luxury-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all glow-gold flex items-center justify-center gap-2 shrink-0"
                >
                  <MessageCircle size={16} />
                  {t('orderTracker.contactSupport')}
                </a>
              </div>
            </motion.div>
          )}

          {hasSearched && !searchedCase && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-glass p-12 rounded-[2.5rem] border border-red-500/20 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                {t('orderTracker.notFound')}
              </h3>
              <p className="text-white/40 text-sm max-w-md mx-auto mb-6">
                Vui lòng kiểm tra lại ký tự mã đơn hoặc bấm vào một trong các mã ví dụ có sẵn để trải nghiệm tính năng tra cứu.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('SKY-8821');
                  handleSearch('SKY-8821');
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all"
              >
                Tải thử mã mẫu SKY-8821
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

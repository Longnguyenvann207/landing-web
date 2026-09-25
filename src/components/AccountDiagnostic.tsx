import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Send, 
  RefreshCw, 
  Cpu, 
  Zap, 
  HelpCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiagnosticIssue {
  id: string;
  name: string;
  category: 'facebook' | 'tiktok' | 'instagram' | 'google';
  severity: 'low' | 'medium' | 'high' | 'critical';
  baseSuccessRate: number;
  estTime: string;
  dos: string;
  donts: string;
  protocol: string;
}

const ISSUES: Record<string, DiagnosticIssue[]> = {
  facebook: [
    {
      id: 'fb-282',
      name: 'Khóa 282 (Yêu cầu tải ảnh selfie / video khuôn mặt / CCCD)',
      category: 'facebook',
      severity: 'medium',
      baseSuccessRate: 95,
      estTime: '15 - 30 phút',
      donts: 'Tuyệt đối KHÔNG tự chụp ảnh qua camera điện thoại không khớp với hồ sơ gốc của nick, tránh để AI Meta quét từ chối vĩnh viễn.',
      dos: 'Chuẩn bị phôi cccd chuẩn nét, độ phân giải cao và sử dụng tool fake IP sạch sang bang California để gửi kháng.',
      protocol: 'Can thiệp qua cổng Webhook Partner Meta, nạp phôi phôi căn cước số hóa chuẩn phông Meta và bypass bot quét nhận diện.'
    },
    {
      id: 'fb-956',
      name: 'Khóa 956 Két Sắt Tím (Bắt xác minh qua Mail / SĐT cũ đã mất)',
      category: 'facebook',
      severity: 'low',
      baseSuccessRate: 98,
      estTime: '10 - 20 phút',
      donts: 'Không bấm nút "Bắt đầu" liên tục nhiều lần trên cùng 1 IP mạng wifi khiến tài khoản bị kẹt đuôi vô hạn.',
      dos: 'Đăng xuất khỏi tất cả thiết bị lạ, ngâm tài khoản trên trình duyệt sạch hoặc Dcom 4G.',
      protocol: 'Sử dụng Tool đá dạng xác minh tự động từ gửi mã SĐT cũ sang dạng xác minh Ngày tháng năm sinh hoặc gửi mã về Email mới.'
    },
    {
      id: 'fb-hacked',
      name: 'Bị Hacker chiếm quyền (Đổi pass, gỡ Email/SĐT và bật 2FA)',
      category: 'facebook',
      severity: 'high',
      baseSuccessRate: 90,
      estTime: '30 - 60 phút',
      donts: 'Không nhắn tin đôi co với hacker để tránh chúng xóa vĩnh viễn hòm thư liên kết hoặc spam vi phạm tiêu chuẩn làm die nick.',
      dos: 'Lưu lại đường link trang cá nhân (UID), email ban đầu lập nick và các thiết bị từng đăng nhập trước đó.',
      protocol: 'Khai thác form kháng nghị đặc biệt dành cho tài khoản bị xâm phạm (Compromised Direct Line), đá bay 2FA của hacker và khôi phục mail gốc.'
    },
    {
      id: 'fb-bm-ads',
      name: 'Khóa BM / Tài khoản Quảng cáo / Fanpage tích xanh',
      category: 'facebook',
      severity: 'high',
      baseSuccessRate: 88,
      estTime: '2 - 6 giờ',
      donts: 'Không dùng thẻ ngân hàng từng bị nợ tiền hoặc IP từng bị phạt để tạo thêm tài khoản phụ.',
      dos: 'Chuẩn bị giấy phép đăng ký kinh doanh và sao kê giao dịch ngân hàng minh bạch.',
      protocol: 'Gửi ticket ưu tiên qua kênh đại diện Meta Concierge Support Agency, yêu cầu nhân sự kiểm duyệt thủ công gỡ hạn chế.'
    }
  ],
  tiktok: [
    {
      id: 'tt-ban',
      name: 'Tài khoản TikTok bị đình chỉ vĩnh viễn (Banned)',
      category: 'tiktok',
      severity: 'critical',
      baseSuccessRate: 85,
      estTime: '2 - 12 giờ',
      donts: 'Không nộp đơn kháng mẫu có sẵn tràn lan trên mạng khiến AI TikTok tự động từ chối tự động bằng bot.',
      dos: 'Cung cấp bằng chứng bản quyền nội dung chính chủ, giấy tờ tùy thân của chủ kênh.',
      protocol: 'Soạn đơn tường trình pháp lý song ngữ Anh - Việt, gửi trực tiếp tới hòm thư Pháp chế & Kiểm duyệt nội dung TikTok Singapore.'
    },
    {
      id: 'tt-shadowban',
      name: 'Kênh bị Shadowban (Mất đề xuất, 0 view bất thường)',
      category: 'tiktok',
      severity: 'medium',
      baseSuccessRate: 94,
      estTime: '24 - 48 giờ',
      donts: 'Không xóa video hàng loạt trong thời gian ngắn làm rớt chỉ số tín nhiệm của kênh.',
      dos: 'Ẩn các video dính nhạc bản quyền hoặc vi phạm từ ngữ cấm (số điện thoại, link ngoài,...).',
      protocol: 'Tối ưu lại bộ metadata kênh, chạy reset thuật toán đề xuất bằng bộ tool tương tác chéo sạch.'
    },
    {
      id: 'tt-shop-lock',
      name: 'Khóa TikTok Shop / Đóng băng tiền không cho rút',
      category: 'tiktok',
      severity: 'critical',
      baseSuccessRate: 92,
      estTime: '4 - 24 giờ',
      donts: 'Không thay đổi thông tin tài khoản ngân hàng liên kết trong lúc đang bị điều tra điểm vi phạm.',
      dos: 'Tổng hợp đầy đủ vận đơn logistics và hóa đơn chứng minh nguồn gốc xuất xứ hàng hóa.',
      protocol: 'Liên hệ chuyên viên quản lý ngành hàng TikTok Shop VN, nộp bộ hồ sơ phúc khảo cấp tốc gỡ điểm phạt và mở băng rút tiền.'
    }
  ],
  instagram: [
    {
      id: 'ig-suspended',
      name: 'Khóa vô hiệu hóa 180 ngày (Suspended 180 days)',
      category: 'instagram',
      severity: 'medium',
      baseSuccessRate: 92,
      estTime: '1 - 4 giờ',
      donts: 'Không upload ảnh selfie mờ hoặc thiếu sáng qua ứng dụng di động.',
      dos: 'Chuẩn bị mã code 5 chữ số do Instagram cung cấp viết tay lên giấy trắng kèm họ tên và username.',
      protocol: 'Gửi xác thực ảnh cầm mã code chuẩn độ phân giải cao kết hợp cổng mở khóa Instagram Direct Appeal.'
    },
    {
      id: 'ig-impersonation',
      name: 'Bị Report Mạo danh người nổi tiếng / Bản quyền thương hiệu',
      category: 'instagram',
      severity: 'high',
      baseSuccessRate: 88,
      estTime: '2 - 8 giờ',
      donts: 'Không đổi tên người dùng hoặc ảnh đại diện liên tục trong lúc đang kháng nghị.',
      dos: 'Chuẩn bị CCCD/Hộ chiếu trùng khớp tên hiển thị trên trang cá nhân.',
      protocol: 'Chứng minh danh tính thực tế với đội ngũ Meta Trust & Safety để hủy bỏ báo cáo sai lệch.'
    }
  ],
  google: [
    {
      id: 'gg-disabled',
      name: 'Gmail / Google Workspace bị vô hiệu hóa vì hoạt động lạ',
      category: 'google',
      severity: 'high',
      baseSuccessRate: 90,
      estTime: '1 - 6 giờ',
      donts: 'Không thử đoán mật khẩu sai quá 5 lần khiến tài khoản bị khóa chặt.',
      dos: 'Sử dụng mạng wifi và thiết bị máy tính quen thuộc từng đăng nhập tài khoản trước đây.',
      protocol: 'Xác thực qua chứng chỉ bảo mật và hệ thống khôi phục tài khoản quản trị viên Google Workspace.'
    }
  ]
};

const ACCOUNT_STATUSES = [
  { id: 'fresh', name: 'Mới bị trong vòng 24 giờ (Hồ sơ nguyên bản, chưa ai kháng)', penalty: 0 },
  { id: 'recent', name: 'Đã bị từ 2 đến 7 ngày (Chưa gửi kháng nhiều)', penalty: -5 },
  { id: 'spammed', name: 'Bị trên 1 tuần hoặc đã qua tay thợ khác / Kháng trượt nhiều lần', penalty: -18 }
];

interface AccountDiagnosticProps {
  t: (key: string) => any;
  zaloLink: string;
}

export const AccountDiagnostic: React.FC<AccountDiagnosticProps> = ({ t, zaloLink }) => {
  const [platform, setPlatform] = useState<'facebook' | 'tiktok' | 'instagram' | 'google'>('facebook');
  const [selectedIssueId, setSelectedIssueId] = useState<string>(ISSUES['facebook'][0].id);
  const [accountStatusId, setAccountStatusId] = useState<string>('fresh');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const currentIssues = ISSUES[platform] || ISSUES['facebook'];
  const activeIssue = currentIssues.find(i => i.id === selectedIssueId) || currentIssues[0];
  const activeStatus = ACCOUNT_STATUSES.find(s => s.id === accountStatusId) || ACCOUNT_STATUSES[0];

  const calculatedSuccessRate = Math.max(55, Math.min(99, activeIssue.baseSuccessRate + activeStatus.penalty));

  const handlePlatformChange = (p: 'facebook' | 'tiktok' | 'instagram' | 'google') => {
    setPlatform(p);
    const newIssues = ISSUES[p];
    setSelectedIssueId(newIssues[0].id);
    setShowResult(false);
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setShowResult(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 1800);
  };

  const getSeverityBadge = (severity: DiagnosticIssue['severity']) => {
    switch (severity) {
      case 'low':
        return <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold">Mức độ: Nhẹ</span>;
      case 'medium':
        return <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold">Mức độ: Trung bình</span>;
      case 'high':
        return <span className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-bold">Mức độ: Nghiêm trọng</span>;
      case 'critical':
        return <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold">Mức độ: Cực kỳ nguy cấp</span>;
    }
  };

  return (
    <section id="diagnostic" className="py-24 relative overflow-hidden bg-luxury-black/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-4">
            <Stethoscope size={16} className="text-luxury-gold" />
            <span className="text-luxury-gold text-xs font-black uppercase tracking-widest">
              AI Account Health Check
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
            {t('diagnostic.title')}
          </h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full mb-4" />
          <p className="text-white/60 max-w-2xl mx-auto text-base">
            {t('diagnostic.desc')}
          </p>
        </div>

        {/* Diagnostic Form */}
        <div className="bg-glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl mb-8 space-y-8">
          {/* Step 1: Platforms */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-3">
              {t('diagnostic.step1')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'facebook', name: 'Facebook', icon: '📘' },
                { id: 'tiktok', name: 'TikTok', icon: '🎵' },
                { id: 'instagram', name: 'Instagram', icon: '📸' },
                { id: 'google', name: 'Gmail / Ads', icon: '🌐' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handlePlatformChange(item.id as any)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                    platform === item.id
                      ? 'bg-luxury-gold text-luxury-black border-luxury-gold font-black shadow-lg shadow-luxury-gold/20 scale-[1.02]'
                      : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Specific Issue */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-3">
              {t('diagnostic.step2')}
            </label>
            <div className="space-y-2.5">
              {currentIssues.map((issue) => {
                const isSelected = issue.id === selectedIssueId;
                return (
                  <div
                    key={issue.id}
                    onClick={() => {
                      setSelectedIssueId(issue.id);
                      setShowResult(false);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-luxury-gold/10 border-luxury-gold text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                        : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-luxury-gold animate-ping' : 'bg-white/20'}`} />
                      <span className="text-xs sm:text-sm font-bold">{issue.name}</span>
                    </div>
                    {getSeverityBadge(issue.severity)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Account Current Status */}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-3">
              {t('diagnostic.step3')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {ACCOUNT_STATUSES.map((st) => {
                const isSelected = st.id === accountStatusId;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setAccountStatusId(st.id);
                      setShowResult(false);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all text-xs leading-relaxed ${
                      isSelected
                        ? 'bg-luxury-gold/15 border-luxury-gold text-white font-bold'
                        : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {st.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="text-center pt-4">
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={runAnalysis}
              className="px-10 py-5 bg-luxury-gold text-luxury-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all glow-gold flex items-center justify-center gap-3 mx-auto disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  {t('diagnostic.analyzing')}
                </>
              ) : (
                <>
                  <Activity size={18} />
                  {t('diagnostic.btnAnalyze')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Diagnosis Results Card */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-glass p-8 md:p-12 rounded-[2.5rem] border border-luxury-gold/40 shadow-[0_20px_50px_rgba(212,175,55,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-8">
                <div>
                  <span className="px-3.5 py-1 bg-luxury-gold/20 text-luxury-gold text-[10px] font-black uppercase tracking-widest rounded-full mb-2 inline-block">
                    {t('diagnostic.resultBadge')}
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    {activeIssue.name}
                  </h3>
                </div>

                <div className="flex items-center gap-6">
                  {/* Big Success Rate Gauge */}
                  <div className="text-center p-4 bg-luxury-gold/10 rounded-2xl border border-luxury-gold/30">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">
                      {t('diagnostic.successRate')}
                    </span>
                    <span className="text-3xl font-black text-luxury-gold font-mono">
                      {calculatedSuccessRate}%
                    </span>
                  </div>

                  <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-1">
                      {t('diagnostic.eta')}
                    </span>
                    <span className="text-base font-bold text-white">
                      {activeIssue.estTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Critical Warnings & Protocol */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider">
                    <ShieldAlert size={18} />
                    {t('diagnostic.warningTitle')}
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {activeIssue.donts}
                  </p>
                </div>

                <div className="p-6 bg-luxury-green/5 rounded-2xl border border-luxury-green/20 space-y-2">
                  <div className="flex items-center gap-2 text-luxury-green font-black text-xs uppercase tracking-wider">
                    <CheckCircle size={18} />
                    {t('diagnostic.actionTitle')}
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {activeIssue.protocol}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowResult(false)}
                  className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold"
                >
                  ← {t('diagnostic.btnReset')}
                </button>

                <a
                  href={`${zaloLink}?text=${encodeURIComponent(
                    `Chào Sky Luxury Media, tôi vừa chạy chẩn đoán AI cho tài khoản: [${platform.toUpperCase()}] - ${activeIssue.name}. Tình trạng: ${activeStatus.name}. Tỷ lệ thành công AI tính: ${calculatedSuccessRate}%. Tôi cần chuyên viên hỗ trợ cấp cứu ca này ngay!`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-8 py-5 bg-luxury-gold text-luxury-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all glow-gold flex items-center justify-center gap-2"
                >
                  <Zap size={16} />
                  {t('diagnostic.btnRescue')}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

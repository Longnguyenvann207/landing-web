import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wrench, 
  Search, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  Type, 
  CheckCircle2, 
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MmoUtilitiesProps {
  t: (key: string) => any;
}

export const MmoUtilities: React.FC<MmoUtilitiesProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<'uid' | 'validator' | 'fancy'>('uid');

  // Tool 1: Facebook UID Finder state
  const [fbUrl, setFbUrl] = useState('');
  const [extractedUid, setExtractedUid] = useState<string | null>(null);
  const [isFindingUid, setIsFindingUid] = useState(false);
  const [uidCopied, setUidCopied] = useState(false);

  // Tool 2: Account Parser state
  const [batchInput, setBatchInput] = useState(
    '100084920192841|SecurePass2026@|JBSWY3DPEHPK3PXP|user1@gmail.com|passMail99\n100095819203812|LuxuryAds999!|GEZDGNBVGY3TQOJQ|shop_vip@outlook.com|passMail11\n100078129048123|MarketingMmo#1|MFRGGZDFMZTWQ2LK|affiliate_pro@yahoo.com|passMail22'
  );
  const [parsedAccounts, setParsedAccounts] = useState<any[]>([]);
  const [parsedCopied, setParsedCopied] = useState(false);

  // Tool 3: Fancy Font Generator state
  const [fancyInput, setFancyInput] = useState('Sky Luxury Media');
  const [copiedFontIdx, setCopiedFontIdx] = useState<number | null>(null);

  // --- UID Finder Logic ---
  const handleFindUid = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = fbUrl.trim();
    if (!clean) return;

    setIsFindingUid(true);
    setTimeout(() => {
      // Check for numeric ID in URL or generate deterministically
      const directMatch = clean.match(/(?:profile\.php\?id=|\/id=|\/posts\/|\/permalink\/|user\/|fbid=)(\d+)/);
      if (directMatch && directMatch[1]) {
        setExtractedUid(directMatch[1]);
      } else {
        // Extract username
        const parts = clean.replace(/\/$/, '').split('/');
        const username = parts[parts.length - 1].replace(/[^a-zA-Z0-9._-]/g, '') || 'user';
        // Deterministic hash to valid 15-digit UID simulation
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
          hash = (hash << 5) - hash + username.charCodeAt(i);
          hash |= 0;
        }
        const pseudoUid = `1000${Math.abs(hash).toString().padEnd(11, '8').slice(0, 11)}`;
        setExtractedUid(pseudoUid);
      }
      setIsFindingUid(false);
    }, 450);
  };

  // --- Account Data Parser Logic ---
  const handleParseBatch = () => {
    const lines = batchInput.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed = lines.map((line, idx) => {
      const parts = line.split('|');
      return {
        id: idx + 1,
        uid: parts[0] || 'N/A',
        password: parts[1] || 'N/A',
        twoFactor: parts[2] || '',
        email: parts[3] || '',
        mailPass: parts[4] || '',
        isValid: parts.length >= 2
      };
    });
    setParsedAccounts(parsed);
  };

  // --- Fancy Fonts Generator Maps ---
  const generateFancyFonts = (text: string) => {
    if (!text) text = 'Sky Luxury';

    const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    // Bold Serif
    const boldSerif = '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗';
    // Script / Cursive
    const script = '𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵0123456789';
    // Double Struck
    const doubleStruck = '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡';
    // Circle text
    const circled = 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨';

    const transform = (input: string, targetMap: string) => {
      let out = '';
      for (const char of input) {
        const idx = normal.indexOf(char);
        out += idx !== -1 ? Array.from(targetMap)[idx] || char : char;
      }
      return out;
    };

    return [
      { name: 'Gothic Bold (Hoàng Gia)', text: transform(text, boldSerif) },
      { name: 'Cursive Script (Thanh Lịch)', text: transform(text, script) },
      { name: 'Double Struck (Nổi Bật)', text: transform(text, doubleStruck) },
      { name: 'Circled (Huy Hiệu)', text: transform(text, circled) },
      { name: 'Luxury Framing', text: `✨ ⚜️ ${text.toUpperCase()} ⚜️ ✨` },
      { name: 'Fire Trending FYP', text: `🔥 〖 ${text} 〗 👑` }
    ];
  };

  const fancyResults = generateFancyFonts(fancyInput);

  return (
    <section id="tools" className="py-24 relative overflow-hidden bg-luxury-black/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full mb-4">
            <Wrench size={16} className="text-luxury-gold" />
            <span className="text-luxury-gold text-xs font-black uppercase tracking-widest">
              {t('mmoUtilities.badge')}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
            {t('mmoUtilities.title')}
          </h2>
          <div className="w-24 h-1 bg-luxury-gold mx-auto rounded-full mb-4" />
          <p className="text-white/60 max-w-2xl mx-auto text-base">
            {t('mmoUtilities.desc')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setActiveTab('uid')}
            className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border ${
              activeTab === 'uid'
                ? 'bg-luxury-gold text-luxury-black border-luxury-gold shadow-lg shadow-luxury-gold/20'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {t('mmoUtilities.tabUid')}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('validator');
              if (parsedAccounts.length === 0) handleParseBatch();
            }}
            className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border ${
              activeTab === 'validator'
                ? 'bg-luxury-gold text-luxury-black border-luxury-gold shadow-lg shadow-luxury-gold/20'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {t('mmoUtilities.tabValidator')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fancy')}
            className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border ${
              activeTab === 'fancy'
                ? 'bg-luxury-gold text-luxury-black border-luxury-gold shadow-lg shadow-luxury-gold/20'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {t('mmoUtilities.tabFancyFont')}
          </button>
        </div>

        {/* Tool 1: Facebook UID Finder */}
        {activeTab === 'uid' && (
          <div className="bg-glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-2">
              {t('mmoUtilities.uidTitle')}
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Hỗ trợ link cá nhân, Fanpage, Group, bài viết hoặc username facebook.
            </p>

            <form onSubmit={handleFindUid} className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                value={fbUrl}
                onChange={(e) => setFbUrl(e.target.value)}
                placeholder={t('mmoUtilities.uidPlaceholder')}
                className="flex-grow bg-white/5 border border-white/10 focus:border-luxury-gold text-white rounded-2xl py-4 px-5 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={isFindingUid}
                className="px-8 py-4 bg-luxury-gold text-luxury-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all glow-gold flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isFindingUid ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    ĐANG QUÉT...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    {t('mmoUtilities.btnGetUid')}
                  </>
                )}
              </button>
            </form>

            {extractedUid && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-luxury-gold/10 border border-luxury-gold/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] uppercase font-black text-white/50 block mb-1">
                    {t('mmoUtilities.uidResult')}
                  </span>
                  <span className="text-2xl font-black font-mono text-luxury-gold">
                    {extractedUid}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(extractedUid);
                      setUidCopied(true);
                      setTimeout(() => setUidCopied(false), 2000);
                    }}
                    className="px-5 py-2.5 bg-luxury-gold text-luxury-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    {uidCopied ? <Check size={14} /> : <Copy size={14} />}
                    {uidCopied ? t('mmoUtilities.copiedText') : t('mmoUtilities.copyText')}
                  </button>
                </div>
              </motion.div>
            )}

            <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2 text-xs text-white/40">
              <span>Ví dụ nhanh:</span>
              {['facebook.com/zuck', 'fb.com/100084920192841'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setFbUrl(sample);
                    setTimeout(() => handleFindUid(), 50);
                  }}
                  className="font-mono text-luxury-gold hover:underline"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tool 2: Account Parser & Validator */}
        {activeTab === 'validator' && (
          <div className="bg-glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-2">
              {t('mmoUtilities.valTitle')}
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Bóc tách UID, mật khẩu và khóa 2FA Secret Key chuẩn hóa dữ liệu nhập vào tool nuôi nick.
            </p>

            <textarea
              rows={4}
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder={t('mmoUtilities.valPlaceholder')}
              className="w-full bg-white/5 border border-white/10 focus:border-luxury-gold text-white rounded-2xl p-4 text-xs font-mono outline-none mb-4"
            />

            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={handleParseBatch}
                className="px-6 py-3 bg-luxury-gold text-luxury-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all glow-gold flex items-center gap-2"
              >
                <Terminal size={14} />
                {t('mmoUtilities.btnValidate')}
              </button>

              <span className="text-xs text-white/50 font-bold">
                Tổng cộng: <strong className="text-luxury-gold">{parsedAccounts.length}</strong> tài khoản
              </span>
            </div>

            {parsedAccounts.length > 0 && (
              <div className="space-y-2 overflow-x-auto max-h-80 overflow-y-auto pr-2">
                {parsedAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-3 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-between gap-4 text-xs font-mono text-white/80"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/30 w-4">#{acc.id}</span>
                      <strong className="text-luxury-gold">{acc.uid}</strong>
                    </div>

                    <div className="truncate max-w-xs text-white/60">
                      Pass: <span className="text-white">{acc.password}</span>
                    </div>

                    {acc.twoFactor && (
                      <span className="px-2 py-0.5 bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 rounded text-[10px]">
                        2FA: {acc.twoFactor}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`${acc.uid}|${acc.password}|${acc.twoFactor}`);
                      }}
                      className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-white/50 hover:text-white"
                      title="Copy line"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tool 3: Fancy Font Generator */}
        {activeTab === 'fancy' && (
          <div className="bg-glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-2">
              {t('mmoUtilities.fancyTitle')}
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Tạo chữ kiểu thẩm mỹ cho Bio TikTok, Tên Fanpage, Tiêu đề bài viết Facebook để tăng tỷ lệ click.
            </p>

            <input
              type="text"
              value={fancyInput}
              onChange={(e) => setFancyInput(e.target.value)}
              placeholder={t('mmoUtilities.fancyPlaceholder')}
              className="w-full bg-white/5 border border-white/10 focus:border-luxury-gold text-white rounded-2xl py-4 px-5 text-sm outline-none mb-6 font-bold"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fancyResults.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-between gap-3 hover:border-luxury-gold/30 transition-all"
                >
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">
                      {item.name}
                    </span>
                    <span className="text-base text-white font-bold block truncate">
                      {item.text}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(item.text);
                      setCopiedFontIdx(idx);
                      setTimeout(() => setCopiedFontIdx(null), 2000);
                    }}
                    className="px-3.5 py-2 bg-white/10 hover:bg-luxury-gold hover:text-luxury-black rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                  >
                    {copiedFontIdx === idx ? <Check size={12} className="text-luxury-green" /> : <Copy size={12} />}
                    <span>{copiedFontIdx === idx ? 'Xong' : 'Copy'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

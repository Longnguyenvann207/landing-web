import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Settings, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Search, 
  Save, 
  ExternalLink,
  Sliders,
  UserCheck,
  Sparkles,
  Zap,
  Phone,
  FileText
} from 'lucide-react';
import { OrderCase } from '../types/order';
import { 
  getStoredOrders, 
  updateOrderProgress, 
  createCustomerOrder, 
  deleteOrder, 
  resetOrders, 
  subscribeOrders 
} from '../services/orderStore';

interface AdminOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetOrderId?: string;
  onJumpToTracker?: (code: string) => void;
}

export const AdminOrderModal: React.FC<AdminOrderModalProps> = ({
  isOpen,
  onClose,
  targetOrderId,
  onJumpToTracker
}) => {
  const [orders, setOrders] = useState<OrderCase[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderCase | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'edit' | 'create'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'processing' | 'completed' | 'pending'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for editing
  const [editProgress, setEditProgress] = useState(50);
  const [editStatus, setEditStatus] = useState<OrderCase['status']>('processing');
  const [editStepIndex, setEditStepIndex] = useState(1);
  const [editTechnician, setEditTechnician] = useState('');
  const [editEta, setEditEta] = useState('');
  const [editTechNote, setEditTechNote] = useState('');
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Form state for creating a new order
  const [newService, setNewService] = useState('Mở khóa Checkpoint 282');
  const [newPlatform, setNewPlatform] = useState('Facebook');
  const [newCustomer, setNewCustomer] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAmount, setNewAmount] = useState(500000);

  // Subscribe to store updates
  useEffect(() => {
    setOrders(getStoredOrders());
    const unsub = subscribeOrders((updatedOrders) => {
      setOrders(updatedOrders);
    });
    return () => unsub();
  }, []);

  // Sync selectedOrder with props or first order
  useEffect(() => {
    if (!isOpen) return;
    const currentList = getStoredOrders();
    setOrders(currentList);

    if (targetOrderId) {
      const found = currentList.find(o => o.id.toUpperCase() === targetOrderId.toUpperCase());
      if (found) {
        selectOrderToEdit(found);
        setActiveTab('edit');
        return;
      }
    }

    if (currentList.length > 0 && !selectedOrder) {
      selectOrderToEdit(currentList[0]);
    }
  }, [isOpen, targetOrderId]);

  const selectOrderToEdit = (order: OrderCase) => {
    setSelectedOrder(order);
    setEditProgress(order.progress);
    setEditStatus(order.status);
    setEditStepIndex(order.currentStepIndex);
    setEditTechnician(order.technician);
    setEditEta(order.eta);
    setEditTechNote(order.techNote);
    setEditCustomerName(order.customerName);
    setEditPhone(order.phone);
    setActiveTab('edit');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedOrder) return;

    const updated = updateOrderProgress(selectedOrder.id, {
      progress: editProgress,
      status: editStatus,
      currentStepIndex: editStepIndex,
      technician: editTechnician,
      eta: editEta,
      techNote: editTechNote,
      customerName: editCustomerName,
      phone: editPhone
    });

    if (updated) {
      setSelectedOrder(updated);
      showToast(`Đã lưu thay đổi cho đơn #${updated.id} thành công!`);
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createCustomerOrder({
      service: newService,
      platform: newPlatform,
      customerName: newCustomer || 'Khách hàng VIP',
      phone: newPhone || '0988888888',
      amount: Number(newAmount) || 500000,
      paymentMethod: 'Chuyển khoản trực tiếp'
    });

    showToast(`Đã tạo đơn hàng mới #${created.id}!`);
    selectOrderToEdit(created);
    setNewCustomer('');
    setNewPhone('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa đơn hàng #${id}?`)) {
      deleteOrder(id);
      const remaining = getStoredOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder(remaining[0] || null);
        if (remaining[0]) selectOrderToEdit(remaining[0]);
        else setActiveTab('list');
      }
      showToast(`Đã xóa đơn #${id}`);
    }
  };

  const handleReset = () => {
    if (window.confirm('Khôi phục toàn bộ đơn hàng mẫu mặc định?')) {
      resetOrders();
      const fresh = getStoredOrders();
      setOrders(fresh);
      selectOrderToEdit(fresh[0]);
      showToast('Đã khôi phục dữ liệu ban đầu!');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchQuery = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.service.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchQuery) return false;
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const STEPS_LABELS = [
    'Bước 1: Tiếp nhận hồ sơ',
    'Bước 2: Xác thực & Soạn phôi bypass',
    'Bước 3: Can thiệp máy chủ (Meta/TikTok Webhook)',
    'Bước 4: Bàn giao & Kích hoạt bảo hiểm'
  ];

  const QUICK_NOTES = [
    'Đã bypass lớp 1 thành công, máy chủ đang đợi webhook xác thực cuối cùng từ Meta California.',
    'Tài khoản đã về an toàn 100%, đã đổi 2FA mới và kích hoạt gói bảo hiểm chống khóa lại 30 ngày.',
    'Đã nộp bộ hồ sơ phúc khảo chứng từ VAT và giấy phép kinh doanh lên phòng kiểm duyệt TikTok Shop VN.',
    'Kỹ thuật viên đang kiểm tra mã lỗi checkpoint 956, tỷ lệ khôi phục ước tính 98%.'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-luxury-black border border-luxury-gold/40 rounded-[2.5rem] shadow-[0_20px_80px_rgba(212,175,55,0.3)] overflow-hidden z-10 flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40 flex items-center justify-center shrink-0">
                  <Sliders size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-luxury-gold text-luxury-black">
                      ADMIN PORTAL
                    </span>
                    <span className="text-xs text-luxury-green font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-luxury-green animate-ping" />
                      Live Sync
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                    Quản Trị & Điều Chỉnh Tiến Độ Đơn Hàng
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  title="Khôi phục đơn mẫu"
                >
                  <RotateCcw size={14} />
                  <span className="hidden sm:inline">Khôi phục mẫu</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-white/[0.01] px-6 gap-2 sm:gap-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`py-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'list'
                    ? 'border-luxury-gold text-luxury-gold'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <FileText size={16} />
                <span>Danh sách đơn hàng ({orders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!selectedOrder && orders.length > 0) {
                    selectOrderToEdit(orders[0]);
                  }
                  setActiveTab('edit');
                }}
                className={`py-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'edit'
                    ? 'border-luxury-gold text-luxury-gold'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Edit3 size={16} />
                <span>
                  Chỉnh sửa tiến độ {selectedOrder ? `(#${selectedOrder.id})` : ''}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`py-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'create'
                    ? 'border-luxury-gold text-luxury-gold'
                    : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                <Plus size={16} />
                <span>Tạo đơn thủ công</span>
              </button>
            </div>

            {/* Toast notice */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-luxury-gold text-luxury-black font-black text-xs px-6 py-2 text-center tracking-wider flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* TAB 1: DANH SÁCH ĐƠN HÀNG */}
              {activeTab === 'list' && (
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                      <input
                        type="text"
                        placeholder="Tìm theo mã đơn (SKY-xxxx), tên khách, SĐT, dịch vụ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white text-xs outline-none focus:border-luxury-gold"
                      />
                    </div>
                    <div className="flex gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/5 shrink-0 overflow-x-auto">
                      {(['all', 'processing', 'completed', 'pending'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                            statusFilter === st
                              ? 'bg-luxury-gold text-luxury-black font-black'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {st === 'all' ? 'Tất cả' : st === 'processing' ? 'Đang xử lý' : st === 'completed' ? 'Hoàn thành' : 'Chờ duyệt'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orders Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredOrders.map((order) => {
                      const isSelected = selectedOrder?.id === order.id;
                      return (
                        <div
                          key={order.id}
                          className={`p-5 rounded-3xl border transition-all relative ${
                            isSelected
                              ? 'bg-luxury-gold/10 border-luxury-gold shadow-lg shadow-luxury-gold/10'
                              : 'bg-white/[0.02] border-white/10 hover:border-luxury-gold/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-base font-black text-luxury-gold">
                                  #{order.id}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    order.status === 'completed'
                                      ? 'bg-luxury-green/20 text-luxury-green border border-luxury-green/40'
                                      : order.status === 'processing'
                                      ? 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40'
                                      : 'bg-white/10 text-white/60'
                                  }`}
                                >
                                  {order.status === 'completed' ? 'Hoàn tất' : order.status === 'processing' ? 'Đang chạy' : 'Chờ xử lý'}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-white leading-tight">
                                {order.service}
                              </h4>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDelete(order.id)}
                              className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Xóa đơn"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Progress bar preview */}
                          <div className="space-y-1 mb-3">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-white/50">Tiến độ:</span>
                              <span className="text-luxury-gold font-mono">{order.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                              <div
                                className="h-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light"
                                style={{ width: `${order.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Details metadata */}
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-white/50 mb-4 bg-white/5 p-2.5 rounded-xl">
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-white/30">Khách hàng</span>
                              <span className="font-bold text-white truncate block">{order.customerName}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-white/30">SĐT</span>
                              <span className="font-bold text-white font-mono">{order.phone}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-white/30">KTV</span>
                              <span className="font-bold text-white/90 truncate block">{order.technician}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-white/30">Cập nhật</span>
                              <span className="font-bold text-white/90">{order.lastUpdate}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => selectOrderToEdit(order)}
                              className="flex-1 py-2.5 px-3 bg-luxury-gold text-luxury-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                            >
                              <Edit3 size={14} />
                              <span>Chỉnh tiến độ</span>
                            </button>
                            {onJumpToTracker && (
                              <button
                                type="button"
                                onClick={() => {
                                  onJumpToTracker(order.id);
                                  onClose();
                                }}
                                className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-white/10"
                                title="Xem trên Case Tracker của khách"
                              >
                                <ExternalLink size={14} />
                                <span className="hidden sm:inline">Xem tra cứu</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: CHỈNH SỬA TIẾN ĐỘ ĐƠN HÀNG */}
              {activeTab === 'edit' && selectedOrder && (
                <form onSubmit={handleSaveEdit} className="space-y-6 max-w-3xl mx-auto">
                  {/* Current Order Summary Banner */}
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-luxury-gold/15 to-transparent border border-luxury-gold/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xl font-black text-luxury-gold">
                          #{selectedOrder.id}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                          {selectedOrder.platform}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        {selectedOrder.service}
                      </h4>
                      <p className="text-xs text-white/50 mt-0.5">
                        Khách: <strong className="text-white">{selectedOrder.customerName}</strong> ({selectedOrder.phone})
                      </p>
                    </div>

                    {onJumpToTracker && (
                      <button
                        type="button"
                        onClick={() => {
                          onJumpToTracker(selectedOrder.id);
                          onClose();
                        }}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
                      >
                        <ExternalLink size={14} />
                        <span>Xem thực tế trang tra cứu</span>
                      </button>
                    )}
                  </div>

                  {/* 1. PROGRESS SLIDER & PRESETS */}
                  <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black uppercase tracking-widest text-luxury-gold flex items-center gap-2">
                        <Zap size={16} />
                        Tiến độ hoàn thành (%)
                      </label>
                      <span className="font-mono text-2xl font-black text-luxury-gold">
                        {editProgress}%
                      </span>
                    </div>

                    {/* Range slider */}
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={editProgress}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEditProgress(val);
                        if (val === 100) {
                          setEditStatus('completed');
                          setEditStepIndex(3);
                          setEditEta('Đã hoàn thành');
                        } else if (val > 0) {
                          setEditStatus('processing');
                          if (val <= 25) setEditStepIndex(0);
                          else if (val <= 60) setEditStepIndex(1);
                          else setEditStepIndex(2);
                        }
                      }}
                      className="w-full accent-luxury-gold cursor-pointer h-2 bg-white/10 rounded-lg"
                    />

                    {/* Quick percentage buttons */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {[0, 25, 50, 75, 90, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => {
                            setEditProgress(pct);
                            if (pct === 100) {
                              setEditStatus('completed');
                              setEditStepIndex(3);
                              setEditEta('Đã hoàn thành');
                            } else {
                              setEditStatus('processing');
                              if (pct <= 25) setEditStepIndex(0);
                              else if (pct <= 60) setEditStepIndex(1);
                              else setEditStepIndex(2);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                            editProgress === pct
                              ? 'bg-luxury-gold text-luxury-black font-black'
                              : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. STATUS & 4 STEPS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Status */}
                    <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-white/50 block">
                        Trạng thái đơn hàng
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['pending', 'processing', 'completed'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => {
                              setEditStatus(st);
                              if (st === 'completed') {
                                setEditProgress(100);
                                setEditStepIndex(3);
                                setEditEta('Đã hoàn thành');
                              }
                            }}
                            className={`py-3 px-2 rounded-2xl text-xs font-black uppercase tracking-wider text-center border transition-all ${
                              editStatus === st
                                ? st === 'completed'
                                  ? 'bg-luxury-green text-luxury-black border-luxury-green'
                                  : st === 'processing'
                                  ? 'bg-luxury-gold text-luxury-black border-luxury-gold'
                                  : 'bg-white/20 text-white border-white/40'
                                : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                            }`}
                          >
                            {st === 'completed' ? 'Hoàn thành' : st === 'processing' ? 'Đang xử lý' : 'Chờ xử lý'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step selection */}
                    <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-white/50 block">
                        Giai đoạn quy trình (Bước 1 - 4)
                      </label>
                      <select
                        value={editStepIndex}
                        onChange={(e) => setEditStepIndex(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white text-xs font-bold outline-none focus:border-luxury-gold"
                      >
                        {STEPS_LABELS.map((label, idx) => (
                          <option key={idx} value={idx} className="bg-luxury-black text-white">
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3. TECHNICIAN & ETA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-white/50">
                        Kỹ thuật viên phụ trách
                      </label>
                      <div className="relative">
                        <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                        <input
                          type="text"
                          value={editTechnician}
                          onChange={(e) => setEditTechnician(e.target.value)}
                          placeholder="Ví dụ: Hoàng Nam (Senior Specialist)"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-xs outline-none focus:border-luxury-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-white/50">
                        Thời gian ước tính (ETA)
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                        <input
                          type="text"
                          value={editEta}
                          onChange={(e) => setEditEta(e.target.value)}
                          placeholder="Ví dụ: ~15 - 20 phút, hoặc Đã hoàn thành"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-white text-xs outline-none focus:border-luxury-gold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. TECHNICIAN NOTE */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/50 flex justify-between">
                      <span>Ghi chú chuyên viên (Hiển thị trực tiếp cho khách tra cứu)</span>
                      <span className="text-luxury-gold cursor-pointer" onClick={() => setEditTechNote(QUICK_NOTES[0])}>
                        Nạp mẫu nhanh
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={editTechNote}
                      onChange={(e) => setEditTechNote(e.target.value)}
                      placeholder="Nhập chi tiết tiến trình kỹ thuật đang can thiệp để khách hàng yên tâm..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs outline-none focus:border-luxury-gold leading-relaxed"
                    />

                    {/* Quick suggestion tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {QUICK_NOTES.map((note, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditTechNote(note)}
                          className="text-[10px] px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 truncate max-w-xs transition-all text-left"
                        >
                          "{note}"
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. CUSTOMER EDIT */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                        Tên khách hàng
                      </label>
                      <input
                        type="text"
                        value={editCustomerName}
                        onChange={(e) => setEditCustomerName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white text-xs outline-none focus:border-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                        Số điện thoại tra cứu
                      </label>
                      <input
                        type="text"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white text-xs font-mono outline-none focus:border-luxury-gold"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-luxury-gold text-luxury-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all glow-gold flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      <span>LƯU CẬP NHẬT TIẾN ĐỘ ĐƠN #{selectedOrder.id}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('list')}
                      className="py-4 px-6 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all"
                    >
                      Quay lại danh sách
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: TẠO ĐƠN THỦ CÔNG */}
              {activeTab === 'create' && (
                <form onSubmit={handleCreateOrder} className="space-y-5 max-w-2xl mx-auto">
                  <div className="p-4 bg-luxury-gold/10 border border-luxury-gold/30 rounded-2xl text-xs text-luxury-gold font-bold">
                    Tạo đơn hàng mới cho khách tiếp nhận qua Hotline, Zalo hoặc trực tiếp tại văn phòng. Mã đơn (SKY-xxxx) sẽ tự sinh và có thể dùng tra cứu ngay tức khắc.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-white/50">
                        Nền tảng
                      </label>
                      <select
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white text-xs outline-none focus:border-luxury-gold font-bold"
                      >
                        <option value="Facebook" className="bg-luxury-black">Facebook</option>
                        <option value="TikTok" className="bg-luxury-black">TikTok</option>
                        <option value="MMO & Tool" className="bg-luxury-black">MMO & Tool</option>
                        <option value="Google & Ads" className="bg-luxury-black">Google & Ads</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-white/50">
                        Chi phí (VND)
                      </label>
                      <input
                        type="number"
                        value={newAmount}
                        onChange={(e) => setNewAmount(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white text-xs font-mono outline-none focus:border-luxury-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-white/50">
                      Tên dịch vụ / Sự cố cần xử lý
                    </label>
                    <input
                      type="text"
                      required
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Ví dụ: Mở khóa Checkpoint 282, Tăng follow Fanpage, Gỡ vi phạm..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white text-xs outline-none focus:border-luxury-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-white/50">
                        Tên khách hàng
                      </label>
                      <input
                        type="text"
                        required
                        value={newCustomer}
                        onChange={(e) => setNewCustomer(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white text-xs outline-none focus:border-luxury-gold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-widest text-white/50">
                        Số điện thoại khách (để tra cứu)
                      </label>
                      <input
                        type="tel"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="Ví dụ: 0988123456"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white text-xs font-mono outline-none focus:border-luxury-gold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-luxury-gold text-luxury-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all glow-gold flex items-center justify-center gap-2 pt-4"
                  >
                    <Plus size={18} />
                    <span>TẠO ĐƠN VÀ ĐƯA VÀO HỆ THỐNG XỬ LÝ</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

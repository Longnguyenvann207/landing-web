import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
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
  FileText,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  LayoutDashboard,
  Check,
  Copy,
  Lock,
  Key,
  LogOut
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

interface AdminPageProps {
  onBackToHome: () => void;
  onJumpToTracker: (code: string) => void;
  initialOrderId?: string;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  onBackToHome,
  onJumpToTracker,
  initialOrderId
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
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

  // Subscribe to live order updates
  useEffect(() => {
    const fresh = getStoredOrders();
    setOrders(fresh);

    if (initialOrderId) {
      const found = fresh.find(o => o.id.toUpperCase() === initialOrderId.toUpperCase());
      if (found) {
        selectOrderToEdit(found);
        setActiveTab('edit');
      } else if (fresh.length > 0) {
        selectOrderToEdit(fresh[0]);
      }
    } else if (fresh.length > 0) {
      selectOrderToEdit(fresh[0]);
    }

    const unsub = subscribeOrders((updatedOrders) => {
      setOrders(updatedOrders);
    });
    return () => unsub();
  }, [initialOrderId]);

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
      showToast(`Đã lưu cập nhật tiến độ #${updated.id} thành công!`);
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
      if (fresh[0]) selectOrderToEdit(fresh[0]);
      showToast('Đã khôi phục dữ liệu ban đầu!');
    }
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
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

  // Stats calculation
  const totalOrders = orders.length;
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 500000), 0);

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-6 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Security & Access Banner */}
        <div className="p-4 bg-luxury-gold/10 border border-luxury-gold/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-luxury-gold font-medium">
            <Lock size={16} className="shrink-0" />
            <span>
              <strong>Khu vực Quản trị viên bí mật:</strong> Truy cập trực tiếp qua URL <code className="bg-black/50 px-2 py-0.5 rounded text-white font-mono">/admin</code> hoặc <code className="bg-black/50 px-2 py-0.5 rounded text-white font-mono">/#admin</code>. Giao diện khách hàng hoàn toàn không hiển thị nút admin để tránh khách bấm vào.
            </span>
          </div>
          <button
            type="button"
            onClick={onBackToHome}
            className="px-3.5 py-1.5 bg-luxury-gold text-luxury-black font-black uppercase text-[10px] tracking-wider rounded-xl hover:scale-105 transition-all shrink-0"
          >
            ← Về Website Khách Hàng
          </button>
        </div>

        {/* Top Navigation Bar of Admin Page */}
        <div className="bg-luxury-black/90 backdrop-blur-xl border border-luxury-gold/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="p-3 bg-white/5 hover:bg-luxury-gold hover:text-luxury-black rounded-2xl border border-white/10 transition-all flex items-center gap-2 text-xs font-bold"
              title="Quay lại giao diện website chính"
            >
              <ArrowLeft size={18} />
              <span>Về Website Chính</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-luxury-gold text-luxury-black font-black text-[10px] tracking-wider uppercase">
                  ADMIN DASHBOARD
                </span>
                <span className="text-xs text-luxury-green font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-luxury-green animate-ping" />
                  Đang hoạt động (URL Mode)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                TRANG QUẢN TRỊ & ĐIỀU CHỈNH TIẾN ĐỘ ĐƠN HÀNG
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
            <button
              type="button"
              onClick={onBackToHome}
              className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-luxury-gold hover:text-luxury-black text-white text-xs font-bold transition-all flex items-center gap-1.5"
              title="Quay lại trang chủ"
            >
              <ArrowLeft size={14} />
              <span>Thoát Admin</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Khôi phục mẫu</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onJumpToTracker(selectedOrder?.id || 'SKY-8821');
              }}
              className="px-4 py-2 bg-luxury-gold text-luxury-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all flex items-center gap-1.5 shadow-md shadow-luxury-gold/20"
            >
              <ExternalLink size={14} />
              <span>Xem trang Tra cứu của Khách</span>
            </button>
          </div>
        </div>

        {/* Stats KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <div className="p-5 bg-white/[0.02] border border-white/10 rounded-3xl">
            <div className="flex justify-between items-center text-white/40 text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">Tổng đơn hàng</span>
              <LayoutDashboard size={16} className="text-luxury-gold" />
            </div>
            <div className="text-3xl font-mono font-black text-white">{totalOrders}</div>
            <span className="text-[10px] text-white/40 mt-1 block">Toàn bộ hồ sơ trên hệ thống</span>
          </div>

          <div className="p-5 bg-luxury-gold/10 border border-luxury-gold/30 rounded-3xl">
            <div className="flex justify-between items-center text-luxury-gold text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">Đang xử lý</span>
              <Clock size={16} className="text-luxury-gold animate-spin" />
            </div>
            <div className="text-3xl font-mono font-black text-luxury-gold">{processingCount}</div>
            <span className="text-[10px] text-luxury-gold/70 mt-1 block">KTV đang can thiệp</span>
          </div>

          <div className="p-5 bg-luxury-green/10 border border-luxury-green/30 rounded-3xl">
            <div className="flex justify-between items-center text-luxury-green text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">Đã hoàn thành</span>
              <CheckCircle2 size={16} className="text-luxury-green" />
            </div>
            <div className="text-3xl font-mono font-black text-luxury-green">{completedCount}</div>
            <span className="text-[10px] text-luxury-green/70 mt-1 block">Đã bàn giao 100%</span>
          </div>

          <div className="p-5 bg-white/[0.02] border border-white/10 rounded-3xl">
            <div className="flex justify-between items-center text-white/40 text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">Chờ tiếp nhận</span>
              <AlertCircle size={16} className="text-white/40" />
            </div>
            <div className="text-3xl font-mono font-black text-white/80">{pendingCount}</div>
            <span className="text-[10px] text-white/40 mt-1 block">Đang đợi số hóa</span>
          </div>

          <div className="p-5 bg-white/[0.02] border border-white/10 rounded-3xl col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center text-white/40 text-xs mb-2">
              <span className="font-bold uppercase tracking-wider">Tổng giá trị đơn</span>
              <TrendingUp size={16} className="text-luxury-green" />
            </div>
            <div className="text-2xl font-mono font-black text-luxury-gold truncate">{formatVND(totalRevenue)}</div>
            <span className="text-[10px] text-white/40 mt-1 block">Doanh số đơn tiếp nhận</span>
          </div>
        </div>

        {/* Toast notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-luxury-gold text-luxury-black font-black text-xs rounded-2xl tracking-wider flex items-center justify-center gap-2 shadow-xl"
            >
              <CheckCircle2 size={18} />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Controls */}
        <div className="flex gap-2 sm:gap-4 border-b border-white/10 pb-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`py-3 px-5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'list'
                ? 'bg-luxury-gold text-luxury-black shadow-lg shadow-luxury-gold/20'
                : 'bg-white/5 text-white/60 hover:text-white'
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
            className={`py-3 px-5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'edit'
                ? 'bg-luxury-gold text-luxury-black shadow-lg shadow-luxury-gold/20'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Edit3 size={16} />
            <span>
              Bảng chỉnh sửa tiến độ {selectedOrder ? `(#${selectedOrder.id})` : ''}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`py-3 px-5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'create'
                ? 'bg-luxury-gold text-luxury-black shadow-lg shadow-luxury-gold/20'
                : 'bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            <Plus size={16} />
            <span>Tạo đơn thủ công mới</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-glass border border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
          {/* TAB 1: DANH SÁCH ĐƠN HÀNG */}
          {activeTab === 'list' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="text"
                    placeholder="Tìm theo mã đơn (SKY-xxxx), tên khách, SĐT, dịch vụ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white text-xs outline-none focus:border-luxury-gold"
                  />
                </div>
                <div className="flex gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/5 shrink-0 overflow-x-auto">
                  {(['all', 'processing', 'completed', 'pending'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <div
                      key={order.id}
                      className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-luxury-gold/10 border-luxury-gold shadow-xl shadow-luxury-gold/10'
                          : 'bg-white/[0.02] border-white/10 hover:border-luxury-gold/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-lg font-black text-luxury-gold">
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
                                {order.status === 'completed' ? 'Hoàn tất' : order.status === 'processing' ? 'Đang xử lý' : 'Chờ duyệt'}
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
                        <div className="space-y-1 mb-4">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-white/50">Tiến độ hoàn thành:</span>
                            <span className="text-luxury-gold font-mono font-black">{order.progress}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <div
                              className="h-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light"
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Metadata summary */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-white/50 mb-4 bg-white/5 p-3 rounded-2xl">
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-white/30">Khách hàng</span>
                            <span className="font-bold text-white truncate block">{order.customerName}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-white/30">Số điện thoại</span>
                            <span className="font-bold text-white font-mono">{order.phone}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-white/30">KTV Phụ trách</span>
                            <span className="font-bold text-white/90 truncate block">{order.technician}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase tracking-wider text-white/30">Cập nhật</span>
                            <span className="font-bold text-white/90">{order.lastUpdate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => selectOrderToEdit(order)}
                          className="flex-1 py-3 px-3 bg-luxury-gold text-luxury-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                        >
                          <Sliders size={14} />
                          <span>Chỉnh tiến độ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onJumpToTracker(order.id)}
                          className="py-3 px-3 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-white/10"
                          title="Xem trên trang Tra Cứu"
                        >
                          <ExternalLink size={14} />
                          <span className="hidden sm:inline">Tra cứu</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BẢNG CHỈNH SỬA TIẾN ĐỘ ĐƠN HÀNG */}
          {activeTab === 'edit' && selectedOrder && (
            <form onSubmit={handleSaveEdit} className="space-y-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-luxury-gold/20 via-luxury-gold/5 to-transparent border border-luxury-gold/40 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-2xl font-black text-luxury-gold">
                      #{selectedOrder.id}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white font-bold">
                      {selectedOrder.platform}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedOrder.service}
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    Khách hàng: <strong className="text-white">{selectedOrder.customerName}</strong> • SĐT: <strong className="text-white font-mono">{selectedOrder.phone}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onJumpToTracker(selectedOrder.id)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
                >
                  <ExternalLink size={14} />
                  <span>Xem trên trang Tra cứu</span>
                </button>
              </div>

              {/* 1. PROGRESS SLIDER & PRESETS */}
              <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/10 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black uppercase tracking-widest text-luxury-gold flex items-center gap-2">
                    <Zap size={16} />
                    Tiến độ hoàn thành của ca xử lý (%)
                  </label>
                  <span className="font-mono text-3xl font-black text-luxury-gold">
                    {editProgress}%
                  </span>
                </div>

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
                  className="w-full accent-luxury-gold cursor-pointer h-3 bg-white/10 rounded-lg"
                />

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
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                        editProgress === pct
                          ? 'bg-luxury-gold text-luxury-black font-black shadow-md shadow-luxury-gold/20'
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

                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-white/50 block">
                    Giai đoạn quy trình (Bước 1 - 4)
                  </label>
                  <select
                    value={editStepIndex}
                    onChange={(e) => setEditStepIndex(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-xs font-bold outline-none focus:border-luxury-gold"
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
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white text-xs outline-none focus:border-luxury-gold"
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
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-white text-xs outline-none focus:border-luxury-gold"
                    />
                  </div>
                </div>
              </div>

              {/* 4. TECHNICIAN NOTE */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/50 flex justify-between">
                  <span>Ghi chú chuyên viên (Khách hàng sẽ nhìn thấy ghi chú này khi tra cứu)</span>
                  <span className="text-luxury-gold cursor-pointer" onClick={() => setEditTechNote(QUICK_NOTES[0])}>
                    Dùng mẫu nhanh
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={editTechNote}
                  onChange={(e) => setEditTechNote(e.target.value)}
                  placeholder="Ghi chú chi tiết về tình trạng kỹ thuật hiện tại của hồ sơ..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs outline-none focus:border-luxury-gold leading-relaxed"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_NOTES.map((note, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditTechNote(note)}
                      className="text-[11px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 truncate max-w-sm transition-all text-left"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs outline-none focus:border-luxury-gold"
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs font-mono outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-luxury-gold text-luxury-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all glow-gold flex items-center justify-center gap-2 shadow-lg shadow-luxury-gold/25"
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
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-xs outline-none focus:border-luxury-gold font-bold"
                  >
                    <option value="Facebook" className="bg-luxury-black">Facebook</option>
                    <option value="TikTok" className="bg-luxury-black">TikTok</option>
                    <option value="MMO & Tool" className="bg-luxury-black">MMO & Tool</option>
                    <option value="Google & Ads" className="bg-luxury-black">Google & Ads</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-white/50">
                    Chi phí dịch vụ (VND)
                  </label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-xs font-mono outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-white/50">
                  Tên dịch vụ / Lỗi cần xử lý
                </label>
                <input
                  type="text"
                  required
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Ví dụ: Mở khóa Checkpoint 282, Tăng follow Fanpage, Gỡ vi phạm..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-xs outline-none focus:border-luxury-gold"
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
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-xs outline-none focus:border-luxury-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-white/50">
                    Số điện thoại khách
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Ví dụ: 0988123456"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-white text-xs font-mono outline-none focus:border-luxury-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-luxury-gold text-luxury-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all glow-gold flex items-center justify-center gap-2 shadow-lg shadow-luxury-gold/25"
              >
                <Plus size={18} />
                <span>TẠO ĐƠN VÀ ĐƯA VÀO HỆ THỐNG XỬ LÝ</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

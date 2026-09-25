import { OrderCase } from '../types/order';

const STORAGE_KEY = 'skyluxury_orders_db_v2';
const RECENT_ORDER_KEY = 'skyluxury_recent_order_code';
const EVENT_NAME = 'skyluxury_orders_updated';

export const INITIAL_ORDERS: OrderCase[] = [
  {
    id: 'SKY-8821',
    phone: '0984128219',
    customerName: 'Trần M*** T**',
    platform: 'Facebook',
    service: 'Mở khóa Checkpoint 282 (Úp mặt/CCCD)',
    status: 'processing',
    progress: 75,
    technician: 'Hoàng Nam (Senior Specialist)',
    lastUpdate: '5 phút trước',
    eta: '~15 - 20 phút',
    techNote: 'Đã nạp phôi CCCD chuẩn meta và bypass lớp 1, máy chủ đang đợi webhook xác thực cuối cùng từ Meta California.',
    currentStepIndex: 2,
    amount: 500000,
    createdAt: 'Hôm nay'
  },
  {
    id: 'SKY-9562',
    phone: '0334882910',
    customerName: 'Nguyễn V*** L**',
    platform: 'Facebook',
    service: 'Mở khóa Két sắt tím 956 & Đổi pass spam',
    status: 'completed',
    progress: 100,
    technician: 'Quang Huy (Security Lead)',
    lastUpdate: '30 phút trước',
    eta: 'Đã hoàn thành',
    techNote: 'Tài khoản đã về an toàn 100%, đã bật xác thực 2FA mới và kích hoạt gói bảo hiểm chống khóa lại 30 ngày.',
    currentStepIndex: 3,
    amount: 500000,
    createdAt: 'Hôm nay'
  },
  {
    id: 'SKY-4410',
    phone: '0903847543',
    customerName: 'Shop Trang S***',
    platform: 'TikTok',
    service: 'Gỡ vi phạm chính sách & Mở khóa TikTok Shop',
    status: 'processing',
    progress: 50,
    technician: 'Đức Anh (TikTok Operations)',
    lastUpdate: '18 phút trước',
    eta: '~1 - 2 giờ',
    techNote: 'Đã nộp bộ hồ sơ phúc khảo chứng từ VAT và giấy phép kinh doanh lên phòng kiểm duyệt TikTok Shop VN.',
    currentStepIndex: 1,
    amount: 800000,
    createdAt: 'Hôm nay'
  },
  {
    id: 'SKY-1088',
    phone: '0334063029',
    customerName: 'Khách hàng VIP',
    platform: 'Facebook & MMO',
    service: 'Cấp bộ Tool Nuôi Nick & Hỗ trợ Unlock Ads',
    status: 'completed',
    progress: 100,
    technician: 'Sky Luxury Master Team',
    lastUpdate: '10 phút trước',
    eta: 'Đã hoàn thành',
    techNote: 'Hệ thống đã kích hoạt bản quyền Tool MMO Pro v4.2 và bàn giao danh sách proxy IPv4 sạch riêng biệt.',
    currentStepIndex: 3,
    amount: 1500000,
    createdAt: 'Hôm nay'
  }
];

export const getStoredOrders = (): OrderCase[] => {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ORDERS;
  } catch (err) {
    console.error('Failed to load orders from storage', err);
    return INITIAL_ORDERS;
  }
};

export const saveOrders = (orders: OrderCase[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: orders }));
  } catch (err) {
    console.error('Failed to save orders to storage', err);
  }
};

export const findOrder = (query: string): OrderCase | undefined => {
  if (!query) return undefined;
  const orders = getStoredOrders();
  const clean = query.trim().toUpperCase().replace('#', '');
  const cleanDigits = query.replace(/\D/g, '');

  return orders.find(o => {
    const oId = o.id.toUpperCase();
    const oPhone = (o.phone || '').replace(/\D/g, '');
    if (oId === clean || oId.replace('-', '') === clean.replace('-', '')) return true;
    if (cleanDigits.length >= 6 && oPhone.includes(cleanDigits)) return true;
    return false;
  });
};

export const updateOrderProgress = (
  id: string,
  updates: Partial<OrderCase>
): OrderCase | null => {
  const orders = getStoredOrders();
  const index = orders.findIndex(o => o.id.toUpperCase() === id.trim().toUpperCase());
  if (index === -1) return null;

  const existing = orders[index];
  const updated: OrderCase = {
    ...existing,
    ...updates,
    lastUpdate: updates.lastUpdate || 'Vừa xong (bởi Admin)'
  };

  orders[index] = updated;
  saveOrders(orders);
  return updated;
};

export const createCustomerOrder = (data: {
  service: string;
  platform?: string;
  customerName?: string;
  phone?: string;
  amount?: number;
  paymentMethod?: string;
  customId?: string;
  techNote?: string;
}): OrderCase => {
  const orders = getStoredOrders();
  
  // Generate random 4 digits not already existing
  let id = data.customId;
  if (!id) {
    let rand = Math.floor(1000 + Math.random() * 9000);
    while (orders.some(o => o.id === `SKY-${rand}`)) {
      rand = Math.floor(1000 + Math.random() * 9000);
    }
    id = `SKY-${rand}`;
  }

  const newOrder: OrderCase = {
    id,
    phone: data.phone || '0334063029',
    customerName: data.customerName || 'Khách hàng mới',
    platform: data.platform || 'Facebook',
    service: data.service,
    status: 'processing',
    progress: 25,
    technician: 'KTV Trực ban 24/7 (Sky Luxury)',
    lastUpdate: 'Vừa tạo đơn',
    eta: '~15 - 30 phút',
    techNote: data.techNote || 'Hồ sơ đã được ghi nhận trên hệ thống. Kỹ thuật viên đang kiểm tra và chuẩn bị công cụ xử lý.',
    currentStepIndex: 0,
    amount: data.amount || 500000,
    createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    paymentMethod: data.paymentMethod || 'VietQR / ZaloPay'
  };

  // Prepend new order
  const updated = [newOrder, ...orders.filter(o => o.id !== id)];
  saveOrders(updated);
  setRecentOrderCode(id);

  return newOrder;
};

export const deleteOrder = (id: string): void => {
  const orders = getStoredOrders();
  const filtered = orders.filter(o => o.id.toUpperCase() !== id.trim().toUpperCase());
  saveOrders(filtered);
};

export const resetOrders = (): void => {
  saveOrders(INITIAL_ORDERS);
};

export const getRecentOrderCode = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(RECENT_ORDER_KEY);
};

export const setRecentOrderCode = (code: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RECENT_ORDER_KEY, code);
};

export const subscribeOrders = (callback: (orders: OrderCase[]) => void): (() => void) => {
  const handler = (e: any) => {
    callback(e.detail || getStoredOrders());
  };
  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredOrders());
    }
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', storageHandler);
  };
};

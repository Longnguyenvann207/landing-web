export interface OrderCase {
  id: string; // e.g. 'SKY-8821'
  phone: string;
  customerName: string;
  platform: string;
  service: string;
  status: 'processing' | 'completed' | 'pending';
  progress: number; // 0 to 100
  technician: string;
  lastUpdate: string;
  eta: string;
  techNote: string;
  currentStepIndex: number; // 0: Tiếp nhận, 1: Xác thực & Soạn phôi, 2: Can thiệp máy chủ, 3: Bàn giao & Bảo hành
  amount?: number;
  createdAt?: string;
  paymentMethod?: string;
}

import { Trade } from '../types';

export const DEFAULT_TRADES: Trade[] = [
  {
    id: 't-1',
    date: '2026-05-02',
    asset: 'BTCUSDT',
    type: 'Short',
    rResult: -1.5,
    isPlan: true,
    isEntry: true,
    isReview: true,
    notes: 'Vào lệnh đúng kế hoạch tại kháng cự khung H4. Tuy nhiên giá quét stop-loss trước khi đảo chiều.'
  },
  {
    id: 't-2',
    date: '2026-05-05',
    asset: 'ETHUSDT',
    type: 'Long',
    rResult: -2.0,
    isPlan: false,
    isEntry: false,
    isReview: true,
    notes: 'FOMO vào lệnh nhanh khi thấy nến xanh tăng mạnh. Vi phạm kỷ luật nghiêm trọng.'
  },
  {
    id: 't-3',
    date: '2026-05-09',
    asset: 'GOLD',
    type: 'Short',
    rResult: -1.8,
    isPlan: true,
    isEntry: false,
    isReview: true,
    notes: 'Vào lệnh vội vã lúc tin tức ra, trượt giá nặng.'
  },
  {
    id: 't-4',
    date: '2026-05-12',
    asset: 'BTCUSDT',
    type: 'Long',
    rResult: 2.5,
    isPlan: true,
    isEntry: true,
    isReview: true,
    notes: 'Kế hoạch mua tại hỗ trợ cứng. Giá phản ứng cực đẹp đạt Target 1.'
  },
  {
    id: 't-5',
    date: '2026-05-15',
    asset: 'SOLUSDT',
    type: 'Long',
    rResult: 2.5,
    isPlan: true,
    isEntry: true,
    isReview: true,
    notes: 'Giao dịch theo xu hướng tăng H1. Quản lý lệnh tốt.'
  },
  {
    id: 't-6',
    date: '2026-05-18',
    asset: 'XAUUSD',
    type: 'Short',
    rResult: 0.0,
    isPlan: false,
    isEntry: false,
    isReview: true,
    notes: 'Hòa vốn. Thoát lệnh sớm do lực mua tăng mạnh ngoài dự kiến.'
  },
  {
    id: 't-7',
    date: '2026-05-22',
    asset: 'EURUSD',
    type: 'Long',
    rResult: 2.0,
    isPlan: false,
    isEntry: false,
    isReview: true,
    notes: 'Ăn may. Vào lệnh không có kế hoạch kỹ lưỡng nhưng ăn sóng hồi ngắn hạn.'
  },
  {
    id: 't-8',
    date: '2026-05-25',
    asset: 'BTCUSDT',
    type: 'Short',
    rResult: -2.2,
    isPlan: false,
    isEntry: false,
    isReview: false,
    notes: 'Vào lệnh ngược xu hướng tăng mạnh khung D1. Thua lỗ nặng nhất.'
  },
  {
    id: 't-9',
    date: '2026-05-28',
    asset: 'ETHUSDT',
    type: 'Long',
    rResult: -1.5,
    isPlan: false,
    isEntry: false,
    isReview: true,
    notes: 'Cố gắng gỡ gạc cuối tháng. Không quản lý rủi ro tốt.'
  }
];

export interface Trade {
  id: string;
  date: string; // YYYY-MM-DD
  asset: string; // e.g., BTCUSDT, EURUSD, GOLD...
  type: 'Long' | 'Short';
  rResult: number; // e.g., +2.5, -1.0, 0
  isPlan: boolean; // Đúng Kế hoạch
  isEntry: boolean; // Đúng Entry
  isReview: boolean; // Đã Review
  notes?: string;
}

export type ChartCategory = 'Plan' | 'Entry' | 'Review';

export interface JournalStats {
  netR: number;
  totalTrades: number;
  winRate: number; // percentage, e.g. 33
  expectancy: number; // Net R / total or computed expectancy
  disciplineRate: number; // percentage of fully disciplined trades
  profitFactor: number;
  maxDrawdown: number;
  winStreak: number;
  lossStreak: number;
  avgWin: number;
  avgLoss: number;
}

import { useState, useMemo } from 'react';
import { Trade } from './types';
import { DEFAULT_TRADES } from './data/defaultTrades';
import { calculateStats } from './utils';

// Import sub-components
import MetricCircleCard from './components/MetricCircleCard';
import ResultChart from './components/ResultChart';
import StatCard from './components/StatCard';
import TradeTable from './components/TradeTable';
import TradeForm from './components/TradeForm';

// Import icons
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  ShieldAlert,
  Flame,
  FileText,
  BookOpen,
  SlidersHorizontal,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  Layers,
  ChevronDown,
  Activity,
  Plus
} from 'lucide-react';

export default function App() {
  // Main trade entries state
  const [trades, setTrades] = useState<Trade[]>(DEFAULT_TRADES);
  
  // Date range filters (mock matches the picture's default)
  const [startDate, setStartDate] = useState('2026-05-01');
  const [endDate, setEndDate] = useState('2026-05-31');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Selected trade ID for highlighted detail/note
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

  // Active discipline tab ('Plan' | 'Entry' | 'Review') for the central chart
  const [activeDisciplineTab, setActiveDisciplineTab] = useState<'Plan' | 'Entry' | 'Review'>('Plan');

  // Trade Form Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  // Filtered trades by Date and Search asset
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const matchDate = trade.date >= startDate && trade.date <= endDate;
      const matchSearch = trade.asset.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDate && matchSearch;
    });
  }, [trades, startDate, endDate, searchTerm]);

  // Derived stats
  const stats = useMemo(() => calculateStats(filteredTrades), [filteredTrades]);

  // Handlers
  const handleSaveTrade = (tradeData: Omit<Trade, 'id'> & { id?: string }) => {
    if (tradeData.id) {
      // Edit mode
      setTrades((prev) =>
        prev.map((t) => (t.id === tradeData.id ? (tradeData as Trade) : t))
      );
    } else {
      // Add mode
      const newTrade: Trade = {
        ...tradeData,
        id: `t-user-${Date.now()}`
      };
      setTrades((prev) => [...prev, newTrade]);
    }
    setIsFormOpen(false);
    setEditingTrade(null);
  };

  const handleEditClick = (trade: Trade) => {
    setEditingTrade(trade);
    setIsFormOpen(true);
  };

  const handleDeleteTrade = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      setTrades((prev) => prev.filter((t) => t.id !== id));
      if (selectedTradeId === id) {
        setSelectedTradeId(null);
      }
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Đặt lại toàn bộ dữ liệu về chuỗi 9 lệnh mặc định trong ảnh?')) {
      setTrades(DEFAULT_TRADES);
      setStartDate('2026-05-01');
      setEndDate('2026-05-31');
      setSearchTerm('');
      setSelectedTradeId(null);
    }
  };

  // Quick formatting helper for vietnam date display
  const fDate = (isoString: string) => {
    const parts = isoString.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return isoString;
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] pb-16 font-sans">
      
      {/* Upper Navigation & Brand Banner */}
      <header className="bg-white border-b border-indigo-50/50 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm shadow-indigo-200">
            L
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight">Luminous Trader</h1>
            <p className="text-[10px] text-slate-400 font-medium">Trading Journal & Discipline Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick info toggle */}
          <div className="hidden lg:flex items-center gap-2 text-xs bg-indigo-50/40 border border-indigo-100 rounded-xl px-4 py-2 text-slate-600 max-w-sm">
            <Info size={14} className="text-primary flex-shrink-0" />
            <p className="line-clamp-1">
              Thực hành kỷ luật 3 bước để tối ưu hóa hiệu suất tỉ số R
            </p>
          </div>

          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
            title="Đặt lại dữ liệu mô phỏng như ảnh chụp"
          >
            <RefreshCw size={13} />
            Đặt lại hệ thống
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6 grid grid-cols-1 gap-6">
        
        {/* TOP LAYOUT SPLIT: Left Summary metrics & Right interactive chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT CHUNK: Header Indicator (Net R, total trades, date) + 3 Metrics Circle cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Main Header Card showing: -2R / 9 lệnh */}
            <div className="flex flex-col space-y-4">
              
              <div className="flex flex-col space-y-2">
                {/* Happy Trading indicator tab exactly as in the photo */}
                <div className="self-start">
                  <span className="inline-flex items-center gap-1.5 bg-[#eaedff] text-[#493ee5] px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide">
                    <Activity size={12} className="stroke-[#493ee5]" />
                    Happy Trading
                  </span>
                </div>

                {/* Main figure: -2R / 9 lệnh */}
                <div className="flex items-baseline gap-2">
                  <span className="text-[48px] font-extrabold tracking-tight text-[#131b2e] leading-none">
                    {stats.netR > 0 ? `+${stats.netR}` : stats.netR}R
                  </span>
                  <span className="text-3xl text-slate-400 font-medium">/</span>
                  <span className="text-3xl text-[#131b2e] font-bold">
                    {stats.totalTrades} lệnh
                  </span>
                </div>
              </div>

              {/* Date Filter Widget beautifully aligned */}
              <div className="relative self-start">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-2 bg-white rounded-2xl px-5 py-3 shadow-[0_4px_20px_rgba(4,4,10,0.03)] border border-slate-100 hover:border-indigo-100 text-[#131b2e] text-xs font-bold transition-all cursor-pointer"
                >
                  <Calendar size={14} className="text-primary" />
                  <span>{fDate(startDate)} – {fDate(endDate)}</span>
                  <ChevronDown size={14} className="text-slate-400 ml-1" />
                </button>

                {/* Hoverable date input selectors */}
                {showDatePicker && (
                  <div className="absolute left-0 mt-2 z-30 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl w-64 animate-fade-in space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-600">Lọc khoảng thời gian</span>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="text-[10px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 hover:bg-slate-200 font-semibold"
                      >
                        Xong
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">Từ ngày</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 outline-none focus:border-primary font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase">Đến ngày</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 outline-none focus:border-primary font-semibold"
                      />
                    </div>
                    {/* Quick presets */}
                    <div className="pt-2 border-t border-slate-100 flex gap-2 justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setStartDate('2026-05-01');
                          setEndDate('2026-05-31');
                          setShowDatePicker(false);
                        }}
                        className="text-[10px] text-primary font-black hover:underline"
                      >
                        Tháng 5/2026
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const last30 = new Date();
                          last30.setDate(last30.getDate() - 30);
                          setStartDate(last30.toISOString().split('T')[0]);
                          setEndDate(new Date().toISOString().split('T')[0]);
                          setShowDatePicker(false);
                        }}
                        className="text-[10px] text-primary font-black hover:underline"
                      >
                        30 ngày qua
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Grid of the 3 key Circle metrics row: Win Rate, Expectancy, Kỷ Luật */}
            <div className="grid grid-cols-3 gap-4">
              
              {/* Win Rate Card */}
              <MetricCircleCard
                id="metric-win-rate"
                label="Win Rate"
                value={`${stats.winRate}%`}
                valueColorClass="text-emerald-500 font-black"
                icon={<TrendingUp size={16} className="text-emerald-500" />}
                iconBgColor="#e6f7ec"
              />

              {/* Expectancy Card */}
              <MetricCircleCard
                id="metric-expectancy"
                label="Expectancy"
                value={`${stats.expectancy}R`}
                valueColorClass={stats.expectancy >= 0 ? 'text-emerald-500 font-black' : 'text-rose-500 font-black'}
                icon={<Target size={16} className={stats.expectancy >= 0 ? 'text-emerald-500' : 'text-rose-500'} />}
                iconBgColor={stats.expectancy >= 0 ? '#e6f7ec' : '#fdf2f2'}
              />

              {/* Kỷ Luật Card */}
              <MetricCircleCard
                id="metric-discipline"
                label="Kỷ Luật"
                value={`${stats.disciplineRate}%`}
                valueColorClass="text-[#493ee5] font-black"
                icon={<SlidersHorizontal size={14} className="text-[#493ee5]" />}
                iconBgColor="#eaedff"
              />

            </div>

          </div>

          {/* RIGHT CHUNK: The beautiful result column/line chart in 7 cols */}
          <div className="lg:col-span-7">
            <ResultChart
              trades={filteredTrades}
              selectedTradeId={selectedTradeId}
              onSelectTrade={setSelectedTradeId}
              activeDisciplineTab={activeDisciplineTab}
              setActiveDisciplineTab={setActiveDisciplineTab}
            />
          </div>

        </div>

        {/* BOTTOM WORKSPACE GRID: The 8-grid Stat card elements */}
        <div>
          <h3 className="text-xs font-extrabold text-[#464555] opacity-80 uppercase tracking-widest mb-4">
            PHÂN TÍCH CHỈ SỐ GIAO DỊCH CHỦ CHỐT
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {/* NET R */}
            <StatCard
              id="stat-net-r"
              label="NET R"
              value={`${stats.netR > 0 ? '+' : ''}${stats.netR}R`}
              highlightColor={stats.netR >= 0 ? 'emerald' : 'rose'}
              icon={stats.netR >= 0 ? <TrendingUp size={15} className="text-emerald-600" /> : <TrendingDown size={15} className="text-rose-600" />}
              iconBgColor={stats.netR >= 0 ? '#e6f7ec' : '#fdf2f2'}
              sparklineType={stats.netR >= 0 ? 'flat-up-blue' : 'down-rose'}
            />

            {/* PROFIT FACTOR */}
            <StatCard
              id="stat-profit-factor"
              label="PROFIT FACTOR"
              value={stats.profitFactor}
              highlightColor="indigo"
              icon={<Layers size={14} className="text-primary" />}
              iconBgColor="#eaedff"
              sparklineType="flat-up-blue"
            />

            {/* MAX DRAWDOWN */}
            <StatCard
              id="stat-max-drawdown"
              label="MAX DRAWDOWN"
              value={`${stats.maxDrawdown}R`}
              highlightColor="rose"
              icon={<TrendingDown size={15} className="text-rose-600" />}
              iconBgColor="#fdf2f2"
              sparklineType="down-flat-rose"
            />

            {/* CHUỖI WIN */}
            <StatCard
              id="stat-win-streak"
              label="CHUỖI WIN"
              value={stats.winStreak}
              highlightColor="emerald"
              icon={<Flame size={15} className="text-emerald-600-ish fill-emerald-500 text-emerald-500" />}
              iconBgColor="#e6f7ec"
              dots={{ activeCount: stats.winStreak, colorClass: 'bg-emerald-500', max: 5 }}
            />

            {/* CHUỖI LOSS */}
            <StatCard
              id="stat-loss-streak"
              label="CHUỖI LOSS"
              value={stats.lossStreak}
              highlightColor="rose"
              icon={<XCircle size={15} className="text-rose-500" />}
              iconBgColor="#fdf2f2"
              dots={{ activeCount: stats.lossStreak, colorClass: 'bg-rose-500', max: 5 }}
            />

            {/* TB R WIN / LỆNH */}
            <StatCard
              id="stat-avg-win"
              label="TB R WIN / LỆNH"
              value={`${stats.avgWin > 0 ? '+' : ''}${stats.avgWin}R`}
              highlightColor="emerald"
              icon={<TrendingUp size={15} className="text-emerald-500" />}
              iconBgColor="#e6f7ec"
            />

            {/* TB R LOSS / LỆNH */}
            <StatCard
              id="stat-avg-loss"
              label="TB R LOSS / LỆNH"
              value={`${stats.avgLoss}R`}
              highlightColor="rose"
              icon={<TrendingDown size={15} className="text-rose-500" />}
              iconBgColor="#fdf2f2"
            />

            {/* TỔNG LỆNH */}
            <StatCard
              id="stat-total-trades"
              label="TỔNG LỆNH"
              value={stats.totalTrades}
              highlightColor="indigo"
              icon={<BookOpen size={14} className="text-[#493ee5]" />}
              iconBgColor="#eaedff"
            />
          </div>
        </div>

        {/* DETAILED LOG ROW WITH FILTER AND LOG TABLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          
          {/* SEARCH & FILTERS CONTROLS COLUMN (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(4,4,10,0.03)] border border-slate-100 space-y-4">
              <h4 className="text-xs font-extrabold text-[#131b2e] uppercase tracking-wide">
                Bộ phận lọc dữ liệu
              </h4>

              {/* Search input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Tìm theo mã tài sản</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ví dụ: BTCUSDT"
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 focus:border-primary rounded-xl pl-9 pr-3 py-2.5 outline-none transition-all"
                  />
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Current Filters Overview info */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col space-y-2">
                <span className="text-[10px] font-black text-[#493ee5] uppercase">Thống kê lọc</span>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Số lệnh thỏa mãn:</span>
                  <span className="font-extrabold text-[#131b2e]">{filteredTrades.length} lệnh</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Lãi ròng R đợt này:</span>
                  <span className={`font-black ${stats.netR >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stats.netR > 0 ? '+' : ''}{stats.netR}R
                  </span>
                </div>
              </div>

              {/* Quick instructions panel */}
              <div className="bg-indigo-50/20 p-3.5 rounded-2xl border border-indigo-50 flex items-start gap-2 text-[11px] text-slate-500">
                <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Nhấp vào tiêu đề cột hoặc biểu tượng hành động để quản lý lệnh. Hệ thống sẽ tự động cập nhật mọi chỉ số kỷ luật tương thích theo thời gian thực!
                </p>
              </div>
            </div>
          </div>

          {/* TABLE LOG DISPLAY COLUMN (9 cols) */}
          <div className="lg:col-span-9 flex flex-col">
            <TradeTable
              trades={filteredTrades}
              selectedTradeId={selectedTradeId}
              onSelectTrade={setSelectedTradeId}
              onEditTrade={handleEditClick}
              onDeleteTrade={handleDeleteTrade}
              onOpenNewForm={() => {
                setEditingTrade(null);
                setIsFormOpen(true);
              }}
            />
          </div>

        </div>

      </main>

      {/* FOOTER METRICS EXPLANATIONS */}
      <footer className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
          <div>
            <h5 className="font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles size={12} className="text-primary" />
              Tỷ Số R-Multiple Là Gì?
            </h5>
            <p className="leading-relaxed">
              R đại diện cho giá trị rủi ro khởi điểm trên một lệnh (Risk Unit). Đạt kết quả +2.5R nghĩa là bạn kiếm được 2.5 lần số tiền đã chấp nhận mất nếu cắt lỗ ban đầu. Quản lý tỷ lệ R tốt là bí quyết duy trì lợi nhuận dài hạn.
            </p>
          </div>
          <div>
            <h5 className="font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Tỷ Lệ Kỷ Luật 3 Bước
            </h5>
            <p className="leading-relaxed">
              Các giai đoạn kỷ luật bao gồm: **Plan** (Có lập kế hoạch giao dịch), **Entry** (Bấm lệnh đúng quy chuẩn không fomo), và **Review** (Ghi chép đúc rút kinh nghiệm). Định mức tuân thủ phản ánh sức mạnh nội tại của trader.
            </p>
          </div>
          <div>
            <h5 className="font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <XCircle size={12} className="text-rose-500" />
              Tại Sao Lại Có Profit Factor?
            </h5>
            <p className="leading-relaxed">
              Profit Factor được tính bằng Tổng lợi nhuận từ các lệnh thắng chia cho Tổng thua lỗ từ các lệnh thua. Định mức PF trên 1.5 phản ánh một phương pháp giao dịch cực kỳ lành mạnh và có tiềm năng sinh lời.
            </p>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-400 font-semibold mt-12 tracking-wide">
          © {new Date().getFullYear()} Luminous Trader. Crafted with meticulous aesthetic corporate modern style.
        </p>
      </footer>

      {/* CREATE & EDIT OVERLAY MODAL FORM */}
      {isFormOpen && (
        <TradeForm
          trade={editingTrade}
          onSave={handleSaveTrade}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTrade(null);
          }}
        />
      )}

    </div>
  );
}

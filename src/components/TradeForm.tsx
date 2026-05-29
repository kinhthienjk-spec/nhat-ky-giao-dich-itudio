import React, { useState, useEffect } from 'react';
import { Trade } from '../types';
import { Shield, Sparkles, X } from 'lucide-react';

interface TradeFormProps {
  trade: Trade | null; // Put null for Add mode, or Trade metadata for Edit mode
  onSave: (trade: Omit<Trade, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

export default function TradeForm({ trade, onSave, onClose }: TradeFormProps) {
  const [asset, setAsset] = useState('BTCUSDT');
  const [type, setType] = useState<'Long' | 'Short'>('Long');
  const [rResult, setRResult] = useState<number>(1.0);
  const [date, setDate] = useState('2026-05-29');
  const [isPlan, setIsPlan] = useState(true);
  const [isEntry, setIsEntry] = useState(true);
  const [isReview, setIsReview] = useState(true);
  const [notes, setNotes] = useState('');

  // If editing, fill fields with trade details
  useEffect(() => {
    if (trade) {
      setAsset(trade.asset);
      setType(trade.type);
      setRResult(trade.rResult);
      setDate(trade.date);
      setIsPlan(trade.isPlan);
      setIsEntry(trade.isEntry);
      setIsReview(trade.isReview);
      setNotes(trade.notes || '');
    } else {
      // Default to today/current local date
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setAsset('BTCUSDT');
      setType('Long');
      setRResult(1.0);
      setIsPlan(true);
      setIsEntry(true);
      setIsReview(true);
      setNotes('');
    }
  }, [trade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset.trim()) return;

    onSave({
      id: trade?.id,
      date,
      asset: asset.toUpperCase().trim(),
      type,
      rResult: Number(rResult),
      isPlan,
      isEntry,
      isReview,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col relative md:scale-100 transition-transform">
        
        {/* Header decoration */}
        <div className="bg-[#f0f2ff] px-6 py-4 flex items-center justify-between border-b border-indigo-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <Shield size={16} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#131b2e]">
                {trade ? 'Cập nhật lệnh giao dịch' : 'Thêm lệnh giao dịch mới'}
              </h3>
              <p className="text-[10px] text-slate-500">
                Lập hồ sơ quản lý và kỷ luật giao dịch Luminous
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content body */}
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4 max-h-[80vh]">
          {/* Asset & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Mã giao dịch / Cặp tiền *
              </label>
              <input
                type="text"
                required
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                placeholder="Ví dụ: BTCUSDT, EURUSD"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Ngày thực hiện *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 outline-none transition-all"
              />
            </div>
          </div>

          {/* Type Toggle & Result R */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Vị thế (Position Status)
              </label>
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                <button
                  type="button"
                  onClick={() => setType('Long')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    type === 'Long'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  LONG (MUA)
                </button>
                <button
                  type="button"
                  onClick={() => setType('Short')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    type === 'Short'
                      ? 'bg-white text-rose-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  SHORT (BÁN)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Kết quả trả về (R Result) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={rResult === 0 ? '0' : rResult}
                  onChange={(e) => setRResult(parseFloat(e.target.value) || 0)}
                  placeholder="Ví dụ: +2.5 hoặc -1.0"
                  className="w-full text-xs font-black bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2.5 pr-8 outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400 pointer-events-none">
                  R
                </span>
              </div>
            </div>
          </div>

          {/* Discipline checklist checkboxes */}
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <h4 className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Sparkles size={11} className="text-primary" />
              Đánh giá kỷ luật & Thực hành
            </h4>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isPlan}
                  onChange={(e) => setIsPlan(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 text-primary focus:ring-primary accent-primary"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                    Đúng Kế Hoạch (Plan Cohesion)
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Phân tích thiết lập lệnh và tính toán rủi ro đầy đủ trước khi kích hoạt lệnh
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isEntry}
                  onChange={(e) => setIsEntry(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 text-primary focus:ring-primary accent-primary"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                    Đúng Vào Lệnh (Entry Compliance)
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Kích hoạt lệnh chuẩn chỉ, không fomo nến, không trượt giá bộc phát
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isReview}
                  onChange={(e) => setIsReview(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 text-primary focus:ring-primary accent-primary"
                />
                <div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                    Đã Ghi Chú & Đánh Giá (Review Finished)
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Đã lưu vết biểu đồ và tự chất vấn lý do thực hiện sau khi lệnh kết thúc
                  </p>
                </div>
              </label>
            </div>
            {/* Helpful validation reminder */}
            <div className="text-[9px] text-[#493ee5] bg-[#eaedff]/30 px-3 py-1.5 rounded-lg font-medium mt-3">
              * Tỷ lệ Kỷ Luật dựa trên các lệnh đáp ứng đồng thời cả **Kế Hoạch** và **Vào Lệnh**.
            </div>
          </div>

          {/* Notes display */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Nhật ký / Ghi chú cảm xúc
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ghi nhận tâm lý sợ hãi, tham lam, trượt giá hoặc bối cảnh thị trường..."
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-2 outline-none transition-all resize-none"
            />
          </div>

          <div className="border-t border-slate-100 pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              {trade ? 'Lưu cập nhật' : 'Thêm lệnh giao dịch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

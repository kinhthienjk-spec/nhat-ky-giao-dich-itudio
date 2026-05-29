import { Trade } from '../types';
import { Edit2, Trash2, ShieldCheck, FileText, ChevronRight, Ban, PlusCircle } from 'lucide-react';

interface TradeTableProps {
  trades: Trade[];
  selectedTradeId: string | null;
  onSelectTrade: (id: string | null) => void;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
  onOpenNewForm: () => void;
}

export default function TradeTable({
  trades,
  selectedTradeId,
  onSelectTrade,
  onEditTrade,
  onDeleteTrade,
  onOpenNewForm,
}: TradeTableProps) {
  // Sort descending by date
  const sortedTrades = [...trades].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(4,4,10,0.03)] border border-slate-100 flex-1 flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#131b2e]">
              Nhật ký lệnh chi tiết ({trades.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chọn một dòng để tô sáng trên biểu đồ hoặc chỉnh sửa/xóa
            </p>
          </div>
          <button
            onClick={onOpenNewForm}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer shadow-sm shadow-indigo-100"
          >
            <PlusCircle size={14} />
            Thêm lệnh mới
          </button>
        </div>

        {trades.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-center">
            <ShieldCheck size={40} className="stroke-slate-300 mb-2" />
            <p className="text-sm font-semibold">Chưa có lệnh giao dịch nào trong khoảng thời gian này</p>
            <button
              onClick={onOpenNewForm}
              className="mt-3 text-xs font-bold text-primary hover:underline"
            >
              Thêm giao dịch đầu tiên của bạn
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Ngày</th>
                  <th className="py-3 px-3">Tài sản (Asset)</th>
                  <th className="py-3 px-3 text-center">Vị thế</th>
                  <th className="py-3 px-3 text-right">Kết quả (R)</th>
                  <th className="py-3 px-3 text-center">Kỷ luật</th>
                  <th className="py-3 px-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sortedTrades.map((trade) => {
                  const isSelected = selectedTradeId === trade.id;
                  const isPositive = trade.rResult > 0;
                  const isNegative = trade.rResult < 0;

                  // Discipline items status count
                  const disciplineCount = [trade.isPlan, trade.isEntry, trade.isReview].filter(Boolean).length;

                  return (
                    <tr
                      key={trade.id}
                      onClick={() => onSelectTrade(isSelected ? null : trade.id)}
                      className={`border-b border-slate-50 last:border-none text-xs hover:bg-[#f8faff] transition-colors cursor-pointer group ${
                        isSelected ? 'bg-[#f4f6ff]' : ''
                      }`}
                    >
                      {/* Date */}
                      <td className="py-3.5 px-3 font-semibold text-slate-500 whitespace-nowrap">
                        {trade.date}
                      </td>

                      {/* Asset */}
                      <td className="py-3.5 px-3 font-extrabold text-[#131b2e]">
                        {trade.asset}
                      </td>

                      {/* Long/Short Position Type */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${
                            trade.type === 'Long'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}
                        >
                          {trade.type}
                        </span>
                      </td>

                      {/* Result R */}
                      <td
                        className={`py-3.5 px-3 text-right font-black text-sm ${
                          isPositive
                            ? 'text-emerald-600'
                            : isNegative
                            ? 'text-rose-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {trade.rResult}R
                      </td>

                      {/* Discipline checklist overview */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-center gap-1">
                          <span
                            title="Đúng Plan"
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black ${
                              trade.isPlan
                                ? 'bg-[#eaedff] text-primary'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            P
                          </span>
                          <span
                            title="Đúng Entry"
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black ${
                              trade.isEntry
                                ? 'bg-[#eaedff] text-primary'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            E
                          </span>
                          <span
                            title="Đã Review"
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black ${
                              trade.isReview
                                ? 'bg-[#eaedff] text-primary'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            R
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Chỉnh sửa lệnh"
                            onClick={() => onEditTrade(trade)}
                            className="p-1 hover:bg-[#eae8ff] rounded text-slate-400 hover:text-[#493ee5] transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            title="Xóa lệnh"
                            onClick={() => onDeleteTrade(trade.id)}
                            className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Trade Note display footer */}
      {selectedTradeId && (
        <div className="mt-4 bg-[#f4f6ff] border border-[rgba(73,62,229,0.1)] rounded-2xl p-3.5 relative animate-fade-in text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-extrabold text-primary flex items-center gap-1.5">
              <FileText size={13} />
              Ghi chú cho lệnh {trades.find((t) => t.id === selectedTradeId)?.asset} ({trades.find((t) => t.id === selectedTradeId)?.date})
            </span>
            <button
              onClick={() => onSelectTrade(null)}
              className="text-slate-400 hover:text-slate-600 text-[10px] font-bold"
            >
              Đóng [X]
            </button>
          </div>
          <p className="text-[#464555] italic leading-relaxed">
            "{trades.find((t) => t.id === selectedTradeId)?.notes || 'Không ghi chú.'}"
          </p>
        </div>
      )}
    </div>
  );
}

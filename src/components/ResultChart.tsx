import React, { useState } from 'react';
import { Trade } from '../types';
import { Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface ResultChartProps {
  trades: Trade[];
  selectedTradeId: string | null;
  onSelectTrade: (id: string | null) => void;
  activeDisciplineTab: 'Plan' | 'Entry' | 'Review';
  setActiveDisciplineTab: (tab: 'Plan' | 'Entry' | 'Review') => void;
}

export default function ResultChart({
  trades,
  selectedTradeId,
  onSelectTrade,
  activeDisciplineTab,
  setActiveDisciplineTab,
}: ResultChartProps) {
  const [chartType, setChartType] = useState<'per-trade' | 'cumulative'>('per-trade');
  const [hoveredTrade, setHoveredTrade] = useState<Trade | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Chronological sort
  const sortedTrades = [...trades].sort((a, b) => a.date.localeCompare(b.date));

  // Cumulative math
  let cumulativeValue = 0;
  const cumulativeData = sortedTrades.map((t) => {
    cumulativeValue += t.rResult;
    return parseFloat(cumulativeValue.toFixed(2));
  });

  // Calculate scales
  const maxAbsVal = Math.max(
    ...sortedTrades.map((t) => Math.abs(t.rResult)),
    ...cumulativeData.map((v) => Math.abs(v)),
    1.5 // default min-bound
  );
  // Scale rounded up slightly for margin
  const chartYBound = Math.ceil(maxAbsVal * 1.2 * 2) / 2; // increments of 0.5

  // SVG parameters
  const width = 640;
  const height = 240;
  const paddingX = 40;
  const paddingY = 25;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;
  const centerY = paddingY + graphHeight / 2;

  // Grid lines
  const gridValues = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
  const activeGridLines = gridValues.filter(val => val < chartYBound);

  // Map Y coordinate
  const getY = (val: number) => {
    const ratio = val / chartYBound; // fits in [-1, 1]
    return centerY - ratio * (graphHeight / 2);
  };

  const getX = (index: number) => {
    if (sortedTrades.length <= 1) return paddingX + graphWidth / 2;
    return paddingX + (index / (sortedTrades.length - 1)) * graphWidth;
  };

  const barWidth = Math.max(8, Math.min(30, graphWidth / (sortedTrades.length * 1.8)));

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement | SVGCircleElement, MouseEvent>, trade: Trade, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (parentRect) {
      setTooltipPos({
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 10
      });
    }
    setHoveredTrade(trade);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredTrade(null);
    setHoveredIndex(null);
  };

  // Determine compliance for highlighting
  const isCompliant = (trade: Trade) => {
    if (activeDisciplineTab === 'Plan') return trade.isPlan;
    if (activeDisciplineTab === 'Entry') return trade.isEntry;
    return trade.isReview;
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(4,4,10,0.03)] border border-slate-100 flex flex-col justify-between h-[390px] relative transition-all duration-300">
      
      {/* Header and Filter Option */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-extrabold text-[#131b2e] flex items-center gap-2">
            Kết quả theo lệnh (R)
            <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {chartType === 'per-trade' ? 'Lực R tương đối' : 'Đồ thị tăng trưởng'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Di chuột để xem nhật ký của từng giao dịch
          </p>
        </div>

        {/* Dropdown styled similarly to the image */}
        <div className="relative">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'per-trade' | 'cumulative')}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="per-trade">Theo lệnh</option>
            <option value="cumulative">Lũy kế (Equity Curve)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex-1 flex items-center justify-center min-h-[220px]">
        {trades.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            Chưa có dữ liệu lệnh giao dịch. Hãy thêm lệnh mới bên dưới!
          </div>
        ) : (
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            {/* Horizontal Grid lines */}
            {activeGridLines.map((val) => (
              <g key={`grid-pos-${val}`}>
                <line
                  x1={paddingX}
                  y1={getY(val)}
                  x2={width - paddingX}
                  y2={getY(val)}
                  stroke="#f1f3f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={getY(val) + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="end"
                >
                  {val.toFixed(1)}R
                </text>
              </g>
            ))}

            {/* Zero line (stronger line) */}
            <line
              x1={paddingX}
              y1={centerY}
              x2={width - paddingX}
              y2={centerY}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <text
              x={paddingX - 8}
              y={centerY + 4}
              fill="#64748b"
              fontSize="10"
              fontWeight="700"
              textAnchor="end"
            >
              0
            </text>

            {/* Negative Grid lines */}
            {activeGridLines.map((val) => (
              <g key={`grid-neg-${val}`}>
                <line
                  x1={paddingX}
                  y1={getY(-val)}
                  x2={width - paddingX}
                  y2={getY(-val)}
                  stroke="#f1f3f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={getY(-val) + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="end"
                >
                  {-val.toFixed(1)}R
                </text>
              </g>
            ))}

            {/* CHART RENDERING: TYPE PER TRADE */}
            {chartType === 'per-trade' &&
              sortedTrades.map((trade, idx) => {
                const x = getX(idx);
                const y = getY(trade.rResult);
                const isPositive = trade.rResult >= 0;
                
                // Height is the absolute distance from zero line (centerY)
                const barHeight = Math.abs(centerY - y);
                const barY = isPositive ? y : centerY;

                // Color configuration
                const compliant = isCompliant(trade);
                let fillColor = '#64748b'; // generic neutral
                if (trade.rResult > 0) {
                  fillColor = compliant ? '#10b981' : '#a7f3d0'; // active green vs faded green
                } else if (trade.rResult < 0) {
                  fillColor = compliant ? '#ef4444' : '#fecaca'; // active red vs faded red
                } else {
                  fillColor = '#cbd5e1'; // gray for 0R scratch
                }

                const isSelected = selectedTradeId === trade.id;
                const isHovered = hoveredIndex === idx;

                return (
                  <rect
                    key={trade.id}
                    x={x - barWidth / 2}
                    y={barY}
                    width={barWidth}
                    height={Math.max(1.5, barHeight)}
                    rx={2}
                    fill={fillColor}
                    stroke={isSelected ? '#493ee5' : 'transparent'}
                    strokeWidth={2}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      opacity: hoveredIndex !== null && !isHovered ? 0.35 : 1,
                      transform: isHovered ? 'scaleY(1.03)' : 'none',
                      transformOrigin: 'bottom',
                    }}
                    onMouseMove={(e) => handleMouseMove(e, trade, idx)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                      onSelectTrade(isSelected ? null : trade.id);
                    }}
                  />
                );
              })}

            {/* CHART RENDERING: TYPE CUMULATIVE AREA */}
            {chartType === 'cumulative' && (
              <>
                {/* Area path */}
                <path
                  d={[
                    `M ${getX(0)} ${centerY}`,
                    ...cumulativeData.map((val, idx) => `L ${getX(idx)} ${getY(val)}`),
                    `L ${getX(cumulativeData.length - 1)} ${centerY}`,
                    'Z',
                  ].join(' ')}
                  fill="url(#equityGradient)"
                  opacity="0.15"
                />

                {/* Growth path line */}
                <path
                  d={cumulativeData
                    .map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(val)}`)
                    .join(' ')}
                  stroke="#493ee5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Zero line shading markers or trade points */}
                {cumulativeData.map((val, idx) => {
                  const x = getX(idx);
                  const y = getY(val);
                  const trade = sortedTrades[idx];
                  const isSelected = selectedTradeId === trade.id;
                  const isHovered = hoveredIndex === idx;

                  return (
                    <circle
                      key={`dot-${trade.id}`}
                      cx={x}
                      cy={y}
                      r={isSelected ? 6 : isHovered ? 5 : 3.5}
                      fill={val >= 0 ? '#10b981' : '#ef4444'}
                      stroke={isSelected ? '#493ee5' : '#ffffff'}
                      strokeWidth={1.5}
                      className="cursor-pointer transition-all duration-200"
                      onMouseMove={(e) => handleMouseMove(e, trade, idx)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => {
                        onSelectTrade(isSelected ? null : trade.id);
                      }}
                    />
                  );
                })}

                {/* SVG Definitions */}
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#493ee5" />
                    <stop offset="100%" stopColor="#493ee5" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </>
            )}
          </svg>
        )}

        {/* Hover Tooltip perfectly modeled */}
        {hoveredTrade && (
          <div
            className="absolute z-30 bg-slate-900 text-white rounded-xl p-3 shadow-xl max-w-[240px] pointer-events-none text-xs border border-slate-700 font-sans"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 70}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="font-extrabold text-[#94a3b8]">{hoveredTrade.asset}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                  hoveredTrade.type === 'Long'
                    ? 'bg-emerald-500/25 text-emerald-300'
                    : 'bg-rose-500/25 text-rose-300'
                }`}
              >
                {hoveredTrade.type}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-gray-400 text-[10px]">{hoveredTrade.date}</span>
              <span
                className={`font-black text-sm ${
                  hoveredTrade.rResult > 0
                    ? 'text-emerald-400'
                    : hoveredTrade.rResult < 0
                    ? 'text-rose-400'
                    : 'text-slate-300'
                }`}
              >
                {hoveredTrade.rResult > 0 ? '+' : ''}
                {hoveredTrade.rResult}R
              </span>
            </div>

            {/* Compliance badges in tooltip */}
            <div className="border-t border-slate-800 pt-1.5 mt-1.5 flex flex-wrap gap-1">
              <span className={`px-1 py-0.5 rounded-[4px] text-[9px] flex items-center gap-0.5 ${hoveredTrade.isPlan ? 'bg-slate-800 text-purple-300' : 'bg-slate-800/40 text-slate-500'}`}>
                Plan: {hoveredTrade.isPlan ? '✓' : '✗'}
              </span>
              <span className={`px-1 py-0.5 rounded-[4px] text-[9px] flex items-center gap-0.5 ${hoveredTrade.isEntry ? 'bg-slate-800 text-purple-300' : 'bg-slate-800/40 text-slate-500'}`}>
                Entry: {hoveredTrade.isEntry ? '✓' : '✗'}
              </span>
              <span className={`px-1 py-0.5 rounded-[4px] text-[9px] flex items-center gap-0.5 ${hoveredTrade.isReview ? 'bg-slate-800 text-purple-300' : 'bg-slate-800/40 text-slate-500'}`}>
                Review: {hoveredTrade.isReview ? '✓' : '✗'}
              </span>
            </div>

            {hoveredTrade.notes && (
              <p className="mt-1.5 text-[9px] text-[#94a3b8] italic line-clamp-2 border-t border-slate-800 pt-1">
                "{hoveredTrade.notes}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer Pill Toggles for Plan / Entry / Review matching the beautiful CSS design in the image */}
      <div className="flex justify-center mt-3">
        <div className="bg-[#f0f2ff] p-1 rounded-full flex gap-1 border border-slate-100">
          {(['Plan', 'Entry', 'Review'] as const).map((tab) => {
            const isActive = activeDisciplineTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveDisciplineTab(tab)}
                className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-[#464555] hover:text-[#131b2e]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

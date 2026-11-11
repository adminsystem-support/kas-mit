import React, { useState } from "react";
import { Scale, Ruler, Calendar, TrendingUp } from "lucide-react";
import { GrowthLog } from "../types";

interface GrowthChartProps {
  weightLogs: GrowthLog[];
  heightLogs: GrowthLog[];
}

export default function GrowthChart({ weightLogs = [], heightLogs = [] }: GrowthChartProps) {
  const [activeTab, setActiveTab] = useState<"weight" | "height">("weight");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const logs = activeTab === "weight" ? weightLogs : heightLogs;
  const unit = activeTab === "weight" ? "kg" : "cm";
  const label = activeTab === "weight" ? "Berat Badan" : "Tinggi Badan";
  const color = activeTab === "weight" ? "#3b82f6" : "#10b981"; // Blue vs Green

  // SVG dimensions
  const width = 500;
  const height = 220;
  const padding = 35;

  if (logs.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-6 h-[280px] flex flex-col items-center justify-center text-center">
        <TrendingUp className="w-10 h-10 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-500">Belum ada data grafik perkembangan</p>
        <p className="text-xs text-slate-400 mt-1">Silakan tambahkan data berat & tinggi badan anak Anda</p>
      </div>
    );
  }

  // Calculate scales
  const values = logs.map(l => l.value);
  const minVal = Math.max(0, Math.min(...values) - 2);
  const maxVal = Math.max(...values) + 2;
  const valRange = maxVal - minVal || 1;

  // Convert logs to SVG coordinates
  const points = logs.map((log, index) => {
    const x = padding + (index / (logs.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - ((log.value - minVal) / valRange) * (height - padding * 2);
    return { x, y, value: log.value, date: log.date };
  });

  // Generate SVG path (smooth line curve helper)
  let linePath = "";
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Use bezier for nice smoothness
      const cpX1 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY1 = points[i - 1].y;
      const cpX2 = points[i - 1].x + (points[i].x - points[i - 1].x) / 2;
      const cpY2 = points[i].y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
    }
  }

  // Generate background area path
  let areaPath = "";
  if (points.length > 0) {
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  }

  // Calculate change
  const firstVal = logs[0]?.value || 0;
  const lastVal = logs[logs.length - 1]?.value || 0;
  const diff = lastVal - firstVal;
  const diffText = diff >= 0 ? `+${diff.toFixed(1)} ${unit}` : `${diff.toFixed(1)} ${unit}`;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm font-display flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Grafik Tumbuh Kembang
          </h3>
          <p className="text-xs text-slate-500">Perkembangan fisik anak real-time</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("weight")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              activeTab === "weight" 
                ? "bg-white text-blue-600 shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> BB
          </button>
          <button
            onClick={() => setActiveTab("height")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              activeTab === "height" 
                ? "bg-white text-emerald-600 shadow-xs" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" /> TB
          </button>
        </div>
      </div>

      {/* Summary Stat */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold font-display text-slate-800">
          {lastVal} <span className="text-sm font-medium text-slate-500">{unit}</span>
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diff >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
          {diffText} (total)
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[450px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="heightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const yVal = height - padding - ratio * (height - padding * 2);
              const gridValue = minVal + ratio * valRange;
              return (
                <g key={idx} opacity="0.3">
                  <line
                    x1={padding}
                    y1={yVal}
                    x2={width - padding}
                    y2={yVal}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={padding - 5}
                    y={yVal + 3}
                    fontFamily="Inter, sans-serif"
                    fontSize="9"
                    fill="#475569"
                    textAnchor="end"
                  >
                    {gridValue.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Filled area */}
            {points.length > 0 && (
              <path
                d={areaPath}
                fill={activeTab === "weight" ? "url(#weightGrad)" : "url(#heightGrad)"}
              />
            )}

            {/* Line curve */}
            {points.length > 0 && (
              <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Data Points */}
            {points.map((pt, idx) => {
              const isHovered = hoveredPoint === idx;
              return (
                <g key={idx} className="cursor-pointer">
                  {/* Point node */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    fill="white"
                    stroke={color}
                    strokeWidth={isHovered ? 3 : 2}
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  
                  {/* X-axis labels (Dates) */}
                  <text
                    x={pt.x}
                    y={height - 10}
                    fontFamily="Inter, sans-serif"
                    fontSize="9"
                    fill="#64748b"
                    textAnchor="middle"
                  >
                    {new Date(pt.date).toLocaleDateString("id-ID", { month: "short", year: "2-digit" })}
                  </text>

                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={pt.x - 45}
                        y={pt.y - 35}
                        width="90"
                        height="24"
                        rx="6"
                        fill="#0f172a"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 20}
                        fill="white"
                        fontFamily="Inter, sans-serif"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {pt.value} {unit}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      
      {/* Footer log details */}
      <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 rounded-lg p-2.5">
        <Calendar className="w-3.5 h-3.5 text-blue-500" />
        <span>Terakhir diukur: <strong>{logs[logs.length - 1]?.date}</strong> ({logs[logs.length - 1]?.value} {unit})</span>
      </div>
    </div>
  );
}

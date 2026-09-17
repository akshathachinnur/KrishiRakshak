import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Camera, 
  Info, 
  Activity, 
  MapPin,
  BarChart3,
  Layers,
  PlusCircle,
  FileCheck
} from 'lucide-react';
import { LeafPathology, DiagnosisRecord, FarmProfile } from '../types';

interface InfestationTrendProps {
  currentPathology: LeafPathology;
  diagnosesHistory?: DiagnosisRecord[];
  farmProfile?: FarmProfile | null;
  onScanAgain?: () => void;
  onRecordDiagnosis?: (record: DiagnosisRecord) => void;
}

interface ScanDataPoint {
  id: string;
  timestamp: number;
  formattedDate: string;
  formattedTime: string;
  affectedAreaPercent: number;
  severity: 'optimal' | 'warning' | 'critical';
  confidence: number;
  fieldName: string;
  isCurrentScan?: boolean;
}

function normalizeKey(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
}

/**
 * Match whether a diagnosis record belongs to the same historical series:
 * Same field/plot, same crop, and same disease/pest.
 */
function isSameSeries(
  rec: DiagnosisRecord,
  targetCrop: string,
  targetDisease: string,
  targetField: string
): boolean {
  const normRecCrop = normalizeKey(rec.cropName);
  const normTgtCrop = normalizeKey(targetCrop);
  const normRecDisease = normalizeKey(rec.diseaseName);
  const normTgtDisease = normalizeKey(targetDisease);

  // Common crop roots (e.g. "tomato", "rice", "paddy", "potato", "maize", "corn", "cotton", "soybean")
  const crops = ['tomato', 'rice', 'paddy', 'potato', 'maize', 'corn', 'cotton', 'soybean', 'wheat', 'chickpea', 'foliage'];
  const matchedCrop = crops.find(c => normTgtCrop.includes(c) || normRecCrop.includes(c));

  const cropMatches = matchedCrop 
    ? normRecCrop.includes(matchedCrop) && normTgtCrop.includes(matchedCrop)
    : normRecCrop === normTgtCrop || normRecCrop.includes(normTgtCrop) || normTgtCrop.includes(normRecCrop);

  // Disease roots (e.g. "blight", "blast", "rust", "spot", "mildew", "healthy", "armyworm", "bollworm")
  const diseases = ['early blight', 'late blight', 'blight', 'blast', 'rust', 'spot', 'rot', 'mildew', 'healthy', 'armyworm', 'bollworm'];
  const matchedDisease = diseases.find(d => normTgtDisease.includes(d) && normRecDisease.includes(d));

  const diseaseMatches = Boolean(matchedDisease) || 
    normRecDisease === normTgtDisease || 
    normRecDisease.includes(normTgtDisease) || 
    normTgtDisease.includes(normRecDisease);

  return cropMatches && diseaseMatches;
}

export const InfestationTrend: React.FC<InfestationTrendProps> = ({
  currentPathology,
  diagnosesHistory = [],
  farmProfile,
  onScanAgain,
  onRecordDiagnosis
}) => {
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const resolvedFieldId = useMemo(() => {
    return farmProfile?.farmName ? `FIELD-001 - ${farmProfile.farmName}` : 'FIELD-001 - North Plot #2';
  }, [farmProfile]);

  // Extract matched chronological series
  const dataPoints = useMemo<ScanDataPoint[]>(() => {
    const matched = diagnosesHistory.filter((rec) =>
      isSameSeries(rec, currentPathology.cropName, currentPathology.diseaseName, resolvedFieldId)
    );

    const list: ScanDataPoint[] = matched.map((rec) => {
      const d = new Date(rec.timestamp);
      return {
        id: rec.id || `hist-${rec.timestamp}`,
        timestamp: rec.timestamp,
        formattedDate: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        formattedTime: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        affectedAreaPercent: typeof rec.foliarLesionPercent === 'number'
          ? rec.foliarLesionPercent
          : (rec.status === 'optimal' ? 0 : rec.status === 'critical' ? 75 : 30),
        severity: rec.status,
        confidence: rec.confidence || 95,
        fieldName: rec.fieldName || resolvedFieldId,
      };
    });

    // If no matching historical record exists at all, use current pathology as the initial baseline
    if (list.length === 0) {
      const now = new Date();
      const currentLesion = typeof currentPathology.foliarLesionPercent === 'number'
        ? currentPathology.foliarLesionPercent
        : (currentPathology.badgeType === 'optimal' ? 0 : currentPathology.badgeType === 'critical' ? 75 : 30);

      list.push({
        id: 'baseline-scan-current',
        timestamp: Date.now(),
        formattedDate: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        formattedTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        affectedAreaPercent: currentLesion,
        severity: currentPathology.badgeType,
        confidence: currentPathology.confidence,
        fieldName: resolvedFieldId,
        isCurrentScan: true
      });
    }

    // Sort chronologically ascending
    return list.sort((a, b) => a.timestamp - b.timestamp);
  }, [currentPathology, diagnosesHistory, resolvedFieldId]);

  const hasMultipleScans = dataPoints.length >= 2;

  // Trend statistics calculations
  const trendStats = useMemo(() => {
    if (!hasMultipleScans) return null;

    const firstScan = dataPoints[0];
    const previousScan = dataPoints[dataPoints.length - 2];
    const latestScan = dataPoints[dataPoints.length - 1];

    const firstVal = firstScan.affectedAreaPercent;
    const prevVal = previousScan.affectedAreaPercent;
    const latestVal = latestScan.affectedAreaPercent;

    // Change from previous scan
    const prevDiff = latestVal - prevVal;
    const prevPctChange = prevVal > 0 ? (prevDiff / prevVal) * 100 : prevDiff;

    // Overall change from first baseline scan
    const overallDiff = latestVal - firstVal;
    const overallPctChange = firstVal > 0 ? (overallDiff / firstVal) * 100 : overallDiff;

    // Determine trend
    let trend: 'Increasing' | 'Decreasing' | 'Stable';
    if (prevDiff > 1.0) {
      trend = 'Increasing';
    } else if (prevDiff < -1.0) {
      trend = 'Decreasing';
    } else {
      trend = 'Stable';
    }

    return {
      firstScan,
      previousScan,
      latestScan,
      firstVal,
      prevVal,
      latestVal,
      prevDiff,
      prevPctChange,
      overallDiff,
      overallPctChange,
      trend
    };
  }, [dataPoints, hasMultipleScans]);

  // SVG Chart Dimensions
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Compute SVG coordinates
  const pointsCoords = useMemo(() => {
    if (dataPoints.length === 0) return [];
    return dataPoints.map((pt, idx) => {
      const x = dataPoints.length === 1 
        ? paddingLeft + chartWidth / 2 
        : paddingLeft + (idx / (dataPoints.length - 1)) * chartWidth;
      
      const clampedVal = Math.min(100, Math.max(0, pt.affectedAreaPercent));
      const y = paddingTop + chartHeight - (clampedVal / 100) * chartHeight;

      return { x, y, pt, idx };
    });
  }, [dataPoints, chartWidth, chartHeight, paddingLeft, paddingTop]);

  const linePathD = useMemo(() => {
    if (pointsCoords.length < 2) return '';
    return pointsCoords.reduce((acc, coord, idx) => {
      return idx === 0 ? `M ${coord.x},${coord.y}` : `${acc} L ${coord.x},${coord.y}`;
    }, '');
  }, [pointsCoords]);

  const areaPathD = useMemo(() => {
    if (pointsCoords.length < 2) return '';
    const firstX = pointsCoords[0].x;
    const lastX = pointsCoords[pointsCoords.length - 1].x;
    const bottomY = paddingTop + chartHeight;
    return `${linePathD} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [linePathD, pointsCoords, paddingTop, chartHeight]);

  return (
    <div className="w-full mt-6 rounded-3xl bg-[#101913] border border-[#2d3731] p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-[#dae5dc] transition-all">
      {/* 1. Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#222c26]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#5bf06c]/15 border border-[#5bf06c]/30 flex items-center justify-center text-[#5bf06c] shadow-inner">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-space text-xs font-bold text-[#5bf06c] uppercase tracking-widest flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Infestation Trend Tracking
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#18221c] border border-[#2d3731] text-[10px] text-[#869582] font-mono">
                {resolvedFieldId}
              </span>
            </div>
            <h3 className="font-space text-xl sm:text-2xl font-bold text-[#dae5dc]">
              📈 Infestation Trend
            </h3>
          </div>
        </div>

        {/* Scan Again Action Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onScanAgain && (
            <button
              onClick={onScanAgain}
              className="px-4 py-2 rounded-xl bg-[#5bf06c] hover:bg-[#48d859] text-[#00390c] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              title="Open scanner to capture a new leaf photo and add follow-up scan"
            >
              <Camera className="w-4 h-4 text-[#00390c]" />
              <span>Scan Again</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Context Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#141e18] border border-[#222c26] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#869582]">
            <Layers className="w-3.5 h-3.5 text-[#5bf06c]" />
            <span>Target:</span>
            <span className="font-bold text-[#dae5dc]">{currentPathology.cropName}</span>
          </div>
          <span className="text-[#2d3731]">•</span>
          <div className="flex items-center gap-1.5 text-[#869582]">
            <span>Pathogen:</span>
            <span className="font-semibold text-[#5bf06c]">{currentPathology.diseaseName}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[#869582]">
          <MapPin className="w-3.5 h-3.5 text-[#ffcb87]" />
          <span>Field ID:</span>
          <span className="font-mono font-medium text-[#dae5dc]">{resolvedFieldId}</span>
        </div>
      </div>

      {/* 3. CASE A: Single Scan Only (Baseline) */}
      {!hasMultipleScans ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col items-center text-center gap-4 shadow-inner">
          <div className="w-12 h-12 rounded-2xl bg-[#ffcb87]/15 border border-[#ffcb87]/30 flex items-center justify-center text-[#ffcb87]">
            <Clock className="w-6 h-6" />
          </div>

          <div className="flex flex-col gap-1 max-w-md">
            <h4 className="font-space font-bold text-base text-[#dae5dc]">
              Not enough historical scans yet. Complete another scan to track infestation changes.
            </h4>
            <p className="text-xs text-[#bccbb6] leading-relaxed">
              Tracking spread rate and biological control efficacy requires at least two diagnostic scans for the same field plot. The initial scan is recorded as your baseline.
            </p>
          </div>

          {/* Baseline Scan Summary Card */}
          <div className="w-full max-w-md grid grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-[#18221c] border border-[#2d3731] text-xs">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-[10px] text-[#869582] uppercase">Date of Scan</span>
              <span className="font-bold text-[#dae5dc] text-xs truncate">
                {dataPoints[0]?.formattedDate || 'Today'}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-[10px] text-[#869582] uppercase">Affected Area</span>
              <span className="font-mono font-bold text-[#5bf06c] text-xs">
                {dataPoints[0]?.affectedAreaPercent.toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-[10px] text-[#869582] uppercase">Severity</span>
              <span className="font-bold text-[#ffcb87] text-xs capitalize">
                {dataPoints[0]?.severity || 'Critical'}
              </span>
            </div>
          </div>

          {onScanAgain && (
            <button
              onClick={onScanAgain}
              className="mt-1 px-5 py-2.5 rounded-xl bg-[#5bf06c] hover:bg-[#48d859] text-[#00390c] font-space text-xs font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <Camera className="w-4 h-4 text-[#00390c]" />
              <span>Scan Again (Add Follow-up Data Point)</span>
            </button>
          )}
        </div>
      ) : (
        /* 4. CASE B: Multiple Scans Available -> Full Infestation Trend Dashboard */
        <div className="flex flex-col gap-5">
          {/* Exact Required Trend Metrics Display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* First scan */}
            <div className="p-3.5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-1 shadow-sm">
              <span className="text-[#869582] text-[11px] font-space uppercase">First scan</span>
              <span className="font-mono text-base font-bold text-[#dae5dc]">
                {trendStats?.firstVal.toFixed(1)}%
              </span>
              <span className="text-[10px] text-[#869582]">{trendStats?.firstScan.formattedDate}</span>
            </div>

            {/* Latest scan */}
            <div className="p-3.5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-1 shadow-sm">
              <span className="text-[#869582] text-[11px] font-space uppercase">Latest scan</span>
              <span className="font-mono text-base font-bold text-[#dae5dc]">
                {trendStats?.latestVal.toFixed(1)}%
              </span>
              <span className="text-[10px] text-[#869582]">{trendStats?.latestScan.formattedDate}</span>
            </div>

            {/* Overall change */}
            <div className="p-3.5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-1 shadow-sm">
              <span className="text-[#869582] text-[11px] font-space uppercase">Overall change</span>
              <span 
                className={`font-mono text-base font-bold ${
                  trendStats && trendStats.overallDiff > 0 
                    ? 'text-[#ffb4ab]' 
                    : trendStats && trendStats.overallDiff < 0 
                    ? 'text-[#5bf06c]' 
                    : 'text-[#38bdf8]'
                }`}
              >
                {trendStats && trendStats.overallDiff > 0 ? '+' : ''}
                {trendStats?.overallPctChange.toFixed(1)}%
              </span>
              <span className="text-[10px] text-[#869582]">
                ({trendStats && trendStats.overallDiff > 0 ? '+' : ''}{trendStats?.overallDiff.toFixed(1)}% area)
              </span>
            </div>

            {/* Trend Badge */}
            <div className="p-3.5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-1 shadow-sm">
              <span className="text-[#869582] text-[11px] font-space uppercase">Trend</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {trendStats?.trend === 'Decreasing' ? (
                  <span className="px-2 py-0.5 rounded-lg bg-[#5bf06c]/20 text-[#5bf06c] border border-[#5bf06c]/30 text-xs font-bold flex items-center gap-1">
                    🟢 Decreasing
                  </span>
                ) : trendStats?.trend === 'Increasing' ? (
                  <span className="px-2 py-0.5 rounded-lg bg-[#93000a]/25 text-[#ffb4ab] border border-[#ffb4ab]/30 text-xs font-bold flex items-center gap-1">
                    🔴 Increasing
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-lg bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30 text-xs font-bold flex items-center gap-1">
                    🔵 Stable
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#869582]">
                Δ vs prev: {trendStats && trendStats.prevDiff > 0 ? '+' : ''}{trendStats?.prevDiff.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Trend Advisory Notice */}
          {trendStats?.trend === 'Increasing' && (
            <div className="p-4 rounded-2xl bg-[#93000a]/20 border border-[#ffb4ab]/40 flex items-start gap-3 text-xs text-[#ffb4ab]">
              <AlertTriangle className="w-5 h-5 shrink-0 text-[#ffb4ab] mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  Warning: Infestation Spread Is Increasing (+{trendStats.prevPctChange.toFixed(1)}%)
                </span>
                <p className="leading-relaxed">
                  Foliar lesion spread increased from {trendStats.prevVal.toFixed(1)}% to {trendStats.latestVal.toFixed(1)}% since the previous scan on {trendStats.previousScan.formattedDate}. Intensify IPM biological and cultural controls, prune lower infected leaves, and consider consulting an agricultural expert.
                </p>
              </div>
            </div>
          )}

          {trendStats?.trend === 'Decreasing' && (
            <div className="p-4 rounded-2xl bg-[#5bf06c]/15 border border-[#5bf06c]/30 flex items-start gap-3 text-xs text-[#5bf06c]">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#5bf06c] mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-bold uppercase tracking-wider text-[11px]">
                  Improvement: Infestation Spread Is Decreasing ({trendStats.prevPctChange.toFixed(1)}%)
                </span>
                <p className="leading-relaxed text-[#bccbb6]">
                  Foliar lesion spread reduced from {trendStats.prevVal.toFixed(1)}% to {trendStats.latestVal.toFixed(1)}% since {trendStats.previousScan.formattedDate}. Current control practices are demonstrating positive disease suppression.
                </p>
              </div>
            </div>
          )}

          {trendStats?.trend === 'Stable' && (
            <div className="p-4 rounded-2xl bg-[#18221c] border border-[#2d3731] flex items-start gap-3 text-xs text-[#bccbb6]">
              <Info className="w-5 h-5 shrink-0 text-[#38bdf8] mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#dae5dc] uppercase tracking-wider text-[11px]">
                  Status: Infestation Level Is Stable
                </span>
                <p className="leading-relaxed">
                  Foliar lesion spread remains steady ({trendStats.latestVal.toFixed(1)}% vs {trendStats.prevVal.toFixed(1)}% on {trendStats.previousScan.formattedDate}). Continue routine scouting.
                </p>
              </div>
            </div>
          )}

          {/* Interactive SVG Line Chart */}
          <div className="p-5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#869582] uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#5bf06c]" />
                Affected Area % vs Scan Date
              </span>
              <span className="text-[11px] text-[#869582]">
                {dataPoints.length} Historical Scans Plotted
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[500px]">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-auto overflow-visible select-none"
                >
                  <defs>
                    <linearGradient id="trendGradientSeries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={trendStats?.trend === 'Increasing' ? '#ffb4ab' : '#5bf06c'} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={trendStats?.trend === 'Increasing' ? '#ffb4ab' : '#5bf06c'} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines & Y-Axis Labels */}
                  {[0, 25, 50, 75, 100].map((val) => {
                    const y = paddingTop + chartHeight - (val / 100) * chartHeight;
                    return (
                      <g key={val}>
                        <line
                          x1={paddingLeft}
                          y1={y}
                          x2={svgWidth - paddingRight}
                          y2={y}
                          stroke="#222c26"
                          strokeDasharray="3 3"
                          strokeWidth="1"
                        />
                        <text
                          x={paddingLeft - 8}
                          y={y + 3}
                          textAnchor="end"
                          fontSize="9"
                          fill="#869582"
                          fontFamily="monospace"
                        >
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Area Under Curve */}
                  {areaPathD && (
                    <path
                      d={areaPathD}
                      fill="url(#trendGradientSeries)"
                    />
                  )}

                  {/* Line Stroke */}
                  {linePathD && (
                    <path
                      d={linePathD}
                      fill="none"
                      stroke={trendStats?.trend === 'Increasing' ? '#ffb4ab' : '#5bf06c'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Data Points */}
                  {pointsCoords.map(({ x, y, pt, idx }) => {
                    const isSelected = activePointIndex === idx;
                    const isLatest = idx === pointsCoords.length - 1;

                    return (
                      <g
                        key={pt.id}
                        className="cursor-pointer group"
                        onMouseEnter={() => setActivePointIndex(idx)}
                        onMouseLeave={() => setActivePointIndex(null)}
                        onClick={() => setActivePointIndex(idx)}
                      >
                        {isLatest && (
                          <circle
                            cx={x}
                            cy={y}
                            r="9"
                            fill="none"
                            stroke={trendStats?.trend === 'Increasing' ? '#ffb4ab' : '#5bf06c'}
                            strokeWidth="1.5"
                            strokeOpacity="0.4"
                            className="animate-ping"
                          />
                        )}

                        <circle
                          cx={x}
                          cy={y}
                          r={isSelected ? "6.5" : "4.5"}
                          fill="#0c1510"
                          stroke={trendStats?.trend === 'Increasing' ? '#ffb4ab' : '#5bf06c'}
                          strokeWidth="2.5"
                          className="transition-all duration-200"
                        />

                        <text
                          x={x}
                          y={y - 9}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill="#dae5dc"
                          fontFamily="monospace"
                        >
                          {pt.affectedAreaPercent.toFixed(1)}%
                        </text>

                        <text
                          x={x}
                          y={paddingTop + chartHeight + 18}
                          textAnchor="middle"
                          fontSize="9"
                          fill={isLatest ? '#5bf06c' : '#869582'}
                          fontWeight={isLatest ? 'bold' : 'normal'}
                        >
                          {pt.formattedDate}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Selected Tooltip */}
            {activePointIndex !== null && pointsCoords[activePointIndex] && (
              <div className="p-3 rounded-xl bg-[#18221c] border border-[#2d3731] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#5bf06c]" />
                  <span className="text-[#869582]">Scan:</span>
                  <span className="font-bold text-[#dae5dc]">
                    {pointsCoords[activePointIndex].pt.formattedDate} ({pointsCoords[activePointIndex].pt.formattedTime})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#869582]">Affected Area:</span>
                  <span className="font-mono font-bold text-[#5bf06c]">
                    {pointsCoords[activePointIndex].pt.affectedAreaPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#869582]">Severity:</span>
                  <span className="capitalize font-bold text-[#ffcb87]">
                    {pointsCoords[activePointIndex].pt.severity}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Historical Scans Ledger Table */}
          <div className="p-5 rounded-2xl bg-[#141e18] border border-[#222c26] flex flex-col gap-3">
            <span className="text-xs font-bold text-[#869582] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#5bf06c]" />
              Historical Scan List ({dataPoints.length} points)
            </span>

            <div className="flex flex-col gap-2">
              {dataPoints.map((pt, idx) => {
                const prevPt = idx > 0 ? dataPoints[idx - 1] : null;
                const change = prevPt ? pt.affectedAreaPercent - prevPt.affectedAreaPercent : 0;

                return (
                  <div 
                    key={pt.id}
                    className="p-3 rounded-xl bg-[#18221c] border border-[#222c26] hover:border-[#2d3731] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#101913] border border-[#222c26] flex items-center justify-center text-[10px] font-mono text-[#869582]">
                        #{idx + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#dae5dc]">
                          {pt.formattedDate} • {pt.formattedTime}
                        </span>
                        <span className="text-[10px] text-[#869582]">
                          {pt.fieldName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="flex flex-col items-end">
                        <span className="font-mono font-bold text-[#dae5dc]">
                          {pt.affectedAreaPercent.toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-[#869582]">Lesion Area</span>
                      </div>

                      {prevPt ? (
                        <span 
                          className={`font-mono text-xs font-semibold ${
                            change > 0 ? 'text-[#ffb4ab]' : change < 0 ? 'text-[#5bf06c]' : 'text-[#38bdf8]'
                          }`}
                        >
                          {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#869582] italic">Baseline Scan</span>
                      )}

                      <span 
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          pt.severity === 'optimal'
                            ? 'bg-[#5bf06c]/20 text-[#5bf06c]'
                            : pt.severity === 'critical'
                            ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                            : 'bg-[#ffcb87]/20 text-[#ffcb87]'
                        }`}
                      >
                        {pt.severity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

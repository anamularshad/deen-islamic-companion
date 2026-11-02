import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  BarChart3,
  TrendingUp,
  Grid,
  Calendar,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Moon,
} from 'lucide-react';
import { DailyPrayerTracker, Language, PrayerName } from '../../types';
import {
  DayPrayerStat,
  getLast30DaysPrayerStats,
  generateSample30DayTrackerData,
} from '../../utils/prayerHistory';

interface PrayerD3ChartProps {
  language: Language;
  trackerData: Record<string, DailyPrayerTracker>;
  onSeedSampleData?: (sampleData: Record<string, DailyPrayerTracker>) => void;
  onClearSampleData?: () => void;
  isSampleActive?: boolean;
}

type ChartViewType = 'stacked' | 'heatmap' | 'trend';

const PRAYER_KEYS: { id: PrayerName; label: string; ar: string }[] = [
  { id: 'fajr', label: 'Fajr', ar: 'الفجر' },
  { id: 'dhuhr', label: 'Dhuhr', ar: 'الظهر' },
  { id: 'asr', label: 'Asr', ar: 'العصر' },
  { id: 'maghrib', label: 'Maghrib', ar: 'المغرب' },
  { id: 'isha', label: 'Isha', ar: 'العشاء' },
];

export const PrayerD3Chart: React.FC<PrayerD3ChartProps> = ({
  language,
  trackerData,
  onSeedSampleData,
  onClearSampleData,
  isSampleActive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [viewType, setViewType] = useState<ChartViewType>('stacked');
  const [selectedPrayer, setSelectedPrayer] = useState<'all' | PrayerName>('all');
  const [hoveredDay, setHoveredDay] = useState<DayPrayerStat | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Compute 30-day stats from trackerData
  const stats = useMemo(() => {
    return getLast30DaysPrayerStats(trackerData);
  }, [trackerData]);

  // Handle responsive width resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Main D3 Render Effect
  useEffect(() => {
    if (!svgRef.current || !stats.days.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = Math.max(320, containerWidth);
    const height = viewType === 'heatmap' ? 240 : 260;
    const margin = {
      top: 24,
      right: 16,
      bottom: 40,
      left: viewType === 'heatmap' ? 64 : 36,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Detect dark mode from document
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#8E9D95' : '#68756E';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

    // ----------------------------------------------------
    // VIEW 1: STACKED BAR CHART (0 to 5 prayers per day)
    // ----------------------------------------------------
    if (viewType === 'stacked') {
      const x = d3
        .scaleBand<string>()
        .domain(stats.days.map((d) => d.date))
        .range([0, innerWidth])
        .padding(0.25);

      const y = d3.scaleLinear().domain([0, 5]).range([innerHeight, 0]);

      // Horizontal Grid Lines
      const yTicks = [1, 2, 3, 4, 5];
      g.append('g')
        .attr('class', 'grid')
        .selectAll('line')
        .data(yTicks)
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', gridColor)
        .attr('stroke-dasharray', (d) => (d === 5 ? '4,4' : '2,2'))
        .attr('stroke-width', (d) => (d === 5 ? 1.5 : 1));

      // 5-Prayer Goal Marker text
      g.append('text')
        .attr('x', innerWidth - 4)
        .attr('y', y(5) - 6)
        .attr('text-anchor', 'end')
        .attr('fill', '#C9A45C')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .text('Goal (5/5)');

      // Stacked Bar generation
      // Layers: Jama'ah (Bottom), Individual (Middle), Missed (Top)
      stats.days.forEach((day) => {
        const xPos = x(day.date) || 0;
        const barW = x.bandwidth();

        if (selectedPrayer === 'all') {
          let currentY = 0;

          // 1. Jama'ah Segment
          if (day.jamaahCount > 0) {
            const h = innerHeight - y(day.jamaahCount);
            g.append('rect')
              .attr('x', xPos)
              .attr('y', y(currentY + day.jamaahCount))
              .attr('width', barW)
              .attr('height', h)
              .attr('rx', day.individualCount === 0 && day.missedCount === 0 ? 3 : 1)
              .attr('fill', '#064E3B') // Deep Green for Jama'ah
              .attr('class', 'transition-opacity duration-150 cursor-pointer')
              .on('mouseenter', (event) => {
                setHoveredDay(day);
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                  setTooltipPos({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                  });
                }
              })
              .on('mouseleave', () => setHoveredDay(null));
            currentY += day.jamaahCount;
          }

          // 2. Individual Completed Segment
          if (day.individualCount > 0) {
            const h = innerHeight - y(day.individualCount);
            g.append('rect')
              .attr('x', xPos)
              .attr('y', y(currentY + day.individualCount))
              .attr('width', barW)
              .attr('height', h)
              .attr('rx', day.missedCount === 0 ? 3 : 1)
              .attr('fill', '#087F5B') // Primary Emerald for Prayed
              .attr('class', 'transition-opacity duration-150 cursor-pointer')
              .on('mouseenter', (event) => {
                setHoveredDay(day);
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                  setTooltipPos({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                  });
                }
              })
              .on('mouseleave', () => setHoveredDay(null));
            currentY += day.individualCount;
          }

          // 3. Missed Segment
          if (day.missedCount > 0) {
            const h = innerHeight - y(day.missedCount);
            g.append('rect')
              .attr('x', xPos)
              .attr('y', y(currentY + day.missedCount))
              .attr('width', barW)
              .attr('height', h)
              .attr('rx', 3)
              .attr('fill', '#F43F5E') // Rose for Missed
              .attr('opacity', 0.85)
              .attr('class', 'transition-opacity duration-150 cursor-pointer')
              .on('mouseenter', (event) => {
                setHoveredDay(day);
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                  setTooltipPos({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                  });
                }
              })
              .on('mouseleave', () => setHoveredDay(null));
          }

          // Empty day placeholder bar if 0 recorded
          if (day.completedCount === 0 && day.missedCount === 0) {
            g.append('rect')
              .attr('x', xPos)
              .attr('y', innerHeight - 4)
              .attr('width', barW)
              .attr('height', 4)
              .attr('rx', 2)
              .attr('fill', isDark ? '#23332B' : '#E4EAE5')
              .on('mouseenter', (event) => {
                setHoveredDay(day);
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                  setTooltipPos({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                  });
                }
              })
              .on('mouseleave', () => setHoveredDay(null));
          }
        } else {
          // Specific single prayer view
          const status = day.prayers[selectedPrayer];
          const isDone = status === 'completed' || status === 'jamaah';
          const isMissed = status === 'missed';
          const fill =
            status === 'jamaah'
              ? '#064E3B'
              : status === 'completed'
              ? '#087F5B'
              : isMissed
              ? '#F43F5E'
              : isDark
              ? '#23332B'
              : '#E4EAE5';

          g.append('rect')
            .attr('x', xPos)
            .attr('y', isDone || isMissed ? y(1) : innerHeight - 4)
            .attr('width', barW)
            .attr('height', isDone || isMissed ? innerHeight - y(1) : 4)
            .attr('rx', 3)
            .attr('fill', fill)
            .attr('class', 'cursor-pointer')
            .on('mouseenter', (event) => {
              setHoveredDay(day);
              const rect = containerRef.current?.getBoundingClientRect();
              if (rect) {
                setTooltipPos({
                  x: event.clientX - rect.left,
                  y: event.clientY - rect.top,
                });
              }
            })
            .on('mouseleave', () => setHoveredDay(null));
        }

        // Fasting indicator dot below bar
        if (day.fasted) {
          g.append('circle')
            .attr('cx', xPos + barW / 2)
            .attr('cy', innerHeight + 6)
            .attr('r', 2)
            .attr('fill', '#C9A45C');
        }
      });

      // 7-day rolling moving average trend line
      if (selectedPrayer === 'all' && stats.days.length >= 7) {
        const rollingAvgData = stats.days.map((day, idx, arr) => {
          const windowStart = Math.max(0, idx - 6);
          const slice = arr.slice(windowStart, idx + 1);
          const avg = slice.reduce((acc, cur) => acc + cur.completedCount, 0) / slice.length;
          return { date: day.date, avg };
        });

        const lineGen = d3
          .line<{ date: string; avg: number }>()
          .x((d) => (x(d.date) || 0) + x.bandwidth() / 2)
          .y((d) => y(d.avg))
          .curve(d3.curveMonotoneX);

        g.append('path')
          .datum(rollingAvgData)
          .attr('fill', 'none')
          .attr('stroke', '#C9A45C')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '3,3')
          .attr('opacity', 0.85)
          .attr('d', lineGen);
      }

      // Y-Axis labels (0 to 5)
      const yAxis = d3
        .axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d}`);

      g.append('g')
        .call(yAxis)
        .attr('color', textColor)
        .selectAll('text')
        .attr('font-size', '10px');

      // X-Axis labels (every 5-6 days to avoid overcrowding on small screens)
      const step = width < 480 ? 6 : width < 768 ? 4 : 3;
      const filteredTicks = stats.days.filter((_, idx) => idx % step === 0 || idx === stats.days.length - 1);

      const xAxis = d3
        .axisBottom(x)
        .tickValues(filteredTicks.map((d) => d.date))
        .tickFormat((dateStr) => {
          const match = stats.days.find((d) => d.date === dateStr);
          return match ? match.displayDate : '';
        });

      g.append('g')
        .attr('transform', `translate(0, ${innerHeight + 12})`)
        .call(xAxis)
        .attr('color', textColor)
        .selectAll('text')
        .attr('font-size', '10px')
        .attr('text-anchor', 'middle');
    }

    // ----------------------------------------------------
    // VIEW 2: PRAYER MATRIX / HEATMAP (5 prayers × 30 days)
    // ----------------------------------------------------
    else if (viewType === 'heatmap') {
      const prayersToShow =
        selectedPrayer === 'all'
          ? PRAYER_KEYS
          : PRAYER_KEYS.filter((p) => p.id === selectedPrayer);

      const x = d3
        .scaleBand<string>()
        .domain(stats.days.map((d) => d.date))
        .range([0, innerWidth])
        .padding(0.18);

      const y = d3
        .scaleBand<string>()
        .domain(prayersToShow.map((p) => p.id))
        .range([0, innerHeight])
        .padding(0.2);

      // Render Prayer Row Labels on the left
      prayersToShow.forEach((p) => {
        g.append('text')
          .attr('x', -8)
          .attr('y', (y(p.id) || 0) + y.bandwidth() / 2 + 3)
          .attr('text-anchor', 'end')
          .attr('fill', isDark ? '#E4EAE5' : '#17231F')
          .attr('font-size', '11px')
          .attr('font-weight', '600')
          .text(p.label);
      });

      // Render Grid Tiles
      prayersToShow.forEach((p) => {
        stats.days.forEach((day) => {
          const status = day.prayers[p.id];
          const xPos = x(day.date) || 0;
          const yPos = y(p.id) || 0;
          const w = x.bandwidth();
          const h = y.bandwidth();

          let fill = isDark ? '#1F2E26' : '#E8EFEA'; // none
          let stroke = 'transparent';

          if (status === 'jamaah') {
            fill = '#064E3B'; // Deep green
          } else if (status === 'completed') {
            fill = '#087F5B'; // Emerald
          } else if (status === 'missed') {
            fill = '#F43F5E'; // Rose
          }

          g.append('rect')
            .attr('x', xPos)
            .attr('y', yPos)
            .attr('width', w)
            .attr('height', h)
            .attr('rx', 3)
            .attr('fill', fill)
            .attr('stroke', stroke)
            .attr('class', 'transition-transform duration-100 cursor-pointer hover:opacity-85')
            .on('mouseenter', (event) => {
              setHoveredDay(day);
              const rect = containerRef.current?.getBoundingClientRect();
              if (rect) {
                setTooltipPos({
                  x: event.clientX - rect.left,
                  y: event.clientY - rect.top,
                });
              }
            })
            .on('mouseleave', () => setHoveredDay(null));
        });
      });

      // X-Axis labels
      const step = width < 480 ? 6 : width < 768 ? 4 : 3;
      const filteredTicks = stats.days.filter((_, idx) => idx % step === 0 || idx === stats.days.length - 1);

      const xAxis = d3
        .axisBottom(x)
        .tickValues(filteredTicks.map((d) => d.date))
        .tickFormat((dateStr) => {
          const match = stats.days.find((d) => d.date === dateStr);
          return match ? match.displayDate : '';
        });

      g.append('g')
        .attr('transform', `translate(0, ${innerHeight + 8})`)
        .call(xAxis)
        .attr('color', textColor)
        .selectAll('text')
        .attr('font-size', '10px');
    }

    // ----------------------------------------------------
    // VIEW 3: CONTINUOUS TREND AREA (Completion % spline)
    // ----------------------------------------------------
    else if (viewType === 'trend') {
      const x = d3
        .scaleTime()
        .domain([
          d3.min(stats.days, (d) => new Date(d.date)) || new Date(),
          d3.max(stats.days, (d) => new Date(d.date)) || new Date(),
        ])
        .range([0, innerWidth]);

      const y = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

      // Horizontal reference lines at 50%, 80%, 100%
      [20, 40, 60, 80, 100].forEach((tick) => {
        g.append('line')
          .attr('x1', 0)
          .attr('x2', innerWidth)
          .attr('y1', y(tick))
          .attr('y2', y(tick))
          .attr('stroke', gridColor)
          .attr('stroke-dasharray', tick === 100 ? '4,4' : '2,2');

        g.append('text')
          .attr('x', -6)
          .attr('y', y(tick) + 3)
          .attr('text-anchor', 'end')
          .attr('fill', textColor)
          .attr('font-size', '9px')
          .text(`${tick}%`);
      });

      // Gradient definition for area chart
      const defs = svg.append('defs');
      const gradient = defs
        .append('linearGradient')
        .attr('id', 'emerald-trend-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#087F5B')
        .attr('stop-opacity', isDark ? 0.45 : 0.35);

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#087F5B')
        .attr('stop-opacity', 0.0);

      // Trend data points (% completion)
      const trendPoints = stats.days.map((d) => {
        let pct = (d.completedCount / 5) * 100;
        if (selectedPrayer !== 'all') {
          const st = d.prayers[selectedPrayer];
          pct = st === 'completed' || st === 'jamaah' ? 100 : 0;
        }
        return {
          dateObj: new Date(d.date),
          pct,
          day: d,
        };
      });

      // Area generator
      const areaGen = d3
        .area<{ dateObj: Date; pct: number }>()
        .x((d) => x(d.dateObj))
        .y0(innerHeight)
        .y1((d) => y(d.pct))
        .curve(d3.curveMonotoneX);

      // Line generator
      const lineGen = d3
        .line<{ dateObj: Date; pct: number }>()
        .x((d) => x(d.dateObj))
        .y((d) => y(d.pct))
        .curve(d3.curveMonotoneX);

      // Draw Area
      g.append('path')
        .datum(trendPoints)
        .attr('fill', 'url(#emerald-trend-gradient)')
        .attr('d', areaGen);

      // Draw Line
      g.append('path')
        .datum(trendPoints)
        .attr('fill', 'none')
        .attr('stroke', '#087F5B')
        .attr('stroke-width', 2.5)
        .attr('d', lineGen);

      // Draw Interactive Points
      g.selectAll('.trend-dot')
        .data(trendPoints)
        .enter()
        .append('circle')
        .attr('class', 'trend-dot cursor-pointer')
        .attr('cx', (d) => x(d.dateObj))
        .attr('cy', (d) => y(d.pct))
        .attr('r', (d) => (d.pct === 100 ? 3.5 : 2.5))
        .attr('fill', (d) => (d.pct === 100 ? '#C9A45C' : '#087F5B'))
        .attr('stroke', isDark ? '#101A16' : '#FFFFFF')
        .attr('stroke-width', 1.5)
        .on('mouseenter', (event, d) => {
          setHoveredDay(d.day);
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            setTooltipPos({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
            });
          }
        })
        .on('mouseleave', () => setHoveredDay(null));

      // X-Axis
      const xAxis = d3
        .axisBottom<Date>(x)
        .ticks(width < 480 ? 4 : 7)
        .tickFormat(d3.timeFormat('%b %d') as any);

      g.append('g')
        .attr('transform', `translate(0, ${innerHeight + 10})`)
        .call(xAxis)
        .attr('color', textColor)
        .selectAll('text')
        .attr('font-size', '10px');
    }
  }, [containerWidth, viewType, selectedPrayer, stats]);

  // Handle seed sample data
  const handleLoadSample = () => {
    if (onSeedSampleData) {
      const sample = generateSample30DayTrackerData();
      onSeedSampleData(sample);
    }
  };

  const handleResetData = () => {
    if (onClearSampleData) {
      onClearSampleData();
    }
  };

  return (
    <div className="space-y-4">
      {/* 30-Day High-Level Analytics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs">
          <div className="flex items-center justify-between text-[#68756E] dark:text-[#8E9D95] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">30-Day Rate</span>
            <Award className="w-3.5 h-3.5 text-[#C9A45C]" />
          </div>
          <p className="text-xl font-extrabold text-[#087F5B] dark:text-[#C9A45C] tabular-nums">
            {stats.overallPercentage}%
          </p>
          <span className="text-[10px] text-[#68756E] dark:text-[#8E9D95]">
            {stats.totalCompleted} / {stats.totalPrayersRequired} prayers
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs">
          <div className="flex items-center justify-between text-[#68756E] dark:text-[#8E9D95] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Jama'ah Share</span>
            <Users className="w-3.5 h-3.5 text-[#064E3B] dark:text-emerald-400" />
          </div>
          <p className="text-xl font-extrabold text-[#064E3B] dark:text-emerald-400 tabular-nums">
            {stats.jamaahPercentage}%
          </p>
          <span className="text-[10px] text-[#68756E] dark:text-[#8E9D95]">
            {stats.totalJamaah} in congregation
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs">
          <div className="flex items-center justify-between text-[#68756E] dark:text-[#8E9D95] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Best Streak</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xl font-extrabold text-[#17231F] dark:text-[#E4EAE5] tabular-nums">
            {stats.bestStreak} <span className="text-xs font-normal">days</span>
          </p>
          <span className="text-[10px] text-[#68756E] dark:text-[#8E9D95]">
            Current: {stats.currentStreak} days
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-xs">
          <div className="flex items-center justify-between text-[#68756E] dark:text-[#8E9D95] mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Fasted Days</span>
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {stats.days.filter((d) => d.fasted).length} <span className="text-xs font-normal">days</span>
          </p>
          <span className="text-[10px] text-[#68756E] dark:text-[#8E9D95]">
            Sunnah / voluntary fasts
          </span>
        </div>
      </div>

      {/* Main Chart Container Card */}
      <div
        ref={containerRef}
        className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] shadow-sm relative overflow-hidden"
      >
        {/* Controls Bar: View Type Toggles & Prayer Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E4EAE5] dark:border-[#23332B]">
          <div className="flex items-center gap-1.5 bg-[#F7F9F6] dark:bg-[#101A16] p-1 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] self-start">
            <button
              onClick={() => setViewType('stacked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewType === 'stacked'
                  ? 'bg-white dark:bg-[#19251F] text-[#087F5B] dark:text-[#C9A45C] shadow-xs'
                  : 'text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-[#E4EAE5]'
              }`}
              title="Stacked completion bars"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Stacked Bars</span>
            </button>

            <button
              onClick={() => setViewType('heatmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewType === 'heatmap'
                  ? 'bg-white dark:bg-[#19251F] text-[#087F5B] dark:text-[#C9A45C] shadow-xs'
                  : 'text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-[#E4EAE5]'
              }`}
              title="30-day prayer matrix"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Prayer Matrix</span>
            </button>

            <button
              onClick={() => setViewType('trend')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewType === 'trend'
                  ? 'bg-white dark:bg-[#19251F] text-[#087F5B] dark:text-[#C9A45C] shadow-xs'
                  : 'text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-[#E4EAE5]'
              }`}
              title="Completion percentage spline"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trend Area</span>
            </button>
          </div>

          {/* Quick Filter: All vs Individual Prayers */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedPrayer('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedPrayer === 'all'
                  ? 'bg-[#087F5B] text-white shadow-xs'
                  : 'bg-[#F7F9F6] dark:bg-[#101A16] text-[#68756E] dark:text-[#8E9D95] hover:bg-[#E4EAE5] dark:hover:bg-[#23332B]'
              }`}
            >
              All (5)
            </button>
            {PRAYER_KEYS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPrayer(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedPrayer === p.id
                    ? 'bg-[#087F5B] text-white shadow-xs'
                    : 'bg-[#F7F9F6] dark:bg-[#101A16] text-[#68756E] dark:text-[#8E9D95] hover:bg-[#E4EAE5] dark:hover:bg-[#23332B]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 py-3 text-[11px] text-[#68756E] dark:text-[#8E9D95]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#064E3B] inline-block" />
            <span>Jama'ah</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#087F5B] inline-block" />
            <span>Individual</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F43F5E] inline-block" />
            <span>Missed</span>
          </span>
          {viewType === 'stacked' && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-[#C9A45C] inline-block" />
              <span>7-Day Moving Avg</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C9A45C] inline-block" />
            <span>Fasted</span>
          </span>
        </div>

        {/* D3 Render Target SVG */}
        <div className="relative w-full">
          <svg
            ref={svgRef}
            className="w-full overflow-visible select-none"
            style={{ minHeight: viewType === 'heatmap' ? 240 : 260 }}
          />

          {/* Interactive Floating Tooltip */}
          {hoveredDay && tooltipPos && (
            <div
              className="absolute z-20 pointer-events-none p-3 rounded-2xl bg-white dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B] shadow-xl text-xs w-56 transform -translate-x-1/2 -translate-y-full mb-3"
              style={{
                left: Math.min(Math.max(120, tooltipPos.x), containerWidth - 120),
                top: Math.max(10, tooltipPos.y - 10),
              }}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E4EAE5] dark:border-[#23332B]">
                <div className="font-bold text-[#17231F] dark:text-[#E4EAE5]">
                  {hoveredDay.displayDate} ({hoveredDay.dayOfWeek})
                </div>
                <div className="font-extrabold text-[#087F5B] dark:text-[#C9A45C] tabular-nums">
                  {hoveredDay.completedCount}/5 Prayed
                </div>
              </div>

              <div className="py-2 space-y-1">
                {PRAYER_KEYS.map((p) => {
                  const st = hoveredDay.prayers[p.id];
                  return (
                    <div key={p.id} className="flex items-center justify-between text-[11px]">
                      <span className="text-[#68756E] dark:text-[#8E9D95]">{p.label}:</span>
                      <span
                        className={`font-semibold capitalize px-1.5 py-0.2 rounded text-[10px] ${
                          st === 'jamaah'
                            ? 'bg-[#064E3B] text-white'
                            : st === 'completed'
                            ? 'bg-[#087F5B] text-white'
                            : st === 'missed'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                            : 'text-[#68756E] dark:text-[#8E9D95]'
                        }`}
                      >
                        {st === 'jamaah' ? 'Jama’ah' : st === 'completed' ? 'Prayed' : st === 'missed' ? 'Missed' : 'Not logged'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {hoveredDay.fasted && (
                <div className="pt-1 border-t border-[#E4EAE5] dark:border-[#23332B] flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                  <Moon className="w-3 h-3" />
                  <span>Fasted on this day</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Demo Data Seeder Banner / Toggle */}
        <div className="mt-4 pt-4 border-t border-[#E4EAE5] dark:border-[#23332B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#68756E] dark:text-[#8E9D95]">
            <HelpCircle className="w-4 h-4 text-[#087F5B] shrink-0" />
            <span>
              {isSampleActive
                ? 'Showing 30-day realistic sample devotion history.'
                : 'Showing your browser’s recorded prayer logs over the past 30 days.'}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {isSampleActive ? (
              <button
                onClick={handleResetData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E4EAE5] dark:border-[#23332B] hover:bg-[#F7F9F6] dark:hover:bg-[#101A16] font-semibold text-xs text-[#17231F] dark:text-[#E4EAE5] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to My Data</span>
              </button>
            ) : (
              <button
                onClick={handleLoadSample}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#087F5B] text-white hover:bg-[#064E3B] font-semibold text-xs shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>Load 30-Day Demo Data</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

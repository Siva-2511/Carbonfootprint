import { useEffect, useRef, useCallback } from 'react';
import type { RefObject } from 'react';
import { Chart, type ChartConfiguration, type ChartData } from 'chart.js';
import {
  ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Legend,
} from 'chart.js';

Chart.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

/** Manages Chart.js lifecycle: create once, update data, destroy on unmount. */
export function useChartRef(config: ChartConfiguration) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  // Initialize chart once
  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, config);
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateChart = useCallback((data: ChartData) => {
    if (!chartRef.current) return;
    chartRef.current.data = data;
    chartRef.current.update('none'); // Skip animation for performance
  }, []);

  return { canvasRef: canvasRef as RefObject<HTMLCanvasElement>, updateChart };
}

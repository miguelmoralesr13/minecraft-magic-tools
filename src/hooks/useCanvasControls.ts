
import { useState, useCallback, useEffect } from 'react';

interface CanvasControlsProps {
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onZoomChange?: (zoom: number) => void;
}

interface CanvasControls {
  position: { x: number; y: number };
  zoom: number;
  isDragging: boolean;
  startDrag: (x: number, y: number) => void;
  drag: (x: number, y: number) => void;
  endDrag: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  handleWheel: (e: React.WheelEvent) => void;
}

export function useCanvasControls({
  initialZoom = 1, 
  minZoom = 0.5, 
  maxZoom = 2,
  onPositionChange,
  onZoomChange
}: CanvasControlsProps = {}): CanvasControls {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(initialZoom);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Update callback when position changes
  useEffect(() => {
    onPositionChange?.(position);
  }, [position, onPositionChange]);

  // Update callback when zoom changes
  useEffect(() => {
    onZoomChange?.(zoom);
  }, [zoom, onZoomChange]);

  const startDrag = useCallback((x: number, y: number) => {
    setIsDragging(true);
    setDragStart({ x, y });
  }, []);

  const drag = useCallback((x: number, y: number) => {
    if (!isDragging) return;

    setPosition(prev => ({
      x: prev.x + (x - dragStart.x),
      y: prev.y + (y - dragStart.y)
    }));
    setDragStart({ x, y });
  }, [isDragging, dragStart]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, maxZoom));
  }, [maxZoom]);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, minZoom));
  }, [minZoom]);

  const resetView = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setZoom(initialZoom);
  }, [initialZoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(minZoom, Math.min(maxZoom, prev + delta)));
  }, [minZoom, maxZoom]);

  return {
    position,
    zoom,
    isDragging,
    startDrag,
    drag,
    endDrag,
    zoomIn,
    zoomOut,
    resetView,
    handleWheel
  };
}

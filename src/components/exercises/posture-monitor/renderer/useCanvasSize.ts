
import { useState, useCallback, useEffect } from 'react';

export const useCanvasSize = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  // Adjust canvas to match video dimensions
  const adjustCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const parent = canvas.parentElement;
    if (!parent) return;
    
    // Get actual display dimensions
    const displayWidth = parent.clientWidth;
    const displayHeight = parent.clientHeight;
    
    // If dimensions have changed, update canvas size
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      // Set canvas display size (css pixels)
      canvas.style.width = displayWidth + "px";
      canvas.style.height = displayHeight + "px";
      
      // Set actual size in memory (scaled for high DPI displays)
      const dpr = window.devicePixelRatio || 1;
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      
      // Scale context to ensure correct drawing operations
      ctx.scale(dpr, dpr);
      
      // Store the new size
      setCanvasSize({ width: displayWidth, height: displayHeight });
      
      console.log(`Canvas resized to ${displayWidth}x${displayHeight} (DPR: ${dpr})`);
    }
    
    // Clear the canvas after resize
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  // Set up resize observer
  useEffect(() => {
    adjustCanvas();
    
    // Watch for container resize
    const resizeObserver = new ResizeObserver(() => {
      adjustCanvas();
    });
    
    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }
    
    // Also watch for window resize
    window.addEventListener('resize', adjustCanvas);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', adjustCanvas);
    };
  }, [adjustCanvas, canvasRef]);

  return { canvasSize, adjustCanvas };
};

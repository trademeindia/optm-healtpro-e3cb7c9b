
import { useState, useEffect } from 'react';

interface CanvasSize {
  width: number;
  height: number;
}

export const useCanvasSize = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 640, height: 480 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      
      // Only update if sizes have actually changed
      if (canvasSize.width !== width || canvasSize.height !== height) {
        console.log('Canvas size set to ' + Math.round(width) + 'x' + Math.round(height));
        
        // Set the canvas resolution to match its display size
        canvas.width = width;
        canvas.height = height;
        
        setCanvasSize({ width, height });
      }
    };

    // Run once on component mount
    updateCanvasSize();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    // Clean up
    return () => {
      if (canvasRef.current) {
        resizeObserver.unobserve(canvasRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [canvasRef, canvasSize.width, canvasSize.height]);

  return { canvasSize };
};

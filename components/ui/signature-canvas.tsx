"use client";

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Box, Typography } from '@mui/material';

export interface SignatureCanvasRef {
  clear: () => void;
  getDataUrl: () => string | null;
  isEmpty: boolean;
}

interface SignatureCanvasProps {
  onStrokeChange?: (isEmpty: boolean) => void;
  placeholder?: string;
  height?: number;
  strokeColor?: string;
}

export const SignatureCanvas = forwardRef<SignatureCanvasRef, SignatureCanvasProps>(({
  onStrokeChange,
  placeholder = "Sign Inside This Box",
  height = 180,
  strokeColor = "#2e2e2e"
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(true);

  // Initialize canvas with correct sizing and line styles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.scale(2, 2);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = strokeColor;

    // Clear canvas to white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setIsEmptyState(true);
    if (onStrokeChange) onStrokeChange(true);
  }, [strokeColor]);

  // Coordinates helper
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (e.cancelable) e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();

    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    if (isEmptyState) {
      setIsEmptyState(false);
      if (onStrokeChange) onStrokeChange(false);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
      setIsEmptyState(true);
      if (onStrokeChange) onStrokeChange(true);
    },
    getDataUrl: () => {
      if (isEmptyState) return null;
      return canvasRef.current?.toDataURL('image/png') || null;
    },
    isEmpty: isEmptyState
  }));

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height,
        border: (theme) => `2px dashed ${isEmptyState ? theme.palette.primary.main : theme.palette.success.main}`,
        borderRadius: 2.5,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        touchAction: 'none',
        cursor: 'crosshair',
        transition: 'border-color 0.2s ease',
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      {isEmptyState && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.01)',
          }}
        >
          <Typography variant="caption" color="text.disabled">
            {placeholder}
          </Typography>
        </Box>
      )}
    </Box>
  );
});

SignatureCanvas.displayName = 'SignatureCanvas';

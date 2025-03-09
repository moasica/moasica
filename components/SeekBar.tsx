'use client';

import { useRef } from 'react';

import styles from '@/styles/SeekBar.module.scss';

interface SeekBarProps {
  className?: string;
  duration: number;
  position: number;
  onSeek: (position: number) => void;
}

export default function SeekBar({
  className,
  duration,
  position,
  onSeek
}: SeekBarProps) {
  const seekbarRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const updateProgress = (clientX: number) => {
    if (!seekbarRef.current) return;

    const rect = seekbarRef.current.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    offsetX = Math.max(0, Math.min(rect.width, offsetX));

    const newPosition = (offsetX / rect.width) * duration;
    onSeek(newPosition);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    updateProgress(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) updateProgress(e.clientX);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      className={`${styles.seekBar}${className ? ' ' + className : ''}`}
      ref={seekbarRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className={styles.seekBarFilled}
        style={{ width: `${(position / duration) * 100}%` }}
      >
        <div
          className={styles.seekBarThumb}
          onMouseDown={(e) => {
            e.stopPropagation();
            isDraggingRef.current = true;
          }}
        />
      </div>
    </div>
  );
}

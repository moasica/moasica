'use client';

import styles from '@/styles/Spinner.module.scss';

export default function Spinner({ width = 100, height = 100 }: { width?: number, height?: number }) {
  return (
    <svg className={styles.spinner} width={width} height={height} viewBox='0 0 100 100' xmlns="http://www.w3.org/2000/svg" style={{ width: `${width}px`, height: `${height}px`, '--s': `${width}px` }}>
      <circle cx='50' cy='50' r='47' stroke="currentColor" fill='none' />
    </svg>
  );
}
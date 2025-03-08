'use client';

import { useEffect, useState } from 'react';

import styles from '@/styles/Spinner.module.scss';

export default function Spinner({ width = 100, height = 100 }: { width?: number, height?: number }) {
  const [ style, setStyle ] = useState<object | undefined>(undefined);

  useEffect(() => {
    if (!CSS.supports('x: attr(x type(*))')) {
      console.log('%cCSS attribute selector is not supported! ((https://bugzilla.mozilla.org/show_bug.cgi?id=435426) 17 FUCKING YEARS AGO; and safari but it doesn\'t matter :3)', 'color: red;font-weight: bold;');

      setStyle({ width: `${width}px`, height: `${height}px` });
    }
  }, [ height, width ]);

  return (
    <svg className={styles.spinner} style={style} data-width={width} data-height={height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle 
        cx="50"
        cy="50"
        r="47"
        stroke="currentColor"
        fill="none" />
    </svg>
  );
}
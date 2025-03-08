'use client';

import Spinner from './Spinner';

export default function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner width={32} height={32} />
    </div>
  );
}
'use client';

import Spinner from './Spinner';

export default function Loader() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Spinner width={48} height={48} />
    </div>
  );
}

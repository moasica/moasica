'use client';

import { useEffect, useRef } from 'react';
import { MediaPlayer } from 'dashjs';
import { IPlayerConfig } from 'youtubei.js';

export default function VideoPlayer({ id, playerConfig }: { id: string, playerConfig?: IPlayerConfig }) {
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (playerRef.current && id) {
      const dashPlayer = MediaPlayer().create();
      dashPlayer.updateSettings({
        streaming: {
          buffer: {
            bufferTimeDefault: (playerConfig?.media_common_config.dynamic_readahead_config.max_read_ahead_media_time_ms || 0) / 1000,
            bufferTimeAtTopQuality: (playerConfig?.media_common_config.dynamic_readahead_config.read_ahead_growth_rate_ms || 0)  / 1000,
            bufferToKeep: 300
          }
        }
      });
      dashPlayer.initialize(playerRef.current!, `http://localhost:3000/api/video/${id}/dash`, false);
    }
  }, [id, playerConfig]);

  return (
    <audio data-dashjs-player controls ref={playerRef}></audio>
  );
}

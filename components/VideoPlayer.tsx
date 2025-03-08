'use client';

import { useEffect, useRef } from 'react';
import { MediaPlayer } from 'dashjs';
import { IPlayerConfig } from 'youtubei.js';

export default function VideoPlayer({ id, playerConfig }: { id: string, playerConfig?: IPlayerConfig }) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const gainRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);

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
      dashPlayer.initialize(playerRef.current!, `http://localhost:3000/api/v1/video/${id}/dash`, false);

      const audioContext = new AudioContext();
      const track = audioContext.createMediaElementSource(playerRef.current!);
      const gainNode = audioContext.createGain();

      track
        .connect(gainNode)
        .connect(audioContext.destination);

      if (gainRef.current) {
        gainRef.current.addEventListener('input', () => {
          gainNode.gain.value = parseFloat(gainRef.current!.value);
        });
      }

      dashPlayer.on('bufferLoaded', () => {
        track.mediaElement.play();
      });

      playerRef.current.addEventListener('loadedmetadata', () => {
        progressRef.current!.max = playerRef.current!.duration.toString();
      });

      playerRef.current.addEventListener('timeupdate', () => {
        progressRef.current!.value = playerRef.current!.currentTime.toString();
      });
    }
  }, [id, playerConfig]);

  return (
    <div>
      <input type="range" min="0" max="1" step="0.01" id="gain-slider" ref={gainRef} />

      <audio data-dashjs-player controls style={{ display: 'none' }} ref={playerRef} />

      <input type="range" id="progress-bar" min="0" max="100" value="0" step="0.1" ref={progressRef} />
      <span id="current-time">0:00</span> / <span id="total-time">0:00</span>
    </div>
  );
}

'use client';

import * as dashjs from 'dashjs';

type EventType = (
  'error' | 'abort' | 'canplay' | 'durationchange' | 'play' | 'pause' | 'ended' | 'playing' | 'progress' | 'seeked' | 'seeking' | 'stalled' | 'timeupdate' |
  'streaminitialized'
);

class MusicPlayer {
  private src: string;
  private metadata: MediaMetadata;

  private events: Map<EventType, ((e: (Event | dashjs.MediaPlayerEvent)) => void)> = new Map();

  private audio: HTMLAudioElement;

  private context: AudioContext;
  private source: MediaElementAudioSourceNode;
  private gain: GainNode;

  private player: dashjs.MediaPlayerClass;

  get duration() {
    return this.audio.duration;
  }
  get playbackRate() {
    return this.audio.playbackRate;
  }
  set playbackRate(value: number) {
    this.audio.playbackRate = value;
  }
  get position() {
    return this.audio.currentTime;
  }
  set position(value: number) {
    this.audio.currentTime = value;
  }

  constructor(src: string, metadata?: any, buffer?: { maxReadAhead: number, minReadAhead: number, readAhead: number }) {
    this.src = src;
    this.metadata = new MediaMetadata(metadata);

    this.audio = new Audio();

    this.context = new AudioContext();
    this.source = this.context.createMediaElementSource(this.audio);
    this.gain = this.context.createGain();

    this
      .source
      .connect(this.gain)
      .connect(this.context.destination);

    this.player = dashjs.MediaPlayer().create();
    this.player.updateSettings({
      streaming: {
        buffer: {
          bufferTimeDefault: buffer?.readAhead,
          bufferTimeAtTopQuality: buffer?.maxReadAhead,
          bufferTimeAtTopQualityLongForm: buffer?.minReadAhead,
          bufferToKeep: 300
        }
      }
    });
    this.player.initialize(this.audio, this.src, false);

    this.player.on('streamInitialized', (e) => this.events.get('streaminitialized')?.(e));
  }

  setVolume(volume: number) {
    this.gain.gain.value = volume;
  }

  getVolume() {
    return this.gain.gain.value;
  }

  setMetadata(metadata: any) {
    this.metadata = new MediaMetadata(metadata);
    navigator.mediaSession.metadata = this.metadata;
  }

  play() {
    this.audio.play();
    navigator.mediaSession.metadata = this.metadata;
    navigator.mediaSession.playbackState = 'playing';
  }

  pause() {
    this.audio.pause();
    navigator.mediaSession.playbackState = 'paused';
  }

  getBuffer() {
    return this.audio.buffered;
  }

  on(event: EventType, callback: (e: (Event | dashjs.MediaPlayerEvent)) => void) {
    this.events.set(event, callback);

    if (event !== 'streaminitialized')
      this.audio.addEventListener(event, (e) => callback(e));
  }
}

export default MusicPlayer;

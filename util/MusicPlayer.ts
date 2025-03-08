'use client';

import * as dashjs from 'dashjs';

class MusicPlayer {
  private src: string;
  private metadata: MediaMetadata;

  private events: ((e: (Event | dashjs.BufferEvent)) => void)[] = [];

  private audio: HTMLAudioElement;

  private context: AudioContext;
  private source: MediaElementAudioSourceNode;
  private gain: GainNode;

  private player: dashjs.MediaPlayerClass;

  constructor(src: string, metadata?: any) {
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
    this.player.initialize(this.audio, this.src, false);

    this.player.on('bufferLoaded', (e) => {
      this.events.forEach(callback => callback(e));
    });
    
    this.audio.addEventListener('progress', (e) => {
      this.events.forEach(callback => callback(e));
    });
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
  }

  pause() {
    this.audio.pause();
  }

  getBuffer() {
    return this.audio.buffered;
  }

  on(event: string, callback: (e: (Event | dashjs.BufferEvent)) => void) {
    this.events.push(callback);
  }
}

export default MusicPlayer;

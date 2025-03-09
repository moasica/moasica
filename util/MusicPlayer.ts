'use client';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// ^ hate to do this but it's necessary for this file

// @ts-ignore 
import shaka from 'shaka-player';

type EventType = (
  'error' | 'abort' | 'canplay' | 'durationchange' | 'play' | 'pause' | 'ended' | 'playing' | 'progress' | 'seeked' | 'seeking' | 'stalled' | 'timeupdate' | 'loadedmetadata'
);

class MusicPlayer {
  private src: string;

  private events: Map<EventType, ((e: Event) => void)> = new Map();

  private audio: HTMLAudioElement;

  private context: AudioContext;
  private source: MediaElementAudioSourceNode;
  private gain: GainNode;

  private player: any;

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

  constructor(src: string, buffer?: { maxReadAhead: number, minReadAhead: number, readAhead: number }) {
    shaka.polyfill.installAll();

    this.src = src;

    this.audio = new Audio();
    //this.audio.autoplay = true;

    this.context = new AudioContext();
    this.source = this.context.createMediaElementSource(this.audio);
    this.gain = this.context.createGain();

    this
      .source
      .connect(this.gain)
      .connect(this.context.destination);

    this.player = new shaka.Player();
    this.player.configure({
      streaming: {
        segmentPrefetchLimit: buffer ? buffer.maxReadAhead / 1000 : 15,
        bufferingGoal: buffer ? buffer.readAhead / 1000 : 1,
        bufferBehind: 300
      }
    });

    (async () => {
      // @ts-ignore
      await this.player.attach(this.audio);
      // @ts-ignore
      await this.player.load(this.src);
    })();
  }

  setVolume(volume: number) {
    this.gain.gain.value = volume;
  }

  getVolume() {
    return this.gain.gain.value;
  }

  play() {
    this.audio.play().catch((e) => console.error(e));
  }

  pause() {
    this.audio.pause();
  }

  getBuffer() {
    return this.audio.buffered;
  }

  on(event: EventType, callback: (e: Event) => void) {
    this.events.set(event, callback);
    this.audio.addEventListener(event, (e) => callback(e));
  }
}

export default MusicPlayer;

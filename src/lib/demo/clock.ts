import { DEFAULT_SPEED } from './domain';

/** One boundary per tick; never catches up time spent outside the visible session. */
export class PlaybackClock {
  running = false;
  progress = 0;
  speed = DEFAULT_SPEED;
  private last = 0;
  constructor(private advance: () => void) {}
  play(now: number) {
    this.last = now;
    this.running = true;
  }
  pause() {
    this.running = false;
  }
  setSpeed(seconds: number) {
    this.speed = seconds;
  }
  reset() {
    this.pause();
    this.progress = 0;
  }
  step() {
    if (!this.running) {
      this.progress = 0;
      this.advance();
    }
  }
  tick(now: number) {
    if (!this.running) return;
    const delta = Math.max(0, now - this.last);
    this.last = now;
    // A stalled event loop or sleeping device must not award offline interest.
    if (delta > 2000) {
      this.pause();
      return;
    }
    this.progress += delta / (this.speed * 1000);
    if (this.progress >= 1 - 1e-9) {
      this.progress = 0;
      this.advance();
    }
  }
}

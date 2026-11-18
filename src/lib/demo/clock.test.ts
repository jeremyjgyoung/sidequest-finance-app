import { expect, it } from 'vitest';
import { PlaybackClock } from './clock';
import { PLAYBACK_SPEEDS } from './domain';
it.each(PLAYBACK_SPEEDS)(
  'advances exactly once at the %ss boundary',
  (speed) => {
    let months = 0;
    const clock = new PlaybackClock(() => months++);
    clock.setSpeed(speed);
    clock.play(0);
    for (let now = 100; now <= speed * 1000; now += 100) clock.tick(now);
    clock.tick(speed * 1000);
    expect(months).toBe(1);
    expect(clock.progress).toBe(0);
  },
);
it('preserves pause and speed progress; manual steps only work paused', () => {
  let months = 0;
  const clock = new PlaybackClock(() => months++);
  clock.setSpeed(10);
  clock.play(0);
  clock.tick(1000);
  clock.pause();
  clock.tick(5000);
  expect(clock.progress).toBe(0.1);
  clock.setSpeed(2);
  clock.play(5000);
  clock.tick(6000);
  expect(clock.progress).toBeCloseTo(0.6);
  clock.step();
  expect(months).toBe(0);
  clock.pause();
  clock.step();
  expect(months).toBe(1);
  expect(clock.progress).toBe(0);
});
it('pauses stalled sessions without awarding catch-up interest', () => {
  let months = 0;
  const clock = new PlaybackClock(() => months++);
  clock.play(0);
  clock.tick(60000);
  expect(clock.running).toBe(false);
  expect(months).toBe(0);
});

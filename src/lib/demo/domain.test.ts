import { describe, expect, it } from 'vitest';
import {
  createDemo,
  currentGoal,
  exampleDemo,
  parseMoney,
  readSaved,
  transition,
  type DemoState,
} from './domain';

const fresh = () =>
  createDemo({
    teenName: 'Alex',
    title: 'PS5',
    icon: 'gamepad',
    target: 50000,
    teenWallet: 30000,
    parentWallet: 100000,
    reserve: 30000,
  });
const total = (s: DemoState) =>
  s.teenWallet +
  s.parentWallet +
  s.fund +
  s.goals.reduce((n, g) => n + g.balance, 0) +
  s.ledger
    .filter((e) => e.kind === 'purchase')
    .reduce((n, e) => n + e.amount, 0);
describe('family savings', () => {
  it('reserves money separately and does not mutate command inputs', () => {
    const s = fresh();
    const next = transition(s, { type: 'deposit', amount: 10000 });
    expect([s.parentWallet, s.fund, currentGoal(s).balance]).toEqual([
      70000, 30000, 0,
    ]);
    expect(currentGoal(next).balance).toBe(10000);
    expect(currentGoal(s).balance).toBe(0);
    expect(total(s)).toBe(total(next));
  });
  it('compounds and purchases with the exact reference accounting', () => {
    let s = exampleDemo();
    expect([
      currentGoal(s).balance,
      s.fund,
      s.totalInterest,
      s.teenWallet,
    ]).toEqual([39930, 20070, 9930, 20000]);
    for (let n = 0; n < 3; n++) s = transition(s, { type: 'month' });
    expect([
      currentGoal(s).balance,
      s.fund,
      s.totalInterest,
      currentGoal(s).status,
    ]).toEqual([53147, 6853, 23147, 'reached']);
    const before = total(s);
    s = transition(s, { type: 'purchase' });
    expect([
      s.teenWallet,
      currentGoal(s).balance,
      currentGoal(s).status,
    ]).toEqual([23147, 0, 'purchased']);
    expect(total(s)).toBe(before);
    expect(() => transition(s, { type: 'purchase' })).toThrow();
    s = transition(s, {
      type: 'new-goal',
      title: 'Headphones',
      icon: 'headphones',
      target: 20000,
    });
    expect([
      s.goals.length,
      currentGoal(s).balance,
      s.fund,
      s.teenWallet,
    ]).toEqual([2, 0, 6853, 23147]);
  });
  it('previews the fifty dollar transfer and reduces future interest after withdrawing', () => {
    let s = transition(exampleDemo(), { type: 'deposit', amount: 5000 });
    expect([s.teenWallet, currentGoal(s).balance]).toEqual([15000, 44930]);
    s = transition(s, { type: 'month' });
    expect(s.ledger.at(-1)?.amount).toBe(4493);
    s = transition(s, { type: 'withdrawal', amount: 10000 });
    const before = total(s);
    s = transition(s, { type: 'funding', amount: 5000 });
    expect(total(s)).toBe(before);
    s = transition(s, { type: 'month' });
    expect(s.ledger.at(-1)?.amount).toBe(3942);
  });
  it('skips insufficient funding entirely and resumes without back pay', () => {
    let s = transition(fresh(), { type: 'deposit', amount: 30000 });
    s = { ...s, fund: 2999 };
    s = transition(s, { type: 'month' });
    expect([currentGoal(s).balance, s.fund, s.ledger.at(-1)?.kind]).toEqual([
      30000,
      2999,
      'skipped',
    ]);
    s = transition(s, { type: 'funding', amount: 1 });
    s = transition(s, { type: 'month' });
    expect([currentGoal(s).balance, s.fund, s.totalInterest, s.month]).toEqual([
      33000, 0, 3000, 2,
    ]);
  });
  it('rounds half cents, advances zero-balance months, and handles an exact pool', () => {
    let s = transition(fresh(), { type: 'month' });
    expect([s.month, s.totalInterest]).toEqual([1, 0]);
    s = transition(s, { type: 'deposit', amount: 5 });
    s = transition(s, { type: 'month' });
    expect(currentGoal(s).balance).toBe(6);
  });
  it('supports deposit/target completion and locks a reached goal', () => {
    const s = transition(exampleDemo(), { type: 'deposit', amount: 10070 });
    expect(currentGoal(s).status).toBe('reached');
    expect(() => transition(s, { type: 'month' })).toThrow();
    expect(() => transition(s, { type: 'withdrawal', amount: 1 })).toThrow();
    const edited = transition(exampleDemo(), {
      type: 'edit-goal',
      title: 'PS5',
      icon: 'gamepad',
      target: 30000,
    });
    expect(currentGoal(edited).status).toBe('reached');
  });
  it('only creates money through explicit simulated income', () => {
    const s = exampleDemo();
    const next = transition(s, {
      type: 'income',
      amount: 1234,
      role: 'parent',
    });
    expect(total(next) - total(s)).toBe(1234);
    expect(() => transition(s, { type: 'deposit', amount: 999999 })).toThrow();
    expect(() => transition(s, { type: 'funding', amount: -1 })).toThrow();
    expect(() => transition(s, { type: 'withdrawal', amount: 0.1 })).toThrow();
  });
  it('defaults to two seconds and migrates retired speeds without changing savings', () => {
    const state = exampleDemo();
    expect(state.speed).toBe(2);
    for (const speed of [0.5, 1, 2, 10]) {
      expect(transition(state, { type: 'speed', speed }).speed).toBe(speed);
    }
    for (const speed of [5, 30]) {
      const restored = readSaved(JSON.stringify({ ...state, speed }));
      expect(restored).toEqual(state);
    }
    expect(readSaved(JSON.stringify({ ...state, speed: 10 })).speed).toBe(10);
    expect(() => transition(state, { type: 'speed', speed: 3 })).toThrow();
  });
  it('parses currency strictly and validates saved data', () => {
    expect(parseMoney('12.05')).toBe(1205);
    for (const input of ['-2', 'Infinity', '1e3', '12.001', '', 'abc'])
      expect(() => parseMoney(input)).toThrow();
    expect(readSaved(JSON.stringify(exampleDemo()))).toEqual(exampleDemo());
    for (const invalid of [
      'null',
      '{}',
      '{',
      JSON.stringify({ ...exampleDemo(), teenWallet: -1 }),
    ])
      expect(() => readSaved(invalid)).toThrow();
  });
});

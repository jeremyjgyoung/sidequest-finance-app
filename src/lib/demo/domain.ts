export type Role = 'teen' | 'parent';
export type InterestPeriod = 'daily' | 'weekly' | 'monthly';
export const INTEREST_PERIODS = {
  daily: { label: 'Daily', unit: 'day' },
  weekly: { label: 'Weekly', unit: 'week' },
  monthly: { label: 'Monthly', unit: 'month' },
} as const;
export type GoalStatus = 'saving' | 'reached' | 'purchased';
export type EntryKind =
  | 'deposit'
  | 'withdrawal'
  | 'interest'
  | 'skipped'
  | 'funding'
  | 'income'
  | 'purchase'
  | 'return'
  | 'settings'
  | 'goal';
export interface Goal {
  id: string;
  title: string;
  icon: string;
  target: number;
  balance: number;
  deposited: number;
  withdrawn: number;
  interest: number;
  status: GoalStatus;
  startedMonth: number;
  points: { month: number; balance: number }[];
}
export interface LedgerEntry {
  id: string;
  month: number;
  kind: EntryKind;
  amount: number;
  description: string;
  goalId?: string;
  role?: Role;
  basis?: number;
  interestRate?: number;
  interestPeriod?: InterestPeriod;
}
export interface DemoState {
  version: 1;
  teenName: string;
  teenWallet: number;
  parentWallet: number;
  fund: number;
  totalReserved: number;
  totalInterest: number;
  interestRate: number;
  interestPeriod: InterestPeriod;
  /** Sequential payment-period counter; legacy storage name retained for saved demos. */
  month: number;
  speed: number;
  role: Role;
  currentId: string;
  goals: Goal[];
  ledger: LedgerEntry[];
}
export interface SetupInput {
  teenName: string;
  title: string;
  icon: string;
  target: number;
  teenWallet: number;
  parentWallet: number;
  reserve: number;
  interestRate?: number;
  interestPeriod?: InterestPeriod;
}
export type Command =
  | { type: 'deposit' | 'withdrawal' | 'funding'; amount: number }
  | { type: 'income'; amount: number; role: Role }
  | { type: 'advance' | 'purchase' }
  | {
      type: 'edit-goal' | 'new-goal';
      title: string;
      icon: string;
      target: number;
    }
  | { type: 'role'; role: Role }
  | { type: 'speed'; speed: number }
  | {
      type: 'interest-settings';
      interestRate: number;
      interestPeriod: InterestPeriod;
    };

export const MAX_CENTS = 1_000_000_000_000;
export const PLAYBACK_SPEEDS: readonly number[] = [0.5, 1, 2, 10];
export const DEFAULT_SPEED = 2;
export const DEMO_BALANCES = {
  teenWallet: 50000,
  parentWallet: 1000000,
  reserve: 30000,
} as const;
export const GOAL_ICONS = [
  'gamepad',
  'bike',
  'headphones',
  'camera',
  'sparkles',
] as const;
export const formatMoney = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    cents / 100,
  );
export const currentGoal = (state: DemoState) =>
  state.goals.find((g) => g.id === state.currentId)!;
export const displayedBalance = (goal: Goal) =>
  goal.status === 'purchased'
    ? (goal.points.at(-1)?.balance ?? 0)
    : goal.balance;
export const calculateInterest = (balance: number, rate = 10) =>
  Math.round((balance * rate) / 100);
export function validateInterestSettings(
  rate: number,
  period: InterestPeriod,
): void {
  if (!Number.isInteger(rate) || rate < 1 || rate > 30)
    throw new Error('Choose a whole-number interest rate from 1% to 30%.');
  if (!Object.hasOwn(INTEREST_PERIODS, period))
    throw new Error('Choose daily, weekly, or monthly interest.');
}
export function assertMoney(value: number, allowZero = false): void {
  if (
    !Number.isSafeInteger(value) ||
    value < (allowZero ? 0 : 1) ||
    value > MAX_CENTS
  ) {
    throw new Error(
      allowZero
        ? 'Enter a valid amount of $0 or more.'
        : 'Enter a valid amount greater than $0.',
    );
  }
}
export function parseMoney(input: string): number {
  const cleaned = input.trim().replace(/^\$/, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(cleaned))
    throw new Error('Use dollars and up to two decimal places.');
  const [whole, fraction = ''] = cleaned.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  assertMoney(cents, true);
  return cents;
}
function goalDetails(title: string, icon: string, target: number) {
  if (!title.trim() || title.trim().length > 60)
    throw new Error('Give your goal a name of 1–60 characters.');
  if (!(GOAL_ICONS as readonly string[]).includes(icon))
    throw new Error('Choose one of the goal icons.');
  assertMoney(target);
}
function makeGoal(
  title: string,
  icon: string,
  target: number,
  month: number,
  index: number,
): Goal {
  goalDetails(title, icon, target);
  return {
    id: `goal-${index}`,
    title: title.trim(),
    icon,
    target,
    balance: 0,
    deposited: 0,
    withdrawn: 0,
    interest: 0,
    status: 'saving',
    startedMonth: month,
    points: [{ month, balance: 0 }],
  };
}
function entry(
  s: DemoState,
  kind: EntryKind,
  amount: number,
  description: string,
  extra: Partial<LedgerEntry> = {},
) {
  s.ledger.push({
    id: `entry-${s.ledger.length + 1}`,
    month: s.month,
    kind,
    amount,
    description,
    interestRate: s.interestRate,
    interestPeriod: s.interestPeriod,
    ...extra,
  });
}
function snapshot(s: DemoState, g: Goal) {
  const last = g.points.at(-1);
  if (last?.month === s.month) last.balance = g.balance;
  else g.points.push({ month: s.month, balance: g.balance });
}
function checkReached(g: Goal) {
  if (g.balance >= g.target) g.status = 'reached';
}
function saving(g: Goal) {
  if (g.status !== 'saving')
    throw new Error('This quest is complete. Start a new goal to keep saving.');
}
function available(amount: number, balance: number) {
  assertMoney(amount);
  if (amount > balance)
    throw new Error('There isn’t enough money in that balance.');
}
export function createDemo(input: SetupInput): DemoState {
  const name = input.teenName.trim();
  if (!name || name.length > 30)
    throw new Error('Enter a name of 1–30 characters.');
  const interestRate = input.interestRate ?? 10;
  const interestPeriod = input.interestPeriod ?? 'monthly';
  validateInterestSettings(interestRate, interestPeriod);
  assertMoney(input.teenWallet, true);
  assertMoney(input.parentWallet, true);
  assertMoney(input.reserve, true);
  if (input.reserve > input.parentWallet)
    throw new Error('The reservation can’t exceed the parent wallet.');
  const goal = makeGoal(input.title, input.icon, input.target, 0, 1);
  const state: DemoState = {
    version: 1,
    teenName: name,
    teenWallet: input.teenWallet,
    parentWallet: input.parentWallet - input.reserve,
    fund: input.reserve,
    totalReserved: input.reserve,
    totalInterest: 0,
    interestRate,
    interestPeriod,
    month: 0,
    speed: DEFAULT_SPEED,
    role: 'teen',
    currentId: goal.id,
    goals: [goal],
    ledger: [],
  };
  entry(state, 'goal', 0, `Started saving for ${goal.title}`, {
    goalId: goal.id,
  });
  if (input.reserve)
    entry(state, 'funding', input.reserve, 'Reserved the first interest fund', {
      role: 'parent',
    });
  return state;
}
export function transition(state: DemoState, command: Command): DemoState {
  const s = structuredClone(state);
  const g = currentGoal(s);
  switch (command.type) {
    case 'deposit':
      saving(g);
      available(command.amount, s.teenWallet);
      s.teenWallet -= command.amount;
      g.balance += command.amount;
      g.deposited += command.amount;
      entry(s, 'deposit', command.amount, 'Moved wallet money into savings', {
        goalId: g.id,
        role: 'teen',
      });
      snapshot(s, g);
      checkReached(g);
      break;
    case 'withdrawal':
      saving(g);
      available(command.amount, g.balance);
      g.balance -= command.amount;
      s.teenWallet += command.amount;
      g.withdrawn += command.amount;
      entry(
        s,
        'withdrawal',
        command.amount,
        'Moved savings back to the wallet',
        { goalId: g.id, role: 'teen' },
      );
      snapshot(s, g);
      break;
    case 'funding':
      available(command.amount, s.parentWallet);
      s.parentWallet -= command.amount;
      s.fund += command.amount;
      s.totalReserved += command.amount;
      entry(s, 'funding', command.amount, 'Added money to the interest fund', {
        role: 'parent',
      });
      break;
    case 'income':
      assertMoney(command.amount);
      if (command.role === 'teen') s.teenWallet += command.amount;
      else s.parentWallet += command.amount;
      entry(
        s,
        'income',
        command.amount,
        'Added simulated income to the wallet',
        { role: command.role },
      );
      break;
    case 'advance': {
      saving(g);
      s.month += 1;
      const interest = calculateInterest(g.balance, s.interestRate);
      if (!interest)
        entry(
          s,
          'skipped',
          0,
          'No interest payment — savings are too low to earn one cent',
          { goalId: g.id, basis: g.balance },
        );
      else if (s.fund < interest)
        entry(
          s,
          'skipped',
          0,
          `Skipped — the fund couldn’t cover ${formatMoney(interest)}`,
          { goalId: g.id, basis: g.balance },
        );
      else {
        const basis = g.balance;
        s.fund -= interest;
        g.balance += interest;
        g.interest += interest;
        s.totalInterest += interest;
        entry(
          s,
          'interest',
          interest,
          INTEREST_PERIODS[s.interestPeriod].label +
            ' interest from your parent',
          {
            goalId: g.id,
            basis,
          },
        );
      }
      snapshot(s, g);
      checkReached(g);
      break;
    }
    case 'edit-goal':
      saving(g);
      goalDetails(command.title, command.icon, command.target);
      g.title = command.title.trim();
      g.icon = command.icon;
      g.target = command.target;
      entry(s, 'goal', 0, 'Updated the savings goal', { goalId: g.id });
      checkReached(g);
      break;
    case 'new-goal': {
      if (g.status !== 'purchased')
        throw new Error('Finish your current goal before starting another.');
      const next = makeGoal(
        command.title,
        command.icon,
        command.target,
        s.month,
        s.goals.length + 1,
      );
      s.goals.push(next);
      s.currentId = next.id;
      entry(s, 'goal', 0, `Started saving for ${next.title}`, {
        goalId: next.id,
      });
      break;
    }
    case 'purchase': {
      if (g.status !== 'reached')
        throw new Error('Reach your goal before buying the item.');
      const excess = g.balance - g.target;
      entry(s, 'purchase', g.target, `Bought ${g.title} · simulated purchase`, {
        goalId: g.id,
        role: 'teen',
      });
      if (excess)
        entry(s, 'return', excess, 'Returned leftover savings to the wallet', {
          goalId: g.id,
          role: 'teen',
        });
      s.teenWallet += excess;
      g.balance = 0;
      g.status = 'purchased';
      break;
    }
    case 'interest-settings':
      if (s.role !== 'parent')
        throw new Error('Switch to the parent view to set the interest rules.');
      validateInterestSettings(command.interestRate, command.interestPeriod);
      s.interestRate = command.interestRate;
      s.interestPeriod = command.interestPeriod;
      entry(
        s,
        'settings',
        0,
        'Set interest to ' + s.interestRate + '% ' + s.interestPeriod,
        { role: 'parent' },
      );
      break;
    case 'role':
      if (!['teen', 'parent'].includes(command.role))
        throw new Error('Choose a valid view.');
      s.role = command.role;
      break;
    case 'speed':
      if (!PLAYBACK_SPEEDS.includes(command.speed))
        throw new Error('Choose a supported speed.');
      s.speed = command.speed;
      break;
  }
  [
    s.teenWallet,
    s.parentWallet,
    s.fund,
    s.totalReserved,
    s.totalInterest,
    ...s.goals.flatMap((goal) => [
      goal.balance,
      goal.deposited,
      goal.withdrawn,
      goal.interest,
    ]),
  ].forEach((n) => assertMoney(n, true));
  return s;
}
export function exampleDemo(): DemoState {
  let s = createDemo({
    teenName: 'Alex',
    title: 'PS5',
    icon: 'gamepad',
    target: 50000,
    ...DEMO_BALANCES,
  });
  for (const c of [
    { type: 'deposit', amount: 30000 },
    { type: 'advance' },
    { type: 'advance' },
    { type: 'advance' },
  ] as Command[])
    s = transition(s, c);
  return s;
}

export function readSaved(raw: string): DemoState {
  const s = JSON.parse(raw) as DemoState;
  if (s && typeof s === 'object') {
    s.interestRate ??= 10;
    s.interestPeriod ??= 'monthly';
  }
  // Retire old speed settings without discarding any saved financial progress.
  if (s && [5, 30].includes(s.speed)) s.speed = DEFAULT_SPEED;
  if (
    !s ||
    s.version !== 1 ||
    typeof s.teenName !== 'string' ||
    !s.teenName.trim() ||
    !['teen', 'parent'].includes(s.role) ||
    !PLAYBACK_SPEEDS.includes(s.speed) ||
    !Number.isSafeInteger(s.month) ||
    s.month < 0 ||
    !Array.isArray(s.goals) ||
    !s.goals.length ||
    !Array.isArray(s.ledger)
  )
    throw new Error('Invalid saved demo');
  validateInterestSettings(s.interestRate, s.interestPeriod);
  [
    s.teenWallet,
    s.parentWallet,
    s.fund,
    s.totalReserved,
    s.totalInterest,
  ].forEach((n) => assertMoney(n, true));
  for (const g of s.goals) {
    goalDetails(g.title, g.icon, g.target);
    if (
      typeof g.id !== 'string' ||
      !['saving', 'reached', 'purchased'].includes(g.status) ||
      !Array.isArray(g.points) ||
      !g.points.length ||
      !Number.isInteger(g.startedMonth)
    )
      throw new Error('Invalid saved goal');
    [g.balance, g.deposited, g.withdrawn, g.interest].forEach((n) =>
      assertMoney(n, true),
    );
    for (const p of g.points) {
      if (!Number.isInteger(p.month) || p.month < 0 || p.month > s.month)
        throw new Error('Invalid chart');
      assertMoney(p.balance, true);
    }
    if (
      (g.status === 'saving' && g.balance >= g.target) ||
      (g.status === 'reached' && g.balance < g.target) ||
      (g.status === 'purchased' && g.balance !== 0)
    )
      throw new Error('Invalid goal status');
  }
  if (
    !currentGoal(s) ||
    new Set(s.goals.map((g) => g.id)).size !== s.goals.length ||
    new Set(s.ledger.map((e) => e.id)).size !== s.ledger.length
  )
    throw new Error('Missing current goal');
  for (const e of s.ledger) {
    e.interestRate ??= 10;
    e.interestPeriod ??= 'monthly';
    validateInterestSettings(e.interestRate, e.interestPeriod);
    if (
      typeof e.id !== 'string' ||
      typeof e.description !== 'string' ||
      !Number.isInteger(e.month) ||
      e.month < 0 ||
      e.month > s.month ||
      ![
        'deposit',
        'withdrawal',
        'interest',
        'skipped',
        'funding',
        'income',
        'purchase',
        'return',
        'settings',
        'goal',
      ].includes(e.kind) ||
      (e.role !== undefined && !['teen', 'parent'].includes(e.role)) ||
      (e.goalId !== undefined && !s.goals.some((g) => g.id === e.goalId))
    )
      throw new Error('Invalid saved activity');
    assertMoney(e.amount, true);
    if (e.basis !== undefined) assertMoney(e.basis, true);
  }
  return s;
}

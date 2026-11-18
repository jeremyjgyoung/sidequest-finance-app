<script lang="ts">
  import { demo } from '#lib/demo/controller.svelte.js';
  import {
    displayedBalance,
    formatMoney,
    monthlyInterest,
  } from '#lib/demo/domain.js';
  import Icon from './Icon.svelte';
  import MoneyDialog from './MoneyDialog.svelte';
  import GoalDialog from './GoalDialog.svelte';
  import Modal from './Modal.svelte';
  import GrowthChart from './GrowthChart.svelte';
  import ActivityList from './ActivityList.svelte';
  const family = $derived(demo.state!);
  const goal = $derived(demo.goal!);
  const parent = $derived(family.role === 'parent');
  const active = $derived(goal.status === 'saving');
  const balance = $derived(displayedBalance(goal));
  const progress = $derived(Math.min(100, (balance / goal.target) * 100));
  const nextInterest = $derived(monthlyInterest(goal.balance));
  const covered = $derived(family.fund >= nextInterest);
  const recent = $derived(
    family.ledger
      .filter((e) => parent || e.goalId === goal.id || e.role === 'teen')
      .slice(-3)
      .reverse(),
  );
  let moneyMode = $state<'deposit' | 'withdrawal' | 'income' | null>(null);
  let goalMode = $state<'edit' | 'new' | null>(null);
  let purchase = $state(false);
  let reserve = $state('100.00');
  let fundError = $state('');
  import { parseMoney } from '#lib/demo/domain.js';
  function openMoney(mode: typeof moneyMode) {
    demo.pause();
    moneyMode = mode;
  }
  function openGoal(mode: typeof goalMode) {
    demo.pause();
    goalMode = mode;
  }
  function fund(e: SubmitEvent) {
    e.preventDefault();
    fundError = '';
    try {
      const amount = parseMoney(reserve);
      demo.send({ type: 'funding', amount });
      demo.inform(`${formatMoney(amount)} reserved for future interest.`);
    } catch (e) {
      fundError = (e as Error).message;
    }
  }
  function buy() {
    demo.send({ type: 'purchase' });
    purchase = false;
    demo.inform(`You did it! ${goal.title} purchased with demo money.`);
  }
</script>

<div class="page-intro">
  <div>
    <p class="eyebrow">
      {parent
        ? 'A LITTLE HELP GOES A LONG WAY'
        : active
          ? 'ONE SMALL STEP AT A TIME'
          : 'LOOK WHAT YOU MADE POSSIBLE'}
    </p>
    <h1>
      {parent
        ? 'Their future, growing.'
        : goal.status === 'purchased'
          ? 'One quest down. What’s next?'
          : active
            ? 'Your next adventure.'
            : 'Quest complete. You did it!'}
    </h1>
    <p class="muted page-description">
      {parent
        ? `A clear view of ${family.teenName}’s savings and the support behind them.`
        : active
          ? 'Build a little momentum. Get closer to something you love.'
          : goal.status === 'purchased'
            ? 'Keep the good habit going with a new goal.'
            : 'Your patience paid off. That goal is yours for the taking.'}
    </p>
  </div>
  <span class="chapter-label"
    ><Icon name={parent ? 'leaf' : 'sparkles'} size={16} />{parent
      ? 'Family overview'
      : `Quest ${String(family.goals.length).padStart(2, '0')}`}</span
  >
</div>

{#if parent}
  <section class="card parent-goal-summary">
    <div>
      <span class="eyebrow"
        >{goal.status === 'purchased' ? 'COMPLETED GOAL' : 'SAVINGS GOAL'}</span
      >
      <h2>
        <span class="goal-title-icon"><Icon name={goal.icon} size={25} /></span
        >{goal.title}
      </h2>
    </div>
    <div class="parent-goal-values">
      <strong>{formatMoney(balance)}</strong><span class="muted"
        >of {formatMoney(goal.target)}</span
      ><span class="badge sage"
        >{active
          ? `${Math.min(99, Math.round(progress))}% saved`
          : goal.status === 'purchased'
            ? 'Purchased'
            : 'Goal reached'}</span
      >
    </div>
    <div class="parent-progress-row">
      <div
        class="progress-track"
        role="progressbar"
        aria-label="Savings goal progress"
        aria-valuenow={Math.round(progress)}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span style:width={`${progress}%`}></span>
      </div>
      <span
        >{active
          ? `${formatMoney(Math.max(0, goal.target - balance))} remaining`
          : 'A goal worth celebrating'}</span
      >
    </div>
  </section>
  <div class="stat-grid">
    {#each [{ label: 'Your wallet', value: family.parentWallet, note: 'Available demo funds', icon: 'wallet' }, { label: 'Interest fund', value: family.fund, note: 'Reserved for future interest', icon: 'coins' }, { label: 'Interest paid', value: family.totalInterest, note: 'Across all your savings quests', icon: 'leaf' }] as stat}<section
        class="card stat-card"
      >
        <span class="small-icon"><Icon name={stat.icon} size={22} /></span>
        <div>
          <h3>{stat.label}</h3>
          <strong class="stat-value">{formatMoney(stat.value)}</strong>
          <p class="muted">{stat.note}</p>
        </div>
      </section>{/each}
  </div>
  <div class="parent-middle-grid">
    <section class="card funding-card">
      <div class="card-heading">
        <h3>Keep their progress growing</h3>
        <Icon name="leaf" size={21} />
      </div>
      <p class="muted">Move money from your wallet into the interest fund.</p>
      <form onsubmit={fund} class="funding-form">
        <label class="field"
          >Amount to reserve
          <div class="input-prefix">
            <span>$</span><input
              aria-label="Amount to reserve"
              bind:value={reserve}
              inputmode="decimal"
              onfocus={() => demo.pause()}
              required
            />
          </div></label
        ><button class="button primary" type="submit"
          >Fund interest pool<Icon name="arrow" size={16} /></button
        >
      </form>
      <button class="text-button inline" onclick={() => openMoney('income')}
        ><Icon name="plus" size={15} /> Add demo funds to your wallet</button
      >{#if fundError}<p class="form-error" role="alert">{fundError}</p>{/if}
    </section>
    <section class="card boost-card">
      <div class="card-heading">
        <h3>{active ? 'Next monthly payment' : 'A milestone made possible'}</h3>
        <span class="small-icon gold"
          ><Icon name={active ? 'coins' : 'check'} size={21} /></span
        >
      </div>
      {#if active}<div class="boost-value">
          <strong>{formatMoney(nextInterest)}</strong><span
            class:amber={!covered}
            class="badge sage"
            >{!nextInterest
              ? 'No savings yet'
              : covered
                ? 'Covered'
                : 'Needs funding'}</span
          >
        </div>
        <p class="calculation">
          {formatMoney(goal.balance)} <span>×</span> 10% <span>=</span>
          {formatMoney(nextInterest)}
        </p>
        <p class="muted">
          Paid from the interest fund at the next month boundary.
        </p>
        <div class="rule-note">
          <Icon name="info" size={16} /><span
            >A month is skipped if the fund can’t cover the full payment. No
            back payments.</span
          >
        </div>{:else}<strong class="stat-value green"
          >{formatMoney(goal.interest)}</strong
        >
        <p class="muted">
          Your interest contributions toward this goal. The unused fund stays
          available for the next adventure.
        </p>{/if}
    </section>
  </div>
{:else}
  <div class="teen-main-grid">
    <section class="card quest-card" class:complete={!active}>
      <div class="quest-top">
        <div>
          <span class="eyebrow"
            >{active
              ? 'YOUR ACTIVE QUEST'
              : goal.status === 'purchased'
                ? 'QUEST PURCHASED'
                : 'QUEST COMPLETE'}</span
          >
          <h2>
            <span class="goal-title-icon"
              ><Icon name={goal.icon} size={25} /></span
            >{goal.title}
          </h2>
        </div>
        {#if active}<button
            class="icon-button"
            aria-label="Edit savings goal"
            onclick={() => openGoal('edit')}
            ><Icon name="edit" size={18} /></button
          >{:else}<span class="complete-seal"
            ><Icon name="check" size={20} /></span
          >{/if}
      </div>
      <div class="goal-balance">
        <strong>{formatMoney(balance)}</strong><span
          >of {formatMoney(goal.target)}</span
        ><span class="badge" class:sage={active} class:gold={!active}
          >{active
            ? `${Math.min(99, Math.round(progress))}% saved`
            : goal.status === 'purchased'
              ? 'You made it happen'
              : 'Goal reached!'}</span
        >
      </div>
      <div class="quest-landscape">
        <img
          src={goal.icon !== 'gamepad'
            ? '/art/forest-generic.png'
            : active
              ? '/art/forest-saving.png'
              : '/art/forest-complete.png'}
          alt=""
        /><span class="landscape-tag"
          ><Icon name="flag" size={13} />{active
            ? 'THE JOURNEY IS THE REWARD'
            : 'A LITTLE PATIENCE. A BIG WIN.'}</span
        >
      </div>
      <div class="milestones">
        <div
          class="progress-track"
          role="progressbar"
          aria-label="Savings goal progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span style:width={`${progress}%`}></span>
        </div>
        {#each [25, 50, 75, 100] as milestone}<div
            class="milestone"
            class:unlocked={progress >= milestone}
            style:left={`${milestone}%`}
          >
            <span
              >{#if progress >= milestone}<Icon
                  name="check"
                  size={12}
                />{:else}<i></i>{/if}</span
            ><small>{milestone === 100 ? 'FINISH' : `${milestone}%`}</small>
          </div>{/each}
      </div>
      <div class="quest-bottom">
        {#if active}<span class="remaining"
            ><strong>{formatMoney(Math.max(0, goal.target - balance))}</strong> to
            go</span
          >
          <div class="button-row">
            <button class="button primary" onclick={() => openMoney('deposit')}
              ><Icon name="plus" size={16} />Add to savings</button
            ><button
              class="button secondary"
              onclick={() => openMoney('withdrawal')}
              disabled={goal.balance === 0}>Withdraw</button
            >
          </div>{:else if goal.status === 'reached'}<span class="remaining"
            ><strong>{formatMoney(balance - goal.target)}</strong> left after purchase</span
          ><button
            class="button primary"
            onclick={() => {
              demo.pause();
              purchase = true;
            }}><Icon name="gift" size={17} />Buy {goal.title}</button
          >{:else}<span class="remaining"
            ><Icon name="check" size={17} />Purchased with demo money</span
          ><button class="button primary" onclick={() => openGoal('new')}
            >Start a new quest<Icon name="arrow" size={16} /></button
          >{/if}
      </div>
    </section>
    <div class="teen-side-stack">
      <section class="card wallet-card">
        <div class="card-heading">
          <h3>Your wallet</h3>
          <span class="small-icon gold"><Icon name="wallet" size={20} /></span>
        </div>
        <strong class="wallet-value">{formatMoney(family.teenWallet)}</strong>
        <p class="muted">A little something for your next move.</p>
        <button
          class="button secondary full"
          onclick={() => openMoney('income')}
          ><Icon name="plus" size={16} />Add demo funds</button
        >
      </section>
      <section class="card boost-card teen-boost">
        <div class="card-heading">
          <h3>{active ? 'Your next boost' : 'Ready when you are'}</h3>
          <Icon name={active ? 'sparkles' : 'gift'} size={23} />
        </div>
        {#if active}<div class="boost-value">
            <strong>+{formatMoney(nextInterest)}</strong><span
              class="badge gold">10% / month</span
            >
          </div>
          <p class="muted">
            A little help from your parent, growing with your savings.
          </p>
          <div class="calculation">
            {formatMoney(goal.balance)} <span>×</span> 10% <span>=</span>
            {formatMoney(nextInterest)}
          </div>
          <div class="boost-status" class:warning={!covered}>
            <span class="status-dot"></span>{!nextInterest
              ? 'Add savings to start earning'
              : covered
                ? 'Parent fund: covered'
                : 'Parent fund needs a top-up'}
          </div>
          {#if !covered}<p class="fine-print">
              This month will be skipped unless the full payment is funded.
            </p>{/if}{:else}<div class="purchase-totals">
            <div><span>Saved</span><strong>{formatMoney(balance)}</strong></div>
            <div>
              <span
                >{goal.status === 'purchased'
                  ? 'Purchase made'
                  : 'Purchase price'}</span
              ><strong>{formatMoney(goal.target)}</strong>
            </div>
            <div>
              <span
                >{goal.status === 'purchased'
                  ? 'Returned to wallet'
                  : 'Left over'}</span
              ><strong class="green"
                >{formatMoney(balance - goal.target)}</strong
              >
            </div>
          </div>
          <p class="helper">
            {goal.status === 'purchased'
              ? 'Your extra savings are back in your wallet. Nicely done.'
              : 'Interest has stopped. You’ve already reached your goal.'}
          </p>{/if}
      </section>
    </div>
  </div>
{/if}

<div class="dashboard-bottom-grid">
  <GrowthChart {goal} {parent} />
  <section class="card recent-card">
    <div class="card-heading">
      <h3>Recent activity</h3>
      <a class="subtle-link" href="/activity/"
        >View all<Icon name="arrow" size={14} /></a
      >
    </div>
    <ActivityList entries={recent} state={family} />
    <div class="activity-footnote">
      <span class="status-dot"></span>Every little move, accounted for.
    </div>
  </section>
</div>
{#if parent}<p class="fund-accounting">
    Total reserved <strong>{formatMoney(family.totalReserved)}</strong><span
      >·</span
    >Paid <strong>{formatMoney(family.totalInterest)}</strong><span>·</span
    >Remaining <strong>{formatMoney(family.fund)}</strong>
  </p>{/if}

{#if moneyMode}<MoneyDialog
    mode={moneyMode}
    onclose={() => (moneyMode = null)}
  />{/if}
{#if goalMode}<GoalDialog
    mode={goalMode}
    onclose={() => (goalMode = null)}
  />{/if}
{#if purchase}<Modal
    title="Your quest, accomplished."
    subtitle={`Ready to use ${formatMoney(goal.target)} of your savings to buy ${goal.title}?`}
    onclose={() => (purchase = false)}
    ><div class="stack">
      <div class="preview-panel">
        <div class="preview-row">
          <span>Simulated purchase</span><strong
            >{formatMoney(goal.target)}</strong
          >
        </div>
        <div class="preview-row">
          <span>Returned to your wallet</span><strong
            >{formatMoney(goal.balance - goal.target)}</strong
          >
        </div>
      </div>
      <p class="helper">
        This records a demo purchase. No real item is ordered and no real money
        moves.
      </p>
      <button class="button primary full" onclick={buy}
        >Buy {goal.title} · Demo purchase<Icon name="check" size={17} /></button
      ><button class="text-button" onclick={() => (purchase = false)}
        >A little later</button
      >
    </div></Modal
  >{/if}

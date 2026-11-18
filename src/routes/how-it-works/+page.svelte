<script lang="ts">
  import Icon from '#lib/components/Icon.svelte';
  import { demo } from '#lib/demo/controller.svelte.js';
  import {
    calculateInterest,
    formatMoney,
    INTEREST_PERIODS,
  } from '#lib/demo/domain.js';
  const rate = $derived(demo.state?.interestRate ?? 10);
  const period = $derived(demo.state?.interestPeriod ?? 'monthly');
  const unit = $derived(INTEREST_PERIODS[period].unit);
  const unitTitle = $derived(unit.charAt(0).toUpperCase() + unit.slice(1));
  const firstInterest = $derived(calculateInterest(10000, rate));
  const firstBalance = $derived(10000 + firstInterest);
  const secondInterest = $derived(calculateInterest(firstBalance, rate));
</script>

<svelte:head><title>How it works — Sidequest</title></svelte:head>
<div class="page-intro">
  <div>
    <p class="eyebrow">A LITTLE KNOW-HOW GOES A LONG WAY</p>
    <h1>Small steps. Growing possibilities.</h1>
    <p class="muted page-description">
      Here’s how a little saving and a little support work together.
    </p>
  </div>
</div>
<div class="learning-steps">
  {#each [{ n: '01', icon: 'flag', title: 'Pick something worth it.', text: 'Name your goal and set its price. Move money from your wallet into savings whenever you’re ready.' }, { n: '02', icon: 'wallet', title: 'A parent sets the boost.', text: 'Your parent reserves a separate pool of money. This fund pays your interest; it doesn’t count toward your goal until a payment is made.' }, { n: '03', icon: 'leaf', title: 'Let little things grow.', text: 'Your parent chooses 1–30% interest, paid daily, weekly, or monthly. Each simulated period earns interest on savings plus earlier interest. That’s compounding.' }] as step}<section
      class="card learning-card"
    >
      <div class="learning-step-number">
        {step.n}<span class="small-icon"
          ><Icon name={step.icon} size={23} /></span
        >
      </div>
      <h2>{step.title}</h2>
      <p class="muted">{step.text}</p>
    </section>{/each}
</div>
<section class="card compound-example">
  <div>
    <span class="eyebrow">THE MAGIC IS IN THE NEXT {unit.toUpperCase()}</span>
    <h2>Interest that earns interest.</h2>
    <p class="muted">
      Start with $100 and make no new deposits. At your current {rate}% {period} rate,
      with enough parent funding:
    </p>
  </div>
  <div class="compound-equation">
    <div>
      <span>You save</span><strong>$100.00</strong><small
        >Starting balance</small
      >
    </div>
    <Icon name="arrow" />
    <div>
      <span>{unitTitle} 1</span><strong>{formatMoney(firstBalance)}</strong
      ><small>+{formatMoney(firstInterest)} interest</small>
    </div>
    <Icon name="arrow" />
    <div>
      <span>{unitTitle} 2</span><strong class="green"
        >{formatMoney(firstBalance + secondInterest)}</strong
      ><small>+{formatMoney(secondInterest)} interest</small>
    </div>
  </div>
  <p class="example-explanation">
    <Icon name="sparkles" size={18} />The second payment is {formatMoney(
      secondInterest,
    )} because it’s {rate}% of {formatMoney(firstBalance)}, including the first
    payment’s interest.
  </p>
</section>
<section class="card learning-rules">
  <h2>A few things to know.</h2>
  <div class="rules-grid">
    {#each [{ title: 'The fund has a limit.', text: 'If the parent fund can’t cover a whole interest payment, that period is skipped. Later top-ups cover future payments, with no back payments.' }, { title: 'Your money stays yours.', text: 'Withdraw savings back into your wallet while a goal is active. A smaller balance means a smaller next interest payment.' }, { title: 'You control the clock.', text: 'Play at 0.5, 1, 2, or 10 seconds per simulated period (default: 2 seconds), or pause and advance a day, week, or month yourself. Changing tabs and opening money dialogs pauses the simulation.' }, { title: 'A goal is a finish line.', text: 'The final interest payment can exceed your target. Interest stops when the goal is reached. Buy the item with demo money and keep any excess in your wallet.' }] as rule}<div
      >
        <h3>{rule.title}</h3>
        <p class="muted">{rule.text}</p>
      </div>{/each}
  </div>
  <div class="info-note">
    <Icon name="info" size={20} />
    <p>
      This is a learning demo. Your parent chooses the rate (10% by default) and
      payment period (monthly by default). These are parent-funded learning
      rules, not bank rates or investment returns. No real money moves, and your
      demo stays in this browser.
    </p>
  </div>
</section>

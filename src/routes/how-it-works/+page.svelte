<script lang="ts">
  import Icon from '#lib/components/Icon.svelte';
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
  {#each [{ n: '01', icon: 'flag', title: 'Pick something worth it.', text: 'Name your goal and set its price. Move money from your wallet into savings whenever you’re ready.' }, { n: '02', icon: 'wallet', title: 'A parent sets the boost.', text: 'Your parent reserves a separate pool of money. This fund pays your interest; it doesn’t count toward your goal until a payment is made.' }, { n: '03', icon: 'leaf', title: 'Let little things grow.', text: 'Each simulated month, your savings earn 10% paid by your parent. Earlier interest earns interest too. That’s compounding.' }] as step}<section
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
    <span class="eyebrow">THE MAGIC IS IN THE NEXT MONTH</span>
    <h2>Interest that earns interest.</h2>
    <p class="muted">
      Start with $100 and make no new deposits. With enough parent funding,
      here’s what happens:
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
      <span>Month 1</span><strong>$110.00</strong><small>+$10.00 interest</small
      >
    </div>
    <Icon name="arrow" />
    <div>
      <span>Month 2</span><strong class="green">$121.00</strong><small
        >+$11.00 interest</small
      >
    </div>
  </div>
  <p class="example-explanation">
    <Icon name="sparkles" size={18} />The second payment is $11 because it’s 10%
    of $110, including the first month’s interest.
  </p>
</section>
<section class="card learning-rules">
  <h2>A few things to know.</h2>
  <div class="rules-grid">
    {#each [{ title: 'The fund has a limit.', text: 'If the parent fund can’t cover a whole monthly payment, that month is skipped. Later top-ups cover future payments, with no back payments.' }, { title: 'Your money stays yours.', text: 'Withdraw savings back into your wallet while a goal is active. A smaller balance means a smaller next interest payment.' }, { title: 'You control the clock.', text: 'Play at 5, 10, or 30 seconds per month, or pause and advance a month yourself. Changing tabs and opening money dialogs pauses the simulation.' }, { title: 'A goal is a finish line.', text: 'The final monthly payment can exceed your target. Interest stops when the goal is reached. Buy the item with demo money and keep any excess in your wallet.' }] as rule}<div
      >
        <h3>{rule.title}</h3>
        <p class="muted">{rule.text}</p>
      </div>{/each}
  </div>
  <div class="info-note">
    <Icon name="info" size={20} />
    <p>
      This is a learning demo. The 10% monthly rate is a parent-funded rule, not
      a bank rate or an investment return. No real money moves, and your demo
      stays in this browser.
    </p>
  </div>
</section>

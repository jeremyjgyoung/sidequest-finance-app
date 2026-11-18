<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from './Icon.svelte';
  import Sprout from './Sprout.svelte';
  import Modal from './Modal.svelte';
  import { demo } from '#lib/demo/controller.svelte.js';
  import { GOAL_ICONS, DEMO_BALANCES, parseMoney } from '#lib/demo/domain.js';
  let teenName = $state('Alex');
  let title = $state('PS5');
  let icon = $state('gamepad');
  let target = $state('500');
  let error = $state('');
  let replace = $state<'example' | 'setup' | null>(null);
  function finish() {
    try {
      demo.start({
        teenName,
        title,
        icon,
        target: parseMoney(target),
        ...DEMO_BALANCES,
      });
      void goto('/');
    } catch (e) {
      error = (e as Error).message;
    }
  }
  function submit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    if (demo.recovery) replace = 'setup';
    else finish();
  }
  function example() {
    if (demo.recovery) replace = 'example';
    else {
      demo.loadExample();
      void goto('/');
    }
  }
</script>

<div class="setup-page">
  <header class="setup-header">
    <a class="wordmark" href="/"
      ><Sprout /><span>sidequest<span class="logo-dot">.</span></span></a
    ><span class="demo-label"><span></span>A family savings demo</span>
  </header>
  <main id="main" class="setup-grid">
    <section class="setup-story">
      <p class="eyebrow">SMALL SAVES. BIG ADVENTURES.</p>
      <h1>A little today.<br />A lot to look<br />forward to.</h1>
      <p class="setup-lede">
        Turn “one day” into a plan. Pick a goal, start saving, and watch a
        little help from your parent grow.
      </p>
      <div class="setup-art">
        <img
          src="/art/forest-saving.png"
          alt="A cozy pixel forest path leading toward a treasure chest and game console"
        /><span class="art-caption"
          ><Icon name="flag" size={14} />Your next adventure starts here</span
        >
      </div>
      <div class="setup-benefits">
        <span><Icon name="check" size={16} />Parent-funded savings boosts</span
        ><span><Icon name="check" size={16} />All money is simulated</span>
      </div>
    </section>
    <section class="setup-panel card">
      <p class="eyebrow">JUST PICK YOUR QUEST</p>
      <h2>What’s your next quest?</h2>
      <p class="muted">
        Your demo wallets are ready. Choose something worth saving for.
      </p>
      <form class="stack setup-form" onsubmit={submit}>
        <label class="field"
          >Teen’s first name<input
            bind:value={teenName}
            maxlength="30"
            required
          /></label
        >
        <label class="field"
          >What are you saving for?<input
            bind:value={title}
            maxlength="60"
            required
          /></label
        >
        <div class="field-columns">
          <label class="field"
            >Target price
            <div class="input-prefix">
              <span>$</span><input
                bind:value={target}
                inputmode="decimal"
                required
              />
            </div></label
          >
          <fieldset class="icon-options">
            <legend>Goal icon</legend>{#each GOAL_ICONS as item}<button
                type="button"
                class:chosen={icon === item}
                aria-label={item}
                aria-pressed={icon === item}
                onclick={() => (icon = item)}
                ><Icon name={item} size={20} /></button
              >{/each}
          </fieldset>
        </div>
        <div class="info-note">
          <Icon name="wallet" size={19} />
          <p>
            Start with <strong>$500</strong> in the teen wallet and
            <strong>$10,000</strong>
            in the parent wallet. We automatically set aside
            <strong>$300</strong> from the parent wallet for interest.
          </p>
        </div>
        {#if error}<p class="form-error" role="alert">{error}</p>{/if}
        <button type="submit" class="button primary full"
          >Start my adventure<Icon name="arrow" size={18} /></button
        >
      </form>
      <div class="example-divider"><span>just looking around?</span></div>
      <button class="example-button" onclick={example}
        ><span class="small-icon gold"><Icon name="gamepad" size={22} /></span
        ><span
          ><strong>Explore the example demo</strong><small
            >Jump into Alex’s PS5 quest at Month 3</small
          ></span
        ><Icon name="arrow" size={18} /></button
      >
    </section>
  </main>
  <footer class="setup-footer">
    A little learning. A lot of possibility.<span
      >Simulated money · No accounts or bank connections</span
    >
  </footer>
</div>
{#if replace}<Modal
    title="Replace your saved demo?"
    subtitle="The unreadable saved data will be replaced. This can’t be undone."
    onclose={() => (replace = null)}
    ><div class="stack">
      <button
        class="button primary full"
        onclick={() => {
          if (replace === 'example') {
            demo.loadExample();
            void goto('/');
          } else finish();
          replace = null;
        }}>Replace and continue</button
      ><button class="text-button" onclick={() => (replace = null)}
        >Cancel</button
      >
    </div></Modal
  >{/if}

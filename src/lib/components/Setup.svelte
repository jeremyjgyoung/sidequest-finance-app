<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from './Icon.svelte';
  import Sprout from './Sprout.svelte';
  import Modal from './Modal.svelte';
  import { demo } from '#lib/demo/controller.svelte.js';
  import { GOAL_ICONS, formatMoney, parseMoney } from '#lib/demo/domain.js';
  let step = $state(0);
  let teenName = $state('Alex');
  let title = $state('PS5');
  let icon = $state('gamepad');
  let target = $state('500');
  let teenWallet = $state('300');
  let parentWallet = $state('1000');
  let reserve = $state('300');
  let error = $state('');
  let replace = $state<'example' | 'setup' | null>(null);
  function getInput() {
    return {
      teenName,
      title,
      icon,
      target: parseMoney(target),
      teenWallet: parseMoney(teenWallet),
      parentWallet: parseMoney(parentWallet),
      reserve: parseMoney(reserve),
    };
  }
  function next(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    try {
      if (!teenName.trim() || !title.trim() || parseMoney(target) <= 0)
        throw new Error('Add a name, a goal, and a target greater than $0.');
      if (step === 1) {
        const i = getInput();
        if (i.reserve > i.parentWallet)
          throw new Error(
            'Reserve an amount that fits within the parent wallet.',
          );
      }
      if (step < 2) step += 1;
      else if (demo.recovery) replace = 'setup';
      else finish();
    } catch (e) {
      error = (e as Error).message;
    }
  }
  function finish() {
    try {
      demo.start(getInput());
      void goto('/');
    } catch (e) {
      error = (e as Error).message;
    }
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
    ><span class="demo-label"><span></span> A family savings demo</span>
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
          ><Icon name="flag" size={14} /> Your next adventure starts here</span
        >
      </div>
      <div class="setup-benefits">
        <span><Icon name="check" size={16} /> 10% monthly parent boost</span
        ><span><Icon name="check" size={16} /> All money is simulated</span>
      </div>
    </section>
    <section class="setup-panel card">
      <div class="step-trail" aria-label={`Setup step ${step + 1} of 3`}>
        {#each ['Your quest', 'Your wallets', 'Ready, set…'] as label, i}<span
            class:active={step === i}
            class:done={step > i}
            ><b>{step > i ? '✓' : `0${i + 1}`}</b>{label}</span
          >{/each}
      </div>
      <p class="eyebrow">LET’S SET THINGS UP</p>
      <h2>
        {[
          'What’s your next quest?',
          'Give it a little fuel.',
          'Your adventure awaits.',
        ][step]}
      </h2>
      <p class="muted">
        {[
          'A goal worth saving for starts with a name.',
          'Set your demo wallets and reserve a parent-funded boost.',
          'Here’s the plan. You can pause and explore at any time.',
        ][step]}
      </p>
      <form class="stack setup-form" onsubmit={next}>
        {#if step === 0}
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
        {:else if step === 1}
          <div class="field-columns">
            <label class="field"
              >Teen wallet
              <div class="input-prefix">
                <span>$</span><input
                  bind:value={teenWallet}
                  inputmode="decimal"
                  required
                />
              </div></label
            ><label class="field"
              >Parent wallet
              <div class="input-prefix">
                <span>$</span><input
                  bind:value={parentWallet}
                  inputmode="decimal"
                  required
                />
              </div></label
            >
          </div>
          <label class="field"
            >Reserve for monthly interest
            <div class="input-prefix">
              <span>$</span><input
                bind:value={reserve}
                inputmode="decimal"
                required
              />
            </div></label
          >
          <div class="info-note">
            <Icon name="info" size={19} />
            <p>
              This reservation comes out of the parent wallet. It stays separate
              from savings until it pays a monthly boost.
            </p>
          </div>
        {:else}
          <div class="preview-panel setup-summary">
            <div class="summary-goal">
              <span class="small-icon"><Icon name={icon} size={24} /></span>
              <div>
                <h3>{title}</h3>
                <p class="muted">
                  {teenName}’s goal · {formatMoney(parseMoney(target))}
                </p>
              </div>
            </div>
            <div class="preview-row">
              <span>Teen wallet</span><strong
                >{formatMoney(parseMoney(teenWallet))}</strong
              >
            </div>
            <div class="preview-row">
              <span>Parent wallet after reservation</span><strong
                >{formatMoney(
                  parseMoney(parentWallet) - parseMoney(reserve),
                )}</strong
              >
            </div>
            <div class="preview-row">
              <span>Interest fund</span><strong
                >{formatMoney(parseMoney(reserve))}</strong
              >
            </div>
            <div class="preview-row">
              <span>Monthly parent boost</span><strong>10% of savings</strong>
            </div>
          </div>
          <p class="helper">
            Savings start at $0. Move some money in, then press Play or advance
            a month yourself.
          </p>
        {/if}
        {#if error}<p class="form-error" role="alert">{error}</p>{/if}
        <div class="setup-actions">
          {#if step > 0}<button
              type="button"
              class="button secondary"
              onclick={() => {
                step -= 1;
                error = '';
              }}>Back</button
            >{/if}<button type="submit" class="button primary"
            >{step === 2 ? 'Start my adventure' : 'Continue'}<Icon
              name="arrow"
              size={18}
            /></button
          >
        </div>
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

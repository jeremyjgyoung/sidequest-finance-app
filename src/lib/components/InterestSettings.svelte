<script lang="ts">
  import { untrack } from 'svelte';
  import { demo } from '#lib/demo/controller.svelte.js';
  import {
    INTEREST_PERIODS,
    calculateInterest,
    formatMoney,
    type InterestPeriod,
  } from '#lib/demo/domain.js';
  import Icon from './Icon.svelte';
  let rate = $state<number | undefined>(
    untrack(() => demo.state!.interestRate),
  );
  let period = $state<InterestPeriod>(
    untrack(() => demo.state!.interestPeriod),
  );
  let error = $state('');
  const changed = $derived(
    rate !== demo.state!.interestRate || period !== demo.state!.interestPeriod,
  );
  function save(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    try {
      demo.send({
        type: 'interest-settings',
        interestRate: Number(rate),
        interestPeriod: period,
      });
      demo.inform(
        `${rate}% ${period} interest saved. Play to begin the next period.`,
      );
    } catch (e) {
      error = (e as Error).message;
    }
  }
</script>

<section class="card interest-settings-card">
  <div>
    <p class="eyebrow">PARENT CONTROLS</p>
    <h3>Set their savings boost</h3>
    <p class="muted">Choose how much to pay, and how often.</p>
  </div>
  <form onsubmit={save}>
    <label class="field"
      >Interest rate
      <div class="input-prefix">
        <input
          aria-label="Interest rate percentage"
          type="number"
          min="1"
          max="30"
          step="1"
          bind:value={rate}
          onfocus={() => demo.pause()}
          required
        /><span>%</span>
      </div></label
    >
    <label class="field"
      >Pay interest<select
        aria-label="Interest payment frequency"
        bind:value={period}
        onfocus={() => demo.pause()}
        >{#each Object.entries(INTEREST_PERIODS) as [value, option]}<option
            {value}>{option.label}</option
          >{/each}</select
      ></label
    >
    <button class="button primary" type="submit" disabled={!changed}
      >Save settings<Icon name="check" size={16} /></button
    >
    {#if error}<p class="form-error" role="alert">{error}</p>{/if}
  </form>
  <p class="interest-settings-note">
    <Icon name="info" size={16} /><span
      >{#if demo.goal?.status === 'saving' && rate !== undefined && rate >= 1 && rate <= 30}At
        the current balance, {rate}% is
        <strong
          >{formatMoney(calculateInterest(demo.goal.balance, rate))}</strong
        >
        per simulated {INTEREST_PERIODS[period].unit}.
      {/if}Changes start a fresh period. Previous payments stay unchanged.</span
    >
  </p>
</section>

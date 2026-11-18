<script lang="ts">
  import Modal from './Modal.svelte';
  import Icon from './Icon.svelte';
  import { demo } from '#lib/demo/controller.svelte.js';
  import {
    formatMoney,
    monthlyInterest,
    parseMoney,
  } from '#lib/demo/domain.js';
  let {
    mode,
    onclose,
  }: { mode: 'deposit' | 'withdrawal' | 'income'; onclose: () => void } =
    $props();
  let value = $state('50.00');
  let error = $state('');
  const amount = $derived.by(() => {
    try {
      return parseMoney(value);
    } catch {
      return 0;
    }
  });
  const family = $derived(demo.state!);
  const goal = $derived(demo.goal!);
  const wallet = $derived(
    family.role === 'teen' ? family.teenWallet : family.parentWallet,
  );
  const source = $derived(mode === 'withdrawal' ? goal.balance : wallet);
  const valid = $derived(amount > 0 && (mode === 'income' || amount <= source));
  const completesGoal = $derived(
    mode === 'deposit' && goal.balance + amount >= goal.target,
  );
  const title = $derived(
    mode === 'deposit'
      ? 'Give your quest a boost'
      : mode === 'withdrawal'
        ? 'Move a little back'
        : 'A little extra for your wallet',
  );
  function submit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    try {
      const cents = parseMoney(value);
      if (mode === 'income')
        demo.send({ type: 'income', amount: cents, role: family.role });
      else demo.send({ type: mode, amount: cents });
      demo.inform(
        mode === 'income'
          ? `${formatMoney(cents)} in demo income added.`
          : `${formatMoney(cents)} moved ${mode === 'deposit' ? 'into savings' : 'to your wallet'}.`,
      );
      onclose();
    } catch (e) {
      error = (e as Error).message;
    }
  }
</script>

<Modal
  {title}
  subtitle={mode === 'income'
    ? 'Simulate a gift, allowance, or money earned.'
    : mode === 'deposit'
      ? 'A small step today. A little closer to your goal.'
      : 'Your savings stay yours. Future interest will use the new balance.'}
  {onclose}
>
  <form onsubmit={submit} class="stack">
    {#if mode !== 'income'}<div class="flow-label">
        <span>{mode === 'deposit' ? 'Your wallet' : 'Goal savings'}</span><Icon
          name="arrow"
          size={18}
        /><span>{mode === 'deposit' ? 'Goal savings' : 'Your wallet'}</span>
      </div>{/if}
    <label class="field"
      >{mode === 'income' ? 'Demo income to add' : 'Amount to move'}
      <div class="money-input">
        <span>$</span><input
          aria-label="Amount"
          bind:value
          inputmode="decimal"
          placeholder="0.00"
          required
        />
      </div></label
    >
    <div class="shortcuts">
      {#each [10, 25, 50] as dollars}<button
          type="button"
          class:chosen={amount === dollars * 100}
          onclick={() => (value = dollars.toFixed(2))}>${dollars}</button
        >{/each}{#if mode !== 'income'}<button
          type="button"
          onclick={() => (value = (source / 100).toFixed(2))}>Max</button
        >{:else}<button
          type="button"
          class:chosen={amount === 10000}
          onclick={() => (value = '100.00')}>$100</button
        >{/if}
    </div>
    <div class="preview-panel">
      <h3>After this transfer</h3>
      <div class="preview-row">
        <span>Your wallet</span><span
          >{formatMoney(wallet)} <span class="muted">→</span>
          <strong
            >{formatMoney(
              mode === 'income'
                ? wallet + amount
                : mode === 'deposit'
                  ? wallet - amount
                  : wallet + amount,
            )}</strong
          ></span
        >
      </div>
      {#if mode !== 'income'}<div class="preview-row">
          <span>Goal savings</span><span
            >{formatMoney(goal.balance)} <span class="muted">→</span>
            <strong
              >{formatMoney(
                mode === 'deposit'
                  ? goal.balance + amount
                  : goal.balance - amount,
              )}</strong
            ></span
          >
        </div>{/if}
    </div>
    {#if mode !== 'income' && amount > source}<p
        class="form-error"
        role="alert"
      >
        Only {formatMoney(source)} is available to move.
      </p>{/if}
    {#if completesGoal}<p class="helper">
        This transfer reaches your goal! Interest stops immediately, and your
        demo purchase becomes available.
      </p>
    {:else if mode !== 'income'}<p class="helper">
        Next monthly interest: <strong
          >{formatMoney(
            monthlyInterest(
              Math.max(
                0,
                goal.balance + (mode === 'deposit' ? amount : -amount),
              ),
            ),
          )}</strong
        >. Paid only if your parent’s fund covers it and your goal is still
        active.
      </p>{/if}
    {#if error}<p class="form-error" role="alert">{error}</p>{/if}
    <button class="button primary full" type="submit" disabled={!valid}
      >{mode === 'income'
        ? `Add ${formatMoney(amount)} in demo funds`
        : `Move ${formatMoney(amount)} ${mode === 'deposit' ? 'to savings' : 'to wallet'}`}<Icon
        name="arrow"
        size={17}
      /></button
    >
    <button class="text-button" type="button" onclick={onclose}>Cancel</button>
    <p class="fine-print center">Demo transfer · No real money moves</p>
  </form>
</Modal>

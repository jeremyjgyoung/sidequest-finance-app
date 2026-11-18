<script lang="ts">
  import Icon from './Icon.svelte';
  import {
    formatMoney,
    type LedgerEntry,
    type DemoState,
  } from '#lib/demo/domain.js';
  let {
    entries,
    state,
    full = false,
  }: { entries: LedgerEntry[]; state: DemoState; full?: boolean } = $props();
  const labels: Record<string, string> = {
    deposit: 'Added to savings',
    withdrawal: 'Moved to wallet',
    interest: 'Monthly interest',
    skipped: 'Interest skipped',
    funding: 'Interest fund topped up',
    income: 'Demo income',
    purchase: 'Goal purchased',
    return: 'Leftover returned',
    goal: 'Quest updated',
  };
  const icons: Record<string, string> = {
    deposit: 'down',
    withdrawal: 'up',
    interest: 'coins',
    skipped: 'pause',
    funding: 'wallet',
    income: 'plus',
    purchase: 'gift',
    return: 'arrow',
    goal: 'flag',
  };
</script>

<div class:full-ledger={full} class="activity-list">
  {#each entries as entry (entry.id)}
    <div class="activity-row">
      <span class:amber={entry.kind === 'skipped'} class="activity-icon"
        ><Icon name={icons[entry.kind]} size={19} /></span
      >
      <div class="activity-copy">
        <strong>{labels[entry.kind]}</strong><span
          >Month {entry.month}{#if full}
            · {entry.goalId
              ? state.goals.find((g) => g.id === entry.goalId)?.title
              : entry.role === 'teen'
                ? `${state.teenName}’s wallet`
                : 'Parent wallet'}{/if}</span
        >{#if full}<p>
            {entry.description}
          </p>{/if}{#if entry.kind === 'interest' && entry.basis !== undefined}<small
            >{formatMoney(entry.basis)} × 10%</small
          >{/if}{#if !full && entry.kind === 'skipped'}<small
            >{entry.description}</small
          >{/if}
      </div>
      <span
        class="activity-amount"
        class:green={[
          'interest',
          'deposit',
          'income',
          'funding',
          'return',
        ].includes(entry.kind)}
        >{#if entry.amount}{entry.kind === 'withdrawal' ||
          entry.kind === 'purchase'
            ? '−'
            : '+'}{formatMoney(entry.amount)}{:else}<span class="muted"
            >{entry.kind === 'skipped' ? 'Skipped' : '—'}</span
          >{/if}</span
      >
    </div>
  {:else}<div class="empty-activity">
      <Icon name="leaf" size={28} />
      <p>Your story starts here.</p>
      <span>Make your first move and it will appear here.</span>
    </div>{/each}
</div>

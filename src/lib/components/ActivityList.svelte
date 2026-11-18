<script lang="ts">
  import Icon from './Icon.svelte';
  import {
    formatMoney,
    INTEREST_PERIODS,
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
    interest: 'Interest payment',
    skipped: 'Interest skipped',
    funding: 'Interest fund topped up',
    income: 'Demo income',
    purchase: 'Goal purchased',
    return: 'Leftover returned',
    goal: 'Quest updated',
    settings: 'Interest settings',
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
    settings: 'edit',
  };
</script>

<div class:full-ledger={full} class="activity-list">
  {#each entries as entry (entry.id)}
    <div class="activity-row">
      <span class:amber={entry.kind === 'skipped'} class="activity-icon"
        ><Icon name={icons[entry.kind]} size={19} /></span
      >
      <div class="activity-copy">
        <strong
          >{entry.kind === 'interest'
            ? INTEREST_PERIODS[entry.interestPeriod ?? 'monthly'].label +
              ' interest'
            : labels[entry.kind]}</strong
        ><span
          >Period {entry.month}{#if full}
            · {entry.goalId
              ? state.goals.find((g) => g.id === entry.goalId)?.title
              : entry.role === 'teen'
                ? `${state.teenName}’s wallet`
                : 'Parent wallet'}{/if}</span
        >{#if full}<p>
            {entry.description}
          </p>{/if}{#if entry.kind === 'interest' && entry.basis !== undefined}<small
            >{formatMoney(entry.basis)} × {entry.interestRate ?? 10}%</small
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

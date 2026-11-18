<script lang="ts">
  import { formatMoney, type Goal } from '#lib/demo/domain.js';
  let {
    goal,
    teenName,
    parent = false,
  }: { goal: Goal; teenName: string; parent?: boolean } = $props();
</script>

<div class="contribution-breakdown" aria-label="Contributions to this goal">
  <div>
    <span>{parent ? `${teenName} contributed` : 'You contributed'}</span><strong
      >{formatMoney(goal.deposited)}</strong
    >
  </div>
  <span class="contribution-plus">+</span>
  <div>
    <span>{parent ? 'You paid in interest' : 'Parent-paid interest'}</span
    ><strong class="green">{formatMoney(goal.interest)}</strong>
  </div>
  {#if goal.withdrawn > 0}<div class="contribution-withdrawn">
      <span>Moved back to wallet</span><strong
        >−{formatMoney(goal.withdrawn)}</strong
      >
    </div>{/if}
</div>

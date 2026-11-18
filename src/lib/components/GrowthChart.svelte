<script lang="ts">
  import { formatMoney, type Goal } from '#lib/demo/domain.js';
  let { goal, parent = false }: { goal: Goal; parent?: boolean } = $props();
  const points = $derived(goal.points);
  const max = $derived(
    Math.max(
      10000,
      Math.ceil(
        Math.max(goal.target, ...points.map((p) => p.balance)) / 10000,
      ) * 10000,
    ),
  );
  const coordinates = $derived(
    points.map((p, i) => ({
      ...p,
      x: 54 + (points.length > 1 ? i / (points.length - 1) : 0) * 492,
      y: 165 - (p.balance / max) * 142,
    })),
  );
  const path = $derived(
    coordinates.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' '),
  );
  const area = $derived(
    `${path} L${coordinates.at(-1)?.x ?? 54},165 L54,165 Z`,
  );
  const title = $derived(
    parent
      ? 'Savings growth'
      : goal.status === 'saving'
        ? 'Watch your savings grow'
        : 'Look how far you came',
  );
</script>

<section class="card chart-card">
  <div class="card-heading">
    <div>
      <h3>{title}</h3>
      <p class="muted subtitle">
        {parent
          ? 'A little more, month by month.'
          : 'Your balance over simulated months'}
      </p>
    </div>
    <span class="legend"><i></i>Savings</span>
  </div>
  <svg
    class="growth-chart"
    viewBox="0 0 574 200"
    role="img"
    aria-label={`Savings history for ${goal.title}: ${points.map((p) => `Month ${p.month}, ${formatMoney(p.balance)}`).join('; ')}`}
  >
    <defs
      ><linearGradient id="savings-area" x1="0" y1="0" x2="0" y2="1"
        ><stop offset="0%" stop-color="#A9BA96" stop-opacity=".4" /><stop
          offset="100%"
          stop-color="#A9BA96"
          stop-opacity=".03"
        /></linearGradient
      ></defs
    >
    {#each [0, 1, 2, 3, 4] as tick}
      <line
        x1="54"
        x2="548"
        y1={165 - (tick / 4) * 142}
        y2={165 - (tick / 4) * 142}
        class="grid-line"
      />
      <text
        x="42"
        y={169 - (tick / 4) * 142}
        text-anchor="end"
        class="axis-label"
        >${Math.round((max * tick) / 4 / 100).toLocaleString()}</text
      >
    {/each}
    <path d={area} fill="url(#savings-area)" />
    <path
      d={path}
      fill="none"
      stroke="#426B4F"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    {#each coordinates as point, i}
      <circle
        cx={point.x}
        cy={point.y}
        r="4.5"
        fill="#FAF9F3"
        stroke="#426B4F"
        stroke-width="2.5"
        ><title>Month {point.month}: {formatMoney(point.balance)}</title
        ></circle
      >
      {#if points.length < 9 || i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 7) === 0}<text
          x={point.x}
          y="188"
          text-anchor="middle"
          class="axis-label">{i === 0 ? 'Start' : `M${point.month}`}</text
        >{/if}
      {#if points.length < 6 || i === points.length - 1}<text
          x={point.x}
          y={point.y - 13}
          text-anchor={i === points.length - 1
            ? 'end'
            : i === 0
              ? 'start'
              : 'middle'}
          class="point-label">{formatMoney(point.balance)}</text
        >{/if}
    {/each}
  </svg>
  {#if !parent}<div class="chart-totals">
      <div>
        <span>Deposited</span><strong>{formatMoney(goal.deposited)}</strong>
      </div>
      <div>
        <span>Withdrawn</span><strong>{formatMoney(goal.withdrawn)}</strong>
      </div>
      <div>
        <span>Interest earned</span><strong class="green"
          >{formatMoney(goal.interest)}</strong
        >
      </div>
    </div>{/if}
</section>

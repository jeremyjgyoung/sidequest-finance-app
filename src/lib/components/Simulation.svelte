<script lang="ts">
  import Icon from './Icon.svelte';
  import { demo } from '#lib/demo/controller.svelte.js';
  import { PLAYBACK_SPEEDS } from '#lib/demo/domain.js';
  const family = $derived(demo.state!);
  const enabled = $derived(demo.goal?.status === 'saving');
  const seconds = $derived(
    family.speed < 1
      ? Math.max(0.1, Math.ceil((1 - demo.progress) * family.speed * 10) / 10)
      : Math.max(1, Math.ceil((1 - demo.progress) * family.speed)),
  );
</script>

<section class="simulation" aria-label="Simulation controls">
  <div class="simulation-label">
    <span class="simulation-flag"><Icon name="flag" size={19} /></span><strong
      >Time machine</strong
    ><span class="month-badge">Month {family.month}</span>
  </div>
  <div class="simulation-actions">
    <span class="clock-status"
      ><i class:playing={demo.running}></i>{!enabled
        ? 'Goal complete'
        : demo.running
          ? 'Playing'
          : 'Paused'}</span
    >
    <button
      class="button primary play-button"
      disabled={!enabled}
      onclick={() => (demo.running ? demo.pause() : demo.play())}
      ><Icon name={demo.running ? 'pause' : 'play'} size={15} />{demo.running
        ? 'Pause'
        : 'Play'}</button
    >
    <button
      class="button step-button"
      disabled={demo.running || !enabled}
      onclick={() => demo.step()}
      title="Advance one month while paused"
      ><Icon name="step" size={15} /><span>Next month</span></button
    >
    <label class="speed-control"
      ><span class="sr-only">Simulation speed</span><select
        value={family.speed}
        onchange={(e) =>
          demo.send({ type: 'speed', speed: Number(e.currentTarget.value) })}
        >{#each PLAYBACK_SPEEDS as speed}<option value={speed}
            >{speed}s / month</option
          >{/each}</select
      ></label
    >
  </div>
  <div class="countdown">
    <span
      >{enabled ? `Next month in ${seconds}s` : 'A new adventure awaits'}</span
    ><span class="countdown-track"
      ><span style:width={`${demo.progress * 100}%`}></span></span
    >
  </div>
</section>

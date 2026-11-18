<script lang="ts">
  import { untrack } from 'svelte';
  import Modal from './Modal.svelte';
  import Icon from './Icon.svelte';
  import { demo } from '#lib/demo/controller.svelte.js';
  import { GOAL_ICONS, parseMoney } from '#lib/demo/domain.js';
  let { mode, onclose }: { mode: 'edit' | 'new'; onclose: () => void } =
    $props();
  let title = $state(untrack(() => (mode === 'edit' ? demo.goal!.title : '')));
  let icon = $state(
    untrack(() => (mode === 'edit' ? demo.goal!.icon : 'gamepad')),
  );
  let target = $state(
    untrack(() =>
      mode === 'edit' ? (demo.goal!.target / 100).toFixed(2) : '',
    ),
  );
  let error = $state('');
  function submit(e: SubmitEvent) {
    e.preventDefault();
    try {
      demo.send({
        type: mode === 'edit' ? 'edit-goal' : 'new-goal',
        title,
        icon,
        target: parseMoney(target),
      });
      demo.inform(
        mode === 'edit'
          ? 'Goal updated. Your adventure, your pace.'
          : 'A new quest begins! Your parent’s remaining fund carries forward.',
      );
      onclose();
    } catch (e) {
      error = (e as Error).message;
    }
  }
</script>

<Modal
  title={mode === 'edit' ? 'Make it your quest' : 'Your next adventure'}
  subtitle={mode === 'edit'
    ? 'Your existing savings stay right where they are.'
    : 'Start a fresh goal. Your wallets and unused interest fund carry forward.'}
  {onclose}
>
  <form class="stack" onsubmit={submit}>
    <label class="field"
      >What are you saving for?<input
        bind:value={title}
        placeholder="A new adventure…"
        maxlength="60"
        required
      /></label
    >
    <fieldset class="icon-options">
      <legend>Choose an icon</legend>{#each GOAL_ICONS as item}<button
          type="button"
          class:chosen={icon === item}
          aria-label={item}
          aria-pressed={icon === item}
          onclick={() => (icon = item)}><Icon name={item} size={24} /></button
        >{/each}
    </fieldset>
    <label class="field"
      >Target price
      <div class="money-input">
        <span>$</span><input
          bind:value={target}
          inputmode="decimal"
          placeholder="500.00"
          required
        />
      </div></label
    >
    {#if mode === 'edit'}<p class="helper">
        If the new target is at or below your savings, your quest completes
        immediately.
      </p>{/if}
    {#if error}<p class="form-error" role="alert">{error}</p>{/if}
    <button class="button primary full" type="submit"
      >{mode === 'edit' ? 'Save changes' : 'Start this quest'}<Icon
        name="arrow"
        size={17}
      /></button
    >
  </form>
</Modal>

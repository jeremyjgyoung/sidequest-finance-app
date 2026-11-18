<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import '@fontsource/pixelify-sans/latin-400.css';
  import '@fontsource/pixelify-sans/latin-500.css';
  import '@fontsource/pixelify-sans/latin-600.css';
  import '@fontsource/inter/latin-400.css';
  import '@fontsource/inter/latin-500.css';
  import '@fontsource/inter/latin-600.css';
  import '@fontsource/inter/latin-700.css';
  import '#lib/styles.css';
  import Icon from '#lib/components/Icon.svelte';
  import Sprout from '#lib/components/Sprout.svelte';
  import Setup from '#lib/components/Setup.svelte';
  import Modal from '#lib/components/Modal.svelte';
  import Simulation from '#lib/components/Simulation.svelte';
  import { demo } from '#lib/demo/controller.svelte.js';
  import type { LayoutProps } from './$types';
  let { children }: LayoutProps = $props();
  let mobileNav = $state(false);
  let confirm = $state<'reset' | 'example' | null>(null);
  const navigation = [
    { href: '/', label: 'Overview', icon: 'home' },
    { href: '/activity/', label: 'Activity', icon: 'activity' },
    { href: '/how-it-works/', label: 'How it works', icon: 'help' },
  ];
  onMount(() => demo.mount());
  function replace() {
    if (confirm === 'reset') demo.reset();
    else demo.loadExample();
    confirm = null;
    void goto('/');
  }
</script>

<svelte:head>
  <title>Sidequest — Small saves. Big adventures.</title>
  <meta
    name="description"
    content="A cozy savings adventure for teens and their parents. Explore compound interest with simulated money."
  />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</svelte:head>

<a class="skip-link" href="#main">Skip to content</a>
{#if !demo.ready}<main id="main" class="loading-screen">
    <Sprout /><span class="loading-wordmark">sidequest.</span>
    <p>Getting your adventure ready…</p>
  </main>
{:else}
  {#if demo.storageNotice}<div class="storage-notice" role="status">
      <Icon name="info" size={17} />{demo.storageNotice}
    </div>{/if}
  {#if !demo.state}<Setup />
  {:else}
    <div class="app-shell" class:nav-open={mobileNav}>
      <aside class="sidebar" aria-label="Main navigation">
        <a href="/" class="wordmark"
          ><Sprout /><span>sidequest<span class="logo-dot">.</span></span></a
        >
        <p class="brand-caption">Small saves.<br />Big adventures.</p>
        <div class="sidebar-section-label">YOUR LITTLE CORNER</div>
        <nav>
          {#each navigation as item}<a
              href={item.href}
              class:active={page.url.pathname === item.href}
              aria-current={page.url.pathname === item.href
                ? 'page'
                : undefined}
              onclick={() => (mobileNav = false)}
              ><Icon name={item.icon} size={20} /><span>{item.label}</span
              >{#if page.url.pathname === item.href}<span class="nav-active-dot"
                ></span>{/if}</a
            >{/each}
        </nav>
        <div class="sidebar-bottom">
          <div class="sidebar-tip">
            <span class="tip-sparkle"><Icon name="sparkles" size={23} /></span>
            <h3>Little by little<br />adds up.</h3>
            <p>Good things grow<br />with a little patience.</p>
            <div class="tiny-pixel-flowers">
              <span>✦</span><span>✦</span><span>✦</span>
            </div>
          </div>
          <div class="sidebar-demo-actions">
            <button
              onclick={() => {
                demo.pause();
                confirm = 'example';
              }}><Icon name="gamepad" size={15} />Load example</button
            ><button
              onclick={() => {
                demo.pause();
                confirm = 'reset';
              }}><Icon name="reset" size={15} />Reset demo</button
            >
          </div>
          <p class="local-save-note">
            <span class="status-dot"></span>Saved in this browser
          </p>
        </div>
      </aside>
      <div class="main-shell">
        <header class="topbar">
          <div class="topbar-context">
            <button
              class="icon-button mobile-menu"
              aria-label="Toggle navigation"
              aria-expanded={mobileNav}
              onclick={() => (mobileNav = !mobileNav)}
              ><Icon name="menu" /></button
            ><span>YOUR SPACE</span><span class="breadcrumb-divider">/</span
            ><strong
              >{navigation.find((n) => n.href === page.url.pathname)?.label ??
                'Overview'}</strong
            >
          </div>
          <div class="topbar-right">
            <span class="demo-label"><span></span>DEMO MONEY</span>
            <div class="role-toggle" aria-label="Choose view">
              <button
                class:active={demo.state.role === 'teen'}
                aria-pressed={demo.state.role === 'teen'}
                onclick={() => demo.send({ type: 'role', role: 'teen' })}
                >Teen</button
              ><button
                class:active={demo.state.role === 'parent'}
                aria-pressed={demo.state.role === 'parent'}
                onclick={() => demo.send({ type: 'role', role: 'parent' })}
                >Parent</button
              >
            </div>
            <div
              class="user-avatar"
              aria-label={demo.state.role === 'teen'
                ? demo.state.teenName
                : 'Parent'}
            >
              {#if demo.state.role === 'teen'}<span
                  >{demo.state.teenName.charAt(0).toUpperCase()}</span
                ><i></i>{:else}P{/if}
            </div>
          </div>
        </header>
        <main id="main" class="main-content">
          {@render children()}<Simulation />
          <footer class="app-footer">
            <span
              ><Icon name="leaf" size={13} />Small saves. Big adventures.</span
            ><span>Simulated money <b>·</b> Parent-funded learning rate</span>
          </footer>
        </main>
      </div>
    </div>
  {/if}
{/if}
{#if demo.notice}<div class="toast" role="status">
    <span class="small-icon"><Icon name="check" size={17} /></span><span
      >{demo.notice}</span
    ><button
      aria-label="Dismiss notification"
      class="icon-button"
      onclick={() => (demo.notice = '')}><Icon name="close" size={16} /></button
    >
  </div>{/if}
{#if confirm}<Modal
    title={confirm === 'reset'
      ? 'Start a fresh adventure?'
      : 'Explore the example?'}
    subtitle="This replaces your saved demo, including wallets, savings, and history. It can’t be undone."
    onclose={() => (confirm = null)}
    ><div class="stack">
      <button class="button primary full" onclick={replace}
        >{confirm === 'reset'
          ? 'Reset and return to setup'
          : 'Replace with Month 3 example'}</button
      ><button class="text-button" onclick={() => (confirm = null)}
        >Keep my progress</button
      >
    </div></Modal
  >{/if}

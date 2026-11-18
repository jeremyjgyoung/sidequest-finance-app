<script lang="ts">
  let {
    name = 'sparkles',
    size = 20,
    stroke = 1.7,
  }: { name?: string; size?: number; stroke?: number } = $props();
  const paths: Record<string, string> = {
    home: 'm3 10 9-7 9 7M5 9v11h5v-6h4v6h5V9',
    activity: 'M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7',
    help: 'M9.1 9a3 3 0 1 1 5.8 1c-.8 1-2.9 1.5-2.9 3M12 17h.01',
    gamepad:
      'M7 7h10c3 0 4 4 4 8s-2 4-4 1l-1-1H8l-1 1c-2 3-4 2-4-1s1-8 4-8ZM7 10v4M5 12h4M16 11h.01M18 13h.01',
    bike: 'M5 17a4 4 0 1 0 0-.01M19 17a4 4 0 1 0 0-.01M5 17l5-9 5 9H5M9 5h4M10 8l8 1M17 5h2l-1 4 1 8',
    headphones:
      'M4 14v-3a8 8 0 0 1 16 0v3M4 12h3v8H5a1 1 0 0 1-1-1v-7ZM20 12h-3v8h2a1 1 0 0 0 1-1v-7Z',
    camera: 'M3 8h4l2-3h6l2 3h4v12H3ZM16 14a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z',
    sparkles:
      'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4M18 4h4',
    wallet:
      'M20 8V5H4a2 2 0 0 0 0 4h16v11H4a2 2 0 0 1-2-2V7M20 12h-6v5h6M16 14.5h.01',
    coins:
      'M17 7c0 2-3 3-7 3S3 9 3 7s3-3 7-3 7 1 7 3ZM3 7v5c0 2 3 3 7 3 2 0 3-.2 4-.6M3 12v5c0 2 3 3 7 3 2 0 3-.2 4-.6M17 7v4M14 12h7v8h-7Z',
    arrow: 'M4 12h16m-6-6 6 6-6 6',
    down: 'M12 4v16m-6-6 6 6 6-6',
    up: 'M12 20V4m-6 6 6-6 6 6',
    plus: 'M12 5v14M5 12h14',
    close: 'm6 6 12 12M6 18 18 6',
    edit: 'm15 4 5 5-11 11H4v-5L15 4ZM13 6l5 5',
    check: 'm5 12 4 4L19 6',
    play: 'm8 5 11 7-11 7V5Z',
    pause: 'M8 5v14M16 5v14',
    step: 'm5 5 10 7-10 7V5ZM19 5v14',
    reset: 'M3 11a9 9 0 1 1 2 7M3 4v7h7',
    flag: 'M5 21V3h13l-2 4 2 4H5',
    gift: 'M3 9h18v4H3ZM5 13v8h14v-8M12 9v12M12 9C4 9 5 1 9 4l3 5ZM12 9c8 0 7-8 3-5l-3 5Z',
    menu: 'M4 6h16M4 12h16M4 18h16',
    lock: 'M6 10h12v11H6ZM8 10V7a4 4 0 0 1 8 0v3M12 14v3',
    external: 'M14 3h7v7M21 3 10 14M10 3H3v18h18v-7',
    info: 'M12 11v6M12 7h.01',
    leaf: 'M20 3C9 2 2 7 5 15s16 7 15-12ZM4 21 16 8',
  };
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={stroke}
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  {#if name === 'help' || name === 'info'}<circle cx="12" cy="12" r="10" />{/if}
  <path d={paths[name] || paths.sparkles} />
</svg>

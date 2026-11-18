import { PlaybackClock } from './clock';
import {
  createDemo,
  currentGoal,
  exampleDemo,
  readSaved,
  transition,
  type Command,
  type DemoState,
  type SetupInput,
} from './domain';

const KEY = 'sidequest.demo.v1';
class DemoController {
  state = $state.raw<DemoState | null>(null);
  ready = $state(false);
  storageNotice = $state('');
  recovery = $state(false);
  notice = $state('');
  running = $state(false);
  progress = $state(0);
  private timeout: ReturnType<typeof setTimeout> | undefined;
  private clock = new PlaybackClock(() => {
    try {
      if (this.state && currentGoal(this.state).status === 'saving')
        this.send({ type: 'advance' });
      else this.pause();
    } catch (error) {
      this.pause();
      this.inform((error as Error).message);
    }
  });
  get goal() {
    return this.state ? currentGoal(this.state) : null;
  }
  private syncClock() {
    this.running = this.clock.running;
    this.progress = this.clock.progress;
  }
  inform(message: string) {
    this.notice = message;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.notice = '';
    }, 4500);
  }
  private persist() {
    try {
      if (this.state) localStorage.setItem(KEY, JSON.stringify(this.state));
      else localStorage.removeItem(KEY);
    } catch {
      this.storageNotice =
        'Session-only mode: this browser can’t save your demo. Keep this tab open to retain progress.';
    }
  }
  mount() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        try {
          this.state = readSaved(saved);
          this.clock.setSpeed(this.state.speed);
        } catch {
          this.recovery = true;
          this.storageNotice =
            'We couldn’t read the saved demo. Start fresh or load the example to replace it.';
        }
      }
    } catch {
      this.storageNotice =
        'Session-only mode: this browser can’t save your demo.';
    }
    this.ready = true;
    const interval = setInterval(() => {
      this.clock.tick(performance.now());
      this.syncClock();
    }, 100);
    const visibility = () => {
      if (document.hidden) this.pause();
    };
    const storage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      this.pause();
      try {
        this.state = e.newValue ? readSaved(e.newValue) : null;
        if (this.state) this.clock.setSpeed(this.state.speed);
        this.clock.reset();
        this.syncClock();
        this.inform('Demo updated in another tab. Playback is paused.');
      } catch {
        this.storageNotice =
          'Another tab saved an unreadable demo. Your current session is unchanged.';
      }
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('storage', storage);
    return () => {
      clearInterval(interval);
      clearTimeout(this.timeout);
      this.pause();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('storage', storage);
    };
  }
  start(input: SetupInput) {
    this.replace(createDemo(input));
  }
  loadExample() {
    this.replace(exampleDemo());
    this.inform('Example loaded. You’re three months into Alex’s PS5 quest.');
  }
  private replace(state: DemoState) {
    this.clock.reset();
    this.clock.setSpeed(state.speed);
    this.state = state;
    if (this.recovery) this.storageNotice = '';
    this.recovery = false;
    this.syncClock();
    this.persist();
  }
  reset() {
    this.pause();
    this.clock.reset();
    this.syncClock();
    this.state = null;
    this.recovery = false;
    this.storageNotice = '';
    this.persist();
  }
  send(command: Command) {
    if (!this.state) throw new Error('Set up a demo first.');
    if (command.type === 'speed') this.clock.tick(performance.now());
    const before = currentGoal(this.state).status;
    this.state = transition(this.state, command);
    this.clock.setSpeed(this.state.speed);
    if (this.goal?.status !== 'saving') this.pause();
    if (command.type === 'new-goal' || command.type === 'interest-settings') {
      this.clock.reset();
      this.syncClock();
    }
    this.persist();
    if (before === 'saving' && this.goal?.status === 'reached')
      this.inform('Quest complete! You’ve reached your savings goal.');
  }
  play() {
    if (this.goal?.status === 'saving') {
      this.clock.play(performance.now());
      this.syncClock();
    }
  }
  pause() {
    this.clock.pause();
    this.syncClock();
  }
  step() {
    this.clock.step();
    this.syncClock();
  }
}
export const demo = new DemoController();

import { vi } from "vitest";

// jsdom does not implement media playback. Components like SlotsView call
// `new Audio(...).play()`, which otherwise returns a rejected promise and
// produces noisy unhandled-rejection warnings during tests. Stub it out.
window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = vi.fn();

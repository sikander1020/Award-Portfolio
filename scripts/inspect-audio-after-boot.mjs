import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const debugPort = Number(process.env.DEBUG_PORT ?? 9444);
const waitMs = Number(process.env.WAIT_MS ?? 8_000);
const targetUrl = `http://localhost:3000/${process.env.TARGET_QUERY ?? "?from_audio_check=1"}`;
const autoplayFlag = process.env.AUTOPLAY_ALLOWED === "1" ? ["--autoplay-policy=no-user-gesture-required"] : [];
const chromium = spawn("/usr/bin/chromium", [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  `--remote-debugging-port=${debugPort}`,
  "--user-data-dir=/tmp/gta-portfolio-audio-evidence",
  ...autoplayFlag,
  targetUrl,
], { stdio: "ignore" });

async function getPageTarget() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${debugPort}/json`).then((response) => response.json());
      const page = targets.find((target) => target.type === "page");
      if (page) return page;
    } catch {
      // Chromium is starting.
    }
    await delay(200);
  }
  throw new Error("Unable to connect to Chromium DevTools.");
}

async function inspectAudioAfterBoot() {
  const page = await getPageTarget();
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  let messageId = 0;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const resolver = pending.get(message.id);
    if (resolver) {
      pending.delete(message.id);
      resolver(message);
    }
  });

  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++messageId;
    pending.set(id, (message) => {
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    });
    socket.send(JSON.stringify({ id, method, params }));
  });

  await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
  await call("Page.enable");
  await delay(waitMs);
  if (process.env.TRIGGER_POINTER === "1") {
    await call("Input.dispatchMouseEvent", { type: "mousePressed", x: 80, y: 80, button: "left", clickCount: 1 });
    await call("Input.dispatchMouseEvent", { type: "mouseReleased", x: 80, y: 80, button: "left", clickCount: 1 });
    await delay(750);
  }
  const result = await call("Runtime.evaluate", {
    expression: `(() => {
      const audio = document.querySelector('audio[src*="vice-night-drive"]');
      const soundLabels = Array.from(document.querySelectorAll('button, span')).map((element) => element.textContent?.trim()).filter((text) => text === 'SOUND ON' || text === 'SOUND OFF');
      return JSON.stringify({
        bootVisible: Boolean(document.querySelector('.boot-intro')),
        soundLabels,
        backgroundPaused: audio?.paused ?? null,
        backgroundCurrentTime: audio?.currentTime ?? null,
        backgroundVolume: audio?.volume ?? null,
        backgroundMuted: audio?.muted ?? null,
        backgroundReadyState: audio?.readyState ?? null,
      });
    })()`,
    returnByValue: true,
  });
  console.log(result.result.value);
  socket.close();
}

try {
  await inspectAudioAfterBoot();
} finally {
  chromium.kill("SIGTERM");
}

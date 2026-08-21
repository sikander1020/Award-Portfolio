import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const activeScreen = process.env.SCREEN ?? "start";
const targetUrl = `http://localhost:3000/?screen=${activeScreen}&preview=scene`;
const debugPort = Number(process.env.DEBUG_PORT ?? 9333);
const viewportWidth = Number(process.env.VIEWPORT_WIDTH ?? 390);
const viewportHeight = Number(process.env.VIEWPORT_HEIGHT ?? 844);
const emulateReducedMotion = process.env.REDUCED_MOTION === "reduce";
const blockHeroVideo = process.env.BLOCK_HERO_VIDEO === "1";
const blockVideoUrl = process.env.BLOCK_VIDEO_URL;
const inspectionDelayMs = Number(process.env.WAIT_MS ?? 4200);
const summaryOnly = process.env.SUMMARY === "1";
const capturePath = process.env.CAPTURE_PATH;
const chromium = spawn(
  "/usr/bin/chromium",
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    `--remote-debugging-port=${debugPort}`,
    "--user-data-dir=/tmp/gta-portfolio-mobile-hero-evidence",
    targetUrl,
  ],
  { stdio: "ignore" },
);

async function getPageTarget() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${debugPort}/json`).then((response) => response.json());
      const page = targets.find((target) => target.type === "page");
      if (page) return page;
    } catch {
      // Chromium is still starting.
    }
    await delay(200);
  }
  throw new Error("Unable to connect to Chromium DevTools.");
}

async function inspect() {
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

  const call = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++messageId;
      pending.set(id, (message) => {
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      });
      socket.send(JSON.stringify({ id, method, params }));
    });

  await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
  await call("Emulation.setDeviceMetricsOverride", {
    width: viewportWidth,
    height: viewportHeight,
    deviceScaleFactor: 1,
    mobile: viewportWidth <= 720,
  });
  await call("Page.enable");
  await call("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: emulateReducedMotion ? "reduce" : "no-preference" }],
  });
  if (blockHeroVideo || blockVideoUrl) {
    await call("Network.enable");
    const sourcePattern = blockVideoUrl ?? "sikandar-hero-seamless-loop_67150277.mp4";
    await call("Network.setBlockedURLs", { urls: [`*${sourcePattern}*`] });
  }
  await call("Page.navigate", { url: targetUrl });
  await delay(inspectionDelayMs);
  if (capturePath) {
    const screenshot = await call("Page.captureScreenshot", { format: "png" });
    await writeFile(capturePath, Buffer.from(screenshot.data, "base64"));
  }

  const expression = `(() => {
    const backdrop = document.querySelector('.scene-backdrop');
    const portrait = document.querySelector('.scene-portrait-layer');
    const videos = Array.from(document.querySelectorAll('video'));
    const sceneVideo = document.querySelector('.scene-motion-video');
    const backdropStyle = backdrop ? getComputedStyle(backdrop) : null;
    const portraitStyle = portrait ? getComputedStyle(portrait) : null;
    const staticHeroLayerMounted = Boolean(document.querySelector('.scene-portrait-layer'));
    const staticHeroAssetInBackdrop = Boolean(backdropStyle?.backgroundImage.includes('owner-hero-storage-validation'));
    const sceneVideoHasTakenOver = Boolean(sceneVideo) && sceneVideo.currentTime > 0 && !sceneVideo.paused && !staticHeroLayerMounted && !staticHeroAssetInBackdrop;
    return JSON.stringify({
      viewport: { width: innerWidth, height: innerHeight, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches },
      backdropImage: backdropStyle?.backgroundImage ?? null,
      backdropPosition: backdropStyle?.backgroundPosition ?? null,
      backdropSize: backdropStyle?.backgroundSize ?? null,
      portraitImage: portraitStyle?.backgroundImage ?? null,
      portraitPosition: portraitStyle?.backgroundPosition ?? null,
      portraitSize: portraitStyle?.backgroundSize ?? null,
      videoCount: videos.length,
      sceneVideoMounted: Boolean(sceneVideo),
      sceneVideoSource: sceneVideo?.currentSrc ?? null,
      sceneVideoPoster: sceneVideo?.poster ?? null,
      sceneVideoCurrentTime: sceneVideo?.currentTime ?? null,
      sceneVideoPaused: sceneVideo?.paused ?? null,
      sceneVideoReadyState: sceneVideo?.readyState ?? null,
      sceneVideoObjectPosition: sceneVideo ? getComputedStyle(sceneVideo).objectPosition : null,
      sceneVideoObjectFit: sceneVideo ? getComputedStyle(sceneVideo).objectFit : null,
      sceneVideoScale: sceneVideo ? getComputedStyle(sceneVideo).scale : null,
      staticHeroLayerMounted,
      staticHeroAssetInBackdrop,
      sceneVideoHasTakenOver,
    });
  })()`;
  const result = await call("Runtime.evaluate", { expression, returnByValue: true });
  const evidence = JSON.parse(result.result.value);
  if (summaryOnly) {
    console.log(JSON.stringify({
      screen: activeScreen,
      viewport: evidence.viewport,
      backdropSize: evidence.backdropSize,
      portraitSize: evidence.portraitSize,
      sceneVideoMounted: evidence.sceneVideoMounted,
      sceneVideoObjectFit: evidence.sceneVideoObjectFit,
      sceneVideoObjectPosition: evidence.sceneVideoObjectPosition,
      sceneVideoScale: evidence.sceneVideoScale,
    }));
  } else {
    console.log(result.result.value);
  }
  socket.close();
}

try {
  await inspect();
} finally {
  chromium.kill("SIGTERM");
}

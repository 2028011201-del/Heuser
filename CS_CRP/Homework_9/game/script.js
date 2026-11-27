(() => {
  "use strict";
  const tiles = [...document.querySelectorAll(".tile")];
  const board = document.getElementById("board");
  const message = document.getElementById("message");
  const roundValue = document.getElementById("roundValue");
  const scoreValue = document.getElementById("scoreValue");
  const bestValue = document.getElementById("bestValue");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const restartBtn = document.getElementById("restartBtn");
  const resetDataBtn = document.getElementById("resetDataBtn");
  const muteBtn = document.getElementById("muteBtn");
  const COLORS = [261.63, 329.63, 392.00, 523.25];
  const STORAGE_KEY = "memoryMatrixBest";
  let sequence = [], playerStep = 0, round = 0, score = 0, best = readBest();
  let state = "menu", muted = false, playbackToken = 0, audioContext = null, resumeState = "menu";
  bestValue.textContent = best;
  function readBest() {
    try { const saved = Number(localStorage.getItem(STORAGE_KEY)); return Number.isFinite(saved) && saved >= 0 ? Math.floor(saved) : 0; }
    catch { return 0; }
  }
  function saveBest() { try { localStorage.setItem(STORAGE_KEY, String(best)); } catch { /* Storage may be unavailable. */ } }
  function setMessage(text) { message.textContent = text; }
  function updateDisplay() { roundValue.textContent = round; scoreValue.textContent = score; bestValue.textContent = best; }
  function setState(nextState) {
    state = nextState;
    const active = state === "input";
    board.classList.toggle("locked", !active);
    tiles.forEach(tile => { tile.disabled = !active; });
    startBtn.disabled = state === "showing" || state === "input" || state === "paused";
    pauseBtn.disabled = !["showing", "input", "paused"].includes(state);
    pauseBtn.textContent = state === "paused" ? "Resume" : "Pause";
  }
  function getAudio() {
    if (muted) return null;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    try { if (!audioContext) audioContext = new AudioCtor(); if (audioContext.state === "suspended") audioContext.resume().catch(() => {}); return audioContext; }
    catch { return null; }
  }
  function playTone(index, duration = 0.22) {
    const ctx = getAudio(); if (!ctx) return;
    try {
      const oscillator = ctx.createOscillator(), gain = ctx.createGain();
      oscillator.type = "sine"; oscillator.frequency.value = COLORS[index];
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      oscillator.connect(gain); gain.connect(ctx.destination); oscillator.start(); oscillator.stop(ctx.currentTime + duration + 0.02);
    } catch { /* Audio is optional; gameplay must continue. */ }
  }
  function wait(ms, token) {
    return new Promise(resolve => {
      const started = Date.now();
      const check = () => {
        if (token !== playbackToken) return resolve(false);
        if (state === "paused") return window.setTimeout(check, 80);
        if (Date.now() - started >= ms) return resolve(true);
        window.setTimeout(check, Math.min(40, ms));
      };
      check();
    });
  }
  async function flash(index, token) {
    if (token !== playbackToken) return false;
    tiles[index].classList.add("lit"); playTone(index);
    const completed = await wait(360, token);
    tiles[index].classList.remove("lit");
    if (!completed) return false;
    return wait(150, token);
  }
  async function showSequence() {
    const token = ++playbackToken;
    setState("showing"); setMessage("Watch carefully...");
    await wait(450, token);
    for (const index of sequence) if (!(await flash(index, token))) return;
    if (token !== playbackToken || state === "over") return;
    playerStep = 0; setState("input"); setMessage("Your turn — repeat the sequence!");
  }
  function beginRound() {
    if (state === "paused") return;
    sequence.push(Math.floor(Math.random() * tiles.length));
    round = sequence.length; updateDisplay(); showSequence();
  }
  function startGame() {
    playbackToken++; sequence = []; playerStep = 0; round = 0; score = 0;
    updateDisplay(); setMessage("Get ready..."); setState("showing"); beginRound();
  }
  function endGame() {
    playbackToken++; tiles.forEach(tile => tile.classList.remove("lit"));
    setState("over"); setMessage(`Game over! Your score: ${score}. Press Restart to try again.`);
    if (score > best) { best = score; saveBest(); updateDisplay(); setMessage(`New best score: ${best}! Press Restart to play again.`); }
  }
  function handleTile(index) {
    if (state !== "input") return;
    tiles[index].classList.add("lit"); playTone(index, 0.16);
    window.setTimeout(() => tiles[index].classList.remove("lit"), 150);
    if (sequence[playerStep] !== index) { endGame(); return; }
    playerStep++;
    if (playerStep === sequence.length) {
      score = round; updateDisplay(); setState("showing"); setMessage("Correct! Next round...");
      const token = playbackToken;
      wait(650, token).then(ok => { if (ok && state === "showing" && token === playbackToken) beginRound(); });
    }
  }
  function pauseGame() {
    if (state === "paused") {
      const previous = resumeState;
      if (previous === "showing") { setState("showing"); setMessage("Resuming sequence..."); showSequence(); }
      else { setState("input"); setMessage("Your turn — repeat the sequence!"); }
      return;
    }
    if (state !== "showing" && state !== "input") return;
    resumeState = state; playbackToken++; tiles.forEach(tile => tile.classList.remove("lit"));
    setState("paused"); setMessage("Paused. Press Resume when you're ready.");
  }
  tiles.forEach(tile => tile.addEventListener("click", () => handleTile(Number(tile.dataset.tile))));
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  resetDataBtn.addEventListener("click", () => {
    best = 0; try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
    updateDisplay(); setMessage("Best score reset. Start a new game whenever you're ready.");
    if (state === "menu" || state === "over") setState("menu");
  });
  pauseBtn.addEventListener("click", pauseGame);
  muteBtn.addEventListener("click", () => {
    muted = !muted; muteBtn.textContent = muted ? "🔇 Sound off" : "🔊 Sound on";
    muteBtn.setAttribute("aria-pressed", String(muted));
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && (state === "showing" || state === "input")) pauseGame(); });
  window.addEventListener("beforeunload", () => { playbackToken++; if (audioContext && audioContext.state !== "closed") audioContext.close().catch(() => {}); });
  setState("menu"); updateDisplay();
})();

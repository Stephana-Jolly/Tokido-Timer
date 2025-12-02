let time = 0;
let interval = null;
let isRunning = false; // ✅ ADDED: Track running state

export function startTimer(display) {
  // ✅ FIXED: Toggle start/pause functionality
  if (isRunning) {
    // Pause
    clearInterval(interval);
    interval = null;
    isRunning = false;
    
    // Update button text
    const startBtn = document.getElementById("start");
    if (startBtn) startBtn.textContent = "Start";
    return;
  }

  // Start
  isRunning = true;
  
  // Update button text
  const startBtn = document.getElementById("start");
  if (startBtn) startBtn.textContent = "Pause";

  interval = setInterval(() => {
    time++;

    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");

    display.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

export function resetTimer(display) {
  clearInterval(interval);
  interval = null;
  time = 0;
  isRunning = false; // ✅ ADDED: Reset running state
  display.textContent = "00:00";
  
  // ✅ ADDED: Reset button text
  const startBtn = document.getElementById("start");
  if (startBtn) startBtn.textContent = "Start";
}
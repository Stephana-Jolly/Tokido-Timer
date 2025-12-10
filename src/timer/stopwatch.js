let time = 0;
let interval = null;
let isRunning = false; 

export function startTimer(display) {
  if (isRunning) {
    // Pause
    clearInterval(interval);
    interval = null;
    isRunning = false;
    
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
  isRunning = false; 
  display.textContent = "00:00";
  
  // ✅ ADDED: Reset button text
  const startBtn = document.getElementById("start");
  if (startBtn) startBtn.textContent = "Start";
}
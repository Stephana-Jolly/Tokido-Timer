// ==================== WINDOW CONTROLS ====================
function initWindowControls() {
  const minimizeBtn = document.getElementById("minimizeBtn");
  const closeBtn = document.getElementById("closeBtn");

  if (minimizeBtn) {
    minimizeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.api && window.api.minimize) {
        window.api.minimize();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.api && window.api.close) {
        window.api.close();
      }
    });
  }

}

// ==================== TIMER FUNCTIONALITY ====================
async function initTimer() {
  const display = document.getElementById("display");
  const startBtn = document.getElementById("start");
  const resetBtn = document.getElementById("reset");

  if (display && startBtn && resetBtn) {
    try {
      // ✅ FIXED: Correct path relative to src folder
      const { startTimer, resetTimer } = await import("./timer/timer.js");

      startBtn.addEventListener("click", () => {
        startTimer();
      });

      resetBtn.addEventListener("click", () => {
        resetTimer();
      });
    } catch (error) {
      console.error("Failed to load timer module:", error);
    }
  }
}

// ==================== STOPWATCH FUNCTIONALITY ====================
async function initStopwatch() {
  const display = document.getElementById("stopwatchDisplay");
  const startBtn = document.getElementById("start");
  const resetBtn = document.getElementById("reset");

  // Added stopwatch initialization
  if (display && startBtn && resetBtn) {
    try {
      const { startTimer, resetTimer } = await import("./timer/stopwatch.js");

      startBtn.addEventListener("click", () => {
        startTimer(display);
      });

      resetBtn.addEventListener("click", () => {
        resetTimer(display);
      });
    } catch (error) {
      console.error("Failed to load stopwatch module:", error);
    }
  }
}

// ==================== PAGE TOGGLING ====================
function initPageToggles() {
  const timerTab = document.getElementById("timerTab");
  const stopwatchTab = document.getElementById("stopwatchTab");

  // Switch to Stopwatch  
  if (stopwatchTab) {
    stopwatchTab.addEventListener("click", () => {
      window.location.href = "./stopwatch.html";
    });
  }

  // Switch to Timer
  if (timerTab) {
    timerTab.addEventListener("click", () => {
      window.location.href = "./timer.html";
    });
  }
}

// ==================== LANDING PAGE NAVIGATION ====================
function initNavigation() {
  const goToTimerBtn = document.getElementById("goToTimer");

  if (goToTimerBtn) {
    goToTimerBtn.addEventListener("click", () => {
      window.location.href = "./timer/timer.html";
    });
  }
}

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  initWindowControls();
  initNavigation();
  initTimer();
  initStopwatch(); 
  initPageToggles();
});
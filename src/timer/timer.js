// ✅ FIXED: Better audio initialization
const alarmSound = document.createElement("audio");
// Use relative path that works in both dev and production
alarmSound.src = "../assets/sounds/alarm.mp3";   
alarmSound.preload = "auto";
alarmSound.volume = 1.0;

alarmSound.addEventListener("canplaythrough", () => {
  console.log("✅ Alarm sound loaded");
});

alarmSound.addEventListener("error", (e) => {
  console.error("❌ Alarm load failed:", e);
});

// ==================== TIMER STATE ====================
let totalSeconds = 0;
let remainingSeconds = 0;
let interval = null;
let isRunning = false;

// ==================== DOM ELEMENTS ====================
const display = document.getElementById("display");
const progressFill = document.getElementById("progressFill");
const clockHand = document.getElementById("clockHand");
const timeKnob = document.getElementById("timeKnob");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");

// Circle parameters
const centerX = 150;
const centerY = 150;
const borderRadius = 135;
const fillRadius = 120;

//=====================TOAST ELEMENT====================
const timesUpToast = document.getElementById("timesUpToast");

function showTimesUpToast() {
  if (!timesUpToast) return; // ✅ ADDED: Safety check
  
  timesUpToast.classList.remove("hidden");
  timesUpToast.classList.add("show");

  setTimeout(() => {
    timesUpToast.classList.remove("show");
    setTimeout(() => {
      timesUpToast.classList.add("hidden");
    }, 300);
  }, 4000); // visible for 4s
}

// ==================== CREATE CLOCK TICKS ====================
function createClockTicks() {
    const ticksContainer = document.getElementById("clockTicks");
    if (!ticksContainer) return;
    
    // Ticks are removed - keeping function for structure
}

// ==================== HELPER FUNCTIONS ====================
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    const d = [
        "M", x, y,
        "L", end.x, end.y,
        "A", radius, radius, 0, largeArcFlag, 1, start.x, start.y,
        "Z"
    ].join(" ");
    
    return d;
}

// ==================== KNOB VISIBILITY ====================
function showKnob() {
    if (!timeKnob) return; // ✅ ADDED: Safety check
    timeKnob.style.display = "block";
    timeKnob.style.opacity = "1";
}

function hideKnob() {
    if (!timeKnob) return; // ✅ ADDED: Safety check
    timeKnob.style.opacity = "0";
    setTimeout(() => {
        if (isRunning || remainingSeconds === 0) {
            timeKnob.style.display = "none";
        }
    }, 300);
}

// ==================== KNOB DRAGGING ====================
let isDragging = false;

function updateKnobPosition(minutes) {
    if (!timeKnob) return; // ✅ ADDED: Safety check
    
    minutes = Math.round(minutes);
    
    // Position knob on border
    const angle = (minutes * 6) - 90; // 6 degrees per minute
    const radians = (angle * Math.PI) / 180;
    
    const x = centerX + borderRadius * Math.cos(radians);
    const y = centerY + borderRadius * Math.sin(radians);
    
    timeKnob.setAttribute("cx", x);
    timeKnob.setAttribute("cy", y);
    
    totalSeconds = minutes * 60;
    remainingSeconds = totalSeconds;
    updateDisplay();
    updateProgressFill();
    updateClockHand();
}

function getMinutesFromPoint(clientX, clientY) {
    const svg = document.querySelector(".timer-svg");
    if (!svg) return 0; // ✅ ADDED: Safety check
    
    const rect = svg.getBoundingClientRect();
    const svgX = clientX - rect.left;
    const svgY = clientY - rect.top;
    
    const deltaX = svgX - centerX;
    const deltaY = svgY - centerY;
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360;
    
    const minutes = Math.round(angle / 6); // 6 degrees per minute
    return Math.min(60, Math.max(0, minutes));
}

function handleKnobMouseDown(e) {
    if (isRunning) return;
    isDragging = true;
    e.preventDefault();
}

function handleDocumentMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    
    if (!clientX || !clientY) return;
    
    const minutes = getMinutesFromPoint(clientX, clientY);
    updateKnobPosition(minutes);
}

function handleDocumentMouseUp() {
    isDragging = false;
}

// ✅ FIXED: Added safety checks before adding listeners
if (timeKnob) {
    timeKnob.addEventListener("mousedown", handleKnobMouseDown);
    timeKnob.addEventListener("touchstart", handleKnobMouseDown);
}
document.addEventListener("mousemove", handleDocumentMouseMove);
document.addEventListener("touchmove", handleDocumentMouseMove, { passive: false });
document.addEventListener("mouseup", handleDocumentMouseUp);
document.addEventListener("touchend", handleDocumentMouseUp);

// ==================== CLOCK HAND ====================
function updateClockHand() {
    if (!clockHand) return;
    
    if (totalSeconds === 0 || remainingSeconds === 0) {
        clockHand.classList.remove("visible");
        return;
    }
    
    clockHand.classList.add("visible");
    
    const remainingMinutes = remainingSeconds / 60;
    const handAngle = remainingMinutes * 6;
    const radians = ((handAngle - 90) * Math.PI) / 180;
    
    const handLength = 100;
    const x2 = centerX + handLength * Math.cos(radians);
    const y2 = centerY + handLength * Math.sin(radians);
    
    clockHand.setAttribute("x2", x2);
    clockHand.setAttribute("y2", y2);
}

// =============== PROGRESS FILL (DARK AREA) ====================
function updateProgressFill() {
    if (!progressFill) {
        console.error("progressFill element not found!");
        return;
    }
    
    if (totalSeconds === 0 || remainingSeconds === 0) {
        progressFill.setAttribute("d", "");
        if (clockHand) clockHand.classList.remove("visible");
        return;
    }
    
    const remainingMinutes = remainingSeconds / 60;
    
    // Full circle for 60 minutes
    if (remainingMinutes >= 59.9) {
        const pathData = describeArc(centerX, centerY, fillRadius, 0, 359.99);
        progressFill.setAttribute("d", pathData);
        return;
    }
    
    const handAngle = remainingMinutes * 6;
    const startAngle = 0;
    const endAngle = handAngle;
    
    const pathData = describeArc(centerX, centerY, fillRadius, startAngle, endAngle);
    progressFill.setAttribute("d", pathData);
}

// ==================== DISPLAY UPDATE ====================
function updateDisplay() {
    if (!display) return;
    
    const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
    const seconds = String(remainingSeconds % 60).padStart(2, "0");
    display.textContent = `${minutes}:${seconds}`;
}

// ==================== TIMER LOGIC ====================
export function startTimer() {
    if (!startBtn) return; // ✅ ADDED: Safety check
    
    if (isRunning) {
        // Pause timer
        clearInterval(interval);
        interval = null;
        isRunning = false;
        startBtn.textContent = "Start";
        showKnob();
        return;
    }
    
    if (totalSeconds === 0) {
        alert("Please set a time by dragging the green knob!");
        return;
    }
    
    isRunning = true;
    startBtn.textContent = "Pause";
    hideKnob();

    // Test alarm sound
    alarmSound.muted = true;
    alarmSound.play().then(() => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        alarmSound.muted = false;
    }).catch(() => {});
    
    interval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
            updateProgressFill();
            updateClockHand();
        } else {
            // Timer completed
            clearInterval(interval);
            interval = null;
            isRunning = false;
            startBtn.textContent = "Start";
            showKnob();
            
            // Play alarm
            alarmSound.currentTime = 0;
            alarmSound.play().catch(err => {
                console.error("❌ Sound play failed:", err);
            });

            showTimesUpToast();
        }
    }, 1000);
}

export function resetTimer() {
    if (!startBtn) return; // ✅ ADDED: Safety check
    
    clearInterval(interval);
    interval = null;
    isRunning = false;
    
    totalSeconds = 0;
    remainingSeconds = 0;

    alarmSound.pause();
    alarmSound.currentTime = 0;
    
    startBtn.textContent = "Start";
    showKnob();
    
    updateKnobPosition(0);
    updateDisplay();
    updateProgressFill();
    updateClockHand();

    // Reset toast
    if (timesUpToast) {
        timesUpToast.classList.remove("show");
        timesUpToast.classList.add("hidden");
    }
}

// ==================== INITIALIZATION ====================
createClockTicks();
updateKnobPosition(0);
showKnob();
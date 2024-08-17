let timer;
let totalTime = localStorage.getItem('totalTime') ? parseInt(localStorage.getItem('totalTime')) : 1500; // Default 25 minutes
let currentTime = totalTime; // Record current timer time

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

function updateDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    currentTime = totalTime; // Record current time before starting
    timer = setInterval(() => {
        currentTime--;
        updateDisplay();
        if (currentTime === 0) {
            clearInterval(timer); // Stop timer
            alert('Time is up!');
            resetTimer(); // Call reset function to restore time
        }
    }, 1000);
    startButton.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    currentTime = totalTime; // Restore to modified time
    updateDisplay();
    startButton.disabled = false;
}

function modifyTime(event) {
    const [minutes, seconds] = timerDisplay.textContent.split(':').map(Number);
    const isLeftSide = event.offsetX < timerDisplay.clientWidth / 2;

    const newTime = prompt(`Enter new ${isLeftSide ? 'minutes' : 'seconds'}:`, isLeftSide ? minutes : seconds);
    if (newTime !== null) {
        if (isLeftSide) {
            totalTime = (parseInt(newTime) || 0) * 60 + seconds; // Update total minutes
        } else {
            totalTime = minutes * 60 + (parseInt(newTime) || 0); // Update total seconds
        }
        localStorage.setItem('totalTime', totalTime); // Save to localStorage
        currentTime = totalTime; // Update currentTime to reflect the new totalTime
        updateDisplay();
    }
}

timerDisplay.addEventListener('click', modifyTime);
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

updateDisplay();
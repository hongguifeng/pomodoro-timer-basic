let timer;
let timeLeft = 1500; // Default 25 minutes
let initialTimeLeft = timeLeft; // Record initial time

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    initialTimeLeft = timeLeft; // Record current time before starting
    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 0) {
            clearInterval(timer); // Stop timer
            alert('Time is up!');
            resetTimer(); // Call reset function to restore time
        }
    }, 1000);
    startButton.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = initialTimeLeft; // Restore to modified time
    updateDisplay();
    startButton.disabled = false;
}

function modifyTime(event) {
    const [minutes, seconds] = timerDisplay.textContent.split(':').map(Number);
    if (event.offsetX < timerDisplay.clientWidth / 2) {
        // Click left side, modify minutes
        const newMinutes = prompt('Enter new minutes:', minutes);
        if (newMinutes !== null) {
            timeLeft = (parseInt(newMinutes) || 0) * 60 + seconds;
            updateDisplay();
        }
    } else {
        // Click right side, modify seconds
        const newSeconds = prompt('Enter new seconds:', seconds);
        if (newSeconds !== null) {
            timeLeft = minutes * 60 + (parseInt(newSeconds) || 0);
            updateDisplay();
        }
    }
}

timerDisplay.addEventListener('click', modifyTime);
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

updateDisplay();
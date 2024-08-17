let timer;
let timeLeft = localStorage.getItem('timeLeft') ? parseInt(localStorage.getItem('timeLeft')) : 1500; // Default 25 minutes
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
    const isLeftSide = event.offsetX < timerDisplay.clientWidth / 2;

    const newTime = prompt(`Enter new ${isLeftSide ? 'minutes' : 'seconds'}:`, isLeftSide ? minutes : seconds);
    if (newTime !== null) {
        if (isLeftSide) {
            timeLeft = (parseInt(newTime) || 0) * 60 + seconds; // Update minutes
        } else {
            timeLeft = minutes * 60 + (parseInt(newTime) || 0); // Update seconds
        }
        localStorage.setItem('timeLeft', timeLeft); // Save to localStorage
        updateDisplay();
    }
}

timerDisplay.addEventListener('click', modifyTime);
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

updateDisplay();
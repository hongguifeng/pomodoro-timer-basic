let timer;
let timeLeft = 5; // 25分钟 = 1500秒

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 0) {
            resetTimer();
            alert('时间到!');
        }
    }, 1000);
    startButton.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 5;
    updateDisplay();
    startButton.disabled = false;
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

updateDisplay();
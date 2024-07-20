let timer;
let timeLeft = 5; // 25分钟 = 1500秒

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const timeInput = document.getElementById('timeInput');
const setTimeButton = document.getElementById('setTimeButton');

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
    setTimeButton.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 5;
    updateDisplay();
    startButton.disabled = false;
    setTimeButton.disabled = false;
}

function setTime() {
    const inputMinutes = parseInt(timeInput.value);
    if (inputMinutes > 0 && inputMinutes <= 60) {
        timeLeft = inputMinutes * 60;
        updateDisplay();
    } else {
        alert('请输入1到60之间的数字');
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
setTimeButton.addEventListener('click', setTime);

updateDisplay();
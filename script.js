let timer;
let timeLeft = 1500; // 默认25分钟
let initialTimeLeft = timeLeft; // 记录初始时间

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    initialTimeLeft = timeLeft; // 开始计时前记录当前时间
    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 0) {
            clearInterval(timer); // 停止计时器
            alert('时间到!');
            resetTimer(); // 调用重置函数来恢复时间
        }
    }, 1000);
    startButton.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = initialTimeLeft; // 恢复为修改的时间
    updateDisplay();
    startButton.disabled = false;
}

function modifyTime(event) {
    const [minutes, seconds] = timerDisplay.textContent.split(':').map(Number);
    if (event.offsetX < timerDisplay.clientWidth / 2) {
        // 点击左边，修改分钟
        const newMinutes = prompt('输入新的分钟数:', minutes);
        if (newMinutes !== null) {
            timeLeft = (parseInt(newMinutes) || 0) * 60 + seconds;
            updateDisplay();
        }
    } else {
        // 点击右边，修改秒钟
        const newSeconds = prompt('输入新的秒数:', seconds);
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
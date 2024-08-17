let timer;
let totalTime = localStorage.getItem('totalTime') ? parseInt(localStorage.getItem('totalTime')) : 1500; // Default 25 minutes
let currentTime = totalTime; // Record current timer time

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

let pomodoroRecords = JSON.parse(localStorage.getItem('pomodoroRecords')) || [];

function updateDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    currentTime = totalTime;
    const startTime = new Date();
    timer = setInterval(() => {
        currentTime--;
        updateDisplay();
        if (currentTime === 0) {
            clearInterval(timer);
            const endTime = new Date();
            const record = {
                date: startTime.toLocaleDateString(),
                startTime: startTime.toLocaleTimeString(),
                endTime: endTime.toLocaleTimeString(),
                duration: totalTime // Record total time (seconds)
            };
            pomodoroRecords.push(record);
            localStorage.setItem('pomodoroRecords', JSON.stringify(pomodoroRecords));
            alert('Time is up!');
            resetTimer();
            displayRecords();
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

function displayRecords() {
    const recordsContainer = document.getElementById('records');
    recordsContainer.innerHTML = '<h2>Pomodoro Records</h2>';
    if (pomodoroRecords.length === 0) {
        recordsContainer.innerHTML += '<p class="no-records">No records available</p>';
    } else {
        const groupedRecords = groupRecordsByDate(pomodoroRecords);
        const recordsList = document.createElement('ul');
        
        for (const [date, records] of Object.entries(groupedRecords)) {
            const dateHeader = document.createElement('li');
            dateHeader.className = 'date-header';
            dateHeader.textContent = date;
            recordsList.appendChild(dateHeader);
            
            records.forEach((record, index) => {
                const li = createRecordListItem(record, index);
                recordsList.appendChild(li);
            });
        }
        
        recordsContainer.appendChild(recordsList);
    }
}

function groupRecordsByDate(records) {
    return records.reduce((groups, record) => {
        const date = record.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(record);
        return groups;
    }, {});
}

function createRecordListItem(record, index) {
    const durationMinutes = Math.floor(record.duration / 60);
    const durationSeconds = record.duration % 60;
    const li = document.createElement('li');
    li.innerHTML = `
        <div class="record-header">
            <span class="record-number">#${index + 1}</span>
            <span class="record-time">
                <span class="time-label">Start:</span>
                <span class="start-time">${record.startTime}</span>
            </span>
            <span class="record-time">
                <span class="time-label">End:</span>
                <span class="end-time">${record.endTime}</span>
            </span>
            <span class="record-duration">
                <span class="time-label">Duration:</span>
                <span>${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}</span>
            </span>
        </div>
    `;
    return li;
}

timerDisplay.addEventListener('click', modifyTime);
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

updateDisplay();
displayRecords();
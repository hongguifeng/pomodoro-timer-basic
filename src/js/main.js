import Timer from './timer.js';
import Records from './records.js';

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

const timer = new Timer();
const records = new Records();

function updateDisplay(time) {
    timerDisplay.textContent = timer.getTimeString();
}

function onTimerComplete(startTime, endTime, duration) {
    records.addRecord(startTime, endTime, duration);
    alert('Time is up!');
    displayRecords();
    resetTimer();
}

timer.onTick = updateDisplay;
timer.onComplete = onTimerComplete;

function startTimer() {
    timer.start();
    startButton.disabled = true;
}

function resetTimer() {
    timer.reset();
    startButton.disabled = false;
}

function modifyTime(event) {
    const [minutes, seconds] = timerDisplay.textContent.split(':').map(Number);
    const isLeftSide = event.offsetX < timerDisplay.clientWidth / 2;

    const newTime = prompt(`Enter new ${isLeftSide ? 'minutes' : 'seconds'}:`, isLeftSide ? minutes : seconds);
    if (newTime !== null) {
        const newMinutes = isLeftSide ? parseInt(newTime) || 0 : minutes;
        const newSeconds = isLeftSide ? seconds : parseInt(newTime) || 0;
        timer.modifyTime(newMinutes, newSeconds);
    }
}

function displayRecords() {
    const recordsContainer = document.getElementById('records');
    recordsContainer.innerHTML = '<h2>Pomodoro Records</h2>';
    if (records.records.length === 0) {
        recordsContainer.innerHTML += '<p class="no-records">No records available</p>';
    } else {
        const groupedRecords = records.groupRecordsByDate();
        const recordsList = document.createElement('ul');
        
        const headerRow = document.createElement('li');
        headerRow.className = 'record-row record-header-row';
        headerRow.innerHTML = `
            <span class="record-item record-checkbox"><input type="checkbox" id="selectAll"></span>
            <span class="record-item record-number">Number</span>
            <span class="record-item record-start">Start</span>
            <span class="record-item record-end">End</span>
            <span class="record-item record-duration">Duration</span>
        `;
        recordsList.appendChild(headerRow);
        
        let recordIndex = 0;
        for (const [date, dateRecords] of Object.entries(groupedRecords)) {
            const dateHeader = document.createElement('li');
            dateHeader.className = 'date-header';
            dateHeader.textContent = date;
            recordsList.appendChild(dateHeader);
            
            dateRecords.forEach((record) => {
                const li = records.createRecordListItem(record, recordIndex);
                recordsList.appendChild(li);
                recordIndex++;
            });
        }
        
        recordsContainer.appendChild(recordsList);
    }
}

function showAddRecordModal() {
    document.getElementById('addRecordModal').style.display = 'block';
}

function hideAddRecordModal() {
    document.getElementById('addRecordModal').style.display = 'none';
}

function addManualRecord(event) {
    event.preventDefault();
    const date = document.getElementById('recordDate').value;
    const startTime = document.getElementById('recordStartTime').value;
    const endTime = document.getElementById('recordEndTime').value;

    if (date && startTime && endTime) {
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);
        const durationInSeconds = Math.round((end - start) / 1000);

        if (durationInSeconds > 0) {
            records.addManualRecord(date, startTime, endTime, durationInSeconds);
            displayRecords();
            hideAddRecordModal();
        } else {
            alert("Invalid time range. End time must be after start time.");
        }
    }
}

document.getElementById('addRecordButton').addEventListener('click', showAddRecordModal);
document.getElementById('cancelAddRecord').addEventListener('click', hideAddRecordModal);
document.getElementById('addRecordForm').addEventListener('submit', addManualRecord);

timerDisplay.addEventListener('click', modifyTime);
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

document.addEventListener('change', function(e) {
    if (e.target && e.target.type === 'checkbox') {
        const deleteButton = document.getElementById('deleteSelectedRecords');
        const checkboxes = document.querySelectorAll('.record-checkbox input[type="checkbox"]');
        const checkedBoxes = document.querySelectorAll('.record-checkbox input[type="checkbox"]:checked');
        
        if (e.target.id === 'selectAll') {
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
        }
        
        deleteButton.style.display = checkedBoxes.length > 0 ? 'inline-block' : 'none';
    }
});

document.getElementById('deleteSelectedRecords').addEventListener('click', function() {
    const checkedBoxes = document.querySelectorAll('.record-checkbox input[type="checkbox"]:checked');
    const recordIds = Array.from(checkedBoxes)
        .filter(checkbox => checkbox.id !== 'selectAll')
        .map(checkbox => parseInt(checkbox.dataset.recordId));

    if (recordIds.length > 0) {
        records.deleteRecords(recordIds);
        displayRecords();
    }

    document.getElementById('selectAll').checked = false;
    document.getElementById('deleteSelectedRecords').style.display = 'none';
});

updateDisplay();
displayRecords();
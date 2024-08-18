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
    startButton.textContent = 'Start';
}

timer.onTick = updateDisplay;
timer.onComplete = onTimerComplete;

function toggleTimer() {
    if (!timer.isRunning) {
        timer.start();
        startButton.textContent = 'Pause';
    } else {
        if (timer.isPaused) {
            timer.resume();
            startButton.textContent = 'Pause';
        } else {
            timer.pause();
            startButton.textContent = 'Resume';
        }
    }
}

function resetTimer() {
    timer.stop();
    startButton.textContent = 'Start';
}

function showModifyTimeModal() {
    const modal = document.getElementById('modifyTimeModal');
    modal.style.display = 'block';
    populateTimeSelects();
}

function hideModifyTimeModal() {
    document.getElementById('modifyTimeModal').style.display = 'none';
}

function populateTimeSelects() {
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    for (let i = 0; i < 24; i++) {
        hours.options[hours.options.length] = new Option(i.toString().padStart(2, '0'), i);
    }
    for (let i = 0; i < 60; i++) {
        minutes.options[minutes.options.length] = new Option(i.toString().padStart(2, '0'), i);
        seconds.options[seconds.options.length] = new Option(i.toString().padStart(2, '0'), i);
    }
}

function modifyTime(event) {
    event.preventDefault();
    const hours = parseInt(document.getElementById('hours').value);
    const minutes = parseInt(document.getElementById('minutes').value);
    const seconds = parseInt(document.getElementById('seconds').value);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    timer.modifyTime(totalSeconds);
    hideModifyTimeModal();
}

function displayRecords() {
    const recordsContainer = document.querySelector('#records .records-content');
    recordsContainer.innerHTML = '';
    
    if (records.records.length === 0) {
        recordsContainer.innerHTML = '<p class="no-records">No records available</p>';
    } else {
        const groupedRecords = records.groupRecordsByDate();
        const recordsList = createRecordsList(groupedRecords);
        recordsContainer.appendChild(recordsList);
    }
}

function createRecordsList(groupedRecords) {
    const recordsList = document.createElement('ul');
    
    for (const [date, dateRecords] of groupedRecords) {
        recordsList.appendChild(createDateHeader(date));
        dateRecords.forEach((record, index) => {
            recordsList.appendChild(createRecordListItem(record, index + 1));
        });
    }
    
    return recordsList;
}

function createDateHeader(date) {
    const dateHeader = document.createElement('li');
    dateHeader.className = 'date-header';
    const totalDuration = records.calculateTotalDurationForDate(date);
    dateHeader.innerHTML = `
        <span class="date">${date}</span>
        <span class="total-duration">${totalDuration}</span>
    `;
    return dateHeader;
}

function createRecordListItem(record, index) {
    const li = document.createElement('li');
    li.className = 'record-row';
    li.innerHTML = `
        <span class="record-item record-checkbox"><input type="checkbox" data-record-id="${record.id}"></span>
        <span class="record-item record-number">#${index}</span>
        <span class="record-item record-time">${record.startTime} - ${record.endTime}</span>
        <span class="record-item record-duration">${record.duration}</span>
    `;
    return li;
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

timerDisplay.addEventListener('click', showModifyTimeModal);
document.getElementById('modifyTimeForm').addEventListener('submit', modifyTime);
document.getElementById('cancelModifyTime').addEventListener('click', hideModifyTimeModal);
startButton.addEventListener('click', toggleTimer);
resetButton.addEventListener('click', resetTimer);

document.addEventListener('change', function(e) {
    if (e.target && e.target.closest('#records')) {
        const deleteButton = document.getElementById('deleteSelectedRecords');
        const checkboxes = document.querySelectorAll('.record-checkbox input[type="checkbox"]');
        if (e.target.id === 'selectAll') {
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
        }
        
        const checkedBoxes = document.querySelectorAll('.record-checkbox input[type="checkbox"]:checked');
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
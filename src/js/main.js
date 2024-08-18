import Timer from './timer.js';
import Records from './records.js';

class PomodoroApp {
    constructor() {
        this.timer = new Timer();
        this.records = new Records();
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
        this.displayRecords();
    }

    initializeElements() {
        this.timerDisplay = document.getElementById('timer');
        this.startButton = document.getElementById('startButton');
        this.resetButton = document.getElementById('resetButton');
        this.addRecordButton = document.getElementById('addRecordButton');
        this.deleteSelectedRecordsButton = document.getElementById('deleteSelectedRecords');
        this.modifyTimeModal = document.getElementById('modifyTimeModal');
        this.addRecordModal = document.getElementById('addRecordModal');
    }

    attachEventListeners() {
        this.startButton.addEventListener('click', () => this.toggleTimer());
        this.resetButton.addEventListener('click', () => this.resetTimer());
        this.timerDisplay.addEventListener('click', () => this.showModifyTimeModal());
        this.addRecordButton.addEventListener('click', () => this.showAddRecordModal());
        document.getElementById('modifyTimeForm').addEventListener('submit', (e) => this.modifyTime(e));
        document.getElementById('cancelModifyTime').addEventListener('click', () => this.hideModifyTimeModal());
        document.getElementById('addRecordForm').addEventListener('submit', (e) => this.addManualRecord(e));
        document.getElementById('cancelAddRecord').addEventListener('click', () => this.hideAddRecordModal());
        this.deleteSelectedRecordsButton.addEventListener('click', () => this.deleteSelectedRecords());
        document.addEventListener('change', (e) => this.handleRecordSelectionChange(e));

        this.timer.onTick = () => this.updateDisplay();
        this.timer.onComplete = (startTime, endTime, duration) => this.onTimerComplete(startTime, endTime, duration);
    }

    toggleTimer() {
        if (!this.timer.isRunning) {
            this.timer.start();
            this.startButton.textContent = 'Pause';
        } else {
            if (this.timer.isPaused) {
                this.timer.resume();
                this.startButton.textContent = 'Pause';
            } else {
                this.timer.pause();
                this.startButton.textContent = 'Resume';
            }
        }
    }

    resetTimer() {
        this.timer.stop();
        this.startButton.textContent = 'Start';
        this.updateDisplay();
    }

    updateDisplay() {
        this.timerDisplay.textContent = this.timer.getTimeString();
    }

    onTimerComplete(startTime, endTime, duration) {
        this.records.addRecord(startTime, endTime, duration);
        alert('Time is up!');
        this.displayRecords();
        this.startButton.textContent = 'Start';
    }

    showModifyTimeModal() {
        this.modifyTimeModal.style.display = 'block';
        this.populateTimeSelects();
    }

    hideModifyTimeModal() {
        this.modifyTimeModal.style.display = 'none';
    }

    populateTimeSelects() {
        const hours = document.getElementById('hours');
        const minutes = document.getElementById('minutes');
        const seconds = document.getElementById('seconds');

        this.populateSelect(hours, 24);
        this.populateSelect(minutes, 60);
        this.populateSelect(seconds, 60);
    }

    populateSelect(select, max) {
        for (let i = 0; i < max; i++) {
            select.options[select.options.length] = new Option(i.toString().padStart(2, '0'), i);
        }
    }

    modifyTime(event) {
        event.preventDefault();
        const hours = parseInt(document.getElementById('hours').value);
        const minutes = parseInt(document.getElementById('minutes').value);
        const seconds = parseInt(document.getElementById('seconds').value);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        this.timer.modifyTime(totalSeconds);
        this.hideModifyTimeModal();
        this.updateDisplay();
    }

    displayRecords() {
        const recordsContainer = document.querySelector('#records .records-content');
        recordsContainer.innerHTML = '';
        
        const groupedRecords = this.records.getGroupedRecords();
        if (groupedRecords.size === 0) {
            recordsContainer.innerHTML = '<p class="no-records">No records available</p>';
        } else {
            const recordsList = this.createRecordsList(groupedRecords);
            recordsContainer.appendChild(recordsList);
        }
    }

    createRecordsList(groupedRecords) {
        const recordsList = document.createElement('ul');
        
        for (const [date, dateRecords] of groupedRecords) {
            recordsList.appendChild(this.createDateHeader(date));
            dateRecords.forEach((record, index) => {
                recordsList.appendChild(this.createRecordListItem(record, index + 1));
            });
        }
        
        return recordsList;
    }

    createDateHeader(date) {
        const dateHeader = document.createElement('li');
        dateHeader.className = 'date-header';
        const totalDuration = this.records.getTotalDurationForDate(date);
        dateHeader.innerHTML = `
            <span class="date">${date}</span>
            <span class="total-duration">${totalDuration}</span>
        `;
        return dateHeader;
    }

    createRecordListItem(record, index) {
        const li = document.createElement('li');
        li.className = 'record-row';
        li.innerHTML = `
            <span class="record-item record-checkbox"><input type="checkbox" data-record-id="${record.id}"></span>
            <span class="record-item record-number">#${index}</span>
            <span class="record-item record-time">${record.startTime} - ${record.endTime}</span>
            <span class="record-item record-duration">${this.records.formatDuration(record.duration)}</span>
        `;
        return li;
    }

    showAddRecordModal() {
        this.addRecordModal.style.display = 'block';
    }

    hideAddRecordModal() {
        this.addRecordModal.style.display = 'none';
    }

    addManualRecord(event) {
        event.preventDefault();
        const date = document.getElementById('recordDate').value;
        const startTime = document.getElementById('recordStartTime').value;
        const endTime = document.getElementById('recordEndTime').value;

        if (date && startTime && endTime) {
            const start = new Date(`${date}T${startTime}`);
            const end = new Date(`${date}T${endTime}`);
            const durationInSeconds = Math.round((end - start) / 1000);

            if (durationInSeconds > 0) {
                this.records.addManualRecord(date, startTime, endTime, durationInSeconds);
                this.displayRecords();
                this.hideAddRecordModal();
            } else {
                alert("Invalid time range. End time must be after start time.");
            }
        }
    }

    handleRecordSelectionChange(e) {
        if (e.target && e.target.closest('#records')) {
            const checkboxes = document.querySelectorAll('.record-checkbox input[type="checkbox"]');
            if (e.target.id === 'selectAll') {
                checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
            }
            
            const checkedBoxes = document.querySelectorAll('.record-checkbox input[type="checkbox"]:checked');
            this.deleteSelectedRecordsButton.style.display = checkedBoxes.length > 0 ? 'inline-block' : 'none';
        }
    }

    deleteSelectedRecords() {
        const checkedBoxes = document.querySelectorAll('.record-checkbox input[type="checkbox"]:checked');
        const recordIds = Array.from(checkedBoxes)
            .filter(checkbox => checkbox.id !== 'selectAll')
            .map(checkbox => parseInt(checkbox.dataset.recordId));

        if (recordIds.length > 0) {
            this.records.deleteRecords(recordIds);
            this.displayRecords();
        }

        document.getElementById('selectAll').checked = false;
        this.deleteSelectedRecordsButton.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PomodoroApp();
});
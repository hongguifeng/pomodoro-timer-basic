class Records {
    constructor() {
        this.records = JSON.parse(localStorage.getItem('pomodoroRecords')) || [];
    }

    addRecord(startTime, endTime, duration) {
        const record = {
            date: this.formatDate(startTime),
            startTime: this.formatTime(startTime),
            endTime: this.formatTime(endTime),
            duration: this.formatDuration(duration)
        };
        this.records.push(record);
        this.saveRecords();
    }

    addManualRecord(date, startTime, endTime, duration) {
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);
        const record = {
            date: this.formatDate(start),
            startTime: this.formatTime(start),
            endTime: this.formatTime(end),
            duration: this.formatDuration(duration)
        };
        this.records.push(record);
        this.saveRecords();
    }

    formatDate(date) {
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
        return adjustedDate.toISOString().split('T')[0];
    }

    formatTime(date) {
        return date.toTimeString().split(' ')[0];
    }

    formatDuration(duration) {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    saveRecords() {
        localStorage.setItem('pomodoroRecords', JSON.stringify(this.records));
    }

    groupRecordsByDate() {
        const groups = this.records.reduce((groups, record) => {
            const date = record.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].unshift(record);
            return groups;
        }, {});
        return Object.fromEntries(
            Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]))
        );
    }

    createRecordListItem(record, index) {
        const li = document.createElement('li');
        li.className = 'record-row';
        li.innerHTML = `
            <span class="record-item record-number">#${index + 1}</span>
            <span class="record-item record-start">${record.startTime}</span>
            <span class="record-item record-end">${record.endTime}</span>
            <span class="record-item record-duration">${record.duration}</span>
        `;
        return li;
    }
}

export default Records;
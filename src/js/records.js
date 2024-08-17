class Records {
    constructor() {
        this.records = JSON.parse(localStorage.getItem('pomodoroRecords')) || [];
    }

    addRecord(startTime, endTime, duration) {
        const record = {
            date: startTime.toLocaleDateString(),
            startTime: startTime.toLocaleTimeString(),
            endTime: endTime.toLocaleTimeString(),
            duration: duration
        };
        this.records.push(record);
        this.saveRecords();
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
            <span class="record-item record-duration">${this.formatDuration(record.duration)}</span>
        `;
        return li;
    }

    formatDuration(duration) {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

export default Records;
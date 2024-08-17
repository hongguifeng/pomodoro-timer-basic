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
}

export default Records;
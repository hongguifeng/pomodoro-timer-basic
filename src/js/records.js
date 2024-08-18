class Records {
    #records;
    #nextId;

    constructor() {
        this.#records = JSON.parse(localStorage.getItem('pomodoroRecords')) || [];
        this.#nextId = this.#calculateNextId();
        this.#ensureRecordIds();
    }

    addRecord(startTime, endTime, duration) {
        const record = this.#createRecord(startTime, endTime, duration);
        this.#records.push(record);
        this.#saveRecords();
    }

    addManualRecord(date, startTime, endTime, duration) {
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);
        const record = this.#createRecord(start, end, duration);
        this.#records.push(record);
        this.#saveRecords();
    }

    deleteRecords(recordIds) {
        this.#records = this.#records.filter(record => !recordIds.includes(record.id));
        this.#nextId = this.#calculateNextId();
        this.#saveRecords();
    }

    getGroupedRecords() {
        const groups = new Map();
        this.#records.forEach(record => {
            if (!groups.has(record.date)) {
                groups.set(record.date, []);
            }
            groups.get(record.date).unshift(record);
        });
        return new Map([...groups.entries()].sort((a, b) => new Date(b[0]) - new Date(a[0])));
    }

    getTotalDurationForDate(date) {
        const records = this.#records.filter(record => record.date === date);
        const totalSeconds = records.reduce((total, record) => total + record.duration, 0);
        return this.formatDuration(totalSeconds);
    }

    formatDuration(duration) {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    #createRecord(startTime, endTime, duration) {
        return {
            id: this.#nextId++,
            date: this.#formatDate(startTime),
            startTime: this.#formatTime(startTime),
            endTime: this.#formatTime(endTime),
            duration: duration
        };
    }

    #calculateNextId() {
        return this.#records.length > 0 ? Math.max(...this.#records.map(r => r.id)) + 1 : 1;
    }

    #ensureRecordIds() {
        this.#records.forEach(record => {
            if (!record.id) {
                record.id = this.#nextId++;
            }
        });
    }

    #formatDate(date) {
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
        return adjustedDate.toISOString().split('T')[0];
    }

    #formatTime(date) {
        return date.toTimeString().split(' ')[0];
    }

    #saveRecords() {
        localStorage.setItem('pomodoroRecords', JSON.stringify(this.#records));
    }
}

export default Records;
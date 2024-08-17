class Timer {
    constructor(initialTime = 1500) {
        this.totalTime = parseInt(localStorage.getItem('totalTime')) || initialTime;
        this.currentTime = this.totalTime;
        this.timer = null;
        this.onTick = null;
        this.onComplete = null;
    }

    start() {
        this.currentTime = this.totalTime;
        const startTime = new Date();
        this.timer = setInterval(() => {
            this.currentTime--;
            if (this.onTick) this.onTick(this.currentTime);
            if (this.currentTime === 0) {
                this.stop();
                const endTime = new Date();
                if (this.onComplete) this.onComplete(startTime, endTime, this.totalTime);
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.timer);
    }

    reset() {
        this.stop();
        this.currentTime = this.totalTime;
        if (this.onTick) this.onTick(this.currentTime);
    }

    modifyTime(totalSeconds) {
        this.totalTime = totalSeconds;
        localStorage.setItem('totalTime', this.totalTime);
        this.currentTime = this.totalTime;
        if (this.onTick) this.onTick(this.currentTime);
    }

    getTimeString() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

export default Timer;
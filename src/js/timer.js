class Timer {
    constructor(initialTime = 1500) {
        this.totalTime = parseInt(localStorage.getItem('totalTime')) || initialTime;
        this.currentTime = this.totalTime;
        this.timer = null;
        this.onTick = null;
        this.onComplete = null;
        this.isPaused = false;
    }

    start() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.currentTime = this.totalTime;
        this.isPaused = false;
        const startTime = new Date();
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.currentTime--;
                if (this.onTick) this.onTick(this.currentTime);
                if (this.currentTime === 0) {
                    this.stop();
                    const endTime = new Date();
                    if (this.onComplete) this.onComplete(startTime, endTime, this.totalTime);
                }
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
        this.currentTime = this.totalTime;
        this.isPaused = false;
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

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }
}

export default Timer;
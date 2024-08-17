class Timer {
    #totalTime;
    #currentTime;
    #timer;
    #isPaused;
    #onTick;
    #onComplete;

    constructor(initialTime = 1500) {
        this.#totalTime = parseInt(localStorage.getItem('totalTime')) || initialTime;
        this.#currentTime = this.#totalTime;
        this.#timer = null;
        this.#isPaused = false;
        this.#onTick = null;
        this.#onComplete = null;
    }

    start() {
        this.stop();
        this.#currentTime = this.#totalTime;
        this.#isPaused = false;
        const startTime = new Date();
        this.#timer = setInterval(() => {
            if (!this.#isPaused) {
                this.#currentTime--;
                this.#onTick?.(this.#currentTime);
                if (this.#currentTime === 0) {
                    this.stop();
                    const endTime = new Date();
                    this.#onComplete?.(startTime, endTime, this.#totalTime);
                }
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.#timer);
        this.#timer = null;
        this.#currentTime = this.#totalTime;
        this.#isPaused = false;
        this.#onTick?.(this.#currentTime);
    }

    pause() {
        this.#isPaused = true;
    }

    resume() {
        this.#isPaused = false;
    }

    modifyTime(totalSeconds) {
        this.#totalTime = totalSeconds;
        localStorage.setItem('totalTime', this.#totalTime);
        this.#currentTime = this.#totalTime;
        this.#onTick?.(this.#currentTime);
    }

    getTimeString() {
        const minutes = Math.floor(this.#currentTime / 60);
        const seconds = this.#currentTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    get isRunning() {
        return this.#timer !== null;
    }

    get isPaused() {
        return this.#isPaused;
    }

    set onTick(callback) {
        this.#onTick = callback;
    }

    set onComplete(callback) {
        this.#onComplete = callback;
    }
}

export default Timer;
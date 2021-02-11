
class Timer {
    // current time in milliseconds(int)
    currentTime;
    timeMarker;
    getCurrentTime() {
        if(this.timeMarker == null)
            return this.currentTime;
        this.currentTime += new Date().getTime() - this.timeMarker;
        this.timeMarker = new Date().getTime();
        return this.currentTime;
    }
    startTimer() {
        this.currentTime = 0;
        this.timeMarker = new Date().getTime();
    }
    resetTimer() {
        this.currentTime = null;
        this.timeMarker = null;
    }
    unpauseTimer() {
        this.timeMarker = new Date().getTime();
    }
    pauseTimer() {
        this.currentTime += new Date().getTime() - this.timeMarker;
        this.timeMarker = null;
    }
    setTimer(time) {
        this.currentTime = time;
    }
}
export default Timer;

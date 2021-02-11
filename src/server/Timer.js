
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
        console.log("PAUSED")
        this.currentTime += new Date().getTime() - this.timeMarker;
        this.timeMarker = null;
    }
    setTimer(time) {
        console.log("SET")
        this.currentTime = time;
    }
}
export default Timer;

class Timer
{
    // current time in milliseconds(int)
    currentTime;
    interval;
    constructor()
    {
        this.currentTime = 0;
    }
    startTimer()
    {
        this.interval = setInterval(() => {
            this.currentTime += 1;
        }, 1)
    } 
    pauseTimer()
    {
        clearInterval(this.interval);
    }
    resetTimer()
    {
        this.currentTime = 0;
        clearInterval(this.interval);
    }
    offsetTimer(offset)
    {
        this.currentTime += offset;
    }
}
export default Timer;
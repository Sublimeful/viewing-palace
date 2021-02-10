class Timer
{
    // current time in milliseconds(int)

    currentTime;
    pauseTime;
    getTime()
    {
        if(this.pauseTime == null)
            return this.currentTime;
        else
        {
            this.currentTime += new Date().getTime() - this.pauseTime;
            this.pauseTime = new Date().getTime();
            return this.currentTime;
        }
    }
    startTimer()
    {
        if(this.currentTime == null)
        {
            this.currentTime = 0;
            this.pauseTime = new Date().getTime()
        }
        else
        {
            this.pauseTime = new Date().getTime()
        }
    } 
    pauseTimer()
    {
        this.currentTime += new Date().getTime() - this.pauseTime;
        this.pauseTime = null;
    }
    resetTimer()
    {
        this.currentTime = null;
        this.pauseTime = null;
    }
    offsetTimer(offset)
    {
    }
}
export default Timer;
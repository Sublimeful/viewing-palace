class Server
{
    private _user_count: number;
    constructor()
    {
        this._user_count = 0;
    }
    set user_count(newCount: number)
    {
        if(newCount < 0) return;
        this._user_count = newCount;
    }
    get user_count()
    {
        return this._user_count;
    }



}
export default Server;
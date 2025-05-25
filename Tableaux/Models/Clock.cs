using System;

namespace Tableaux.Models;

public class Clock
{
    private DateTime lastRecordedTime;

    public Clock()
    {
        lastRecordedTime = DateTime.Now;
    }

    public TimeSpan ElapsedTime
    {
        get
        {
            var elapsed = DateTime.Now - lastRecordedTime;
            return elapsed;
        }
    }

    public void Tick()
    {
        lastRecordedTime = DateTime.Now;
    }
}

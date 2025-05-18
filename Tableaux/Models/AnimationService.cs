using Microsoft.Extensions.Logging;
using StudioLaValse.Drawable;
using StudioLaValse.Drawable.BitmapPainters;
using StudioLaValse.Drawable.Interaction.ViewModels;
using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Tableaux.API;

namespace Tableaux.Models;

internal class AnimationService : IAnimationService
{
    private CancellationTokenSource cancellationTokenSource = new();
    private readonly ILogger<AnimationService> logger;
    private readonly object _lock = new();
    private Timer? timer;
    private readonly ISynchronizationContextService syncContext;
    private readonly INotifyEntityChanged<int> notifyEntityChanged;

    public bool Streaming => timer is not null;

    public AnimationService(ILogger<AnimationService> logger, ISynchronizationContextService syncContext, INotifyEntityChanged<int> notifyEntityChanged)
    {
        this.logger = logger;
        this.syncContext = syncContext;
        this.notifyEntityChanged = notifyEntityChanged;
    }

    public void Start(int frameDuration, Func<CancellationToken, Task> drawFrame)
    {
        lock (_lock)
        {
            Stop();

            cancellationTokenSource.Cancel();
            cancellationTokenSource = new CancellationTokenSource();
        }

        var token = cancellationTokenSource.Token;

        timer = new Timer(async _ =>
        {
            try
            {
                await syncContext.PostAsync(async () => 
                {
                    await drawFrame(token);
                    notifyEntityChanged.Invalidate(0);
                    notifyEntityChanged.RenderChanges();
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error happened during playback. Playback will be stopped.");
                Stop();
            }
        }, null, 0, frameDuration);
    }

    public void Stop()
    {
        lock (_lock)
        {
            cancellationTokenSource.Cancel();
            timer?.Dispose();
        }
    }
}

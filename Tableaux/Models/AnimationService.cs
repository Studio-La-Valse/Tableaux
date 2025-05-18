using Microsoft.Extensions.Logging;
using StudioLaValse.Drawable;
using StudioLaValse.Drawable.BitmapPainters;
using StudioLaValse.Drawable.Interaction.ViewModels;
using StudioLaValse.Geometry;
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
    private readonly CanvasViewModel canvasViewModel;
    private long index = 0;
    private DateTime lastUpdated = DateTime.MinValue;

    public bool Streaming => timer is not null;

    public AnimationService(ILogger<AnimationService> logger, ISynchronizationContextService syncContext, INotifyEntityChanged<int> notifyEntityChanged, CanvasViewModel canvasViewModel)
    {
        this.logger = logger;
        this.syncContext = syncContext;
        this.notifyEntityChanged = notifyEntityChanged;
        this.canvasViewModel = canvasViewModel;
    }

    public void Start(int frameDuration, ISceneDesigner sceneDesigner)
    {
        lock (_lock)
        {
            Stop();

            cancellationTokenSource.Cancel();
            cancellationTokenSource = new CancellationTokenSource();
        }

        var token = cancellationTokenSource.Token;
        lastUpdated = DateTime.Now;

        timer = new Timer(async _ =>
        {
            try
            {
                index++;
                var elapsed = DateTime.Now - lastUpdated;

                await syncContext.PostAsync(async () => 
                {
                    var translation = new XY(canvasViewModel.TranslateX, canvasViewModel.TranslateY);
                    var animationFrame = new AnimationFrame(index, elapsed.Milliseconds, canvasViewModel.Bounds, translation, canvasViewModel.Zoom);
                    await sceneDesigner.OnUpdate(animationFrame, token);
                    notifyEntityChanged.Invalidate(0);
                    notifyEntityChanged.RenderChanges();
                });

                lastUpdated = DateTime.Now;
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
            index = 0;
            lastUpdated = DateTime.MinValue;
        }
    }
}

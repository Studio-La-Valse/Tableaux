using Microsoft.Extensions.Logging;
using StudioLaValse.Drawable;
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.Extensions;
using StudioLaValse.Drawable.Interaction.Extensions;
using StudioLaValse.Drawable.Interaction.UserInput;
using StudioLaValse.Drawable.Interaction.ViewModels;
using StudioLaValse.Geometry;
using System;
using System.Collections.Generic;
using System.Threading;
using Tableaux.API;
using Tableaux.ViewModels;

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
    private readonly MidiService midiService;
    private readonly Clock clock;
    private long index = 0;
    private IDisposable? sceneInteraction;

    public bool Streaming => timer is not null;

    public AnimationService(ILogger<AnimationService> logger, ISynchronizationContextService syncContext, INotifyEntityChanged<int> notifyEntityChanged, SceneCanvasViewModel canvasViewModel, MidiService midiService, Clock clock)
    {
        this.logger = logger;
        this.syncContext = syncContext;
        this.notifyEntityChanged = notifyEntityChanged;
        this.canvasViewModel = canvasViewModel;
        this.midiService = midiService;
        this.clock = clock;
    }

    public void Start(int frameDuration, ISceneDesigner sceneDesigner)
    {
        lock (_lock)
        {
            Stop();
        }

        clock.Tick();

        var scene = new SceneWrapper();
        var sceneManager = new SceneManager<int>(scene, canvasViewModel.CanvasPainter);
        sceneInteraction = notifyEntityChanged.Subscribe(sceneManager.CreateObserver());

        canvasViewModel.InputObserver = new BaseInputObserver().AddDefaultBehavior(sceneManager).AddRerender(notifyEntityChanged);

        timer = new Timer(_ => syncContext.Post(() => TimerCallback(sceneDesigner, scene)), sceneDesigner, 0, frameDuration);
    }

    private void TimerCallback(ISceneDesigner sceneDesigner, SceneWrapper sceneWrapper)
    {
        try
        {
            index++;

            var translation = new XY(canvasViewModel.TranslateX, canvasViewModel.TranslateY);
            var animationFrame = new AnimationFrame(index, clock.ElapsedTime.Microseconds, canvasViewModel.Bounds, translation, canvasViewModel.Zoom);
            var buffer = midiService.ReadBuffer();
            var scene = sceneDesigner.OnUpdate(buffer, animationFrame);
            sceneWrapper.SetContent(scene);

            notifyEntityChanged.Invalidate(0);
            notifyEntityChanged.RenderChanges();

            clock.Tick();

        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unexpected error happened during playback. Playback will be stopped.");
            Stop();
        }
    }

    public void Stop()
    {
        lock (_lock)
        {
            sceneInteraction?.Dispose();
            timer?.Dispose();
            index = 0;
        }
    }


    class SceneWrapper : BaseVisualParent<int>
    {
        private BaseContentWrapper? content;
        public SceneWrapper() : base(0)
        {

        }

        public void SetContent(BaseContentWrapper content)
        {
            this.content = content;
        }

        public override IEnumerable<BaseContentWrapper> GetContentWrappers()
        {
            if (content is null)
            {
                yield break;
            }

            yield return content;
        }
    }
}

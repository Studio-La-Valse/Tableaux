using Avalonia.Threading;
using Microsoft.Extensions.Logging;
using StudioLaValse.Drawable.BitmapPainters;
using StudioLaValse.Drawable.Extensions;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Tableaux.Models.Designer;
using Tableaux.Models.Streams;
using Tableaux.ViewModels;
using static System.Net.Mime.MediaTypeNames;

namespace Tableaux.Models.Engine
{
    public class PlaybackEngine
    {
        private CancellationTokenSource? cancellationTokenSource;
        private readonly BaseBitmapPainter bitmapPainter;
        private readonly CanvasViewModel canvas;
        private readonly ILogger<PlaybackEngine> logger;

        public bool Streaming => cancellationTokenSource != null;


        public PlaybackEngine(BaseBitmapPainter bitmapPainter, CanvasViewModel canvas, ILogger<PlaybackEngine> logger)
        {
            this.bitmapPainter = bitmapPainter;
            this.canvas = canvas;
            this.logger = logger;
        }





        public async Task Activate(BasePlaybackStream inputSignal, IAnimationDesigner animationDesigner)
        {
            if (Streaming)
            {
                throw new Exception("Engine is already activated.");
            }

            try
            {
                cancellationTokenSource = new CancellationTokenSource();

                inputSignal.StartStream();

                var engineKlavier = new Klavier(new double[88]);
                var engineCircle = new CircleOfFifths();

                await Task.Run(async () =>
                {
                    try
                    {
                        while (!cancellationTokenSource.IsCancellationRequested)
                        {
                            var stopWatch = Stopwatch.StartNew();

                            var signalState = inputSignal.GetState();
                            var signalKlavier = signalState.CreateKlavier();
                            engineKlavier.Lerp(signalKlavier, 0.2);
                            engineCircle.Update(engineKlavier);

                            var state = new State(signalState, engineKlavier, engineCircle);
                            var scene = animationDesigner.BuildFrame(state, new StudioLaValse.Geometry.BoundingBox(0, canvas.Bounds.Width, 0, canvas.Bounds.Height));

                            await Dispatcher.UIThread.InvokeAsync(() => bitmapPainter.Draw(scene), DispatcherPriority.Send);
                            var ms = stopWatch.Elapsed.Milliseconds;
                        }
                    }
                    catch (Exception ex)
                    {
                        var message = ex.Message;
                        var stacktrace = ex.StackTrace;
                        logger.LogError("An unexpected error happened during playback: {message} {stacktrace} Playback will be stopped.", message, stacktrace);
                        Deactivate();
                    }
                    finally
                    {

                    }
                });
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                var stacktrace = ex.StackTrace;
                logger.LogError("An unexpected error happened during initalization: {message} {stacktrace} Operation aborted.", message, stacktrace);
            }
            finally
            {
                inputSignal.StopStream();
                cancellationTokenSource = null;
            }
        }
        public void Deactivate()
        {
            if (!Streaming || cancellationTokenSource is null)
            {
                throw new Exception("Engine already dismantled.");
            }

            cancellationTokenSource.Cancel();
        }
    }

    public static class BitmapPainterExtensions
    {
        public static void Draw(this BaseBitmapPainter baseBitmapPainter, Scene scene)
        {
            baseBitmapPainter.InitDrawing();

            if (scene.Background is not null)
            {
                // baseBitmapPainter.DrawBackground(scene.Background);
            }

            baseBitmapPainter.DrawContentWrapper(scene.BaseContentWrapper);
            baseBitmapPainter.FinishDrawing();
        }
    }
}

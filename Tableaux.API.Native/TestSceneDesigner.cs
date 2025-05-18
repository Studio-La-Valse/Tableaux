using StudioLaValse.Drawable;
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.Interaction;
using StudioLaValse.Drawable.Interaction.UserInput;
using Tableaux.API.Native.Signals;
using Tableaux.API.Native.Streams;
using Tableaux.API.Native.Streams.Private;

namespace Tableaux.API.Native;

internal class TestSceneDesigner : ISceneDesigner
{
    private readonly TestScene scene;
    private BaseAudioStream? input;
    private readonly IFastFourierTransformer fastFourierTransformer;

    public string Creator => "Native";
    public string Name => "Test";
    public bool EnablePan => false;
    public bool EnableZoom => false;
    public BaseContentWrapper Scene => scene;

    public TestSceneDesigner(TestScene testScene)
    {
        this.scene = testScene;

        fastFourierTransformer = new FastFourierSharpTransformer();
    }


    public void RegisterSettings(ISettingsProvider settingsProvider)
    {

    }

    public void OnActivate()
    {
        input = new MicrophoneInputStream(0, 44_100, 32, 24, 16_384, fastFourierTransformer);
        input.StartStream();
    }

    public async Task OnUpdate(AnimationFrame animationFrame, CancellationToken cancellationToken)
    {
        if (input is null)
        {
            return;
        }

        var state = input.GetState();
        var radius = state.CreateKlavier().Keys.Max(e => e.Loudness) * 500;
        scene.SetRadius(radius);

        await Task.CompletedTask;
    }

    public void OnDeactivate()
    {
        input?.StopStream();
        input?.Dispose();
    }
}

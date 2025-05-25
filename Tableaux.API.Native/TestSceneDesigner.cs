using StudioLaValse.Drawable.ContentWrappers;
using Tableaux.API.Native.Classic;
using Tableaux.API.Native.Engine;

namespace Tableaux.API.Native;

internal class TestSceneDesigner : ISceneDesigner
{
    private readonly TestScene scene;
    private readonly Klavier klavier = new(new double[88]);
    private readonly CircleOfFifths circleOfFifths = new();
    private readonly Queue<int> volumeHistory = new();
    private readonly AnimationFrameInfo animationFrameInfo;

    public string Creator => "Native";
    public string Name => "Test";
    public bool EnablePan => false;
    public bool EnableZoom => false;
    public BaseContentWrapper Scene => scene;
    public BaseContentWrapper HUD => animationFrameInfo;
    private double lerpFactor = 0.1;

    public TestSceneDesigner(TestScene testScene, AnimationFrameInfo animationFrameInfo)
    {
        this.scene = testScene;
        this.animationFrameInfo = animationFrameInfo;
    }


    public void RegisterSettings(ISettingsProvider settingsProvider)
    {
        settingsProvider.RegisterDouble(() => this.lerpFactor, v => this.lerpFactor = v, "Lerp", 0.1);
    }

    public BaseContentWrapper OnUpdate(IMidiBuffer midiBuffer, AnimationFrame animationFrame)
    {
        this.animationFrameInfo.Update(animationFrame);
        this.klavier.Lerp(klavier, this.lerpFactor);
        this.circleOfFifths.Update(klavier);

        this.scene.Update(new ClassicAnimationContentWrapper(klavier, circleOfFifths, animationFrame.BoundingBox.Width, animationFrame.BoundingBox.Height, volumeHistory, 300));
        return this.scene;
    }
}

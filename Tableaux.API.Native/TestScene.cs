using StudioLaValse.Drawable.ContentWrappers;

namespace Tableaux.API.Native;

using System.Collections.Generic;
using Tableaux.API.Native.Classic;

public class TestScene : BaseVisualParent<int>
{
    private readonly ICanvasService canvasService;


    public TestScene(ICanvasService canvasService) : base(1)
    {
        this.canvasService = canvasService;
    }

    private ClassicAnimationContentWrapper? classicAnimationContentWrapper;

    public void Update(ClassicAnimationContentWrapper classicAnimationContentWrapper)
    {
        this.classicAnimationContentWrapper = classicAnimationContentWrapper;
    }

    public override IEnumerable<BaseContentWrapper> GetContentWrappers()
    {
        if (classicAnimationContentWrapper is not null)
        {
            yield return classicAnimationContentWrapper;
        }
    }
}

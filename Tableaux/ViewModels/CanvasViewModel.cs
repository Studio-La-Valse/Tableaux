using Avalonia;
using Tableaux.ViewModels.Base;
namespace Tableaux.ViewModels;

public class CanvasViewModel : BaseViewModel
{
    public Rect Bounds
    {
        get => GetValue(() => Bounds);
        set => SetValue(() => Bounds, value);
    }
}

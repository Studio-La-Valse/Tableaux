using StudioLaValse.Drawable.Interaction.ViewModels;
using StudioLaValse.Geometry;
using Tableaux.API;

namespace Tableaux.Models;

internal class CanvasService : ICanvasService
{
    private readonly CanvasViewModel canvasViewModel;

    public CanvasService(CanvasViewModel canvasViewModel)
    {
        this.canvasViewModel = canvasViewModel;
    }

    public BoundingBox Bounds => canvasViewModel.Bounds;

    public double Zoom 
    { 
        get => canvasViewModel.Zoom;
        set => canvasViewModel.Zoom = value;    
    }
    public double TranslateX 
    {
        get => canvasViewModel.TranslateX;
        set => canvasViewModel.TranslateX = value;
    }
    public double TranslateY  
    {
        get => canvasViewModel.TranslateY;
        set => canvasViewModel.TranslateY = value;
    }
    public bool EnablePan
    {
        get => canvasViewModel.EnablePan;
        set => canvasViewModel.EnablePan = value;
    }
    public bool EnableZoom 
    {
        get => canvasViewModel.EnableZoom;
        set => canvasViewModel.EnableZoom = value;
    }
}

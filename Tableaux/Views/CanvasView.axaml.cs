using Avalonia;
using Avalonia.Controls;
using Avalonia.Media;
using System;
using System.Collections.Generic;

namespace Tableaux.Views;

public partial class CanvasView : UserControl
{
    public List<Action<DrawingContext>> DrawActions = [];

    public CanvasView()
    {
        InitializeComponent();
    }

    public override void Render(DrawingContext drawingContext)
    {
        foreach (var action in DrawActions) 
        {
            action(drawingContext);
        }
    }
}
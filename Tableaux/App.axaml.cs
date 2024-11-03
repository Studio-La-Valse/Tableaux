using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using Avalonia.Media;
using Avalonia.Media.Imaging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StudioLaValse.Drawable.Avalonia.Painters;
using StudioLaValse.Drawable.BitmapPainters;
using StudioLaValse.Drawable.DrawableElements;
using StudioLaValse.Drawable.Text;
using StudioLaValse.Geometry;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Tableaux.Models.Engine;
using Tableaux.Models.Scenes.Classic;
using Tableaux.Models.Signals;
using Tableaux.Models.Streams.Private;
using Tableaux.ViewModels;
using Tableaux.Views;

namespace Tableaux;

public partial class App : Application
{
    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
    }

    public override void OnFrameworkInitializationCompleted()
    {
        using var host = CreateHostBuilder().Build();
        var mainWindow = host.Services.GetRequiredService<MainWindow>();
        var mainViewModel = host.Services.GetRequiredService<MainViewModel>();
        mainWindow.DataContext = mainViewModel;

        if (ApplicationLifetime is not IClassicDesktopStyleApplicationLifetime desktop)
        {
            throw new UnreachableException();
        }

        desktop.MainWindow = mainWindow;

        var textMeasurer = new AvaloniaTextMeasurer();
        var bitmapPainter = new GraphicsPainter(mainWindow.Canvas, textMeasurer);
        var logger = host.Services.GetRequiredService<ILogger<PlaybackEngine>>();
        var engine = new PlaybackEngine(bitmapPainter, mainViewModel.CanvasViewModel, logger);

        var fourierTransformer = new FastFourierSharpTransformer();
        var inputSignal = new SystemAudioInputStream(fourierTransformer, deviceIndex: 0, bufferSize: 16384);
        var designer = new ClassicAnimationDesigner();
        engine.Activate(inputSignal, designer);

        base.OnFrameworkInitializationCompleted();
    }

    public static HostApplicationBuilder CreateHostBuilder()
    {
        var builder = Host.CreateApplicationBuilder(Environment.GetCommandLineArgs());
        builder.Services.AddSingleton<MainWindow>();
        builder.Services.AddSingleton<CanvasViewModel>();
        builder.Services.AddSingleton<MainViewModel>();
        builder.Services.AddLogging();
        return builder;
    }
}

/// <inheritdoc/>
public class GraphicsPainter : BaseCachingBitmapPainter<DrawingContext>
{
    private readonly CanvasView drawingContext;
    private readonly IMeasureText textMeasurer;

    /// <summary>
    /// The cache where the draw requests are added to.
    /// </summary>
    protected override List<Action<DrawingContext>> Cache => drawingContext.DrawActions;



    /// <inheritdoc/>
    public GraphicsPainter(CanvasView drawingContext, IMeasureText textMeasurer) 
    {
        this.drawingContext = drawingContext;
        this.textMeasurer = textMeasurer;
    }

    /// <inheritdoc/>
    public override void DrawBackground(ColorARGB colorARGB)
    {
        drawingContext.Background = colorARGB.ToBrush();   
    }

    /// <inheritdoc/>
    protected override void DrawElement(DrawingContext drawingContext, DrawableLine line)
    {
        var pen = line.Color.ToPen(line.Thickness);
        drawingContext.DrawLine(pen, line.TopLeft.ToPoint(), line.BottomRight.ToPoint());
    }

    /// <inheritdoc/>
    protected override void DrawElement(DrawingContext drawingContext, DrawableRectangle rectangle)
    {
        var rect = new Rect(new Point((int)rectangle.TopLeftX, (int)rectangle.TopLeftY), new Size((int)rectangle.Width, (int)rectangle.Height));
        drawingContext.FillRectangle(rectangle.Color.ToBrush(), rect);

        if (rectangle.StrokeColor != null && rectangle.StrokeWeight > 0)
        {
            var pen = rectangle.StrokeColor.ToPen(rectangle.StrokeWeight);
            drawingContext.DrawRectangle(pen, rect);
        }
    }

    /// <inheritdoc/>
    protected override void DrawElement(DrawingContext drawingContext, DrawableText text)
    {
        drawingContext.DrawText(text.ToFormattedText(), new Point(text.GetLeft(textMeasurer), text.GetTop(textMeasurer)));
    }

    /// <inheritdoc/>
    protected override void DrawElement(DrawingContext drawingContext, DrawableEllipse ellipse)
    {
        var brush = ellipse.Color.ToBrush();
        var x = ellipse.CenterX - ellipse.Width / 2;
        var y = ellipse.CenterY - ellipse.Height / 2;
        var width = ellipse.Width;
        var height = ellipse.Height;
        var rect = new Rect(x, y, width, height);
        if (ellipse.StrokeColor != null && ellipse.StrokeWeight > 0)
        {
            var strokeBrush = ellipse.StrokeColor.ToBrush();
            var pen = new Pen(strokeBrush, (float)ellipse.StrokeWeight);
            drawingContext.DrawEllipse(brush, pen, rect);
        }
        else
        {
            drawingContext.DrawEllipse(brush, null, rect);
        }
    }

    /// <inheritdoc/>
    protected override void DrawElement(DrawingContext drawingContext, DrawablePolyline polyline)
    {
        var strokeBrush = polyline.Color?.ToBrush() ?? new SolidColorBrush();
        var pen = new Pen(strokeBrush, polyline.StrokeWeight);
        var geometry = new PolylineGeometry()
        {
            Points = polyline.Points.Select(p => p.ToPoint()).ToArray(),
        };
        drawingContext.DrawGeometry(null, pen, geometry);
    }

    /// <inheritdoc/>
    protected override void DrawElement(DrawingContext drawingContext, DrawablePolygon polygon)
    {
        var fillBrush = polygon.Fill?.ToBrush() ?? new SolidColorBrush();
        var strokeBrush = polygon.Color?.ToBrush() ?? new SolidColorBrush();
        var pen = new Pen(strokeBrush, polygon.StrokeWeight);
        var geometry = new PolylineGeometry()
        {
            Points = polygon.Points.Select(p => p.ToPoint()).ToArray(),
        };
        drawingContext.DrawGeometry(fillBrush, pen, geometry);
    }

    /// <inheritdoc/>
    protected override void DrawElement(DrawingContext canvas, DrawableBezierCurve bezier)
    {
        throw new NotImplementedException();
    }

    /// <inheritdoc/>
    public override void FinishDrawing()
    {
        drawingContext.InvalidateVisual();
    }
}

internal static class GeometryExtensions
{
    public static Point ToPoint(this XY point)
    {
        return new Point(point.X, point.Y);
    }

    public static Color ToColor(this ColorARGB colorARGB)
    {
        var color = new Color((byte)colorARGB.Alpha, (byte)colorARGB.Red, (byte)colorARGB.Green, (byte)colorARGB.Blue);
        return color;
    }

    public static SolidColorBrush ToBrush(this ColorARGB colorARGB)
    {
        var color = colorARGB.ToColor();
        var brush = new SolidColorBrush(color);
        return brush;
    }

    public static Pen ToPen(this ColorARGB colorARGB, double thickness)
    {
        var brush = colorARGB.ToBrush();
        var pen = new Pen(brush, thickness);
        return pen;
    }

    public static Rect ToRect(this DrawableRectangle rectangle)
    {
        var rect = new Rect(new Point((int)rectangle.TopLeftX, (int)rectangle.TopLeftY), new Size((int)rectangle.Width, (int)rectangle.Height));
        return rect;
    }

    public static FormattedText ToFormattedText(this DrawableText text)
    {
        var brush = text.Color.ToBrush();
        var fontFamily = text.FontFamily.ToFontFamily();
        var formattedText = new FormattedText(text.Text, System.Globalization.CultureInfo.InvariantCulture, FlowDirection.LeftToRight, new Typeface(fontFamily), text.FontSize, brush);
        return formattedText;
    }

    public static FontFamily ToFontFamily(this FontFamilyCore fontFamily)
    {
        return fontFamily.Uri is null ? new FontFamily(fontFamily.Name) : new FontFamily(fontFamily.Uri, fontFamily.Name);
    }
}

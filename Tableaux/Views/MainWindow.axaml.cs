using Avalonia.Controls;

namespace Tableaux.Views;

public partial class MainWindow : Window
{
    public CanvasView Canvas => MainView.CanvasView;
    public MainWindow()
    {
        InitializeComponent();
    }
}

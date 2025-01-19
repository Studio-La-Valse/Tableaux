using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StudioLaValse.DependencyInjection;
using StudioLaValse.DependencyInjection.Microsoft;
using StudioLaValse.Drawable;
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.Extensions;
using StudioLaValse.Drawable.Interaction.ViewModels;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using Tableaux.API;
using Tableaux.Models;
using Tableaux.ViewModels;

namespace Tableaux;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddViews(this IServiceCollection services)
    {
        services.AddSingleton<MainWindow>();
        return services;
    }

    public static IServiceCollection AddViewModels(this IServiceCollection services)
    {
        services.AddSingleton<CanvasViewModel>();
        services.AddSingleton<AddinCollectionViewModel>();
        services.AddSingleton<MainViewModel>();
        return services;
    }

    public static IServiceCollection AddModels(this IServiceCollection services)
    {
        services.AddSingleton(SceneManager<int>.CreateObservable());
        services.AddSingleton<ICanvasService, CanvasService>();
        services.AddSingleton<IAnimationService, AnimationService>();
        services.AddSingleton<ISynchronizationContextService, DefaultSynchronizationContextService>();
        services.AddLogging(e =>
        {
            e.ClearProviders();
        });
        return services;
    }

    public static IServiceCollection AddScenes(this IServiceCollection services)
    {
        var directory = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!, "External Addins");
        AppDomain.CurrentDomain.AssemblyResolve += (sender, args) =>
        {
            var baseDirectory = Path.Combine(directory, "Dependencies");
            return ResolveAssembly(args.Name, baseDirectory);
        };

        var typeLoader = TypeLoader.FromDirectory(directory);
        var typeRegistryClient = new SceneLoaderTypeRegistryClient();

        services.RegisterExternalAddins<ISceneDesigner>(typeLoader, typeRegistryClient);
        services.RegisterCollection<ISceneDesigner>();
        services.RegisterExternalServices(typeLoader);

        return services;
    }

    private static Assembly? ResolveAssembly(string assemblyFullName, string baseDirectory)
    {
        try
        {
            var assemblyName = new AssemblyName(assemblyFullName);
            var assemblyVersion = $"{assemblyName.Version!.Major}.{assemblyName.Version.Minor}.{assemblyName.Version.Build}";
            var versionPath = Path.Combine(baseDirectory, assemblyName.Name!.ToLower(), assemblyVersion);
            var files = Directory.GetFiles(versionPath, "*.dll", SearchOption.AllDirectories);
            foreach (var file in files)
            {
                if (Path.GetFileNameWithoutExtension(file).Equals(assemblyName.Name, StringComparison.OrdinalIgnoreCase))
                {
                    return Assembly.LoadFrom(file);
                }
            }
        }
        catch
        {

        }

        return null;
    }

    class SceneLoaderTypeRegistryClient : ITypeRegistryClient<IServiceCollection>
    {
        public void Register(Type addin, IServiceCollection container)
        {
            container.AddSingleton(typeof(ISceneDesigner), addin);
        }
    }
}

public partial class App : Application
{
    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
    }

    public override void OnFrameworkInitializationCompleted()
    {
        var hostBuilder = CreateHostBuilder();
        hostBuilder.Services.AddViews().AddViewModels().AddModels().AddScenes();
        using var host = hostBuilder.Build();

        var mainWindow = host.Services.GetRequiredService<MainWindow>();
        var mainViewModel = host.Services.GetRequiredService<MainViewModel>();

        mainWindow.DataContext = mainViewModel;

        if (ApplicationLifetime is not IClassicDesktopStyleApplicationLifetime desktop)
        {
            throw new UnreachableException();
        }

        desktop.MainWindow = mainWindow;

        base.OnFrameworkInitializationCompleted();
    }

    public static HostApplicationBuilder CreateHostBuilder()
    {
        var builder = Host.CreateApplicationBuilder(Environment.GetCommandLineArgs());

        return builder;
    }
}

using StudioLaValse.Drawable.Interaction.ViewModels;
using StudioLaValse.Drawable;
using System.Collections.Generic;
using Tableaux.API;
using System.Windows.Input;
using ReactiveUI;
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.Extensions;
using System;
using Tableaux.ViewModels.Base;

namespace Tableaux.ViewModels;
public class SceneDesignerViewModel : BaseViewModel
{
    private readonly ISceneDesigner sceneDesigner;
    private readonly AddinCollectionViewModel addinCollectionViewModel;
    private bool isLoaded = false;

    public string Creator => sceneDesigner.Creator;
    public string Name => sceneDesigner.Name;
    public ICommand ActivateCommand { get; }
    public string ButtonContent
    {
        get => GetValue(() => ButtonContent);
        set => SetValue(() => ButtonContent, value);
    }
    public SceneDesignerViewModel(ISceneDesigner sceneDesigner, AddinCollectionViewModel addinCollectionViewModel)
    {
        this.sceneDesigner = sceneDesigner;
        this.addinCollectionViewModel = addinCollectionViewModel;
        ActivateCommand = ReactiveCommand.Create(Activate);
        ButtonContent = "Activate";
    }

    public void Activate()
    {
        if (isLoaded)
        {
            addinCollectionViewModel.Deactivate();
            isLoaded = false;
            ButtonContent = "Activate";
            return;
        }

        addinCollectionViewModel.Activate(sceneDesigner);
        isLoaded = true;

        ButtonContent = "Deactivate";
    }
}

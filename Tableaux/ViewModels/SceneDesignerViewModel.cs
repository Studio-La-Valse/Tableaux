using StudioLaValse.Drawable.Interaction.ViewModels;
using StudioLaValse.Drawable;
using System.Collections.Generic;
using Tableaux.API;
using System.Windows.Input;
using ReactiveUI;
using StudioLaValse.Drawable.ContentWrappers;
using StudioLaValse.Drawable.Extensions;
using System;

namespace Tableaux.ViewModels;
public class SceneDesignerViewModel
{
    private readonly ISceneDesigner sceneDesigner;
    private readonly AddinCollectionViewModel addinCollectionViewModel;

    public string Creator => sceneDesigner.Creator;
    public string Name => sceneDesigner.Name;
    public ICommand ActivateCommand { get; }

    public SceneDesignerViewModel(ISceneDesigner sceneDesigner, AddinCollectionViewModel addinCollectionViewModel)
    {
        this.sceneDesigner = sceneDesigner;
        this.addinCollectionViewModel = addinCollectionViewModel;
        ActivateCommand = ReactiveCommand.Create(Activate);
    }

    public void Activate()
    {
        addinCollectionViewModel.Activate(sceneDesigner);
    }
}

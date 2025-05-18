using System;
using System.Collections.Generic;
using Tableaux.API;
using Tableaux.ViewModels;
using Tableaux.ViewModels.Base;

namespace Tableaux.Models;

public class SettingsProvider : ISettingsProvider
{
    private readonly AddinPropertiesViewModel addinPropertiesViewModel;

    public SettingsProvider(AddinPropertiesViewModel addinPropertiesViewModel)
    {
        this.addinPropertiesViewModel = addinPropertiesViewModel;
    }

    public void RegisterString(Func<string> getValue, Action<string> setValue, string description, string @default)
    {
        var tunnel = new PropertyViewModelString(getValue, setValue, description, @default);
        addinPropertiesViewModel.Properties.Add(tunnel);
    }

    public void RegisterDouble(Func<double> getValue, Action<double> setValue, string description, double @default)
    {
        var tunnel = new PropertyViewModelDouble(getValue, setValue, description, @default);
        addinPropertiesViewModel.Properties.Add(tunnel);
    }

    public void RegisterInt(Func<int> getValue, Action<int> setValue, string description, int @default)
    {
        var tunnel = new PropertyViewModelInt(getValue, setValue, description, @default);
        addinPropertiesViewModel.Properties.Add(tunnel);
    }
}

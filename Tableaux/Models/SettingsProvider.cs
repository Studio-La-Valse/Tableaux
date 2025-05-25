using ReactiveUI;
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

    public ICommandActivator RegisterCommand(Action action, string description)
    {
        var observable = new CommandActivator();
        var command = ReactiveCommand.Create(action, observable);
        var actionViewModel = new ActionViewModel(description, command);
        addinPropertiesViewModel.Actions.Add(actionViewModel);

        return observable;
    }

    class CommandActivator : ICommandActivator, IObservable<bool>
    {
        private readonly HashSet<IObserver<bool>> observers = [];
        private bool enabled = true; 

        public CommandActivator()
        {
            
        }

        public void SetEnabled(bool enabled)
        {
            this.enabled = enabled;

            foreach (var observer in observers)
            {
                observer.OnNext(this.enabled);
            }
        }

        public IDisposable Subscribe(IObserver<bool> observer)
        {
            observers.Add(observer);
            observer.OnNext(enabled);
            return new Unsubscriber(observers, observer);   
        }

        class Unsubscriber : IDisposable
        {
            private readonly HashSet<IObserver<bool>> observers;
            private readonly IObserver<bool> observer;

            public Unsubscriber(HashSet<IObserver<bool>> observers, IObserver<bool> observer)
            {
                this.observers = observers;
                this.observer = observer;
            }

            public void Dispose()
            {
                observers.Remove(observer);
            }
        }
    }
}

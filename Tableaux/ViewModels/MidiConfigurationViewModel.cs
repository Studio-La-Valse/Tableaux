using NAudio.Midi;
using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using Tableaux.Models;
using Tableaux.Models.Streams;
using Tableaux.ViewModels.Base;

namespace Tableaux.ViewModels;

public class MidiDeviceViewModel : BaseViewModel
{
    private readonly MidiInCapabilities midiInCapabilities;

    public int DeviceIndex { get; }
    public int ProductId => midiInCapabilities.ProductId;
    public string ProductName => midiInCapabilities.ProductName;

    public MidiDeviceViewModel(MidiInCapabilities midiInCapabilities, int deviceIndex)
    {
        this.midiInCapabilities = midiInCapabilities;
        DeviceIndex = deviceIndex;
    }
}

public class MidiConfigurationViewModel : BaseViewModel
{
    private readonly MidiService midiService;
    private readonly MidiReaderFactory midiReaderFactory;

    public ObservableCollection<MidiDeviceViewModel> AvailableDevices
    {
        get => GetValue(() => AvailableDevices);
        set => SetValue(() => AvailableDevices, value);
    }

    public MidiDeviceViewModel? SelectedDevice
    {
        get => GetValue(() => SelectedDevice);
        set => SetValue(() => SelectedDevice, value);
    }

    public ICommand ReloadCommand
    {
        get => GetValue(() => ReloadCommand);
        set => SetValue(() => ReloadCommand, value);
    }

    public MidiConfigurationViewModel(MidiService midiService, MidiReaderFactory midiReaderFactory)
    {
        this.midiService = midiService;
        this.midiReaderFactory = midiReaderFactory;

        AvailableDevices = [];
        ReloadCommand = ReactiveCommand.Create(Reload);

        Reload();
    }

    public void Reload()
    {
        AvailableDevices.Clear();
        for (var i = 0; i < MidiIn.NumberOfDevices; i++)
        {
            var deviceInfo = MidiIn.DeviceInfo(i);
            var midiDevice = new MidiDeviceViewModel(deviceInfo, i);
            AvailableDevices.Add(midiDevice);
        }
    }

    public void Create()
    {
        if (SelectedDevice is null)
        {
            return;
        }

        var midiListener = midiReaderFactory.CreateListener(SelectedDevice.DeviceIndex);
        midiService.RegisterMidiProvider(midiListener);
    }
}

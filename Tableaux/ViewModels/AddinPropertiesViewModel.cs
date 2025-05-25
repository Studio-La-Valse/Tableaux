using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tableaux.API;
using Tableaux.ViewModels.Base;

namespace Tableaux.ViewModels;
public class AddinPropertiesViewModel : PropertyCollectionViewModel
{
    public override string Header => "Header";

    public void Clear()
    {
        this.Properties.Clear();
        this.Actions.Clear();
    }
}

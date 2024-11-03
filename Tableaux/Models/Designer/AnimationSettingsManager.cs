﻿using System;
using System.Collections.Generic;

namespace Tableaux.Models.Designer
{
    public sealed class AnimationSettingsManager
    {
        private readonly List<PropertyTunnel> propertyTunnels = new List<PropertyTunnel>();

        public void Register<T>(Func<T> getValue, Action<T> setValue, string description)
        {
            var tunnel = new PropertyTunnel<T>(getValue, setValue, description);

            propertyTunnels.Add(tunnel);
        }

        public IEnumerable<PropertyTunnel> Tunnels => propertyTunnels;
    }

}

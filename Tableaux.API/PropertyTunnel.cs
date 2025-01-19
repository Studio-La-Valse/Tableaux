using System;

namespace Tableaux.API
{
    public class PropertyTunnel
    {
        public string Description { get; }

        public event EventHandler? PropertySet;

        public PropertyTunnel(string description)
        {
            Description = description;
        }

        protected virtual void OnPropertySet()
        {
            var handler = PropertySet;

            handler?.Invoke(this, new EventArgs());
        }
    }

    public class PropertyTunnel<TProperty> : PropertyTunnel
    {
        private readonly Func<TProperty> getValue;
        private readonly Action<TProperty> setValue;


        public TProperty Value
        {
            get
            {
                return getValue();
            }
            set
            {
                setValue(value);

                OnPropertySet();
            }
        }

        public PropertyTunnel(Func<TProperty> getValue, Action<TProperty> setValue, string description) : base(description)
        {
            this.getValue = getValue;
            this.setValue = setValue;
        }


    }
}

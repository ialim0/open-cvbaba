import React, { useCallback, useMemo } from 'react';

interface SwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const Switch: React.FC<SwitchProps> = ({
  id,
  checked,
  onCheckedChange,
  disabled = false,
  ariaLabel,
}) => {
  const handleChange = useCallback(() => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  }, [checked, disabled, onCheckedChange]);

  const buttonClassName = useMemo(() => {
    return [
      'relative inline-flex items-center h-6 w-11 rounded-full',
      'transition-colors duration-200 ease-in-out focus:outline-none',
      'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75',
      checked ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-650',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ].join(' ');
  }, [checked, disabled]);

  const toggleClassName = useMemo(() => {
    return [
      'absolute left-0.5 inline-block w-5 h-5 transform bg-white rounded-full',
      'transition-transform duration-200 ease-in-out',
      checked ? 'translate-x-5' : 'translate-x-0'
    ].join(' ');
  }, [checked]);

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleChange}
      className={buttonClassName}
    >
      <span className="sr-only">
        {ariaLabel || (checked ? 'Enabled' : 'Disabled')}
      </span>
      <span className={toggleClassName} />
    </button>
  );
};

export default React.memo(Switch);
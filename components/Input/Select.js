import cx from 'classnames'
import { renderIcon } from './Input'
import { MdKeyboardArrowDown } from 'react-icons/md'

const Select = ({
  options,
  label,
  error,
  icon = <MdKeyboardArrowDown size={18} />,
  size,
  iconPosition = 'right',
  theme,
  className,
  name,
  value,
  id,
  onChange,
  selectClassName
}) => {
  return (
    <div className={cx(
      className,
      size,
      "input-component relative inline-block w-full body",
      {
        'has-label': label,
        'icon-right': iconPosition === 'right' && icon,
        'icon-left': iconPosition === 'left' && icon,
        'has-value': value && value !== 'false',
        'error': error
      }
    )}>
      <select
        name={name}
        id={id}
        onChange={onChange}
        className={selectClassName}
      >
        {options.map((option, index) => (
          <option className="text-true-black" key={name + '-' + option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {label && (
        <label
          icon={icon}
          size={size}
          htmlFor={name}
          className={cx(selectClassName, 'input-label')}
        >
          {label}
        </label>
      )}
      {icon && (
        renderIcon(icon, size, iconPosition, theme)
      )}
    </div>
  )
}

export default Select

import { JSX } from 'solid-js';
import { Input, InputProps, InputSizes } from '~/components/atoms/Input';

type TextFieldProps = Omit<JSX.InputHTMLAttributes<HTMLDivElement>, 'onChange'> & {
  id?: string;
  name?: string;
  errorText?: string;
  size?: keyof typeof InputSizes;
  value?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  InputProps?: InputProps;
  onChange?: (
    value: string,
    event: InputEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    },
  ) => void;
};

export const TextField = ({
  label,
  id,
  name,
  value,
  type,
  errorText,
  placeholder,
  onChange,
  InputProps,
  ...props
}: TextFieldProps) => {
  return (
    <div class="block" {...props}>
      {label && (
        <label for={id} class="block text-md font-semibold text-gray-700">
          {label}
        </label>
      )}
      <Input
        id={id}
        name={name}
        errorText={errorText}
        onChange={onChange}
        value={value}
        type={type}
        placeholder={placeholder}
        {...InputProps}
      />
    </div>
  );
};

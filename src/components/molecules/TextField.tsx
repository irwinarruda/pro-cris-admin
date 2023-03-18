import { JSX } from 'solid-js';
import { Input, InputProps, InputSizes } from '~/components/atoms/Input';

type TextFieldProps = JSX.InputHTMLAttributes<HTMLDivElement> & {
  id?: string;
  name?: string;
  errorText?: string;
  size?: keyof typeof InputSizes;
  value?: string;
  label?: string;
  type?: string;
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
      <Input id={id} name={name} errorText={errorText} onChange={onChange} value={value} type={type} {...InputProps} />
    </div>
  );
};

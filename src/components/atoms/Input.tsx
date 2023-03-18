import { JSX } from 'solid-js';

export const InputSizes = {
  sm: {
    input: 'h-8 ',
    box: '',
    helper: '',
  },
  md: {
    input: 'h-9 ',
    box: '',
    helper: '',
  },
  lg: {
    input: 'h-10 ',
    box: '',
    helper: '',
  },
};

export type InputProps = JSX.InputHTMLAttributes<HTMLDivElement> & {
  id?: string;
  name?: string;
  errorText?: string;
  size?: keyof typeof InputSizes;
  value?: string;
  type?: string;
  InputProps?: JSX.InputHTMLAttributes<HTMLInputElement>;
  ErrorTextProps?: JSX.InputHTMLAttributes<HTMLSpanElement>;
  onChange?: (
    value: string,
    event: InputEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    },
  ) => void;
};

export function Input({
  id,
  name,
  size = 'md',
  value,
  type,
  InputProps,
  ErrorTextProps,
  errorText,
  onChange,
  ...props
}: InputProps) {
  return (
    <div class="w-full relative" {...props}>
      <input
        id={id}
        name={name}
        value={value}
        type={type}
        onInput={e => onChange && onChange(e.currentTarget.value, e)}
        class={`${InputSizes[size].input}w-full px-4 text-md rounded-md bg-white outline-none border-1 border-gray-200 focus:border-gold-500 focus:border-1 focus:shadow-solid focus:shadow-gold-500 transition-all`}
        {...InputProps}
      />
      {errorText && (
        <span class="block text-xs text-red-500 absolute -bottom-5" {...ErrorTextProps}>
          {errorText}
        </span>
      )}
    </div>
  );
}

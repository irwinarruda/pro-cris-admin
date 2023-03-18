import { JSX } from 'solid-js';

export const ButtonSizes = {
  sm: {
    button: 'h-8 ',
  },
  md: {
    button: 'h-9 ',
  },
  lg: {
    button: 'h-10 ',
  },
};

export const getButtonStyles = (size: keyof typeof ButtonSizes, className?: string) => {
  return `${
    ButtonSizes[size].button
  }inline-flex items-center px-4 text-white font-semibold bg-purple-500 hover:bg-purple-600 rounded-md border-1 border-gold-500 focus:shadow-solid focus:shadow-gold-500 select-none transition-all outline-none ${
    className || ''
  }`;
};

type ButtonProps<As extends keyof JSX.HTMLElementTags> = JSX.HTMLElementTags[As] & {
  size?: keyof typeof ButtonSizes;
  as?: As;
};

export function Button<As extends keyof JSX.HTMLElementTags = 'button'>({
  as: asTag = 'button' as any,
  size = 'md',
  ...props
}: ButtonProps<As>): JSX.Element {
  const className = props.class || '';
  if (asTag === 'a') {
    return <a {...(props as any)} class={getButtonStyles(size, className)} />;
  }
  return <button {...(props as any)} class={getButtonStyles(size, className)} />;
}

type ButtonProps = {
  text: string;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export const Button = ({
  text,
  className,
  icon,
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-4xl w-auto h-auto p-4 bg-aam-orange hover:text-white transition-colors duration-300 ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {icon}
      {text}
    </button>
  );
};

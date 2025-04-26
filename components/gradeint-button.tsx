interface GradientButtonProps {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  width?: string;
  height?: string;
  type?: "button" | "submit" | "reset";
  text?: string; // Make optional if using children
  disabled?: boolean;
  children?: React.ReactNode; // Add children prop
}

export default function GradientButton({
  onClick,
  height = "h-10",
  width = "w-full",
  type = "button",
  disabled,
  text,
  children, // Add children
}: GradientButtonProps) {
  return (
    <button
      type={type}
      className={`${width} ${height} flex cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-[#2596be] via-[#1c9e56] to-[#3fa191]`}
      onClick={onClick}
      disabled={disabled}
    >
      {children || <span className="font-thin text-white">{text}</span>}
    </button>
  );
}

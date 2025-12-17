import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Teksti ose përmbajtja e butonit
  size?: "sm" | "md"; // Madhësia e butonit
  variant?: "primary" | "outline"; // Varianti i butonit
  startIcon?: ReactNode; // Ikona para tekstit
  endIcon?: ReactNode; // Ikona pas tekstit
  onClick?: () => void; // Handler për klikimin
  disabled?: boolean; // Gjendja e çaktivizuar
  className?: string; // Klasa ekstra
  type?: "button" | "submit" | "reset"; // Tipi i butonit
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button", // Default type
}) => {
  // Klasa për madhësinë
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Klasa për variantin
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  return (
    <button
      type={type} // <- shumë e rëndësishme për forma
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;

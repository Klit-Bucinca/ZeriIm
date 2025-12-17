import { FC, ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

const Label: FC<LabelProps> = ({ children, htmlFor, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-gray-700 font-medium ${className || ""}`}
    >
      {children}
    </label>
  );
};

export default Label;

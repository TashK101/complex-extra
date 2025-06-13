import { forwardRef, ButtonHTMLAttributes } from "react";
import "./IconButton.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.ReactNode;
    variant?: 'primary' | 'secondary';
};

const IconButton = forwardRef<HTMLButtonElement, Props>(
    ({ icon, variant = 'secondary', className = '', ...props }, ref) => {
        return (
            <button
                className={`icon-button ${variant} ${className}`}
                {...props}
                ref={ref}
            >
                {icon}
            </button>
        );
    }
);

export default IconButton;

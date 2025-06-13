import React, { forwardRef } from 'react';
import './StyledButton.css';

interface StyledButtonProps {
  label: string;
  onClick: () => void;
  type?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const StyledButton = forwardRef<HTMLButtonElement, StyledButtonProps>(
  ({ label, onClick, type = 'primary', fullWidth = false }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`styled-btn ${type} ${fullWidth ? 'full-width' : ''}`}
      >
        {label}
      </button>
    );
  }
);

export default StyledButton;

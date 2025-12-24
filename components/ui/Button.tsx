import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-zinc-100 text-zinc-950 hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]",
    outline: "border border-zinc-700 text-zinc-300 hover:border-zinc-100 hover:text-white bg-transparent",
    ghost: "text-zinc-400 hover:text-white hover:bg-zinc-900",
    danger: "bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-8 py-4"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
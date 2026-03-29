import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, className = '', variant = 'primary', size = 'md', ...props }: ButtonProps) {
    const baseStyle = "rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
    
    let variantStyle = "";
    if (variant === 'primary') variantStyle = "bg-indigo-600 hover:bg-indigo-700 text-white";
    if (variant === 'secondary') variantStyle = "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700";
    if (variant === 'danger') variantStyle = "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    if (variant === 'ghost') variantStyle = "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white";

    let sizeStyle = "";
    if (size === 'sm') sizeStyle = "px-3 py-1.5 text-sm";
    if (size === 'md') sizeStyle = "px-4 py-2";
    if (size === 'lg') sizeStyle = "px-6 py-3 text-lg";

    return (
        <button className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`} {...props}>
            {children}
        </button>
    );
}

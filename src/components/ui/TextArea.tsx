import * as React from "react"

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className = '', ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={`w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors resize-y ${className}`}
                {...props}
            />
        )
    }
)
TextArea.displayName = "TextArea"

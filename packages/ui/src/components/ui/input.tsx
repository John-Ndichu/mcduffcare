import * as React from 'react';

import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftElement, rightElement, error, errorMessage, ...props }, ref) => {
    if (leftElement !== undefined || rightElement !== undefined) {
      return (
        <div className="relative flex items-center">
          {leftElement !== undefined && (
            <div className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
              {leftElement}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
              error === true && 'border-destructive focus-visible:ring-destructive',
              leftElement !== undefined && 'pl-9',
              rightElement !== undefined && 'pr-9',
              className,
            )}
            ref={ref}
            aria-invalid={error}
            aria-describedby={errorMessage !== undefined ? `${props.id ?? ''}-error` : undefined}
            {...props}
          />
          {rightElement !== undefined && (
            <div className="absolute right-3 flex items-center text-muted-foreground">
              {rightElement}
            </div>
          )}
          {error === true && errorMessage !== undefined && (
            <p
              id={`${props.id ?? ''}-error`}
              className="absolute -bottom-5 left-0 text-xs text-destructive"
              role="alert"
            >
              {errorMessage}
            </p>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          error === true && 'border-destructive focus-visible:ring-destructive',
          className,
        )}
        ref={ref}
        aria-invalid={error}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };

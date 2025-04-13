import React from "react";
import { cn } from "../../lib/utils";

const Label = React.forwardRef(({ className, htmlFor, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-gray-700 block",
        className
      )}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = "Label";

export { Label };
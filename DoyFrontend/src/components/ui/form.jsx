import React, { createContext, useContext, useId, forwardRef } from 'react';
import { clsx } from 'clsx';

const FormContext = createContext({});

const Form = ({ className, onSubmit, children, ...props }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={clsx('space-y-6', className)}
      {...props}
    >
      {children}
    </form>
  );
};

const FormField = ({ name, children, ...props }) => {
  const id = useId();
  
  return (
    <FormContext.Provider value={{ name, id }} {...props}>
      <div className="space-y-2">
        {children}
      </div>
    </FormContext.Provider>
  );
};

const FormLabel = ({ className, children, ...props }) => {
  const { id } = useContext(FormContext);
  
  return (
    <label
      htmlFor={id}
      className={clsx('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    >
      {children}
    </label>
  );
};

const FormControl = ({ className, children, ...props }) => {
  const { id } = useContext(FormContext);
  
  return (
    <div className="mt-1">
      {React.cloneElement(children, {
        id,
        className: clsx(children.props.className, className),
        ...props
      })}
    </div>
  );
};

const FormDescription = ({ className, children, ...props }) => {
  return (
    <p className={clsx('text-sm text-gray-500', className)} {...props}>
      {children}
    </p>
  );
};

// const FormItem = ({ className, children, ...props }) => {
//   return (
//     <div className={clsx('space-y-2', className)} {...props}>
//       {children}
//     </div>
//   );
// };

const FormItem = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('flex items-center space-x-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}
);

FormItem.displayName = 'FormItem';


const FormMessage = ({ className, children, ...props }) => {
  return (
    <p className={clsx('text-sm font-medium text-red-500', className)} {...props}>
      {children}
    </p>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormContext);
  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }
  return fieldContext;
};

export {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormItem,
  useFormField
};
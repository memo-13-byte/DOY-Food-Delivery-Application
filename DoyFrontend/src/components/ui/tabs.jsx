import React, { createContext, useContext, useState } from 'react';
import { clsx } from 'clsx';

const TabsContext = createContext({});

const Tabs = ({ defaultValue, children, className, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={clsx('', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ className, children, ...props }) => {
  return (
    <div className={clsx('flex space-x-1 rounded-md p-1 bg-gray-100', className)} {...props}>
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, className, children, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={clsx(
        'px-3 py-1.5 text-sm font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
        isActive
          ? 'bg-white text-amber-700 shadow-sm'
          : 'text-gray-500 hover:text-gray-700',
        className
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, className, children, ...props }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;

  return (
    <div className={clsx('mt-2', className)} {...props}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
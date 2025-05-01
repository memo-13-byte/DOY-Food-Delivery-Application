import React from "react";
import { cn } from "../../lib/utils"; // Varsayılan olarak bir cn yardımcı fonksiyonu kullanılıyor

// Toggle bileşeni oluşturuldu
const Toggle = React.forwardRef(function Toggle(
  {
    className,
    variant = "default",
    size = "default",
    pressed,
    onPressedChange,
    children,
    ...props
  },
  ref
) {
  // Butonu kontrol etmek için tıklama işleyicisi
  const handleClick = () => {
    if (onPressedChange) {
      onPressedChange(!pressed);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={pressed}
      data-state={pressed ? "on" : "off"}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        // Varyasyonlar
        variant === "default" && "bg-transparent",
        variant === "outline" && 
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        // Boyutlar
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-8 px-3 text-xs",
        size === "lg" && "h-11 px-5",
        // Basılı durum
        pressed && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Toggle.displayName = "Toggle";

export { Toggle };

// cn yardımcı fonksiyonu yoksa aşağıdaki implementasyonu kullanabilirsiniz
// Eğer utils/index.js dosyanız yoksa bu dosyayı eklemeyi unutmayın

/*
// lib/utils.js içeriği:
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
*/
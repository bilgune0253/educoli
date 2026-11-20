
const variants = {
  primary: "ui-button-primary",
  outline: "ui-button-outline",
  ghost: "ui-button-ghost",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      className={`ui-button ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;


function Card({
  children,
  className = "",
  hover = false,
  padding = true,
  ...props
}) {
  return (
    <div
      className={`ui-card
        ${padding ? "p-5 sm:p-6" : ""}
        ${hover ? "transition-all hover:-translate-y-1 hover:shadow-lg" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;

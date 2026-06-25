const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  icon = null,
  disabled = false,
  className = "",
}) => {

  const variants = {
    primary:
      "bg-amber-500 hover:bg-amber-600 text-black",

    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    outline:
      "border border-slate-600 text-white hover:bg-slate-800",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        py-3
        rounded-xl
        font-semibold
        transition-all
        duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {icon}

      {children}
    </button>
  );
};

export default Button;
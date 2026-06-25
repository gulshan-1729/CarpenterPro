const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        shadow-lg
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
  className = "",
  label,
  error,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-app-text mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2.5 rounded-button border 
            ${error ? "border-red-500" : "border-app-border"}
            bg-app-surface 
            text-app-text
            placeholder:text-app-muted
            focus:outline-none 
            focus:ring-2 
            focus:ring-ember-accent/50
            disabled:opacity-50 
            disabled:cursor-not-allowed
            transition-all 
            duration-200
            ${className}
          `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default Input;

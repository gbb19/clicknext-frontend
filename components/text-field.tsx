interface TextFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
  height?: string;
  value?: string;
  name?: string;
  type?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function TextField({
  onChange,
  height = "h-11",
  width = "w-full",
  type = "text",
  id,
  name,
  value,
  placeholder,
  disabled = false,
}: TextFieldProps) {
  return (
    <div className={`border-2 border-[#259696] ${width} ${height} rounded-lg`}>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        className={`w-full border-none bg-transparent pt-2 pb-1 pl-3 text-base text-[#7e7e7e] outline-none focus:ring-0 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

type FormInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name?: string;
};

const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  name,
}: FormInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`${label} changed:`, e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold text-sm">{label} *</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
      />
    </div>
  );
};

export default FormInput;

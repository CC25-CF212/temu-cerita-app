type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
};

export default function FormInput({
  label,
  value,
  onChange,
  type = "text",
}: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {label} <span className="text-red-500 ml-1">*</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl"
      />
    </div>
  );
}

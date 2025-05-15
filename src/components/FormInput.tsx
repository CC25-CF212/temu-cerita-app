type Props = {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}

export default function FormInput({ label, value, onChange, type = 'text' }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
    </div>
  )
}

interface Props {
  type: string;
  name: string;
  placeholder: string;
  form: any;
  required?: boolean;
  label: string;
}

const Input = ({ type, name, placeholder, label, form, required }: Props) => {
  return (
    <label htmlFor="" className="text-[#4A4A4A]">
      {label}
      <input
        required={required}
        {...form.register(name)}
        placeholder={placeholder}
        className="w-full mt-1.5 bg-[var(--surface)] p-[13px_0px_10px_29px] focus:outline-none rounded-[10px] border border-[var(--border)] text-[var(--text)]"
        type={type}
      />
    </label>
  );
};

export default Input;

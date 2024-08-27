import { Label } from "../ui/label";
import { Input } from "../ui/input";

type FormInpuProps = {
  name?: string;
  label?: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
};

function FormInput({
  label,
  name,
  type,
  defaultValue,
  placeholder,
}: FormInpuProps) {
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        {label || name}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default FormInput;

import { Label } from "../ui/label";
import { Input } from "../ui/input";

function ImageInput({
  name,
  labelText,
  isRequired = true,
}: {
  name: string;
  labelText: string;
  isRequired: boolean;
}) {
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        {labelText}
      </Label>
      <Input
        id={name}
        name={name}
        type="file"
        required={isRequired}
        accept="/image/*"
        className="max-w-xs"
      />
    </div>
  );
}

export default ImageInput;

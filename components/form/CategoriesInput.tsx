import { Label } from "@/components/ui/label";
import { categories } from "@/utils/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const name = "category";
function CategoriesInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        Categories
      </Label>
      <Select
        defaultValue={defaultValue || categories[0].label}
        name={name}
        required
      >
        <SelectTrigger id={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((item) => {
            return (
              <SelectItem key={item.label} value={item.label}>
                <div className="flex items-center gap-2">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={24}
                    height={24}
                  />
                  <span>{item.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
export default CategoriesInput;

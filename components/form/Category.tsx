import Image from "next/image";
import { Category } from "@/utils/categories";

type CategoryProps = {
  category: Category;
};

const CategoryComponent: React.FC<CategoryProps> = ({ category }) => (
  <div>
    <img src={category.icon} alt={category.label} width={24} height={24} />
    <span>{category.label}</span>
  </div>
);

export default CategoryComponent;

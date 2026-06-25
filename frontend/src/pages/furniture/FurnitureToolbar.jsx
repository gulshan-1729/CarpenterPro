import Button from "../../components/ui/Button";
import { Plus } from "lucide-react";

const FurnitureToolbar = ({ onAddFurniture }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Furniture Management
        </h1>

        <p className="mt-1 text-slate-400">
          Manage furniture items and pricing.
        </p>
      </div>

      <Button
        onClick={onAddFurniture}
        icon={<Plus size={18} />}
      >
        Add Furniture
      </Button>
    </div>
  );
};

export default FurnitureToolbar;
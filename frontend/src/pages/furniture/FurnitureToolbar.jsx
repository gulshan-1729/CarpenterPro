import Button from "../../components/ui/Button";
import { Plus } from "lucide-react";

const FurnitureToolbar = ({ onAddFurniture }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Furniture Management
        </h1>

        <p className="mt-1 text-slate-400">
          Manage furniture items and pricing.
        </p>
      </div>

      <div className="w-full sm:w-auto">
       <Button
          onClick={onAddFurniture}
          icon={<Plus size={18} />}
       >
          Add Furniture
      </Button>
      </div>
    </div>
  );
};

export default FurnitureToolbar;
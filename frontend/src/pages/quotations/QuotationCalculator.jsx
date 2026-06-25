import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";

const furnitureRates = {
  Bed: 500,
  Wardrobe: 900,
  "TV Unit": 700,
  Kitchen: 1200,
};

const QuotationCalculator = () => {
  const [furniture, setFurniture] = useState("Bed");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");

  const area =
    Number(length || 0) * Number(width || 0);

  const rate =
    furnitureRates[furniture];

  const total =
    area * rate;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Smart Quotation Calculator
        </h1>

        <div className="bg-slate-900 rounded-3xl p-8">
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-slate-400 block mb-2">
                Furniture Type
              </label>

              <select
                value={furniture}
                onChange={(e) =>
                  setFurniture(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              >
                <option>Bed</option>
                <option>Wardrobe</option>
                <option>TV Unit</option>
                <option>Kitchen</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-2">
                Rate / Sq Ft
              </label>

              <input
                value={`₹${rate}`}
                disabled
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-2">
                Length (ft)
              </label>

              <input
                type="number"
                value={length}
                onChange={(e) =>
                  setLength(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-2">
                Width (ft)
              </label>

              <input
                type="number"
                value={width}
                onChange={(e) =>
                  setWidth(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              />
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-slate-400">
                Area
              </h3>

              <p className="text-3xl font-bold text-white">
                {area} sq.ft
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-slate-400">
                Rate
              </h3>

              <p className="text-3xl font-bold text-amber-400">
                ₹{rate}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-slate-400">
                Total
              </h3>

              <p className="text-3xl font-bold text-green-400">
                ₹{total.toLocaleString()}
              </p>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default QuotationCalculator;
import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { Building2, Save } from "lucide-react";
import toast from "react-hot-toast";

export const COMPANY_STORAGE = "companyProfile";

const DEFAULT_COMPANY = {
  companyName: "Sharma Interiors & Furniture",
  ownerName: "Ayodhya Sharma",
  phone: "9960040174",
  email: "ayodhyasharma06@gmail.com",
  gst: "",
  address: "",
};

const CompanySettings = () => {
  const [company, setCompany] = useState(DEFAULT_COMPANY);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(COMPANY_STORAGE)
    );

    if (saved) {
      setCompany(saved);
    }
  }, []);

  const handleChange = (field, value) => {
    setCompany((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveCompany = () => {
    localStorage.setItem(
      COMPANY_STORAGE,
      JSON.stringify(company)
    );

    toast.success("Company details saved successfully.");
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Building2 className="text-amber-400" />
            Company Settings
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your business information used in quotations and PDF exports.
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="text-slate-300 block mb-2">
                Company Name
              </label>

              <input
                type="text"
                value={company.companyName}
                onChange={(e) =>
                  handleChange(
                    "companyName",
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-2">
                Owner Name
              </label>

              <input
                type="text"
                value={company.ownerName}
                onChange={(e) =>
                  handleChange(
                    "ownerName",
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-2">
                Phone Number
              </label>

              <input
                type="text"
                value={company.phone}
                onChange={(e) =>
                  handleChange(
                    "phone",
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={company.email}
                onChange={(e) =>
                  handleChange(
                    "email",
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-2">
                GST Number
              </label>

              <input
                type="text"
                value={company.gst}
                onChange={(e) =>
                  handleChange(
                    "gst",
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-2">
                Address
              </label>

              <textarea
                rows={4}
                value={company.address}
                onChange={(e) =>
                  handleChange(
                    "address",
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white resize-none"
              />
            </div>

          </div>

          <button
            onClick={saveCompany}
            className="mt-8 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Save size={18} />
            Save Company Details
          </button>

        </div>

      </div>
    </MainLayout>
  );
};

export default CompanySettings;
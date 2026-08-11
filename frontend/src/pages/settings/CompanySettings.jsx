import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import {
  Building2,
  Save,
  Upload,
  Landmark,
  FileText,
  Image as ImageIcon,
  PenLine,
} from "lucide-react";
import toast from "react-hot-toast";

export const COMPANY_STORAGE = "companyProfile";

const DEFAULT_COMPANY = {
  companyName: "Sharma Interiors & Furniture",
  ownerName: "Ayodhya Sharma",
  phone: "9960040174",
  email: "ayodhyasharma06@gmail.com",
  website: "",
  gst: "",
  address: "",

  logo: "",
  signature: "",

  bankName: "",
  accountNumber: "",
  ifsc: "",
  upiId: "",

  invoicePrefix: "CP",
  startingInvoice: 1,

  terms: "",
  footer: "Thank you for your business.",
};

const CompanySettings = () => {
  const [company, setCompany] = useState(
    DEFAULT_COMPANY
  );

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(COMPANY_STORAGE)
      );

      if (saved) {
        setCompany({
          ...DEFAULT_COMPANY,
          ...saved,
        });
      }
    } catch (error) {
      console.error(
        "Failed to load company settings:",
        error
      );
    }
  }, []);

  const handleChange = (field, value) => {
    setCompany((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (
    field,
    file
  ) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select a valid image file."
      );
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "Image size should be less than 2 MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setCompany((prev) => ({
        ...prev,
        [field]: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const saveCompany = () => {
    try {
      localStorage.setItem(
        COMPANY_STORAGE,
        JSON.stringify(company)
      );

      window.dispatchEvent(
      new Event("companyProfileUpdated")
     );

      toast.success(
        "Company details saved successfully."
      );
    } catch (error) {
      console.error(
        "Failed to save company settings:",
        error
      );

      toast.error(
        "Unable to save company details."
      );
    }
  };

  return (
    <MainLayout>

      <div className="max-w-5xl mx-auto">

        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-white flex items-center gap-3">

            <Building2 className="text-amber-400" />

            Company Settings

          </h1>

          <p className="text-slate-400 mt-2">

            Manage your business information used
            in quotations, invoices and PDF exports.

          </p>

        </div>


        {/* =====================================
            COMPANY INFORMATION
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <Building2
              size={22}
              className="text-amber-400"
            />

            <h2 className="text-xl font-semibold text-amber-400">
              Company Information
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            {/* Company Name */}

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
                placeholder="Enter company name"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />

            </div>


            {/* Owner Name */}

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
                placeholder="Enter owner name"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />

            </div>


            {/* Phone */}

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
                placeholder="Enter phone number"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />

            </div>


            {/* Email */}

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
                placeholder="Enter email address"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />

            </div>


            {/* Website */}

            <div>

              <label className="text-slate-300 block mb-2">
                Website
              </label>

              <input
                type="text"
                value={company.website}
                onChange={(e) =>
                  handleChange(
                    "website",
                    e.target.value
                  )
                }
                placeholder="https://example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />

            </div>


            {/* GST */}

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
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="Enter GST number"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-amber-400"
              />

            </div>

          </div>


          {/* Address */}

          <div className="mt-6">

            <label className="text-slate-300 block mb-2">
              Business Address
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
              placeholder="Enter complete business address"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-amber-400"
            />

          </div>

        </div>


        {/* =====================================
            LOGO
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <ImageIcon
              size={22}
              className="text-amber-400"
            />

            <h2 className="text-xl font-semibold text-amber-400">
              Company Logo
            </h2>

          </div>


          <div className="flex flex-col md:flex-row gap-6 items-start">

            <div className="w-40 h-32 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center overflow-hidden">

              {company.logo ? (

                <img
                  src={company.logo}
                  alt="Company Logo"
                  className="max-w-full max-h-full object-contain"
                />

              ) : (

                <div className="text-slate-500 text-sm text-center">
                  No logo selected
                </div>

              )}

            </div>


            <div>

              <label className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 py-3 rounded-xl cursor-pointer">

                <Upload size={18} />

                Upload Logo

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(
                      "logo",
                      e.target.files[0]
                    )
                  }
                />

              </label>

              <p className="text-slate-500 text-sm mt-2">
                PNG, JPG or WEBP. Maximum 2 MB.
              </p>

            </div>

          </div>

        </div>


        {/* =====================================
            BANK DETAILS
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <Landmark
              size={22}
              className="text-amber-400"
            />

            <h2 className="text-xl font-semibold text-amber-400">
              Bank Details
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            {/* Bank Name */}

            <div>

              <label className="text-slate-300 block mb-2">
                Bank Name
              </label>

              <input
                type="text"
                value={company.bankName}
                onChange={(e) =>
                  handleChange(
                    "bankName",
                    e.target.value
                  )
                }
                placeholder="Enter bank name"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />

            </div>


            {/* Account Number */}

            <div>

              <label className="text-slate-300 block mb-2">
                Account Number
              </label>

              <input
                type="text"
                value={company.accountNumber}
                onChange={(e) =>
                  handleChange(
                    "accountNumber",
                    e.target.value
                  )
                }
                placeholder="Enter account number"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />

            </div>


            {/* IFSC */}

            <div>

              <label className="text-slate-300 block mb-2">
                IFSC Code
              </label>

              <input
                type="text"
                value={company.ifsc}
                onChange={(e) =>
                  handleChange(
                    "ifsc",
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="Enter IFSC code"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-amber-400"
              />

            </div>


            {/* UPI */}

            <div>

              <label className="text-slate-300 block mb-2">
                UPI ID
              </label>

              <input
                type="text"
                value={company.upiId}
                onChange={(e) =>
                  handleChange(
                    "upiId",
                    e.target.value
                  )
                }
                placeholder="example@upi"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />

            </div>

          </div>

        </div>


        {/* =====================================
            INVOICE SETTINGS
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <FileText
              size={22}
              className="text-amber-400"
            />

            <h2 className="text-xl font-semibold text-amber-400">
              Invoice Settings
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            {/* Prefix */}

            <div>

              <label className="text-slate-300 block mb-2">
                Invoice Prefix
              </label>

              <input
                type="text"
                value={company.invoicePrefix}
                onChange={(e) =>
                  handleChange(
                    "invoicePrefix",
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="CP"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white uppercase focus:outline-none focus:border-amber-400"
              />

              <p className="text-slate-500 text-sm mt-2">
                Example: CP-2026-0001
              </p>

            </div>


            {/* Starting Number */}

            <div>

              <label className="text-slate-300 block mb-2">
                Starting Invoice Number
              </label>

              <input
                type="number"
                min="1"
                value={company.startingInvoice}
                onChange={(e) =>
                  handleChange(
                    "startingInvoice",
                    Number(e.target.value)
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />

            </div>

          </div>


          {/* Terms */}

          <div className="mt-6">

            <label className="text-slate-300 block mb-2">
              Terms & Conditions
            </label>

            <textarea
              rows={5}
              value={company.terms}
              onChange={(e) =>
                handleChange(
                  "terms",
                  e.target.value
                )
              }
              placeholder="Enter your quotation terms and conditions..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-amber-400"
            />

          </div>


          {/* Footer */}

          <div className="mt-6">

            <label className="text-slate-300 block mb-2">
              Footer Message
            </label>

            <textarea
              rows={3}
              value={company.footer}
              onChange={(e) =>
                handleChange(
                  "footer",
                  e.target.value
                )
              }
              placeholder="Thank you for your business."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-amber-400"
            />

          </div>

        </div>


        {/* =====================================
            SIGNATURE
        ====================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

          <div className="flex items-center gap-3 mb-6">

            <PenLine
              size={22}
              className="text-amber-400"
            />

            <h2 className="text-xl font-semibold text-amber-400">
              Authorized Signature
            </h2>

          </div>


          <div className="flex flex-col md:flex-row gap-6 items-start">

            <div className="w-56 h-32 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center overflow-hidden">

              {company.signature ? (

                <img
                  src={company.signature}
                  alt="Authorized Signature"
                  className="max-w-full max-h-full object-contain"
                />

              ) : (

                <div className="text-slate-500 text-sm text-center">
                  No signature selected
                </div>

              )}

            </div>


            <div>

              <label className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 py-3 rounded-xl cursor-pointer">

                <Upload size={18} />

                Upload Signature

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(
                      "signature",
                      e.target.files[0]
                    )
                  }
                />

              </label>

              <p className="text-slate-500 text-sm mt-2">
                PNG, JPG or WEBP. Maximum 2 MB.
              </p>

            </div>

          </div>

        </div>


        {/* =====================================
            SAVE BUTTON
        ====================================== */}

        <div className="flex justify-end pb-10">

          <button
            onClick={saveCompany}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-xl flex items-center gap-2 transition"
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
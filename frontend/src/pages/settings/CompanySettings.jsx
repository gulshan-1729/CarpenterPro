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

import { companyAPI } from "../../services/api";


// ==========================================
// DEFAULT COMPANY
// ==========================================

const DEFAULT_COMPANY = {
  companyName: "Sharma Interiors & Furniture",
  ownerName: "Ayodhya Sharma",

  phone: "",
  email: "",
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


// ==========================================
// API → FRONTEND
// ==========================================

const mapApiToCompany = (data) => {
  return {
    ...DEFAULT_COMPANY,

    companyName:
      data?.company_name ??
      DEFAULT_COMPANY.companyName,

    ownerName:
      data?.owner_name ??
      DEFAULT_COMPANY.ownerName,

    phone:
      data?.phone ??
      DEFAULT_COMPANY.phone,

    email:
      data?.email ??
      DEFAULT_COMPANY.email,

    website:
      data?.website ??
      DEFAULT_COMPANY.website,

    gst:
      data?.gst ??
      DEFAULT_COMPANY.gst,

    address:
      data?.address ??
      DEFAULT_COMPANY.address,

    logo:
      data?.logo ??
      DEFAULT_COMPANY.logo,

    signature:
      data?.signature ??
      DEFAULT_COMPANY.signature,

    bankName:
      data?.bank_name ??
      DEFAULT_COMPANY.bankName,

    accountNumber:
      data?.account_number ??
      DEFAULT_COMPANY.accountNumber,

    ifsc:
      data?.ifsc ??
      DEFAULT_COMPANY.ifsc,

    upiId:
      data?.upi_id ??
      DEFAULT_COMPANY.upiId,

    invoicePrefix:
      data?.invoice_prefix ??
      DEFAULT_COMPANY.invoicePrefix,

    startingInvoice:
      data?.starting_invoice ??
      DEFAULT_COMPANY.startingInvoice,

    terms:
      data?.terms ??
      DEFAULT_COMPANY.terms,

    footer:
      data?.footer ??
      DEFAULT_COMPANY.footer,
  };
};


// ==========================================
// FRONTEND → API
// ==========================================

const mapCompanyToApi = (company) => {
  return {
    company_name:
      company.companyName?.trim() || "",

    owner_name:
      company.ownerName?.trim() || "",

    phone:
      company.phone?.trim() || "",

    email:
      company.email?.trim() || "",

    website:
      company.website?.trim() || "",

    gst:
      company.gst?.trim().toUpperCase() || "",

    address:
      company.address?.trim() || "",

    logo:
      company.logo || "",

    signature:
      company.signature || "",

    bank_name:
      company.bankName?.trim() || "",

    account_number:
      company.accountNumber?.trim() || "",

    ifsc:
      company.ifsc?.trim().toUpperCase() || "",

    upi_id:
      company.upiId?.trim() || "",

    invoice_prefix:
      company.invoicePrefix?.trim().toUpperCase() || "CP",

    starting_invoice:
      Number(company.startingInvoice) || 1,

    terms:
      company.terms || "",

    footer:
      company.footer || "",
  };
};


// ==========================================
// COMPONENT
// ==========================================

const CompanySettings = () => {

  const [company, setCompany] =
    useState(DEFAULT_COMPANY);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // ==========================================
  // LOAD COMPANY SETTINGS
  // ==========================================

  useEffect(() => {

    const loadCompany = async () => {

      try {

        setLoading(true);

        const data =
          await companyAPI.get();

        setCompany(
          mapApiToCompany(data)
        );

      } catch (error) {

        console.error(
          "Failed to load company settings:",
          error
        );

        toast.error(
          error.message ||
          "Failed to load company details."
        );

      } finally {

        setLoading(false);

      }

    };

    loadCompany();

  }, []);


  // ==========================================
  // HANDLE FIELD CHANGE
  // ==========================================

  const handleChange = (
    field,
    value
  ) => {

    setCompany((prev) => ({
      ...prev,
      [field]: value,
    }));

  };


  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  const handleImageUpload = (
    field,
    file
  ) => {

    if (!file) {
      return;
    }


    // ------------------------------------------
    // File Type
    // ------------------------------------------

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      toast.error(
        "Please select a valid image file."
      );

      return;
    }


    // ------------------------------------------
    // Maximum 2 MB
    // ------------------------------------------

    const maxSize =
      2 * 1024 * 1024;

    if (file.size > maxSize) {

      toast.error(
        "Image size should be less than 2 MB."
      );

      return;
    }


    // ------------------------------------------
    // Convert to Base64
    // ------------------------------------------

    const reader =
      new FileReader();

    reader.onloadend = () => {

      setCompany((prev) => ({
        ...prev,
        [field]:
          reader.result,
      }));

    };

    reader.onerror = () => {

      toast.error(
        "Failed to read image."
      );

    };

    reader.readAsDataURL(file);

  };


  // ==========================================
  // SAVE COMPANY
  // ==========================================

  const saveCompany = async () => {

    try {

      setSaving(true);


      // ----------------------------------------
      // Basic Validation
      // ----------------------------------------

      if (
        !company.companyName.trim()
      ) {

        toast.error(
          "Company name is required."
        );

        return;
      }


      // ----------------------------------------
      // API Payload
      // ----------------------------------------

      const payload =
        mapCompanyToApi(
          company
        );


      // ----------------------------------------
      // Save to Django
      // ----------------------------------------

      const data =
        await companyAPI.update(
          payload
        );


      // ----------------------------------------
      // Update State
      // ----------------------------------------

      const updatedCompany =
        mapApiToCompany(data);

      setCompany(
        updatedCompany
      );


      // ----------------------------------------
      // Notify Other Components
      // ----------------------------------------

      window.dispatchEvent(
        new Event(
          "companyProfileUpdated"
        )
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
        error.message ||
        "Unable to save company details."
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <MainLayout>

      <div className="max-w-5xl mx-auto">

        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-white flex items-center gap-3">

            <Building2
              className="text-amber-400"
            />

            Company Settings

          </h1>

          <p className="text-slate-400 mt-2">

            Manage your business information used
            in quotations, invoices and PDF exports.

          </p>

        </div>


        {/* =====================================
            LOADING
        ====================================== */}

        {loading && (

          <div className="mb-6 bg-slate-900 border border-slate-800 rounded-2xl p-4">

            <p className="text-slate-400">

              Loading company settings...

            </p>

          </div>

        )}


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
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(
                      "logo",
                      e.target.files?.[0]
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
                    Number(
                      e.target.value
                    )
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
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(
                      "signature",
                      e.target.files?.[0]
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
            disabled={
              loading ||
              saving
            }
            className="
              bg-amber-500
              hover:bg-amber-600
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-black
              font-semibold
              px-8
              py-3
              rounded-xl
              flex
              items-center
              gap-2
              transition
            "
          >

            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Company Details"}

          </button>

        </div>

      </div>

    </MainLayout>
  );
};

export default CompanySettings;
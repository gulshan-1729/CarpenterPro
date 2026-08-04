import {
  FileDown,
  FileSpreadsheet,
  Printer,
} from "lucide-react";

const ExportSection = ({
  onExportPDF,
  onExportExcel,
  onPrint,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-10">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-white">
          📤 Export Reports
        </h2>

        <p className="text-slate-400 mt-1">
          Export or print your business reports.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* PDF */}

        <button
          onClick={onExportPDF}
          className="flex items-center justify-center gap-3 rounded-xl bg-red-600 hover:bg-red-700 transition-all p-5 text-white font-semibold shadow-lg"
        >
          <FileDown size={22} />

          Export PDF
        </button>

        {/* Excel */}

        <button
          onClick={onExportExcel}
          className="flex items-center justify-center gap-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-all p-5 text-white font-semibold shadow-lg"
        >
          <FileSpreadsheet size={22} />

          Export Excel
        </button>

        {/* Print */}

        <button
          onClick={onPrint}
          className="flex items-center justify-center gap-3 rounded-xl bg-sky-600 hover:bg-sky-700 transition-all p-5 text-white font-semibold shadow-lg"
        >
          <Printer size={22} />

          Print Report
        </button>

      </div>

    </div>
  );
};

export default ExportSection;
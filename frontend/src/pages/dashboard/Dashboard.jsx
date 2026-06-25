import MainLayout from "../../components/layout/MainLayout";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-slate-900 rounded-2xl p-6">
          <h3 className="text-slate-400">Customers</h3>
          <p className="text-3xl text-white font-bold mt-2">
            125
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6">
          <h3 className="text-slate-400">Furniture</h3>
          <p className="text-3xl text-white font-bold mt-2">
            18
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6">
          <h3 className="text-slate-400">Quotations</h3>
          <p className="text-3xl text-white font-bold mt-2">
            340
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6">
          <h3 className="text-slate-400">Revenue</h3>
          <p className="text-3xl text-green-400 font-bold mt-2">
            ₹4.5L
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
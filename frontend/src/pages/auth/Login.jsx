import { motion } from "framer-motion";
import { Hammer } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 rounded-2xl bg-amber-500/20 mb-4">
              <Hammer className="w-10 h-10 text-amber-400" />
            </div>

            <h1 className="text-4xl font-bold text-white">
              CarpenterPro
            </h1>

            <p className="text-slate-400 mt-2 text-center">
              Smart Furniture Quotation System
            </p>
          </div>

          <form className="space-y-5">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
            />

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 transition-all duration-300 py-4 rounded-xl font-semibold text-black"
            >
              Sign In
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
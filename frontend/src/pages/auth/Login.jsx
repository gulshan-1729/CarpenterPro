import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Hammer,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Sofa,
  BedDouble,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api";

const furnitureSlides = [
  {
    title: "Design Beautiful Spaces",
    description:
      "Create professional furniture quotations quickly and easily.",
    icon: Sofa,
  },
  {
    title: "Quote With Confidence",
    description:
      "Calculate area, rates, quantities and final amounts with ease.",
    icon: Ruler,
  },
  {
    title: "Manage Every Project",
    description:
      "Keep your customers, furniture and quotations organized.",
    icon: BedDouble,
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [activeSlide, setActiveSlide] = useState(0);

  // -----------------------------------------
  // Furniture slider
  // -----------------------------------------

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveSlide((current) => {
        if (current >= furnitureSlides.length - 1) {
          return 0;
        }

        return current + 1;
      });
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeSlide]);

  // -----------------------------------------
  // Login
  // -----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // -------------------------
    // Frontend validation
    // -------------------------

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    // -------------------------
    // Django Login API
    // -------------------------

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      // -------------------------
      // Django error
      // -------------------------

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Invalid email or password."
        );
      }

      // -------------------------
      // Store authentication
      // -------------------------

      login({
      access: data.access,
      refresh: data.refresh,
      user: data.user,
      rememberMe,
     });

     toast.success("Login successful!");

      // -------------------------
      // Redirect
      // -------------------------

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Unable to login. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Forgot Password
  // -----------------------------------------

  const handleForgotPassword = () => {
    setError(
      "Forgot password will be connected with Django authentication."
    );
  };

  const slide = furnitureSlides[activeSlide];

  const SlideIcon = slide.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* =========================================
          BACKGROUND EFFECTS
      ========================================= */}

      <div className="fixed inset-0 pointer-events-none">

        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />

      </div>

      {/* =========================================
          MAIN CONTAINER
      ========================================= */}

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">

        <div className="w-full max-w-6xl">

          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* =========================================
                LEFT SIDE - FURNITURE SHOWCASE
            ========================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: -60,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="hidden lg:flex min-h-[650px] relative"
            >

              <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 overflow-hidden relative">

                {/* Decorative Circle */}

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -right-32 -top-32 w-80 h-80 rounded-full border border-amber-400/10"
                />

                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -left-40 -bottom-40 w-96 h-96 rounded-full border border-white/5"
                />

                {/* Logo */}

                <div className="relative z-10 flex items-center gap-3 mb-16">

                  <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/20">

                    <Hammer
                      className="w-7 h-7 text-amber-400"
                    />

                  </div>

                  <div>

                    <h2 className="text-2xl font-bold">
                      CarpenterPro
                    </h2>

                    <p className="text-xs text-slate-500">
                      SMART FURNITURE MANAGEMENT
                    </p>

                  </div>

                </div>

                {/* Main Furniture Visual */}

                <div className="relative z-10 flex justify-center items-center h-64">

                  <AnimatePresence mode="wait">

                    <motion.div
                      key={activeSlide}
                      initial={{
                        opacity: 0,
                        scale: 0.7,
                        y: 30,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.7,
                        y: -30,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                      className="flex flex-col items-center"
                    >

                      <motion.div
                        animate={{
                          y: [0, -12, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-40 h-40 rounded-[2rem] bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-400/20 flex items-center justify-center shadow-2xl shadow-amber-500/10"
                      >

                        <SlideIcon
                          className="w-20 h-20 text-amber-400"
                          strokeWidth={1.2}
                        />

                      </motion.div>

                    </motion.div>

                  </AnimatePresence>

                </div>

                {/* Text */}

                <div className="relative z-10 text-center mt-6">

                  <AnimatePresence mode="wait">

                    <motion.div
                      key={activeSlide}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                    >

                      <h1 className="text-3xl font-bold">
                        {slide.title}
                      </h1>

                      <p className="text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
                        {slide.description}
                      </p>

                    </motion.div>

                  </AnimatePresence>

                </div>

                {/* Slide Indicators */}

                <div className="relative z-10 flex justify-center gap-2 mt-8">

                  {furnitureSlides.map(
                    (_, index) => (

                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          setActiveSlide(index)
                        }
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeSlide === index
                            ? "w-8 bg-amber-400"
                            : "w-2 bg-slate-700"
                        }`}
                      />

                    )
                  )}

                </div>

                {/* Features */}

                <div className="relative z-10 grid grid-cols-3 gap-3 mt-12">

                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 text-center">

                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />

                    <p className="text-xs text-slate-400">
                      Smart Quotes
                    </p>

                  </div>

                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 text-center">

                    <Ruler className="w-5 h-5 text-amber-400 mx-auto mb-2" />

                    <p className="text-xs text-slate-400">
                      Easy Calculations
                    </p>

                  </div>

                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 text-center">

                    <ShieldCheck className="w-5 h-5 text-blue-400 mx-auto mb-2" />

                    <p className="text-xs text-slate-400">
                      Secure
                    </p>

                  </div>

                </div>

              </div>

            </motion.div>

            {/* =========================================
                RIGHT SIDE - LOGIN
            ========================================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: 60,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="w-full"
            >

              <div className="w-full max-w-md mx-auto">

                {/* Mobile Branding */}

                <div className="lg:hidden flex flex-col items-center mb-8">

                  <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/20 mb-4">

                    <Hammer className="w-10 h-10 text-amber-400" />

                  </div>

                  <h1 className="text-3xl font-bold">
                    CarpenterPro
                  </h1>

                  <p className="text-slate-500 text-sm mt-1">
                    Smart Furniture Quotation System
                  </p>

                </div>

                {/* Login Card */}

                <div className="backdrop-blur-2xl bg-white/[0.045] border border-white/10 rounded-[2rem] p-7 sm:p-9 shadow-2xl">

                  {/* Heading */}

                  <div className="mb-8">

                    <p className="text-amber-400 text-sm font-medium mb-2">
                      Welcome back
                    </p>

                    <h2 className="text-3xl font-bold">
                      Sign in to your account
                    </h2>

                    <p className="text-slate-500 text-sm mt-2">
                      Manage your furniture business from one place.
                    </p>

                  </div>

                  {/* Error */}

                  <AnimatePresence>

                    {error && (

                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        className="mb-5 overflow-hidden"
                      >

                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                          {error}
                        </div>

                      </motion.div>

                    )}

                  </AnimatePresence>

                  {/* Form */}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >

                    {/* Email */}

                    <div>

                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address
                      </label>

                      <div className="relative">

                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder:text-slate-600 outline-none transition-all duration-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                        />

                      </div>

                    </div>

                    {/* Password */}

                    <div>

                      <div className="flex items-center justify-between mb-2">

                        <label className="text-sm font-medium text-slate-300">
                          Password
                        </label>

                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          Forgot password?
                        </button>

                      </div>

                      <div className="relative">

                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                        <input
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="w-full pl-12 pr-12 py-4 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder:text-slate-600 outline-none transition-all duration-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (prev) => !prev
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >

                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}

                        </button>

                      </div>

                    </div>

                    {/* Remember Me */}

                    <div className="flex items-center justify-between">

                      <label className="flex items-center gap-3 cursor-pointer">

                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) =>
                            setRememberMe(
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 accent-amber-500 cursor-pointer"
                        />

                        <span className="text-sm text-slate-400">
                          Remember me
                        </span>

                      </label>

                    </div>

                    {/* Login Button */}

                    <motion.button
                      whileHover={{
                        scale: loading ? 1 : 1.01,
                      }}
                      whileTap={{
                        scale: loading ? 1 : 0.98,
                      }}
                      type="submit"
                      disabled={loading}
                      className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-700 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
                    >

                      {loading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />

                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In

                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}

                    </motion.button>

                  </form>

                  {/* Divider */}

                  <div className="flex items-center gap-4 my-7">

                    <div className="h-px flex-1 bg-slate-800" />

                    <span className="text-xs text-slate-600">
                      NEW TO CARPENTERPRO?
                    </span>

                    <div className="h-px flex-1 bg-slate-800" />

                  </div>

                  {/* Signup */}

                  <Link
                    to="/signup"
                    className="w-full border border-slate-700 hover:border-amber-500/50 hover:bg-amber-500/5 text-white py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >

                    Create a new account

                    <ArrowRight className="w-4 h-4 text-amber-400" />

                  </Link>

                  {/* Footer */}

                  <p className="text-center text-xs text-slate-600 mt-7">

                    © {new Date().getFullYear()} CarpenterPro.
                    All rights reserved.

                  </p>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
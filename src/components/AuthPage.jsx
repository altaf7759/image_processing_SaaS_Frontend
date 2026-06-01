import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
      const [isSignUp, setIsSignUp] = useState(false);
      const [formData, setFormData] = useState({ name: '', email: '', password: '', terms: false });
      const [authSuccess, setAuthSuccess] = useState(false);
      const { user, setUser } = useAuth()
      const navigate = useNavigate()
      const { VITE_BACKEND_URL } = import.meta.env;

      useEffect(() => {
            if (user !== null) {
                  navigate("/dashboard")
            }
      }, [user, setUser])

      const handleInputChange = (e) => {
            const { name, value, type, checked } = e.target;
            setFormData(prev => ({
                  ...prev,
                  [name]: type === 'checkbox' ? checked : value
            }));
      };

      const handleAuthSubmit = async (e) => {
            e.preventDefault();
            setAuthSuccess(true);

            const apiEndPoint = isSignUp ? "/api/auth/register" : "/api/auth/login";

            // Flatten the payload out so it matches your backend requirements perfectly!
            const payload = isSignUp
                  ? { name: formData.name, email: formData.email, password: formData.password }
                  : { email: formData.email, password: formData.password };

            try {
                  // Aligned to port 3000 to match your working Postman environment
                  const response = await fetch(VITE_BACKEND_URL + apiEndPoint, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                              "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload)
                  });

                  const data = await response.json();

                  if (!response.ok) {
                        throw new Error(data.message || "Authentication failed.");
                  }

                  localStorage.setItem("user", JSON.stringify(data.user));
                  setUser(data.user);

                  if (isSignUp) {
                        setIsSignUp(false)
                  } else {
                        navigate("/dashboard")
                  }

            } catch (error) {
                  console.error("Auth Error:", error);
                  alert(error.message || "Authentication failed.");
            } finally {
                  setAuthSuccess(false);
            }
      };

      const featureCrops = [
            { label: 'youtube_thumbnail', aspect: 'aspect-[16/9]', color: 'from-pink-500 to-rose-500' },
            { label: 'instagram_square', aspect: 'aspect-square max-w-[100px]', color: 'from-indigo-500 to-purple-500' },
            { label: 'instagram_story', aspect: 'aspect-[9/16] h-28', color: 'from-amber-400 to-orange-500' }
      ];

      return (
            // STRICT VIEWPORT LOCK: Ensures zero ugly window scrolling on desktop screens
            <div className="min-h-screen lg:h-screen lg:max-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-50 selection:text-indigo-600 flex items-center justify-center lg:overflow-hidden p-0 sm:p-4 lg:p-8">

                  {/* MAX-WIDTH ALIGNMENT: Uses max-w-7xl and a 12-column template grid 
        to perfectly mirror the layout structure of your home screen! 
      */}
                  <div className="w-full max-w-7xl h-full lg:max-h-[85vh] bg-white lg:border lg:border-slate-200/80 rounded-2xl lg:shadow-xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

                        {/* --- LEFT PANEL: AUTH INTERFACE INPUT FRAME --- */}
                        <div className="col-span-1 lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 bg-white h-full overflow-y-auto">

                              {/* Logo Branding */}
                              <div className="flex items-center space-x-2 shrink-0">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-200">
                                          Pp
                                    </div>
                                    <span className="font-bold text-lg tracking-tight text-slate-900">PixelPipe</span>
                              </div>

                              {/* Central Input Flow Controls */}
                              <div className="w-full max-w-sm mx-auto my-auto py-6">
                                    {authSuccess ? (
                                          <div className="text-center space-y-4">
                                                <div className="h-11 w-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">✓</div>
                                                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                                                      {isSignUp ? 'Account initialized!' : 'Welcome back!'}
                                                </h2>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                      {isSignUp
                                                            ? 'Your asset generation processing metrics are synchronized. Preparing your dashboard...'
                                                            : 'Authentication verified. Launching processing engines...'}
                                                </p>
                                                <div className="inline-block w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mt-4"></div>
                                          </div>
                                    ) : (
                                          <div>
                                                <div className="space-y-1.5 mb-6">
                                                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                                            {isSignUp ? 'Create your account' : 'Sign in to PixelPipe'}
                                                      </h2>
                                                      <p className="text-xs text-slate-400 font-medium">
                                                            {isSignUp ? 'Get 10 daily image transformations free' : 'Access your automated image processing pipelines'}
                                                      </p>
                                                </div>

                                                <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                                                      {isSignUp && (
                                                            <div className="space-y-1">
                                                                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                                                                  <input
                                                                        required
                                                                        type="text"
                                                                        name="name"
                                                                        value={formData.name}
                                                                        onChange={handleInputChange}
                                                                        className="w-full bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm focus:outline-none transition-all"
                                                                        placeholder="Altaf Raja"
                                                                  />
                                                            </div>
                                                      )}

                                                      <div className="space-y-1">
                                                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Work Email</label>
                                                            <input
                                                                  required
                                                                  type="email"
                                                                  name="email"
                                                                  value={formData.email}
                                                                  onChange={handleInputChange}
                                                                  className="w-full bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm focus:outline-none transition-all"
                                                                  placeholder="name@company.com"
                                                            />
                                                      </div>

                                                      <div className="space-y-1">
                                                            <div className="flex justify-between items-center">
                                                                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                                                                  {!isSignUp && (
                                                                        <a href="#forgot" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot?</a>
                                                                  )}
                                                            </div>
                                                            <input
                                                                  required
                                                                  type="password"
                                                                  name="password"
                                                                  value={formData.password}
                                                                  onChange={handleInputChange}
                                                                  className="w-full bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-sm focus:outline-none transition-all"
                                                                  placeholder="••••••••"
                                                            />
                                                      </div>

                                                      {isSignUp && (
                                                            <div className="flex items-start space-x-2 pt-0.5">
                                                                  <input
                                                                        required
                                                                        type="checkbox"
                                                                        id="terms"
                                                                        name="terms"
                                                                        checked={formData.terms}
                                                                        onChange={handleInputChange}
                                                                        className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/10 transition-colors cursor-pointer"
                                                                  />
                                                                  <label htmlFor="terms" className="text-[11px] text-slate-400 leading-tight select-none cursor-pointer">
                                                                        I agree to the <a href="#terms" className="text-slate-600 font-medium underline">Terms</a> and <a href="#privacy" className="text-slate-600 font-medium underline">Privacy</a>.
                                                                  </label>
                                                            </div>
                                                      )}

                                                      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-md shadow-indigo-100 transform hover:-translate-y-0.5 mt-2">
                                                            {isSignUp ? 'Initialize Pipeline Account' : 'Authenticate Dashboard'}
                                                      </button>
                                                </form>

                                                <div className="mt-5 text-center">
                                                      <p className="text-xs font-medium text-slate-400">
                                                            {isSignUp ? 'Already registered with PixelPipe?' : 'New to our processing pipeline?'}
                                                            <button
                                                                  onClick={() => { setIsSignUp(!isSignUp); setAuthSuccess(false); }}
                                                                  className="ml-1 text-indigo-600 font-bold hover:text-indigo-700 focus:outline-none transition-colors"
                                                            >
                                                                  {isSignUp ? 'Sign In' : 'Create Account'}
                                                            </button>
                                                      </p>
                                                </div>
                                          </div>
                                    )}
                              </div>

                              {/* Footer Label */}
                              <div className="w-full text-center text-[10px] text-slate-400 font-medium tracking-wide shrink-0 pt-4">
                                    Made with <span className="text-rose-500 mx-0.5">❤️</span> by Altaf Raja
                              </div>
                        </div>

                        {/* --- RIGHT PANEL: MARKETING VISUAL FRAME --- */}
                        <div className="hidden lg:col-span-7 lg:flex flex-col justify-between bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-950 p-10 relative overflow-hidden h-full">

                              {/* Background Gradient Spotlights */}
                              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
                              <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>

                              {/* Header Metric */}
                              <div className="w-full flex justify-end relative z-10 text-[9px] font-mono text-indigo-400/80 tracking-widest font-bold">
                                    PIXELPIPE ENGINE ACTIVE // V2.0
                              </div>

                              {/* Central Graphical Feature Preview Showcase */}
                              <div className="max-w-sm mx-auto w-full space-y-6 relative z-10 my-auto">
                                    <div className="space-y-2 text-center lg:text-left">
                                          <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
                                                Accelerate asset delivery pipelines.
                                          </h3>
                                          <p className="text-xs text-slate-400 leading-relaxed">
                                                Join thousands of production developers automating cross-platform image transformations with strict center-weighted layout scaling.
                                          </p>
                                    </div>

                                    {/* Dashboard grid mock mimicking your actual crop output mechanics */}
                                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 backdrop-blur-xs shadow-2xl">
                                          <div className="grid grid-cols-2 gap-3 items-end">
                                                {featureCrops.map((crop, idx) => (
                                                      <div key={idx} className={`bg-white/[0.02] border border-white/5 rounded-lg p-2 space-y-1.5 ${crop.label === 'instagram_story' ? 'row-span-2 flex flex-col justify-between h-full' : ''}`}>
                                                            <div className="flex justify-between items-center">
                                                                  <span className="text-[8px] font-mono text-slate-400 truncate max-w-[85px]">{crop.label}</span>
                                                                  <span className="text-[7px] text-slate-500 bg-white/5 px-1 rounded">Auto</span>
                                                            </div>
                                                            <div className={`w-full rounded bg-gradient-to-tr ${crop.color} opacity-80 shadow-inner ${crop.aspect}`}></div>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>
                              </div>

                              {/* Social Proof Analytics */}
                              <div className="w-full flex items-center justify-between text-[9px] text-slate-500 font-medium font-mono relative z-10 border-t border-white/5 pt-4">
                                    <span>PROCESSED: 4.8M+ IMAGES</span>
                                    <span>UPTIME: 99.99%</span>
                              </div>

                        </div>
                  </div>

            </div>
      );
}
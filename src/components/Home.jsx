import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SaaSLandingPage() {
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      const [formSubmitted, setFormSubmitted] = useState(false);
      const [billingInterval, setBillingInterval] = useState('monthly');

      // Exact target crops styled precisely after your production engine results
      const previewVariants = [
            { name: 'facebook_feed', aspect: 'aspect-[1.91/1]', tag: 'Landscape', filter: '' },
            { name: 'instagram_square', aspect: 'aspect-square', tag: '1:1 Ratio', filter: '' },
            { name: 'instagram_story', aspect: 'aspect-[9/16] row-span-2', tag: '9:16 Story', filter: '' },
            { name: 'youtube_thumbnail', aspect: 'aspect-[16/9]', tag: '16:9 Thumbnail', filter: '' },
            { name: 'twitter_feed', aspect: 'aspect-[16/9]', tag: '16:9 Feed', filter: '' },
            { name: 'blur', aspect: 'aspect-[1.91/1]', tag: 'Soft Focus', filter: 'blur-[1.5px]' },
            { name: 'bw', aspect: 'aspect-[1.91/1]', tag: 'Monochrome', filter: 'grayscale contrast-115' },
      ];

      const pricingPlans = [
            {
                  name: 'Free',
                  description: 'Essential image formatting for getting your project off the ground.',
                  popular: false,
                  cta: 'Get Started',
                  href: '#signup',
                  features: ['10 daily image generations', 'Max file size: 5 MB', 'Total storage limit: 500 MB', 'Watermark enabled on exports', 'Standard processing priority'],
                  price: { monthly: '₹0', quarterly: '₹0', yearly: '₹0' }
            },
            {
                  name: 'Pro',
                  description: 'Our most popular tier for active content creators and indie brands.',
                  popular: true,
                  cta: 'Upgrade to Pro',
                  href: '#signup',
                  features: ['300 daily image generations', 'Max file size: 25 MB', 'Total storage limit: 10 GB', 'No watermarks', 'Elevated processing priority'],
                  price: { monthly: '₹499', quarterly: '₹1,399', yearly: '₹4,999' }
            },
            {
                  name: 'Business',
                  description: 'Heavy-duty processing frameworks for production teams and studios.',
                  popular: false,
                  cta: 'Contact Sales',
                  href: '#contact',
                  features: ['5,000 daily image generations', 'Max file size: 100 MB', 'Total storage limit: 100 GB', 'No watermarks', 'Top tier instant processing'],
                  price: { monthly: '₹1,999', quarterly: '₹5,499', yearly: '₹19,999' }
            }
      ];

      const handleContactSubmit = (e) => {
            e.preventDefault();
            setFormSubmitted(true);
      };

      const faceImageUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80";

      return (
            <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-50 selection:text-indigo-600 scroll-smooth">

                  {/* --- HERO CONTAINER (STRICT 100VH VIEWPORT MAX ON DESKTOP) --- */}
                  <div className="lg:h-screen lg:max-h-screen flex flex-col overflow-hidden relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/40 via-white to-white border-b border-slate-100">

                        {/* Navbar */}
                        <nav className="w-full bg-white/70 backdrop-blur-md border-b border-slate-100 px-6 py-3.5 z-50 shrink-0">
                              <div className="max-w-7xl mx-auto flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-200">Pp</div>
                                          <span className="font-bold text-lg tracking-tight text-slate-900">
                                                <Link to="/">PixelPipe</Link>
                                          </span>
                                    </div>

                                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                                          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
                                          <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
                                          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
                                    </div>

                                    <div className="hidden md:flex items-center space-x-4 text-sm font-medium">
                                          <a href="#login" className="text-slate-600 hover:text-slate-900 transition-colors">
                                                <Link to="/auth">Sign In</Link>
                                          </a>
                                          <a href="#signup" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-all shadow-sm">
                                                <Link to="/auth">Start Free</Link>
                                          </a>
                                    </div>

                                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1 text-slate-600 hover:text-slate-900 focus:outline-none transition-colors">
                                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                {mobileMenuOpen ? (
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                ) : (
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                                )}
                                          </svg>
                                    </button>
                              </div>

                              {/* Mobile Drawer */}
                              {mobileMenuOpen && (
                                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-lg px-6 py-4 flex flex-col space-y-3 z-50">
                                          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-slate-900 py-1">Features</a>
                                          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-slate-900 py-1">Contact</a>
                                          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-slate-900 py-1">Pricing</a>
                                          <div className="border-t border-slate-100 pt-3 flex flex-col space-y-2">
                                                <a href="#login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center text-base font-medium text-slate-600 hover:text-slate-900 py-2">
                                                      <Link to="/auth">Sign In</Link>
                                                </a>
                                                <a href="#signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base py-2.5 rounded-xl shadow-sm">
                                                      <Link to="/auth">Start Free</Link>
                                                </a>
                                          </div>
                                    </div>
                              )}
                        </nav>

                        {/* Hero Main Content Block */}
                        <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-6 py-4 min-h-0">

                              {/* Left Text Presentation */}
                              <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left z-10 shrink-0">
                                    <div className="inline-flex items-center mx-auto lg:mx-0 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-indigo-100">
                                          ✨ Intelligent Aspect Ratio Automation
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                                          One file dropped.<br />Every platform crop <span className="text-indigo-600">deployed.</span>
                                    </h1>
                                    <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-sm mx-auto lg:mx-0 leading-relaxed">
                                          Upload your master photo once. Our pipeline handles center-weighted zooming and scale boundaries to output all native variants instantly.
                                    </p>

                                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                                          <a href="#signup" className="w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-100">
                                                <Link to="/auth">Upload Master Image</Link>
                                          </a>
                                          <a href="#pricing" className="w-full sm:w-auto text-center text-slate-600 hover:text-slate-900 font-medium text-sm px-4 py-2 rounded-xl transition-colors">
                                                View Price Limits
                                          </a>
                                    </div>
                              </div>

                              {/* Right Live Application Mockup Frame */}
                              <div className="lg:col-span-7 w-full h-full flex flex-col justify-center relative min-h-0 py-2 lg:py-6">

                                    <div className="w-full max-w-2xl flex justify-end mb-1 px-1 text-[10px] text-slate-400 font-medium tracking-wide">
                                          Made with <span className="text-rose-500 mx-0.5">❤️</span> by Altaf Raja
                                    </div>

                                    {/* Core Application Interface Dashboard Frame */}
                                    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden max-h-[460px] lg:max-h-[85vh]">
                                          <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between shrink-0">
                                                <div className="flex space-x-1.5">
                                                      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                                      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                                      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                                </div>
                                                <div className="bg-slate-200/50 text-[9px] text-slate-400 px-6 py-0.5 rounded font-mono truncate">pixelpipe.app/dashboard</div>
                                                <div className="w-10"></div>
                                          </div>

                                          {/* Dynamic Pipeline Content Stream - Hide ugly scrollbar tracks completely */}
                                          <div className="p-4 bg-slate-50/40 flex flex-col space-y-4 overflow-y-auto scrollbar-none style-scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                                                {/* Master Context Source Box */}
                                                <div className="w-full max-w-xs mx-auto bg-white border border-dashed border-slate-200 rounded-xl p-3 flex flex-col items-center shrink-0 shadow-xs">
                                                      <span className="text-[9px] font-mono text-slate-400 mb-1.5">master_source_photo.jpg</span>
                                                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-100">
                                                            <img src={faceImageUrl} alt="Input Track" className="w-full h-full object-cover" />
                                                      </div>
                                                      <span className="mt-1.5 text-[9px] text-emerald-600 font-bold flex items-center">
                                                            <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1 animate-pulse"></span> Processing Complete
                                                      </span>
                                                </div>

                                                {/* Grid Framework dynamically rendering accurate center-crops */}
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-start">
                                                      {previewVariants.map((variant, index) => (
                                                            <div key={index} className={`bg-white border border-slate-100 rounded-xl p-2.5 flex flex-col justify-between shadow-xs ${variant.name === 'instagram_story' ? 'sm:row-span-2' : ''}`}>
                                                                  <div className="flex justify-between items-center mb-1.5">
                                                                        <span className="text-[9px] font-bold text-slate-800 truncate font-mono">{variant.name}</span>
                                                                        <span className="text-[8px] bg-slate-100 text-slate-400 px-1 py-0.5 rounded scale-95 font-medium">{variant.tag}</span>
                                                                  </div>

                                                                  {/* Scaled cover frame containers matching exact dimensions */}
                                                                  <div className={`w-full overflow-hidden rounded-lg bg-slate-100 border border-slate-200/40 relative ${variant.name === 'instagram_story' ? 'h-48 sm:h-56' : variant.aspect
                                                                        }`}>
                                                                        <img
                                                                              src={faceImageUrl}
                                                                              alt={variant.name}
                                                                              className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${variant.filter}`}
                                                                        />
                                                                  </div>

                                                                  <div className="mt-2">
                                                                        <button className="w-full text-center text-[9px] border border-slate-200 hover:bg-slate-50 py-1 rounded-md text-slate-600 font-semibold transition-colors">
                                                                              Download
                                                                        </button>
                                                                  </div>
                                                            </div>
                                                      ))}
                                                </div>

                                          </div>
                                    </div>

                              </div>
                        </div>
                  </div>

                  {/* --- MARKETING FEATURES --- */}
                  <section id="features" className="bg-white py-20 border-t border-slate-100">
                        <div className="max-w-5xl mx-auto px-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                          <div className="text-indigo-600 font-bold text-lg">⚡</div>
                                          <h3 className="font-semibold text-sm text-slate-900">Multi-Channel Scaling</h3>
                                          <p className="text-xs text-slate-500 leading-relaxed">Instantly transform editorial imagery, design vectors, or product mockups into any digital framework asset needed.</p>
                                    </div>
                                    <div className="space-y-2">
                                          <div className="text-indigo-600 font-bold text-lg">📦</div>
                                          <h3 className="font-semibold text-sm text-slate-900">Global Batch Export</h3>
                                          <p className="text-xs text-slate-500 leading-relaxed">Package all freshly generated outputs directly into a single organized archive ready for deployment.</p>
                                    </div>
                                    <div className="space-y-2">
                                          <div className="text-indigo-600 font-bold text-lg">🎨</div>
                                          <h3 className="font-semibold text-sm text-slate-900">Intelligent Focal Layouts</h3>
                                          <p className="text-xs text-slate-500 leading-relaxed">Keeps the core subject centered flawlessly across diverse canvas changes without manual micro-adjustments.</p>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* --- CONTACT SECTION --- */}
                  <section id="contact" className="bg-white py-20 border-t border-slate-100">
                        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                              <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Have questions? Let’s connect.</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
                                          Need custom volume configurations or automated API pipeline assistance? Connect with an account engineer today.
                                    </p>
                              </div>

                              <div className="lg:col-span-7 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-inner">
                                    {formSubmitted ? (
                                          <div className="text-center py-10 space-y-3">
                                                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                                                <h3 className="font-bold text-base text-slate-900">Message dispatched!</h3>
                                                <p className="text-xs text-slate-500">We will review your account pipeline specs and follow up under 2 hours.</p>
                                          </div>
                                    ) : (
                                          <form onSubmit={handleContactSubmit} className="space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                      <div className="space-y-1.5">
                                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                                                            <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Alex Carter" />
                                                      </div>
                                                      <div className="space-y-1.5">
                                                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Work Email</label>
                                                            <input required type="email" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" placeholder="alex@company.com" />
                                                      </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Message Details</label>
                                                      <textarea required rows="4" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none" placeholder="Tell us about your pipeline integration goals..."></textarea>
                                                </div>
                                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-md shadow-indigo-100">Send Message</button>
                                          </form>
                                    )}
                              </div>
                        </div>
                  </section>

                  {/* --- PRICING SECTION --- */}
                  <section id="pricing" className="bg-slate-50 py-24 border-t border-slate-200/60">
                        <div className="max-w-6xl mx-auto px-6">
                              <div className="text-center max-w-xl mx-auto mb-12">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Production pricing limits</h2>
                                    <p className="mt-3 text-slate-500 text-sm">Choose the generation velocity your pipeline demands. Toggle intervals below to find your sweet spot.</p>

                                    <div className="mt-6 inline-flex bg-slate-200/60 p-1 rounded-xl text-xs font-semibold text-slate-600">
                                          <button onClick={() => setBillingInterval('monthly')} className={`px-4 py-2 rounded-lg transition-all ${billingInterval === 'monthly' ? 'bg-white text-slate-950 shadow-sm' : 'hover:text-slate-900'}`}>Monthly</button>
                                          <button onClick={() => setBillingInterval('quarterly')} className={`px-4 py-2 rounded-lg transition-all ${billingInterval === 'quarterly' ? 'bg-white text-slate-950 shadow-sm' : 'hover:text-slate-900'}`}>Quarterly</button>
                                          <button onClick={() => setBillingInterval('yearly')} className={`px-4 py-2 rounded-lg transition-all ${billingInterval === 'yearly' ? 'bg-white text-slate-950 shadow-sm' : 'hover:text-slate-900'}`}>Yearly Plan</button>
                                    </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto pt-4">
                                    {pricingPlans.map((plan, index) => (
                                          <div key={index} className={`bg-white border rounded-2xl p-8 flex flex-col justify-between relative shadow-sm transition-all hover:shadow-md ${plan.popular ? 'border-indigo-600 ring-2 ring-indigo-600/10 scale-105 z-10' : 'border-slate-200'}`}>
                                                {plan.popular && (
                                                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Most Popular</span>
                                                )}
                                                <div>
                                                      <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                                                      <p className="text-xs text-slate-400 mt-1 min-h-[32px] leading-relaxed">{plan.description}</p>
                                                      <div className="mt-5 flex items-baseline text-slate-900">
                                                            <span className="text-4xl font-black tracking-tight">{plan.price[billingInterval]}</span>
                                                            <span className="text-slate-400 text-xs font-medium ml-1.5">/{billingInterval === 'monthly' ? 'mo' : billingInterval === 'quarterly' ? 'quarter' : 'year'}</span>
                                                      </div>
                                                      <div className="border-t border-slate-100 my-6" />
                                                      <ul className="space-y-3.5">
                                                            {plan.features.map((feature, idx) => (
                                                                  <li key={idx} className="flex items-start text-xs text-slate-600">
                                                                        <svg className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                                        <span>{feature}</span>
                                                                  </li>
                                                            ))}
                                                      </ul>
                                                </div>
                                                <a href={plan.href} className={`mt-8 w-full py-3 rounded-xl text-xs font-bold text-center block transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100' : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'}`}>
                                                      {plan.cta}
                                                </a>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* --- FOOTER --- */}
                  <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-medium">
                        &copy; {new Date().getFullYear()} PixelPipe. All rights reserved.
                  </footer>

            </div>
      );
}
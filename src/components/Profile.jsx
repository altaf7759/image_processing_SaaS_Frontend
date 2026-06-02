import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Helper to convert bytes to human-readable formats
const formatBytes = (bytes, decimals = 2) => {
      if (!bytes || parseInt(bytes) === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(parseInt(bytes)) / Math.log(k));
      return parseFloat((parseInt(bytes) / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function UserProfileDashboard() {
      // State management
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [billingInterval, setBillingInterval] = useState('monthly'); // 'monthly' | 'quarterly' | 'yearly'
      const { user } = useAuth()
      const navigate = useNavigate()
      const { VITE_BACKEND_URL } = import.meta.env;

      // New state to manage button loading during an active API upgrade request
      const [isUpgrading, setIsUpgrading] = useState(false);

      useEffect(() => {
            if (user === null || localStorage.getItem("user") === null) {
                  navigate("/auth")
            }
      }, [user, navigate]);

      // Fetch profile data on component mount
      const fetchProfileData = async () => {
            try {
                  if (user === null || user.id === null || localStorage.getItem("user") === null || user.id === undefined) return
                  setLoading(true);
                  const response = await fetch(`${VITE_BACKEND_URL}/api/profile/${user.id}`, {
                        method: "GET",
                        credentials: "include"
                  });

                  if (!response.ok) {
                        throw new Error(`Failed to fetch profile data: ${response.statusText}`);
                  }

                  const json = await response.json();
                  setData(json.profileData);
            } catch (err) {
                  setError(err.message);
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchProfileData();
      }, [user]);

      // ASYNCHRONOUS HANDLER FOR TIER UPGRADE INTERACTION
      const handlePlanAction = async (planName, targetPlanId, isCurrentPlan) => {
            if (isCurrentPlan) return;

            // Confirm action with user
            const confirmUpgrade = window.confirm(`Are you sure you want to change your membership tier to the ${planName} plan?`);
            if (!confirmUpgrade) return;

            try {
                  setIsUpgrading(true);

                  // Firing request to your custom backend service API gateway path
                  const response = await fetch(`${VITE_BACKEND_URL}/api/subscriptions/${targetPlanId}`, {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json'
                        },
                        credentials: "include",
                        body: JSON.stringify({
                              auto_renew: false
                        }),
                  });

                  if (!response.ok) {
                        throw new Error(`Upgrade operation rejected by remote host server. Status: ${response.status}`);
                  }

                  alert(`Success! Successfully requested transformation to the ${planName} framework tier.`);

                  // Re-trigger core data sync function loop to automatically update values on screen without page refresh
                  await fetchProfileData();

            } catch (err) {
                  console.error("Critical Intercept during subscription tier adjustment sync:", err);
                  alert(`Subscription process failed: ${err.message}`);
            } finally {
                  setIsUpgrading(false);
            }
      };

      // 1. Loading State Screen
      if (loading) {
            return (
                  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-sm font-medium text-gray-600">Retrieving account configuration...</p>
                  </div>
            );
      }

      // 2. Error State Screen
      if (error) {
            return (
                  <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
                        <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-sm border border-red-100 text-center">
                              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">Data Fetch Failed</h3>
                              <p className="mt-1 text-sm text-gray-500">{error}</p>
                              <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition"
                              >
                                    Retry Connection
                              </button>
                        </div>
                  </div>
            );
      }

      if (!data) return null;

      // Destructure payload data
      const { activePlanName, plansWithPrices, activePlansDetails, usage, history } = data;

      // Extract real-time usage status metrics
      const currentUsage = usage[0] || { jobs_used: 0, storage_snapshot_bytes: 0, api_requests: 0 };
      const storageLimit = activePlansDetails.storage_limit_bytes;
      const storageUsed = activePlansDetails.storage_used_bytes;

      // Percentages for dashboard usage circles
      const storagePercent = Math.min(((parseInt(storageUsed) / parseInt(storageLimit)) * 100), 100).toFixed(1);
      const jobsPercent = Math.min(((currentUsage.jobs_used / activePlansDetails.daily_jobs_limit) * 100), 100).toFixed(1);

      // Isolate distinct tiers
      const uniquePlanNames = [...new Set(plansWithPrices.map(p => p.name))];

      return (
            <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased selection:bg-indigo-100">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                        {/* HEADER SECTION */}
                        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                              <div>
                                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Overview</h1>
                                    <p className="mt-1 text-sm text-gray-500">Manage your subscription tier, monitor resource limits, and track output files.</p>
                              </div>
                              <div className="flex items-center gap-2">
                                    <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-md">
                                          {activePlanName[0]?.name} Tier
                                    </span>
                                    <span className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-md uppercase tracking-wider">
                                          {activePlansDetails.status}
                                    </span>
                              </div>
                        </header>

                        {/* METRICS & CURRENT USAGE GRID */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                              {/* Processing Jobs Card */}
                              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                                    <div>
                                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Daily Processing Jobs</h3>
                                          <div className="text-3xl font-bold text-gray-900">
                                                {currentUsage.jobs_used} <span className="text-sm font-normal text-gray-400">/ {activePlansDetails.daily_jobs_limit}</span>
                                          </div>
                                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-4">
                                                <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${jobsPercent}%` }}></div>
                                          </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-4">
                                          {Math.max(0, activePlansDetails.daily_jobs_limit - currentUsage.jobs_used)} jobs remaining today.
                                    </p>
                              </div>

                              {/* Cloud Storage Card */}
                              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                                    <div>
                                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cloud Storage Utilization</h3>
                                          <div className="text-3xl font-bold text-gray-900">
                                                {formatBytes(storageUsed)} <span className="text-sm font-normal text-gray-400">/ {formatBytes(storageLimit, 0)}</span>
                                          </div>
                                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-4">
                                                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${storagePercent}%` }}></div>
                                          </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-4">{storagePercent}% of server configuration filled.</p>
                              </div>

                              {/* Subscription Metadata Card */}
                              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Subscription Diagnostics</h3>
                                    <ul className="space-y-3 text-sm">
                                          <li className="flex justify-between border-b border-gray-50 pb-1.5">
                                                <span className="text-gray-500">Pipeline Priority</span>
                                                <span className="font-semibold text-gray-900">Rank {activePlansDetails.priority_level}</span>
                                          </li>
                                          <li className="flex justify-between border-b border-gray-50 pb-1.5">
                                                <span className="text-gray-500">Max Unit Size</span>
                                                <span className="font-semibold text-gray-900">{formatBytes(activePlansDetails.max_file_size_bytes, 0)}</span>
                                          </li>
                                          <li className="flex justify-between">
                                                <span className="text-gray-500">Cycle Safe-date</span>
                                                <span className="font-semibold text-gray-900">{new Date(activePlansDetails.expires_at).toLocaleDateString()}</span>
                                          </li>
                                    </ul>
                              </div>
                        </section>

                        {/* PRICING PLANS TOGGLE CONTAINER WITH FULL FEATURES */}
                        <section className="mb-12">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div>
                                          <h2 className="text-xl font-bold text-gray-900">Available Ecosystem Plans</h2>
                                          <p className="text-xs text-gray-500 mt-0.5">Review pricing breakdown tiers and dynamic system limits.</p>
                                    </div>

                                    {/* Interval Toggle */}
                                    <div className="inline-flex bg-gray-200 p-1 rounded-lg">
                                          {['monthly', 'quarterly', 'yearly'].map((interval) => (
                                                <button
                                                      key={interval}
                                                      onClick={() => setBillingInterval(interval)}
                                                      className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${billingInterval === interval
                                                            ? 'bg-white text-gray-900 shadow-sm'
                                                            : 'text-gray-600 hover:text-gray-900'
                                                            }`}
                                                >
                                                      {interval.charAt(0).toUpperCase() + interval.slice(1)}
                                                </button>
                                          ))}
                                    </div>
                              </div>

                              {/* Upgraded Plans Grid Layout */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                    {uniquePlanNames.map((name) => {
                                          const planPrice = plansWithPrices.find(p => p.name === name && p.interval === billingInterval);
                                          if (!planPrice) return null;

                                          const isCurrent = name === activePlanName[0]?.name;

                                          return (
                                                <div
                                                      key={planPrice.price_id}
                                                      className={`bg-white p-6 rounded-2xl border transition-all relative flex flex-col justify-between shadow-sm ${isCurrent
                                                            ? 'border-indigo-600 ring-2 ring-indigo-600 ring-opacity-20'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                >
                                                      {isCurrent && (
                                                            <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                                                                  Your Active Plan
                                                            </span>
                                                      )}

                                                      <div>
                                                            <h4 className="text-lg font-bold text-gray-900 mb-1">{name} Plan</h4>
                                                            <p className="text-xs text-gray-400 mb-4">Scalable parameters for production assets.</p>

                                                            <div className="text-3xl font-black text-gray-900 tracking-tight flex items-baseline gap-1 mb-6">
                                                                  {planPrice.currency === 'INR' ? '₹' : planPrice.currency} {parseFloat(planPrice.price).toLocaleString('en-IN')}
                                                                  <span className="text-xs font-normal text-gray-400">/{billingInterval}</span>
                                                            </div>

                                                            {/* DYNAMIC PLAN FEATURE LIST MATRIX */}
                                                            <div className="border-t border-gray-100 pt-5 mb-6">
                                                                  <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Included Limits & Core Features:</h5>
                                                                  <ul className="space-y-2.5 text-xs text-gray-600">
                                                                        <li className="flex items-center gap-2">
                                                                              <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                                              <span>Max Single File Upload Size: <strong className="text-gray-900">{formatBytes(planPrice.max_file_size_bytes, 0)}</strong></span>
                                                                        </li>
                                                                        <li className="flex items-center gap-2">
                                                                              <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                                              <span>Total Assigned Cloud Storage: <strong className="text-gray-900">{formatBytes(planPrice.storage_limit_bytes, 0)}</strong></span>
                                                                        </li>
                                                                        <li className="flex items-center gap-2">
                                                                              <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                                              <span>Daily Concurrent Transformation Jobs: <strong className="text-gray-900">{parseInt(planPrice.daily_jobs_limit).toLocaleString()}</strong></span>
                                                                        </li>
                                                                        <li className="flex items-center gap-2">
                                                                              <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                                              <span>API Router Pipeline Priority Level: <strong className="text-gray-900">Rank {planPrice.priority_level}</strong></span>
                                                                        </li>
                                                                        <li className="flex items-center gap-2">
                                                                              <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                                              <span>Output Burned Asset Watermark: <strong className="text-gray-900">{planPrice.watermark_enabled ? 'Enabled' : 'Disabled'}</strong></span>
                                                                        </li>
                                                                  </ul>
                                                            </div>
                                                      </div>

                                                      {/* ACTION UPGRADE BUTTON ROW */}
                                                      <button
                                                            onClick={() => handlePlanAction(name, planPrice.plan_id, isCurrent)}
                                                            disabled={isCurrent || isUpgrading}
                                                            className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl transition-all ${isCurrent
                                                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                                                  : isUpgrading
                                                                        ? 'bg-indigo-400 text-white cursor-wait'
                                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow active:scale-[0.99]'
                                                                  }`}
                                                      >
                                                            {isCurrent ? 'Active Membership Tier' : isUpgrading ? 'Processing Migration...' : `Upgrade to ${name}`}
                                                      </button>
                                                </div>
                                          );
                                    })}
                              </div>
                        </section>

                        {/* PROCESSING HISTORY LOG TABLE */}
                        <section>
                              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Processing Batches</h2>
                              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                          <table className="w-full text-left border-collapse">
                                                <thead>
                                                      <tr className="bg-gray-50 border-b border-gray-200">
                                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Batch details</th>
                                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500">Output Transformation Jobs</th>
                                                      </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 text-sm">
                                                      {history.map((batch) => (
                                                            <tr key={batch.batchId} className="hover:bg-gray-50/70 transition-colors">
                                                                  <td className="p-4 align-top">
                                                                        <div className="font-mono text-xs text-gray-500 font-semibold mb-1">
                                                                              ID: {batch.batchId.substring(0, 8)}...
                                                                        </div>
                                                                        <a
                                                                              href={batch.originalUrl}
                                                                              target="_blank"
                                                                              rel="noreferrer"
                                                                              className="text-xs inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group"
                                                                        >
                                                                              View Source Asset
                                                                              <span className="ml-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                                                                        </a>
                                                                  </td>
                                                                  <td className="p-4 align-top">
                                                                        <div className="flex flex-wrap gap-2">
                                                                              {batch.transformations.map((job) => (
                                                                                    <div
                                                                                          key={job.jobId}
                                                                                          className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 pl-2 pr-2.5 py-1 rounded-md"
                                                                                    >
                                                                                          <span className="text-[11px] font-mono text-gray-400">
                                                                                                Job: {job.jobId.substring(0, 6)}
                                                                                          </span>

                                                                                          {job.url ? (
                                                                                                <a
                                                                                                      href={job.url}
                                                                                                      target="_blank"
                                                                                                      rel="noreferrer"
                                                                                                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 hover:underline"
                                                                                                >
                                                                                                      Download
                                                                                                </a>
                                                                                          ) : (
                                                                                                <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-1 rounded">
                                                                                                      Missing Output
                                                                                                </span>
                                                                                          )}
                                                                                    </div>
                                                                              ))}
                                                                        </div>
                                                                  </td>
                                                            </tr>
                                                      ))}
                                                </tbody>
                                          </table>
                                    </div>
                              </div>
                        </section>

                  </div>
            </div>
      );
}
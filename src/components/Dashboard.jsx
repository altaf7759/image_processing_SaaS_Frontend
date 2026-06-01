import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Master configuration dictionary for supported transformation variants
const VARIANT_CONFIGS = [
      { id: 'facebook_feed', label: 'facebook_feed', backendKey: 'fb_cover', badge: 'Landscape', aspectClass: 'aspect-[16/9]' },
      { id: 'instagram_square', label: 'instagram_square', backendKey: 'insta_post', badge: '1:1 Ratio', aspectClass: 'aspect-square' },
      { id: 'instagram_story', label: 'instagram_story', backendKey: 'insta_story', badge: '9:16 Story', aspectClass: 'aspect-[9/16] max-h-[340px] mx-auto' },
      { id: 'youtube_thumbnail', label: 'youtube_thumbnail', backendKey: 'youtube_thumbnail', badge: '16:9 Thumbnail', aspectClass: 'aspect-[16/9]' },
      { id: 'twitter_feed', label: 'twitter_feed', backendKey: 'twitter', badge: '16:9 Feed', aspectClass: 'aspect-[16/9]' }
];

export default function Dashboard() {
      const { user, setUser } = useAuth(); // Extracted profile context hooks
      const fileInputRef = useRef(null);
      const navigate = useNavigate();
      const { VITE_BACKEND_URL } = import.meta.env;

      // File Management State Hooks
      const [selectedFile, setSelectedFile] = useState(null);
      const [previewUrl, setPreviewUrl] = useState(null);

      // User Preset Targeting Configuration Map
      const [chosenTargets, setChosenTargets] = useState(["insta_post", "youtube_thumbnail"]);
      const [showProfileDropdown, setShowProfileDropdown] = useState(false);

      // Global Engine Orchestration Trackers
      const [isProcessing, setIsProcessing] = useState(false);
      const [globalProgress, setGlobalProgress] = useState(0);
      const [progressMessage, setProgressMessage] = useState('');

      // Real-time Pipeline Monitoring Hooks
      const [jobStatuses, setJobStatuses] = useState({});
      const [variantsData, setVariantsData] = useState({});

      useEffect(() => {
            if (user === null) {
                  navigate("/auth");
            }
      }, [user, setUser]);

      const handleFileChange = (file) => {
            if (file && file.type.startsWith('image/')) {
                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file));

                  // Flush rendering contexts clean
                  setVariantsData({});
                  setJobStatuses({});
                  setProgressMessage('');
                  setGlobalProgress(0);
                  setIsProcessing(false);
            }
      };

      const toggleTargetPreset = (backendKey) => {
            if (isProcessing) return;
            setChosenTargets(prev =>
                  prev.includes(backendKey)
                        ? prev.filter(key => key !== backendKey)
                        : [...prev, backendKey]
            );
      };

      const triggerFileSelect = () => fileInputRef.current?.click();
      const handleDragOver = (e) => e.preventDefault();
      const handleDrop = (e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
      };

      // Processing Execution Stream
      const handleStartProcess = async () => {
            if (!selectedFile || chosenTargets.length === 0) return;

            setIsProcessing(true);
            setProgressMessage('Uploading master image source...');
            setGlobalProgress(5);

            const formData = new FormData();
            formData.append("image", selectedFile);
            formData.append("totalJobs", chosenTargets.length.toString());
            formData.append("targets", JSON.stringify(chosenTargets));

            try {
                  const uploadResponse = await fetch(`${VITE_BACKEND_URL}/api/images/upload`, {
                        method: "POST",
                        credentials: "include",
                        body: formData
                  });

                  if (!uploadResponse.ok) throw new Error("File upload sequence broken");

                  const responseBody = await uploadResponse.json();
                  const targetBatchId = responseBody?.data?.batchId;

                  if (!targetBatchId) {
                        throw new Error("Missing batchId within tracking payload reference");
                  }

                  setProgressMessage('Opening real-time processing channel...');

                  const eventSource = new EventSource(`${VITE_BACKEND_URL}/api/images/progress/${targetBatchId}/stream`, {
                        withCredentials: true
                  });

                  const safelyParse = (rawData) => {
                        try {
                              console.log(JSON.parse(rawData));
                              return JSON.parse(rawData);
                        } catch {
                              return null;
                        }
                  };

                  // Forces completion states as soon as the files chosen have data keys populated
                  const checkForceCompletion = (currentVariants) => {
                        const activeConfigs = VARIANT_CONFIGS.filter(c => chosenTargets.includes(c.backendKey));
                        const allDone = activeConfigs.every(config => currentVariants[config.id]);

                        if (allDone) {
                              eventSource.close();
                              setIsProcessing(false);
                              setProgressMessage('Processing Complete');
                              setGlobalProgress(100);

                              setJobStatuses(prev => {
                                    const finished = { ...prev };
                                    chosenTargets.forEach(tgt => {
                                          finished[tgt] = { status: 'completed', progress: 100 };
                                    });
                                    return finished;
                              });
                        }
                  };

                  // 1. TEXT KEEPALIVES
                  eventSource.onmessage = (event) => {
                        if (event.data === "Connected") {
                              setProgressMessage("Connected to processing stream...");
                              setGlobalProgress(10);
                        }
                  };

                  // 2. INDIVIDUAL WORKER JOB CHANNEL UPDATES (Dirty string translation completely removed)
                  eventSource.addEventListener('job_update', (event) => {
                        const payload = safelyParse(event.data);
                        if (!payload) return;

                        const targetKey = payload.target; // Directly matches backendKey (e.g., 'insta_story', 'insta_post')

                        setJobStatuses(prev => ({
                              ...prev,
                              [targetKey]: {
                                    status: payload.status,
                                    progress: payload.progress || prev[targetKey]?.progress || 0,
                                    message: payload.message
                              }
                        }));

                        if (payload.message) setProgressMessage(payload.message);

                        if (payload.status === 'completed' && payload.imageUrl) {
                              const targetConfig = VARIANT_CONFIGS.find(c => c.backendKey === targetKey);
                              if (targetConfig) {
                                    setVariantsData(prev => {
                                          const updated = { ...prev, [targetConfig.id]: payload.imageUrl };
                                          checkForceCompletion(updated);
                                          return updated;
                                    });
                              }
                        }
                  });

                  // 3. COMPLETE PIPELINE BATCH UPDATES
                  eventSource.addEventListener('batch_update', (event) => {
                        const payload = safelyParse(event.data);
                        if (!payload) return;

                        if (payload.batchStatus === 'completed' || payload.progress === 100) {
                              eventSource.close();
                              setIsProcessing(false);
                              setProgressMessage('Processing Complete');
                              setGlobalProgress(100);
                        } else {
                              setGlobalProgress(prev => Math.max(prev, payload.progress || 0));
                        }
                  });

                  // 4. PIPELINE STATE ENUMERATORS (Dirty string translation completely removed)
                  eventSource.addEventListener('snapshot', (event) => {
                        const payload = safelyParse(event.data);
                        if (!payload || !payload.jobs) return;

                        const initialStatuses = {};
                        payload.jobs.forEach(j => {
                              const key = j.target; // Directly matches clean backendKey identifiers
                              initialStatuses[key] = { status: j.status, progress: j.status === 'completed' ? 100 : 0 };

                              if (j.status === 'completed' && j.imageUrl) {
                                    const targetConfig = VARIANT_CONFIGS.find(c => c.backendKey === key);
                                    if (targetConfig) {
                                          setVariantsData(prev => ({ ...prev, [targetConfig.id]: j.imageUrl }));
                                    }
                              }
                        });
                        setJobStatuses(initialStatuses);
                  });

                  eventSource.onerror = (err) => {
                        console.error("SSE Connection Failed:", err);
                        eventSource.close();
                        setIsProcessing(false);
                  };

            } catch (error) {
                  console.error("Pipeline breakdown sequence:", error);
                  setIsProcessing(false);
                  setProgressMessage('Error running execution workers.');
            }
      };

      return (
            <div className="bg-[#f8fafc] text-slate-800 min-h-screen flex flex-col font-sans selection:bg-blue-100">
                  <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files?.[0])} accept="image/*" className="hidden" />

                  {/* Navigation Layer */}
                  <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                              <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 select-none">
                                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">P</div>
                                          <span className="font-semibold text-lg tracking-tight">pixelpipe<span className="text-blue-600">.app</span></span>
                                    </div>
                              </div>

                              <div className="flex items-center gap-4 relative">
                                    <button onClick={triggerFileSelect} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-all shadow-sm">
                                          + New Batch
                                    </button>

                                    {/* User Profile Avatar Section */}
                                    <div className="relative">
                                          <button
                                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                                className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 text-xs font-semibold focus:outline-none hover:ring-2 hover:ring-blue-500/20 transition-all"
                                          >
                                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                          </button>

                                          {showProfileDropdown && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                                      <div className="px-4 py-2 border-b border-slate-100">
                                                            <p className="text-xs font-medium text-slate-900 truncate">{user?.name || 'User Profile'}</p>
                                                            <p className="text-[11px] text-slate-400 truncate">{user?.email || 'authenticated user'}</p>
                                                      </div>
                                                      <div className="px-4 py-2 border-b border-slate-100">
                                                            <p className="text-xs font-medium text-slate-900 truncate cursor-pointer"
                                                                  onClick={() => navigate("/profile")}
                                                            >Profile</p>
                                                      </div>
                                                      <button
                                                            onClick={() => {
                                                                  localStorage.removeItem("user");
                                                                  setUser(null);
                                                                  navigate("/auth");
                                                                  setShowProfileDropdown(false);
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium transition-colors"
                                                      >
                                                            Sign Out
                                                      </button>
                                                </div>
                                          )}
                                    </div>
                              </div>
                        </div>
                  </nav>

                  {/* Central Content Canvas */}
                  <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

                        {/* Input Master Area Card */}
                        <div className="max-w-2xl mx-auto space-y-6">
                              <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={!selectedFile ? triggerFileSelect : undefined}
                                    className={`bg-white border-2 rounded-2xl p-8 shadow-sm transition-all text-center flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden
              ${!selectedFile ? 'border-dashed border-slate-300 hover:border-blue-500 cursor-pointer' : 'border-slate-200'}`}
                              >
                                    {isProcessing && (
                                          <div className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300" style={{ width: `${globalProgress}%` }} />
                                    )}

                                    {previewUrl ? (
                                          <div className="w-full flex flex-col items-center">
                                                <span className="font-mono text-xs text-slate-400 mb-3 block truncate max-w-xs">{selectedFile?.name}</span>
                                                <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-inner border border-slate-100 mb-4 group">
                                                      <img className="w-full h-full object-cover" src={previewUrl} alt="Source Preview" />
                                                      {!isProcessing && (
                                                            <div onClick={(e) => { e.stopPropagation(); handleFileChange(null); }} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity cursor-pointer">
                                                                  Change
                                                            </div>
                                                      )}
                                                </div>

                                                {progressMessage && (
                                                      <div className="space-y-1 w-full max-w-xs">
                                                            <div className="flex items-center justify-center gap-2 font-medium text-sm text-slate-700">
                                                                  {isProcessing ? <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" /> : <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                                                                  <span className={!isProcessing ? "text-emerald-600 font-semibold" : "truncate"}>{progressMessage}</span>
                                                            </div>
                                                            <span className="text-[11px] text-slate-400 font-mono block">Overall progress: {globalProgress}%</span>
                                                      </div>
                                                )}
                                          </div>
                                    ) : (
                                          <div className="space-y-2 pointer-events-none">
                                                <div className="text-slate-400 text-3xl">📥</div>
                                                <p className="text-sm font-medium text-slate-700">Drag & drop your image here, or <span className="text-blue-600">browse</span></p>
                                                <p className="text-xs text-slate-400">Supports JPG, PNG, WebP up to 10MB</p>
                                          </div>
                                    )}
                              </div>

                              {/* Interactive Variant Selection Checklist Control Layer */}
                              {selectedFile && !progressMessage && (
                                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                          <div className="flex flex-col">
                                                <span className="text-xs font-semibold text-slate-700">Select Transformation Targets</span>
                                                <span className="text-[11px] text-slate-400">Only variants checked below will be submitted for cloud compilation.</span>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2.5">
                                                {VARIANT_CONFIGS.map(config => {
                                                      const isChecked = chosenTargets.includes(config.backendKey);
                                                      return (
                                                            <div
                                                                  key={config.id}
                                                                  onClick={() => toggleTargetPreset(config.backendKey)}
                                                                  className={`flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all select-none
                        ${isChecked ? 'border-blue-500 bg-blue-50/40 text-blue-900 font-medium' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}
                                                            >
                                                                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all
                        ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}
                                                                  >
                                                                        {isChecked && <span className="text-[10px] font-bold">✓</span>}
                                                                  </div>
                                                                  <div className="flex flex-col min-w-0">
                                                                        <span className="text-xs font-mono truncate">{config.label}</span>
                                                                        <span className="text-[10px] opacity-70 font-sans">{config.badge}</span>
                                                                  </div>
                                                            </div>
                                                      );
                                                })}
                                          </div>

                                          <button
                                                onClick={handleStartProcess}
                                                disabled={isProcessing || chosenTargets.length === 0}
                                                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium text-sm rounded-xl transition-all shadow-sm"
                                          >
                                                {chosenTargets.length === 0 ? "Select at least one preset" : `Generate ${chosenTargets.length} Variant Assets`}
                                          </button>
                                    </div>
                              )}
                        </div>

                        {/* Output Grid View Container */}
                        <section className="space-y-4">
                              <div className="flex justify-between items-center">
                                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Generated Variants</h2>
                                    {Object.keys(variantsData).length > 0 && (
                                          <button className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">Download All (.zip)</button>
                                    )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {VARIANT_CONFIGS.map((variant) => {
                                          // Check if user actually requested this variant compile session
                                          const isRequested = chosenTargets.includes(variant.backendKey);
                                          const variantImage = variantsData[variant.id];
                                          const specificJob = jobStatuses[variant.backendKey];

                                          const isTargetProcessing = specificJob?.status === 'processing';
                                          const isTargetQueued = specificJob?.status === 'queued';
                                          const targetProgressNum = specificJob?.progress || 0;

                                          // Hide or mute variant panels that weren't selected
                                          if (!isRequested && progressMessage) return null;

                                          return (
                                                <div
                                                      key={variant.id}
                                                      className={`bg-white border rounded-2xl p-4 flex flex-col justify-between shadow-sm transition-all
                    ${!isRequested ? 'opacity-40 border-slate-200/60' : 'border-slate-200 hover:shadow-md'}`}
                                                >
                                                      <div>
                                                            <div className="flex justify-between items-center mb-3">
                                                                  <span className="font-mono text-xs font-medium text-slate-700">{variant.label}</span>
                                                                  <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{variant.badge}</span>
                                                            </div>

                                                            <div className={`${variant.aspectClass} w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-200/60 mb-4 flex flex-col items-center justify-center relative`}>
                                                                  {variantImage ? (
                                                                        <img className="w-full h-full object-cover animate-in fade-in duration-300" src={variantImage} alt={variant.label} />
                                                                  ) : (
                                                                        <div className="w-full px-6 text-center select-none space-y-2">
                                                                              {isTargetProcessing && (
                                                                                    <div className="space-y-2 w-full max-w-[140px] mx-auto">
                                                                                          <div className="w-4 h-4 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
                                                                                          <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                                                                                                <div className="bg-blue-600 h-1 transition-all duration-300" style={{ width: `${targetProgressNum}%` }} />
                                                                                          </div>
                                                                                          <span className="text-[10px] font-mono text-slate-400 block">{targetProgressNum}% processed</span>
                                                                                    </div>
                                                                              )}
                                                                              {isTargetQueued && <span className="text-xs text-slate-400 font-medium italic block animate-pulse">Queued in line...</span>}
                                                                              {!specificJob && !isProcessing && (
                                                                                    <span className="text-slate-300 text-xs font-medium block">
                                                                                          {isRequested ? "Awaiting submission..." : "Not selected for generation"}
                                                                                    </span>
                                                                              )}
                                                                              {!specificJob && isProcessing && isRequested && (
                                                                                    <span className="text-slate-300 text-xs font-medium block animate-pulse">Preparing worker node...</span>
                                                                              )}
                                                                        </div>
                                                                  )}
                                                            </div>
                                                      </div>

                                                      <button
                                                            disabled={!variantImage}
                                                            onClick={() => window.open(variantImage, '_blank')}
                                                            className="w-full py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 enabled:hover:bg-slate-50 enabled:hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-center"
                                                      >
                                                            Download Asset
                                                      </button>
                                                </div>
                                          );
                                    })}
                              </div>
                        </section>
                  </main>
            </div>
      );
}
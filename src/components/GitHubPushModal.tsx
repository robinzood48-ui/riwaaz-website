import React, { useState } from 'react';
import {
  X,
  Github,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  GitCommit,
  FolderGit2,
  ArrowRight,
  RefreshCw,
  FileCode,
  Sparkles,
} from 'lucide-react';

interface GitHubPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRepoName?: string;
}

export const GitHubPushModal: React.FC<GitHubPushModalProps> = ({
  isOpen,
  onClose,
  initialRepoName = 'riwaaz-website',
}) => {
  const [token, setToken] = useState('');
  const [repoName, setRepoName] = useState(initialRepoName);
  const [commitMessage, setCommitMessage] = useState('Update website: Riwaaz luxury home decor store');
  const [showToken, setShowToken] = useState(false);

  // Verification state
  const [validating, setValidating] = useState(false);
  const [detectedUser, setDetectedUser] = useState<any>(null);
  const [repoStatus, setRepoStatus] = useState<any>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [guidance, setGuidance] = useState<string | null>(null);

  // Push state
  const [pushing, setPushing] = useState(false);
  const [pushProgress, setPushProgress] = useState<{ step: string; percent: number }>({
    step: 'Idle',
    percent: 0,
  });
  const [pushResult, setPushResult] = useState<any>(null);
  const [pushError, setPushError] = useState<{ error: string; guidance?: string } | null>(null);

  if (!isOpen) return null;

  // Validate token & detect username automatically without asking the user
  const handleValidate = async (providedToken?: string, providedRepo?: string) => {
    const t = (providedToken !== undefined ? providedToken : token).trim();
    const r = (providedRepo !== undefined ? providedRepo : repoName).trim();

    if (!t) {
      setTokenError('Please enter your GitHub Personal Access Token.');
      return;
    }

    setValidating(true);
    setTokenError(null);
    setGuidance(null);

    try {
      const res = await fetch('/api/github/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t, repoName: r }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setDetectedUser(data.user);
        setRepoStatus(data.repoCheck);
        if (data.guidance) {
          setGuidance(data.guidance);
        }
      } else {
        setDetectedUser(null);
        setRepoStatus(null);
        setTokenError(data.error || 'Failed to authenticate with GitHub.');
        setGuidance(data.guidance || null);
      }
    } catch (err: any) {
      setDetectedUser(null);
      setRepoStatus(null);
      setTokenError(`Connection error: ${err.message}`);
    } finally {
      setValidating(false);
    }
  };

  // Perform complete push flow
  const handlePush = async () => {
    const t = token.trim();
    const r = repoName.trim();

    if (!t) {
      setTokenError('GitHub Personal Access Token is required.');
      return;
    }
    if (!r) {
      setTokenError('Repository name is required.');
      return;
    }

    setPushing(true);
    setPushError(null);
    setPushResult(null);

    setPushProgress({ step: 'Validating token & detecting GitHub user...', percent: 15 });

    try {
      // Step simulation for visual feedback
      setTimeout(() => {
        setPushProgress({ step: 'Verifying repository & permissions...', percent: 35 });
      }, 700);

      setTimeout(() => {
        setPushProgress({ step: 'Excluding .env, node_modules, and sensitive files...', percent: 55 });
      }, 1500);

      setTimeout(() => {
        setPushProgress({ step: 'Staging & committing website source files...', percent: 75 });
      }, 2300);

      setTimeout(() => {
        setPushProgress({ step: 'Uploading to main branch via GitHub...', percent: 85 });
      }, 3100);

      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: t,
          repoName: r,
          commitMessage: commitMessage.trim() || 'Update website',
        }),
      });

      const data = await res.json();

      // Wipe token from local state immediately after completion
      setToken('');

      if (data.success) {
        setPushProgress({ step: 'Completed successfully!', percent: 100 });
        setPushResult(data);
      } else {
        setPushError({
          error: data.error || 'Push operation failed',
          guidance: data.guidance,
        });
      }
    } catch (err: any) {
      setToken('');
      setPushError({
        error: `Network error during push: ${err.message}`,
        guidance: 'Please verify server connectivity and try again.',
      });
    } finally {
      setPushing(false);
    }
  };

  const handleClose = () => {
    // Clear all token data from memory on modal close
    setToken('');
    setPushing(false);
    setPushError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF7F2] border border-[#EDE5DA] rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#25201C] text-[#FAF7F2] px-6 py-4 flex items-center justify-between border-b border-[#3D2D24]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#3D2D24] border border-[#BFA069]/40 flex items-center justify-center text-[#BFA069]">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg tracking-wide text-[#FAF7F2] font-semibold flex items-center gap-2">
                Push to GitHub
                <span className="text-[10px] tracking-wider uppercase font-sans font-semibold bg-[#BFA069]/20 text-[#BFA069] px-2 py-0.5 rounded-full border border-[#BFA069]/30">
                  Secure Sync
                </span>
              </h3>
              <p className="text-xs text-[#FAF7F2]/70">
                Commit & sync all project files directly to your repository
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={pushing}
            className="text-[#FAF7F2]/60 hover:text-[#FAF7F2] p-1.5 rounded-lg hover:bg-[#3D2D24] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-[#25201C]">
          {/* Success Result View */}
          {pushResult && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-900">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-base text-emerald-900">
                      Successfully Pushed to GitHub!
                    </h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      All website source files, assets, and configurations have been securely committed to the{' '}
                      <span className="font-mono font-medium">main</span> branch.
                    </p>

                    <div className="mt-4 pt-3 border-t border-emerald-200/80 flex flex-col gap-2 text-xs">
                      {pushResult.repoUrl && (
                        <div className="flex items-center justify-between bg-white/80 p-2.5 rounded-lg border border-emerald-200">
                          <span className="text-emerald-800 font-medium truncate max-w-[280px]">
                            {pushResult.repoUrl}
                          </span>
                          <a
                            href={pushResult.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700 text-white rounded font-medium hover:bg-emerald-800 transition-colors shrink-0 shadow-sm"
                          >
                            <span>Open Repository</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      {pushResult.stats && (
                        <div className="grid grid-cols-2 gap-2 text-emerald-800 mt-1">
                          <div className="bg-white/60 p-2 rounded">
                            <span className="text-emerald-600 block text-[10px] uppercase font-semibold">
                              Files Synchronized
                            </span>
                            <span className="font-bold text-sm">{pushResult.stats.totalFiles} files</span>
                          </div>
                          <div className="bg-white/60 p-2 rounded">
                            <span className="text-emerald-600 block text-[10px] uppercase font-semibold">
                              Bundle Size
                            </span>
                            <span className="font-bold text-sm">~{pushResult.stats.totalSizeKb} KB</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security confirmation badge */}
              <div className="bg-[#EDE5DA]/60 border border-[#EDE5DA] rounded-lg p-3 text-xs text-[#785A44] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#BFA069] shrink-0" />
                <span>
                  <strong>Security verified:</strong> Your Personal Access Token has been wiped from memory. No credentials or <code className="bg-[#FAF7F2] px-1 py-0.5 rounded text-[11px]">.env</code> files were saved.
                </span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 bg-[#25201C] text-[#FAF7F2] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#3D2D24] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Form View (when not successfully pushed) */}
          {!pushResult && (
            <div className="space-y-4">
              {/* Security Banner */}
              <div className="bg-[#FAF7F2] border border-[#EDE5DA] rounded-xl p-3.5 text-xs text-[#785A44] flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#BFA069] shrink-0 mt-0.5" />
                <div className="flex-1 text-[11px] leading-relaxed">
                  <span className="font-semibold text-[#25201C]">Zero-Leak Guarantee:</span> Tokens are kept in temporary memory solely during the push and never stored in files, databases, or logs. Sensitive files like <span className="font-mono text-[#25201C]">.env</span>, API keys, and <span className="font-mono text-[#25201C]">node_modules</span> are strictly excluded.
                </div>
              </div>

              {/* 1. GitHub Token Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#4A3B31] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#BFA069]" /> GitHub Personal Access Token
                  </label>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#BFA069] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Generate token</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                      setTokenError(null);
                    }}
                    onBlur={() => {
                      if (token.trim() && !detectedUser) {
                        handleValidate();
                      }
                    }}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    disabled={pushing}
                    className="w-full bg-white border border-[#EDE5DA] rounded-lg pl-3 pr-20 py-2.5 text-xs font-mono text-[#25201C] focus:outline-none focus:ring-2 focus:ring-[#BFA069] focus:border-transparent transition-all shadow-inner disabled:bg-gray-100"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="p-1 text-[#785A44] hover:text-[#25201C] transition-colors"
                      title={showToken ? 'Hide token' : 'Show token'}
                    >
                      {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleValidate()}
                      disabled={validating || !token.trim() || pushing}
                      className="px-2 py-1 bg-[#25201C] text-[#FAF7F2] text-[10px] font-semibold rounded hover:bg-[#3D2D24] transition-colors disabled:opacity-50"
                    >
                      {validating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Detect'}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-[#785A44] mt-1">
                  Required permission: check the <strong className="text-[#25201C]">repo</strong> scope (Full control of private repositories).
                </p>
              </div>

              {/* Detected User Identity (Requirement 2: Automatically detect username) */}
              {detectedUser && (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between text-xs animate-fade-in">
                  <div className="flex items-center gap-2.5">
                    {detectedUser.avatarUrl ? (
                      <img
                        src={detectedUser.avatarUrl}
                        alt={detectedUser.login}
                        className="w-8 h-8 rounded-full border border-emerald-300"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
                        {detectedUser.login.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-950">
                        <span>@{detectedUser.login}</span>
                        {detectedUser.name && (
                          <span className="text-[11px] font-normal text-emerald-700">({detectedUser.name})</span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-600 block">
                        ✓ Authenticated via GitHub REST API
                      </span>
                    </div>
                  </div>
                  <a
                    href={detectedUser.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-medium"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* 2. Repository Name Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3B31] mb-1.5 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-[#BFA069]" /> GitHub Repository Name
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#785A44]/70">
                      {detectedUser ? `${detectedUser.login}/` : 'github.com/.../'}
                    </span>
                    <input
                      type="text"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      placeholder="riwaaz-website"
                      disabled={pushing}
                      className="w-full bg-white border border-[#EDE5DA] rounded-lg pl-28 pr-3 py-2.5 text-xs font-mono text-[#25201C] focus:outline-none focus:ring-2 focus:ring-[#BFA069] focus:border-transparent transition-all shadow-inner disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[#785A44] mt-1">
                  If the repository exists, files will be updated. If it does not exist, it will be automatically created.
                </p>
              </div>

              {/* 3. Commit Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3B31] mb-1.5 flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-[#BFA069]" /> Commit Message
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Update website: Riwaaz luxury home decor store"
                  disabled={pushing}
                  className="w-full bg-white border border-[#EDE5DA] rounded-lg px-3 py-2 text-xs text-[#25201C] focus:outline-none focus:ring-2 focus:ring-[#BFA069] focus:border-transparent transition-all shadow-inner disabled:bg-gray-100"
                />
              </div>

              {/* Error Box & Guidance */}
              {(tokenError || pushError) && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 space-y-2 animate-fade-in">
                  <div className="flex items-start gap-2 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{tokenError || pushError?.error}</span>
                  </div>
                  {(guidance || pushError?.guidance) && (
                    <div className="mt-2 pt-2 border-t border-rose-200/80 text-[11px] leading-relaxed text-rose-800 whitespace-pre-line bg-white/60 p-2.5 rounded-lg">
                      <strong>How to fix:</strong>
                      <div className="mt-1">{guidance || pushError?.guidance}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Progress View */}
              {pushing && (
                <div className="space-y-3 bg-[#FAF7F2] border border-[#EDE5DA] rounded-xl p-4 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#25201C]">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#BFA069]" />
                      <span>{pushProgress.step}</span>
                    </div>
                    <span className="font-mono text-[#BFA069]">{pushProgress.percent}%</span>
                  </div>
                  <div className="w-full bg-[#EDE5DA] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#BFA069] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${pushProgress.percent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[#785A44] text-center">
                    Please do not close this window while files are synchronizing to GitHub.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#EDE5DA]">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={pushing}
                  className="px-4 py-2 text-xs font-medium text-[#785A44] hover:text-[#25201C] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePush}
                  disabled={pushing || !token.trim() || !repoName.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25201C] text-[#FAF7F2] rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#3D2D24] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pushing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Pushing to GitHub...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4 text-[#BFA069]" />
                      <span>Push to GitHub</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#BFA069]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

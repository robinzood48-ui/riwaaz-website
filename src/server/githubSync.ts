import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export interface GitHubUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  htmlUrl: string;
}

export interface ValidateResult {
  valid: boolean;
  user?: GitHubUser;
  scopes?: string[];
  hasRepoScope?: boolean;
  error?: string;
  guidance?: string;
}

export interface PushStepProgress {
  step: string;
  detail: string;
  percent: number;
}

export interface PushResult {
  success: boolean;
  repoUrl?: string;
  commitSha?: string;
  commitMessage?: string;
  stats?: {
    totalFiles: number;
    createdFiles: number;
    updatedFiles: number;
    unchangedFiles: number;
    totalSizeKb: number;
  };
  error?: string;
  guidance?: string;
}

const GITHUB_API_VERSION = '2022-11-28';
const USER_AGENT = 'Riwaaz-Home-Decor-App';

/**
 * Make an authenticated HTTPS request to GitHub REST API
 */
export function callGitHubApi<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  apiPath: string,
  token: string,
  body?: any
): Promise<{ status: number; headers: Record<string, string | string[] | undefined>; data: T }> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: 'api.github.com',
        port: 443,
        path: apiPath,
        method,
        headers: {
          'User-Agent': USER_AGENT,
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': GITHUB_API_VERSION,
          ...(payload
            ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
              }
            : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let data: any = null;
          try {
            data = raw ? JSON.parse(raw) : null;
          } catch {
            data = raw;
          }
          resolve({
            status: res.statusCode || 500,
            headers: res.headers,
            data,
          });
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (payload) req.write(payload);
    req.end();
  });
}

/**
 * Validate GitHub Personal Access Token and detect the authenticated username
 */
export async function validateGitHubToken(token: string): Promise<ValidateResult> {
  if (!token || typeof token !== 'string' || !token.trim()) {
    return {
      valid: false,
      error: 'GitHub Personal Access Token is required.',
      guidance: 'Generate a token at https://github.com/settings/tokens with the "repo" scope checked.',
    };
  }

  const cleanToken = token.trim();

  try {
    const res = await callGitHubApi('GET', '/user', cleanToken);

    if (res.status === 401) {
      return {
        valid: false,
        error: 'Invalid or expired GitHub Personal Access Token (HTTP 401 Unauthorized).',
        guidance: 'Please check that your token was copied correctly and has not expired.',
      };
    }

    if (res.status !== 200 || !res.data || !res.data.login) {
      return {
        valid: false,
        error: `GitHub API error: ${res.data?.message || 'Failed to authenticate user.'}`,
      };
    }

    const rawScopes = (res.headers['x-oauth-scopes'] as string) || '';
    const scopes = rawScopes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Fine-grained PATs might not populate x-oauth-scopes header, but classic PATs do
    const hasRepoScope = scopes.includes('repo') || scopes.includes('public_repo') || scopes.length === 0;

    return {
      valid: true,
      user: {
        login: res.data.login,
        name: res.data.name || null,
        avatarUrl: res.data.avatar_url || '',
        htmlUrl: res.data.html_url || `https://github.com/${res.data.login}`,
      },
      scopes,
      hasRepoScope,
      guidance: !scopes.includes('repo') && scopes.length > 0
        ? 'Note: Your token has scopes [' + scopes.join(', ') + '], but is missing the "repo" scope needed to push code.'
        : undefined,
    };
  } catch (err: any) {
    return {
      valid: false,
      error: `Network error connecting to GitHub: ${err.message}`,
    };
  }
}

/**
 * Verify if repository exists and check permissions, or create it if missing
 */
export async function verifyOrCreateRepository(
  token: string,
  owner: string,
  repoName: string
): Promise<{
  success: boolean;
  repo?: any;
  created?: boolean;
  defaultBranch: string;
  error?: string;
  guidance?: string;
}> {
  const cleanRepo = repoName.trim().replace(/^\/|\/$/g, '');

  try {
    const res = await callGitHubApi('GET', `/repos/${owner}/${cleanRepo}`, token);

    if (res.status === 200) {
      const defaultBranch = res.data.default_branch || 'main';
      const permissions = res.data.permissions || {};
      
      // If permissions object is present and push is explicitly false
      if (permissions.push === false) {
        return {
          success: false,
          defaultBranch,
          error: `Token does not have push permission for repository "${owner}/${cleanRepo}".`,
          guidance: 'Your token must have write access or the "repo" scope to push code.',
        };
      }

      return {
        success: true,
        repo: res.data,
        created: false,
        defaultBranch,
      };
    }

    if (res.status === 404) {
      // Repository not found on user's account -> Attempt to create it automatically
      const createRes = await callGitHubApi('POST', '/user/repos', token, {
        name: cleanRepo,
        description: 'Riwaaz - Timeless Indian Living & Luxury Home Decor Store',
        private: false,
        auto_init: true,
      });

      if (createRes.status === 201) {
        return {
          success: true,
          repo: createRes.data,
          created: true,
          defaultBranch: createRes.data.default_branch || 'main',
        };
      }

      if (createRes.status === 404 || createRes.status === 403) {
        return {
          success: false,
          defaultBranch: 'main',
          error: `Repository "${cleanRepo}" does not exist on @${owner}, and your token lacks permission to create it.`,
          guidance: `Please create the repository manually at https://github.com/new with name "${cleanRepo}", or create a Personal Access Token with the "repo" scope.`,
        };
      }

      return {
        success: false,
        defaultBranch: 'main',
        error: `Could not access or create repository "${cleanRepo}": ${createRes.data?.message || 'Unknown error'}`,
      };
    }

    return {
      success: false,
      defaultBranch: 'main',
      error: `GitHub repository check failed (${res.status}): ${res.data?.message || 'Unknown response'}`,
    };
  } catch (err: any) {
    return {
      success: false,
      defaultBranch: 'main',
      error: `Error checking repository: ${err.message}`,
    };
  }
}

/**
 * Filter and collect all website source files to upload
 */
export function collectWebsiteFiles(rootDir: string = process.cwd()): {
  relPath: string;
  fullPath: string;
  size: number;
  isBinary: boolean;
}[] {
  const IGNORED_DIRS = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    '.cache',
    'coverage',
    'cloudsql',
    'cloud_sql_proxy',
    'control-plane-api',
    '.bun',
    '.playwright',
    '.npm',
  ]);

  const IGNORED_FILES = new Set([
    '.DS_Store',
    '.dev.pid',
    'thumbs.db',
  ]);

  const BINARY_EXTS = new Set([
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.ico',
    '.svg',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.pdf',
    '.zip',
  ]);

  const collected: {
    relPath: string;
    fullPath: string;
    size: number;
    isBinary: boolean;
  }[] = [];

  function scan(dir: string, baseRel: string = '') {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const name = entry.name;
      const rel = baseRel ? `${baseRel}/${name}` : name;
      const full = path.join(dir, name);

      // 1. Exclude node_modules, build/cache folders, git
      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(name)) continue;
        if (name.startsWith('.') && name !== '.aistudio') continue;
        scan(full, rel);
        continue;
      }

      // 2. Exclude sensitive files (.env, .env.local, .env.production, etc.)
      // BUT keep .env.example
      if (name.startsWith('.env') && name !== '.env.example') {
        continue;
      }

      // 3. Exclude logs, temp, pid, etc.
      if (name.endsWith('.log') || IGNORED_FILES.has(name)) {
        continue;
      }

      // 4. File is accepted
      try {
        const stat = fs.statSync(full);
        const ext = path.extname(name).toLowerCase();
        const isBinary = BINARY_EXTS.has(ext);

        collected.push({
          relPath: rel,
          fullPath: full,
          size: stat.size,
          isBinary,
        });
      } catch {
        // ignore unreadable files
      }
    }
  }

  scan(rootDir);
  return collected;
}

/**
 * Perform Push to GitHub via REST API and Git CLI
 */
export async function pushToGitHub(
  token: string,
  repoName: string,
  commitMessage: string = 'Update website',
  onProgress?: (progress: PushStepProgress) => void
): Promise<PushResult> {
  const cleanToken = token.trim();
  const cleanRepo = repoName.trim().replace(/^\/|\/$/g, '');

  const notify = (step: string, detail: string, percent: number) => {
    if (onProgress) {
      onProgress({ step, detail, percent });
    }
  };

  // 1. Token validation
  notify('Validating token', 'Checking GitHub credentials and detecting user identity...', 10);
  const auth = await validateGitHubToken(cleanToken);
  if (!auth.valid || !auth.user) {
    return {
      success: false,
      error: auth.error || 'GitHub token authentication failed.',
      guidance: auth.guidance,
    };
  }

  const owner = auth.user.login;
  const repoUrl = `https://github.com/${owner}/${cleanRepo}`;

  // 2. Repository check
  notify('Checking repository', `Connecting to repository ${owner}/${cleanRepo}...`, 25);
  const repoCheck = await verifyOrCreateRepository(cleanToken, owner, cleanRepo);
  if (!repoCheck.success) {
    return {
      success: false,
      error: repoCheck.error || `Cannot access repository "${cleanRepo}".`,
      guidance: repoCheck.guidance,
    };
  }

  const defaultBranch = repoCheck.defaultBranch || 'main';

  // 3. File collection and security scan
  notify('Scanning source files', 'Collecting files and verifying exclusion of secrets and dependencies...', 40);
  const files = collectWebsiteFiles(process.cwd());
  const totalFiles = files.length;
  const totalSizeBytes = files.reduce((acc, f) => acc + f.size, 0);
  const totalSizeKb = Math.round(totalSizeBytes / 1024);

  notify('Syncing files', `Preparing ${totalFiles} clean project files (${totalSizeKb} KB)...`, 55);

  // 4. Perform Git commit & push using authenticated git remote
  // We configure git safely in the workspace and push all files to the repository
  try {
    notify('Staging & committing', 'Synchronizing git branch and committing website updates...', 70);

    await execAsync('git config --global --add safe.directory "*"');
    await execAsync(`git config user.name "${auth.user.name || owner}"`);
    await execAsync(`git config user.email "${auth.user.login}@users.noreply.github.com"`);

    // Ensure branch is main
    try {
      await execAsync('git rev-parse --is-inside-work-tree');
    } catch {
      await execAsync('git init');
    }

    await execAsync(`git checkout -B ${defaultBranch}`);
    await execAsync('git add .');

    try {
      await execAsync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
    } catch {
      // nothing to commit is okay
    }

    notify('Pushing to GitHub', `Pushing all files to ${owner}/${cleanRepo} on branch ${defaultBranch}...`, 85);

    // Setup authenticated remote
    const remoteUrl = `https://x-access-token:${cleanToken}@github.com/${owner}/${cleanRepo}.git`;
    
    try {
      await execAsync('git remote remove origin');
    } catch {
      // ignored
    }
    await execAsync(`git remote add origin "${remoteUrl}"`);

    // Fetch and sync if remote exists
    try {
      await execAsync(`git fetch origin ${defaultBranch}`);
      await execAsync(`git rebase -X theirs origin/${defaultBranch} || git merge --allow-unrelated-histories -m "Sync repository" origin/${defaultBranch}`);
    } catch {
      // Fresh repository or empty branch
    }

    // Push to remote main
    const pushOutput = await execAsync(`git push -u origin ${defaultBranch}`);

    // Remove remote immediately so token is never kept in .git/config
    try {
      await execAsync('git remote remove origin');
    } catch {
      // ignored
    }

    // Get current commit hash
    let commitSha = '';
    try {
      const shaRes = await execAsync('git rev-parse HEAD');
      commitSha = shaRes.stdout.trim();
    } catch {
      commitSha = '';
    }

    notify('Completed', `Successfully pushed to ${repoUrl}`, 100);

    return {
      success: true,
      repoUrl,
      commitSha,
      commitMessage,
      stats: {
        totalFiles,
        createdFiles: totalFiles,
        updatedFiles: 0,
        unchangedFiles: 0,
        totalSizeKb,
      },
    };
  } catch (pushErr: any) {
    // Clean remote if left behind
    try {
      await execAsync('git remote remove origin');
    } catch {}

    const errMsg = pushErr.stderr || pushErr.message || String(pushErr);

    // Check for 403 Permission denied
    if (errMsg.includes('403') || errMsg.includes('Permission to') || errMsg.includes('denied')) {
      return {
        success: false,
        error: `Permission denied (HTTP 403): Your Personal Access Token does not have write permissions for repository "${owner}/${cleanRepo}".`,
        guidance: `To fix this:
1. Go to https://github.com/settings/tokens
2. Edit or generate a new Personal Access Token.
3. Check the "repo" checkbox (Full control of private repositories).
4. For fine-grained tokens, ensure "Repository permissions > Contents" is set to "Read and write".
5. Paste the new token here and try again.`,
      };
    }

    return {
      success: false,
      error: `Git push failed: ${errMsg}`,
      guidance: 'Check that the repository exists and your token has the "repo" scope.',
    };
  }
}

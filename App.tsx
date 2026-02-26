import { useEffect } from 'react';
import { useStore } from './store';
import { useStoreConnection } from './hooks';
import { Spinner } from './components/ui';
import { SettingsPage } from './components/settings';
import { WorkspacePanel } from './components/WorkspacePanel';

const DEFAULT_WORKSPACE_ID = 'default-workspace';
const DEFAULT_REPO_PATH = '/tmp';

function App() {
  const connectionState = useStoreConnection();

  const {
    workspaces,
    selectedWorkspaceId,
    showSettings,
    getGlobalConfigValue,
    globalConfig,
    addRepo,
    addWorkspace,
    selectRepo,
    selectWorkspace,
  } = useStore();

  const theme = getGlobalConfigValue<string>('desktop.theme', 'system');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      prefersDark ? root.classList.add('dark') : root.classList.remove('dark');
    }
  }, [theme, globalConfig]);

  // Auto-initialize default workspace once connected
  useEffect(() => {
    if (connectionState !== 'connected') return;
    if (workspaces[DEFAULT_WORKSPACE_ID]) return;

    addRepo({
      path: DEFAULT_REPO_PATH,
      name: 'Chat',
      workspaceIds: [DEFAULT_WORKSPACE_ID],
      metadata: { lastAccessed: Date.now() },
      gitRemote: { originUrl: null, defaultBranch: 'main', syncStatus: 'unknown' },
    });

    addWorkspace({
      id: DEFAULT_WORKSPACE_ID,
      repoPath: DEFAULT_REPO_PATH,
      branch: 'main',
      worktreePath: DEFAULT_REPO_PATH,
      gitState: { currentCommit: '', isDirty: false, pendingChanges: [] },
      metadata: { createdAt: Date.now(), description: '', status: 'active' },
      context: { activeFiles: [], settings: {}, preferences: {} },
    });

    selectRepo(DEFAULT_REPO_PATH);
    selectWorkspace(DEFAULT_WORKSPACE_ID);
  }, [connectionState, workspaces, addRepo, addWorkspace, selectRepo, selectWorkspace]);

  if (connectionState !== 'connected') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground text-sm">Connecting...</p>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="h-screen flex flex-col">
        <SettingsPage />
      </div>
    );
  }

  const selectedWorkspace = selectedWorkspaceId ? workspaces[selectedWorkspaceId] : null;

  return (
    <div className="h-screen flex flex-col">
      <WorkspacePanel workspace={selectedWorkspace} emptyStateType={null} />
    </div>
  );
}

export default App;

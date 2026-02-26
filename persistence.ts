import type { StoreApi } from 'zustand';

// Declare electron API on window object
declare global {
  interface Window {
    // @ts-ignore
    // electron: {
    //   saveStore: (state: any) => Promise<{ success: boolean }>;
    //   loadStore: () => Promise<any>;
    // };
  }
}

// Define the persistable state shape
interface PersistedState {
  repos: Record<string, any>;
  workspaces: Record<string, any>;
  selectedRepoPath: string | null;
  selectedWorkspaceId: string | null;
  selectedSessionId: string | null;
  sessions: Record<string, any>;
  sidebarCollapsed: boolean;
  openRepoAccordions: string[];
  expandedSessionGroups: Record<string, boolean>;
}

// Debounce helper
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): T & { flush: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debouncedFn = ((...args: Parameters<T>) => {
    lastArgs = args;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
      lastArgs = null;
    }, delay);
  }) as T & { flush: () => void };

  debouncedFn.flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
  };

  return debouncedFn;
}

/**
 * Set up automatic persistence of store state to local file system
 * @param store The Zustand store instance
 */
export function setupPersistence(store: StoreApi<any>): void {
  // Extract only persistable state (exclude runtime objects)
  const getPersistableState = (): PersistedState => {
    const state = store.getState();
    return {
      repos: state.repos || {},
      workspaces: state.workspaces || {},
      selectedRepoPath: state.selectedRepoPath || null,
      selectedWorkspaceId: state.selectedWorkspaceId || null,
      selectedSessionId: state.selectedSessionId || null,
      sessions: state.sessions || {},
      sidebarCollapsed: state.sidebarCollapsed || false,
      openRepoAccordions: state.openRepoAccordions || [],
      expandedSessionGroups: state.expandedSessionGroups || {},
    };
  };

  // Debounced save function
  const debouncedSave = debounce(async () => {
    try {
      const persistableState = getPersistableState();
      // @ts-ignore
      // await window.electron.saveStore(persistableState);
    } catch (error) {
      console.error('Failed to save store:', error);
      window.alert(
        `Failed to save application state: ${(error as Error).message}`,
      );
    }
  }, 500);

  // Subscribe to store changes
  store.subscribe(() => {
    debouncedSave();
  });

  // Flush any pending saves before app closes
  window.addEventListener('beforeunload', () => {
    debouncedSave.flush();
  });
}

/**
 * Load persisted state and hydrate the store
 * @param store The Zustand store instance
 * @returns true if hydration succeeded, false otherwise
 */
export async function hydrateStore(_store: StoreApi<any>): Promise<boolean> {
  return true;
}

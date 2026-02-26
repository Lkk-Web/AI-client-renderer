/**
 * Web-compatible entry point for the renderer.
 * Polyfills window.electron with localStorage-based persistence.
 */

// Inject localStorage shim before anything else loads
// if (typeof window !== 'undefined' && !window.electron) {
//   const STORE_KEY = 'ai-renderer-store';
//   (window as any).electron = {
//     saveStore: async (state: any) => {
//       try {
//         localStorage.setItem(STORE_KEY, JSON.stringify(state));
//         return { success: true };
//       } catch {
//         return { success: false };
//       }
//     },
//     loadStore: async () => {
//       try {
//         const raw = localStorage.getItem(STORE_KEY);
//         return raw ? JSON.parse(raw) : null;
//       } catch {
//         return null;
//       }
//     },
//   };
// }

export { default } from './App';

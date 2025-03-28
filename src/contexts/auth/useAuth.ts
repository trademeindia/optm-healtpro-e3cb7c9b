// This file is no longer needed as useAuth is now exported from index.ts
// Can be safely removed, but keeping it for compatibility
import { useAuth as useAuthHook } from './index';

export const useAuth = useAuthHook;

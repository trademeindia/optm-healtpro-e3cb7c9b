
// Re-export from sonner for backward compatibility
import { toast } from "sonner";
import { useToast as useToastHook } from "@/hooks/use-toast";

export const useToast = useToastHook;
export { toast };

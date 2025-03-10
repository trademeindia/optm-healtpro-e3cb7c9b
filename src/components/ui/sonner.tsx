
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Default durations based on toast type
      toastOptions={{
        duration: 5000, // Default duration
        success: {
          duration: 3000, // Shorter duration for success messages
        },
        error: {
          duration: 5000, // Longer duration for error messages
        },
        info: {
          duration: 4000, // Medium duration for info messages
        },
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      position="bottom-right"
      closeButton
      richColors
      {...props}
    />
  )
}

export { Toaster }

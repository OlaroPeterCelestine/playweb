import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
  onClose?: () => void
}

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      // Close on Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onOpenChange(false)
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={() => onOpenChange(false)}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" />
      <div 
        className="relative z-50 w-full max-w-md mx-2 sm:mx-0 animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-gray-900/95 backdrop-blur-md border-2 rounded-xl shadow-2xl w-full p-4 sm:p-6",
          "border-gray-700",
          className
        )}
        {...props}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, children, ...props }: DialogHeaderProps) => {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-center sm:text-left mb-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn("text-xl sm:text-2xl font-semibold leading-none tracking-tight text-white", className)}
        {...props}
      >
        {children}
      </h2>
    )
  }
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-xs sm:text-sm text-gray-300", className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)
DialogDescription.displayName = "DialogDescription"

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription }


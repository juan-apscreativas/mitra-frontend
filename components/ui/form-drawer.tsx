"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { useFormContext } from "react-hook-form"
import { XIcon, Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { labels } from "@/lib/labels"

/* -------------------------------------------------------------------------- */
/*  Size variants                                                              */
/* -------------------------------------------------------------------------- */

const sizeClasses = {
  sm: "sm:max-w-sm",
  default: "sm:max-w-lg",
  lg: "sm:max-w-xl",
  xl: "sm:max-w-2xl",
  full: "sm:max-w-4xl",
} as const

type FormDrawerSize = keyof typeof sizeClasses

/* -------------------------------------------------------------------------- */
/*  FormDrawer (root)                                                          */
/* -------------------------------------------------------------------------- */

function FormDrawer({
  children,
  size = "default",
  ...props
}: { children: React.ReactNode; size?: FormDrawerSize } & Omit<DialogPrimitive.Root.Props, "children">) {
  return (
    <FormDrawerSizeContext.Provider value={size}>
      <DialogPrimitive.Root data-slot="form-drawer" modal={true} {...props}>
        {children}
      </DialogPrimitive.Root>
    </FormDrawerSizeContext.Provider>
  )
}

const FormDrawerSizeContext = React.createContext<FormDrawerSize>("default")

/* -------------------------------------------------------------------------- */
/*  FormDrawerOverlay                                                          */
/* -------------------------------------------------------------------------- */

function FormDrawerOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="form-drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs motion-reduce:transition-none motion-reduce:duration-0",
        className
      )}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  FormDrawerContent (internal — Portal + Overlay + Popup)                    */
/* -------------------------------------------------------------------------- */

function FormDrawerContent({
  className,
  children,
  ...props
}: DialogPrimitive.Popup.Props) {
  const size = React.useContext(FormDrawerSizeContext)

  return (
    <DialogPrimitive.Portal>
      <FormDrawerOverlay />
      <DialogPrimitive.Popup
        data-slot="form-drawer-content"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-background bg-clip-padding text-sm shadow-lg outline-none transition duration-200 ease-in-out data-ending-style:translate-x-full data-ending-style:opacity-0 data-starting-style:translate-x-full data-starting-style:opacity-0 motion-reduce:transition-none motion-reduce:duration-0",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

/* -------------------------------------------------------------------------- */
/*  FormDrawerHeader                                                           */
/* -------------------------------------------------------------------------- */

function FormDrawerHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-drawer-header"
      className={cn(
        "sticky top-0 z-10 bg-background flex items-start justify-between border-b p-4",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-0.5">{children}</div>
      <DialogPrimitive.Close
        data-slot="form-drawer-close"
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
          />
        }
      >
        <XIcon />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  FormDrawerTitle                                                            */
/* -------------------------------------------------------------------------- */

function FormDrawerTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="form-drawer-title"
      className={cn("text-base font-medium text-foreground", className)}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  FormDrawerDescription                                                      */
/* -------------------------------------------------------------------------- */

function FormDrawerDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="form-drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  FormDrawerBody                                                             */
/* -------------------------------------------------------------------------- */

function FormDrawerBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-drawer-body"
      className={cn("flex-1 overflow-y-auto p-4", className)}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  FormDrawerFooter                                                           */
/* -------------------------------------------------------------------------- */

function FormDrawerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-drawer-footer"
      className={cn(
        "flex items-center justify-end gap-2 border-t bg-muted/50 p-4",
        className
      )}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  FormDrawerClose                                                            */
/* -------------------------------------------------------------------------- */

function FormDrawerClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="form-drawer-close" {...props} />
}

/* -------------------------------------------------------------------------- */
/*  FormDrawerSubmitFooter                                                     */
/* -------------------------------------------------------------------------- */

function FormDrawerSubmitFooter({
  formId,
  submitLabel = labels.common.save,
  cancelLabel = labels.common.cancel,
}: {
  formId: string
  submitLabel?: string
  cancelLabel?: string
}) {
  const { formState } = useFormContext()
  const { isSubmitting } = formState

  return (
    <FormDrawerFooter>
      <FormDrawerClose render={<Button variant="outline" />}>
        {cancelLabel}
      </FormDrawerClose>
      <Button type="submit" form={formId} disabled={isSubmitting}>
        {isSubmitting && <Loader2Icon className="animate-spin motion-reduce:animate-none" />}
        {submitLabel}
      </Button>
    </FormDrawerFooter>
  )
}

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export {
  FormDrawer,
  FormDrawerContent,
  FormDrawerOverlay,
  FormDrawerHeader,
  FormDrawerTitle,
  FormDrawerDescription,
  FormDrawerBody,
  FormDrawerFooter,
  FormDrawerClose,
  FormDrawerSubmitFooter,
}

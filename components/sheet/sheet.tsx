import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import sheetRecipe from "./sheet.variants.json";
import { cn, composeRecipe } from "../../utils";
import { Button } from "../../ui/button/button";

export type SheetProps = HTMLAttributes<HTMLDivElement> & {
  variant?: string;
  side?: string;
  size?: string;
  open?: boolean;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  behavior?: string;
};

export type SheetTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  id?: string;
  for?: string;
  variant?: string;
  size?: string;
  open?: boolean;
  behavior?: string;
  "aria-label"?: string;
};

export type SheetOverlayProps = HTMLAttributes<HTMLDivElement> & {
  for?: string;
  open?: boolean;
  behavior?: string;
};

export type SheetContentProps = HTMLAttributes<HTMLDivElement>;
export type SheetHeaderProps = HTMLAttributes<HTMLDivElement>;
export type SheetTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type SheetDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export type SheetCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  for?: string;
  variant?: string;
  size?: string;
  behavior?: string;
  "aria-label"?: string;
};

function sheetState(open?: boolean): string {
  return open ? "open" : "closed";
}

function sheetBehavior(value?: string): string {
  return (value ?? "").trim() === "ui8kit" ? "ui8kit" : "";
}

function sheetRootAttrs(
  id?: string,
  open?: boolean,
  ariaLabel?: string,
  ariaLabelledBy?: string,
  ariaDescribedBy?: string,
  behavior?: string,
  rest?: HTMLAttributes<HTMLDivElement>
): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...(rest ?? {}) };
  if (id?.trim()) attrs.id = id.trim();
  attrs.role = "dialog";
  attrs["aria-modal"] = true;
  attrs["data-state"] = sheetState(open);
  if (ariaLabel?.trim()) attrs["aria-label"] = ariaLabel.trim();
  if (ariaLabelledBy?.trim()) attrs["aria-labelledby"] = ariaLabelledBy.trim();
  if (ariaDescribedBy?.trim()) attrs["aria-describedby"] = ariaDescribedBy.trim();
  if (sheetBehavior(behavior) === "ui8kit") {
    attrs["data-ui8kit"] = "sheet";
    attrs["data-ui8kit-dialog"] = true;
  }
  return attrs;
}

function sheetTriggerAttrs(
  forId?: string,
  open?: boolean,
  behavior?: string,
  rest?: ButtonHTMLAttributes<HTMLButtonElement>
): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...(rest ?? {}) };
  if (forId?.trim()) attrs["aria-controls"] = forId.trim();
  attrs["aria-haspopup"] = "dialog";
  attrs["aria-expanded"] = open ?? false;
  if (sheetBehavior(behavior) === "ui8kit" && forId?.trim()) {
    attrs["data-ui8kit-dialog-open"] = true;
    attrs["data-ui8kit-dialog-target"] = forId.trim();
  }
  return attrs;
}

function sheetCloseAttrs(
  forId?: string,
  behavior?: string,
  rest?: HTMLAttributes<HTMLElement>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(rest ?? {}) };
  if (sheetBehavior(behavior) === "ui8kit") {
    out["data-ui8kit-dialog-close"] = true;
    if (forId?.trim()) out["data-ui8kit-dialog-target"] = forId.trim();
  }
  return out;
}

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(function Sheet(
  {
    id,
    variant,
    side,
    size,
    open,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    behavior,
    className,
    hidden,
    children,
    ...rest
  },
  ref
) {
  const isHidden = hidden ?? !open;
  return (
    <div
      ref={ref}
      hidden={isHidden}
      className={composeRecipe(
        sheetRecipe,
        { side: side ?? "", size: size ?? "", variant: variant ?? "" },
        className
      )}
      {...sheetRootAttrs(
        id,
        open,
        ariaLabel,
        ariaLabelledBy,
        ariaDescribedBy,
        behavior,
        rest
      )}
    >
      {children}
    </div>
  );
});

export const SheetTrigger = forwardRef<HTMLButtonElement, SheetTriggerProps>(
  function SheetTrigger(
    {
      id,
      for: forId,
      variant,
      size,
      open,
      behavior,
      "aria-label": ariaLabel,
      className,
      children,
      ...rest
    },
    ref
  ) {
    return (
      <Button
        ref={ref}
        id={id}
        variant={variant}
        size={size}
        className={className}
        aria-label={ariaLabel}
        {...sheetTriggerAttrs(forId, open, behavior, rest)}
      >
        {children}
      </Button>
    );
  }
);

export const SheetOverlay = forwardRef<HTMLDivElement, SheetOverlayProps>(function SheetOverlay(
  { for: forId, open, behavior, className, hidden, ...rest },
  ref
) {
  const isHidden = hidden ?? !open;
  return (
    <div
      ref={ref}
      hidden={isHidden}
      className={cn("fixed inset-0 z-40 bg-background/80", className)}
      {...sheetCloseAttrs(forId, behavior, rest)}
    />
  );
});

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  { id, className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      id={id || undefined}
      className={cn("flex h-full flex-col overflow-y-auto p-4", className)}
      {...rest}
    >
      {children}
    </div>
  );
});

export const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(function SheetHeader(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("flex items-start justify-between gap-3", className)} {...rest}>
      {children}
    </div>
  );
});

export const SheetTitle = forwardRef<HTMLHeadingElement, SheetTitleProps>(function SheetTitle(
  { id, className, children, ...rest },
  ref
) {
  return (
    <h2 ref={ref} id={id || undefined} className={cn("text-sm font-semibold", className)} {...rest}>
      {children}
    </h2>
  );
});

export const SheetDescription = forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  function SheetDescription({ id, className, children, ...rest }, ref) {
    return (
      <p
        ref={ref}
        id={id || undefined}
        className={cn("text-sm text-muted-foreground", className)}
        {...rest}
      >
        {children}
      </p>
    );
  }
);

export const SheetClose = forwardRef<HTMLButtonElement, SheetCloseProps>(function SheetClose(
  { for: forId, variant, size, behavior, "aria-label": ariaLabel, className, children, ...rest },
  ref
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={className}
      aria-label={ariaLabel}
      {...sheetCloseAttrs(forId, behavior, rest)}
    >
      {children}
    </Button>
  );
});

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import sheetRecipeJson from "./sheet.variants.json";
import {
  cn,
  composeRecipe,
  defineRecipe,
  type BehaviorMode,
  normalizeBehaviorMode,
} from "../../utils";
import { Button, type ButtonVariant, type ButtonSize } from "../../ui/button/button";

const { recipe: sheetRecipe, keys: sheetKeys } = defineRecipe(sheetRecipeJson);

type SheetVariant = typeof sheetKeys.variant;
type SheetSide = typeof sheetKeys.side;
type SheetSize = typeof sheetKeys.size;

export type SheetProps = Omit<HTMLAttributes<HTMLDivElement>, "className" | "role"> & {
  variant?: SheetVariant;
  side?: SheetSide;
  size?: SheetSize;
  open?: boolean;
  className?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  behavior?: BehaviorMode;
};

export type SheetTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  id?: string;
  target?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  open?: boolean;
  behavior?: BehaviorMode;
  "aria-label"?: string;
};

export type SheetOverlayProps = HTMLAttributes<HTMLDivElement> & {
  target?: string;
  open?: boolean;
  behavior?: BehaviorMode;
};

export type SheetContentProps = HTMLAttributes<HTMLDivElement>;
export type SheetHeaderProps = HTMLAttributes<HTMLDivElement>;
export type SheetTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type SheetDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export type SheetCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  target?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  behavior?: BehaviorMode;
  "aria-label"?: string;
};

function sheetState(open?: boolean): string {
  return open ? "open" : "closed";
}

function sheetBehavior(value?: BehaviorMode): BehaviorMode {
  return normalizeBehaviorMode(value);
}

function sheetRootAttrs(
  id: string | undefined,
  open: boolean,
  ariaLabel: string | undefined,
  ariaLabelledBy: string | undefined,
  ariaDescribedBy: string | undefined,
  behavior: BehaviorMode | undefined,
  rest: HTMLAttributes<HTMLDivElement> | undefined
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
  targetId: string | undefined,
  open: boolean | undefined,
  behavior: BehaviorMode | undefined,
  rest: ButtonHTMLAttributes<HTMLButtonElement> | undefined
): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...(rest ?? {}) };
  if (targetId?.trim()) attrs["aria-controls"] = targetId.trim();
  attrs["aria-haspopup"] = "dialog";
  attrs["aria-expanded"] = open ?? false;
  if (sheetBehavior(behavior) === "ui8kit" && targetId?.trim()) {
    attrs["data-ui8kit-dialog-open"] = true;
    attrs["data-ui8kit-dialog-target"] = targetId.trim();
  }
  return attrs;
}

function sheetCloseAttrs(
  targetId: string | undefined,
  behavior: BehaviorMode | undefined,
  rest: HTMLAttributes<HTMLElement> | undefined
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...(rest ?? {}) };
  if (sheetBehavior(behavior) === "ui8kit") {
    out["data-ui8kit-dialog-close"] = true;
    if (targetId?.trim()) out["data-ui8kit-dialog-target"] = targetId.trim();
  }
  return out;
}

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(function Sheet(
  {
    id,
    variant,
    side,
    size,
    open = false,
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
      className={composeRecipe(
        sheetRecipe,
        { side, size, variant },
        className
      )}
      hidden={isHidden ? true : undefined}
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
Sheet.displayName = "Sheet";

export const SheetTrigger = forwardRef<HTMLButtonElement, SheetTriggerProps>(
  function SheetTrigger(
    {
      id,
      target,
      variant,
      size,
      open,
      behavior,
      "aria-label": ariaLabel,
      className,
      children,
      type,
      ...rest
    },
    ref
  ) {
    return (
      <Button
        ref={ref}
        id={id}
        type={type ?? "button"}
        variant={variant}
        size={size}
        className={className}
        aria-label={ariaLabel}
        {...sheetTriggerAttrs(target, open, behavior, rest)}
      >
        {children}
      </Button>
    );
  }
);
SheetTrigger.displayName = "SheetTrigger";

export const SheetOverlay = forwardRef<HTMLDivElement, SheetOverlayProps>(function SheetOverlay(
  { target, open = false, behavior, className, hidden, ...rest },
  ref
) {
  const isHidden = hidden ?? !open;

  return (
    <div
      ref={ref}
      className={cn("fixed inset-0 z-40 bg-background/80", className)}
      hidden={isHidden ? true : undefined}
      {...sheetCloseAttrs(target, behavior, rest)}
    />
  );
});
SheetOverlay.displayName = "SheetOverlay";

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  { id, className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      id={id || undefined}
      className={cn("relative z-50 flex h-full flex-col overflow-y-auto p-4", className)}
      {...rest}
    >
      {children}
    </div>
  );
});
SheetContent.displayName = "SheetContent";

export const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(function SheetHeader(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("flex items-start justify-between gap-4", className)} {...rest}>
      {children}
    </div>
  );
});
SheetHeader.displayName = "SheetHeader";

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
SheetTitle.displayName = "SheetTitle";

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
SheetDescription.displayName = "SheetDescription";

export const SheetClose = forwardRef<HTMLButtonElement, SheetCloseProps>(function SheetClose(
  { target, variant, size, behavior, "aria-label": ariaLabel, className, children, type, ...rest },
  ref
) {
  return (
    <Button
      ref={ref}
      type={type ?? "button"}
      variant={variant}
      size={size}
      className={className}
      aria-label={ariaLabel}
      {...sheetCloseAttrs(target, behavior, rest)}
    >
      {children}
    </Button>
  );
});
SheetClose.displayName = "SheetClose";

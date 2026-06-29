import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import cardRecipe from "./card.variants.json";
import { cn, composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";
import { titleTag } from "../../utils/attrs";
import { Slot } from "../../ui/slot/slot";

type CardVariant = RecipeKey<typeof cardRecipe, "variant">;

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  variant?: CardVariant;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export type CardHeaderProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  className?: string;
  children?: ReactNode;
};

export type CardContentProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  className?: string;
  children?: ReactNode;
};

export type CardFooterProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  className?: string;
  children?: ReactNode;
};

export type CardTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, "className"> & {
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children?: ReactNode;
};

export type CardDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, "className"> & {
  className?: string;
  children?: ReactNode;
};

const cardHeaderBase = "border-b border-border px-4 py-2";
const cardTitleBase = "text-sm font-semibold";
const cardDescriptionBase = "text-sm text-muted-foreground";
const cardContentBase = "p-4";
const cardFooterBase = "border-t border-border px-4 py-3";

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant, className, children, asChild, ...rest },
  ref
) {
  const cls = composeRecipe(cardRecipe as VariantRecipe, { variant: variant ?? "" }, className);
  if (asChild) {
    return (
      <Slot ref={ref} className={cls} {...rest}>
        {children}
      </Slot>
    );
  }
  return (
    <div ref={ref} className={cls} {...rest}>
      {children}
    </div>
  );
});
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn(cardHeaderBase, className)} {...rest}>
      {children}
    </div>
  );
});
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { order, className, children, ...rest },
  ref
) {
  const Tag = titleTag(order) as ElementType;
  return (
    <Tag ref={ref} className={cn(cardTitleBase, className)} {...rest}>
      {children}
    </Tag>
  );
});
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, children, ...rest }, ref) {
    return (
      <p ref={ref} className={cn(cardDescriptionBase, className)} {...rest}>
        {children}
      </p>
    );
  }
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn(cardContentBase, className)} {...rest}>
      {children}
    </div>
  );
});
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn(cardFooterBase, className)} {...rest}>
      {children}
    </div>
  );
});
CardFooter.displayName = "CardFooter";

Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

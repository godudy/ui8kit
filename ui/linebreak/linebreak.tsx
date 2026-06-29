import { forwardRef, type HTMLAttributes, type Ref } from "react";
import linebreakRecipe from "./linebreak.variants.json";
import { composeRecipe } from "../../utils";

export type BreakProps = HTMLAttributes<HTMLElement> & {
  type?: string;
};

function breakType(value?: string): "br" | "wbr" {
  const t = (value ?? "").trim();
  return t === "wbr" || t === "word" ? "wbr" : "br";
}

export const Break = forwardRef<HTMLElement, BreakProps>(function Break(
  { type, className, ...rest },
  ref
) {
  const cls = composeRecipe(linebreakRecipe, {}, className);
  if (breakType(type) === "wbr") {
    return <wbr ref={ref as Ref<HTMLElement>} className={cls} {...rest} />;
  }
  return <br ref={ref as unknown as Ref<HTMLBRElement>} className={cls} {...rest} />;
});
Break.displayName = "Break";

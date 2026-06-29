import {
  forwardRef,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type SourceHTMLAttributes,
} from "react";
import imageRecipe from "./image.variants.json";
import { composeRecipe, type RecipeKey, type VariantRecipe } from "../../utils";

type ImageVariant = RecipeKey<typeof imageRecipe, "variant">;
type ImageSize = RecipeKey<typeof imageRecipe, "size">;
type ImageFit = RecipeKey<typeof imageRecipe, "fit">;
type ImagePosition = RecipeKey<typeof imageRecipe, "position">;
type ImageAspect = RecipeKey<typeof imageRecipe, "aspect">;

export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "className"> & {
  variant?: ImageVariant;
  size?: ImageSize;
  fit?: ImageFit;
  position?: ImagePosition;
  aspect?: ImageAspect;
  fetchPriority?: string;
  decorative?: boolean;
  className?: string;
};

export type PictureProps = HTMLAttributes<HTMLPictureElement>;
export type SourceProps = SourceHTMLAttributes<HTMLSourceElement>;

function imageAlt(alt?: string, decorative?: boolean): string {
  return decorative ? "" : alt ?? "";
}

function imageLoading(value?: string): "lazy" | "eager" {
  return (value ?? "").trim() === "eager" ? "eager" : "lazy";
}

function imageDecoding(value?: string): "async" | "sync" | "auto" {
  const v = (value ?? "").trim();
  return v === "sync" || v === "auto" ? v : "async";
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    variant,
    size,
    fit,
    position,
    aspect,
    src,
    srcSet,
    sizes,
    alt,
    width,
    height,
    loading,
    decoding,
    fetchPriority,
    decorative,
    id,
    className,
    ...rest
  },
  ref
) {
  return (
    <img
      ref={ref}
      id={id?.trim() || undefined}
      src={src}
      srcSet={srcSet || undefined}
      sizes={sizes || undefined}
      alt={imageAlt(alt, decorative)}
      width={width || undefined}
      height={height || undefined}
      loading={imageLoading(loading)}
      decoding={imageDecoding(decoding)}
      fetchPriority={fetchPriority || undefined}
      className={composeRecipe(
        imageRecipe as VariantRecipe,
        {
          variant: variant ?? "",
          size: size ?? "",
          fit: fit ?? "",
          position: position ?? "",
          aspect: aspect ?? "",
        },
        className
      )}
      aria-hidden={decorative ? true : rest["aria-hidden"]}
      {...rest}
    />
  );
});
Image.displayName = "Image";

export const Picture = forwardRef<HTMLPictureElement, PictureProps>(function Picture(
  { className, children, ...rest },
  ref
) {
  return (
    <picture ref={ref} className={className} {...rest}>
      {children}
    </picture>
  );
});
Picture.displayName = "Picture";

export const Source = forwardRef<HTMLSourceElement, SourceProps>(function Source(
  { srcSet, src, media, type, sizes, ...rest },
  ref
) {
  return (
    <source
      ref={ref}
      srcSet={srcSet || undefined}
      src={src || undefined}
      media={media || undefined}
      type={type || undefined}
      sizes={sizes || undefined}
      {...rest}
    />
  );
});
Source.displayName = "Source";

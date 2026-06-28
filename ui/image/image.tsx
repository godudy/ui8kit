import {
  forwardRef,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type SourceHTMLAttributes,
} from "react";
import imageRecipe from "./image.variants.json";
import { composeRecipe } from "../../utils/variants";

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  variant?: string;
  size?: string;
  fit?: string;
  position?: string;
  aspect?: string;
  fetchPriority?: string;
  decorative?: boolean;
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
        imageRecipe,
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

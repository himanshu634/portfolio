import Image from "next/image";

interface MDXImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function MDXImage({
  src,
  alt,
  caption,
  width = 800,
  height = 600,
}: MDXImageProps) {
  return (
    <figure className="my-8">
      <div className="relative w-full overflow-hidden border-2 border-border">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

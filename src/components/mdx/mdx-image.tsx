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
      <div className="relative w-full rounded-lg overflow-hidden border border-accent-2">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-accent-2 mt-2 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

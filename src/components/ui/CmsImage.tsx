import Image, { type ImageProps } from 'next/image'

import type { Media } from '@/payload-types'

type Props = Omit<ImageProps, 'src' | 'alt' | 'placeholder' | 'blurDataURL'> & {
  media: Media
  alt?: string
}

export function CmsImage({ media, alt, fill, width, height, ...props }: Props) {
  const placeholder = media.blurDataURL ? 'blur' : 'empty'

  if (fill) {
    return (
      <Image
        src={media.url!}
        alt={alt ?? media.alt}
        fill
        placeholder={placeholder}
        blurDataURL={media.blurDataURL ?? undefined}
        {...props}
      />
    )
  }

  return (
    <Image
      src={media.url!}
      alt={alt ?? media.alt}
      width={width ?? media.width ?? undefined}
      height={height ?? media.height ?? undefined}
      placeholder={placeholder}
      blurDataURL={media.blurDataURL ?? undefined}
      {...props}
    />
  )
}

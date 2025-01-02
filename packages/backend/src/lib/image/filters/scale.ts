import type { AudioVideoFilter } from 'fluent-ffmpeg'

type ScaleProps = Readonly<{
  width: number
  height: number
}>

export const scale = ({ width, height }: ScaleProps): AudioVideoFilter => ({
  filter: 'scale',
  options: `${width}:${height}`,
})

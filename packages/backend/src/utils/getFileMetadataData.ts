import ffmpeg from 'fluent-ffmpeg'
import { toEitherAsync } from './eitherAsync'
import type { EitherAsync } from 'purify-ts'

export type FileMetadata = ffmpeg.FfprobeData

export const getFileMetadata = (
  filePath: string,
): EitherAsync<string, FileMetadata> => {
  return toEitherAsync((resolve, reject) => {
    ffmpeg(filePath).ffprobe((error, data) => {
      if (error) {
        return reject(`Failed to get metadata for file ${filePath}`)
      }
      return resolve(data)
    })
  })
}

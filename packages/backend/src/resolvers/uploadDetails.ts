import type {
  QueryUploadDetailsArgs,
  UploadDetails,
} from "../generated/graphql";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import type { ServerContext } from "../serverContext";
import { randomUUID } from "node:crypto";

const URL_TIMEOUT_S = 60 * 15;

const getUploadUrl = async (
  s3Client: S3Client,
  bucket: string,
  key: string
) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return await getSignedUrl(s3Client, command, {
    expiresIn: URL_TIMEOUT_S,
  });
};

export const uploadDetails = async (
  _: unknown,
  args: QueryUploadDetailsArgs,
  contextValue: ServerContext
): Promise<UploadDetails> => {
  const { audioExtension, imageExtension } = args.input;

  const audioFilename = `${randomUUID()}.${audioExtension}`;
  const audioUploadUrl = await getUploadUrl(
    contextValue.s3.client,
    contextValue.s3.uploadBucket,
    audioFilename
  );
  const imageFilename = `${randomUUID()}.${imageExtension}`;
  const imageUploadUrl = await getUploadUrl(
    contextValue.s3.client,
    contextValue.s3.uploadBucket,
    imageFilename
  );

  return {
    audioUploadUrl,
    imageUploadUrl,
    audioFilename,
    imageFilename,
  };
};

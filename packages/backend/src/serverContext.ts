import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./environment";

type S3Context = {
  client: S3Client;
  uploadBucket: string;
  downloadBucket: string;
};

export type ServerContext = {
  s3: S3Context;
};

export const getServerContext = async (): Promise<ServerContext> => ({
  s3: {
    client: new S3Client({ region: env.AWS_REGION }),
    uploadBucket: env.UPLOAD_BUCKET,
    downloadBucket: env.DOWNLOAD_BUCKET,
  },
});

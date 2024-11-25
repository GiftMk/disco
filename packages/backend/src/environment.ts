import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  AWS_REGION: str(),
  UPLOAD_BUCKET: str(),
  DOWNLOAD_BUCKET: str(),
});

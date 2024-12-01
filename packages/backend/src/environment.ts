import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  AWS_REGION: str({ default: "ap-southeast-2" }),
  UPLOAD_BUCKET: str({ default: "foo" }),
  DOWNLOAD_BUCKET: str({ default: "" }),
});

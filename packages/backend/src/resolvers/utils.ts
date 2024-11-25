import { randomUUID } from "node:crypto";

export const generateFilename = (extension: string): string => {
  return `${randomUUID()}.${extension}`;
};

import { randomUUID } from "node:crypto";

export const filePath = (
  parentDirectory: ".input" | ".output",
  filename: string
): string => {
  return `.outputs/${filename}`;
};

export const generateFilename = (extension: string): string => {
  return `${randomUUID()}.${extension}`;
};

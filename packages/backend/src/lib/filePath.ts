import { randomUUID } from "node:crypto";

export const filePath = (
  parentDirectory: ".inputs" | ".outputs",
  filename: string
): string => {
  return `${parentDirectory}/${filename}`;
};

export const generateFilename = (extension: string): string => {
  return `${randomUUID()}.${extension}`;
};

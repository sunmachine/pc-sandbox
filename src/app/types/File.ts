export interface File {
  url: string;
  filename: string;
  size?: number;
  hash?: string;
  contents?: ArrayBuffer;
}

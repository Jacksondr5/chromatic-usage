"use client";

interface FileUploadProps {
  onChange: (file: File | undefined) => void;
}

export const FileUpload = ({ onChange }: FileUploadProps) => (
  <input
    type="file"
    id="chromatic-csv"
    onChange={(e) => onChange(e.target.files ? e.target.files[0] : undefined)}
  />
);

"use client";

import { loadFile } from "~/database/loadFile";
import { parseChromaticCsv } from "~/parseChromaticCsv";

interface FileUploadProps {
  onChange: (file: File | undefined) => void;
}

export const FileUpload = ({ onChange }: FileUploadProps) => (
  <input
    type="file"
    id="chromatic-csv"
    accept=".csv"
    onChange={async (e) => {
      const file = e.target.files ? e.target.files[0] : undefined;
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target?.result;
        if (typeof csv === "string") {
          // console.log(csv);
          const builds = parseChromaticCsv(csv);
          await loadFile(builds);
        }
      };
      reader.readAsText(file);
      // onChange(e.target.files ? e.target.files[0] : undefined);
    }}
  />
);

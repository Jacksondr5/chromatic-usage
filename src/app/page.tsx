"use client";
import { useState } from "react";
import {
  type ChromaticBuild,
  parseChromaticCsv,
} from "~/server/parseChromaticCsv";
import { FileUpload } from "./FileUpload";
import { Label } from "~/components/ui/label";

export default function HomePage() {
  const [chromaticData, setChromaticData] = useState<ChromaticBuild[]>([]);
  const handleFileUpload = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result;
        if (typeof csv === "string") {
          // console.log(csv);
          setChromaticData(parseChromaticCsv(csv));
          return;
        }
        throw new Error("Failed to read file");
      };
      reader.readAsText(file);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1>Chromatic Usage Tool</h1>

        <FileUpload />
      </div>
    </main>
  );
}

"use client";
import { useState } from "react";
import { AreaChart } from "./components/AreaChart";
import { FileUpload } from "./components/FileUpload";
import { ChromaticBuild, parseChromaticCsv } from "~/parseChromaticCsv";
import { ChromaticAppForm } from "./components/ChromaticAppForm";

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1>Chromatic Usage Tool</h1>
        <label htmlFor="chromatic-csv">Upload Chromatic CSV</label>
        {/* <FileUpload onChange={handleFileUpload} />
        {chromaticData.length > 0 && <AreaChart data={chromaticData} />} */}
        <ChromaticAppForm />
      </div>
    </main>
  );
}

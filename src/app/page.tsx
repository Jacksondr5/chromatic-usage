"use client";
import { AreaChart } from "./components/AreaChart";
import { FileUpload } from "./components/FileUpload";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1>Chromatic Usage Tool</h1>
        <label htmlFor="chromatic-csv">Upload Chromatic CSV</label>
        <FileUpload onChange={(file) => console.log(file)} />
        <AreaChart />
      </div>
    </main>
  );
}

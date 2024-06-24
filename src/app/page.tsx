"use client";
import { FileUpload } from "./FileUpload";
import { CumulativeDailySnapshotsChart } from "./components/CumulativeDailySnapshotsChart";
import { DailySnapshotsByAppChart } from "./components/DailySnapshotsByAppChart";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1>Chromatic Usage Tool</h1>

        <FileUpload />
        <div className="flex w-full gap-10">
          <DailySnapshotsByAppChart />
          <CumulativeDailySnapshotsChart />
        </div>
      </div>
    </main>
  );
}

"use client";
import { FileUpload } from "./FileUpload";
import { CumulativeSnapshotsByApp } from "./components/CumulativeSnapshotsByApp";
import { CumulativeSnapshotsByType } from "./components/CumulativeSnapshotsByType";
import { DailySnapshotsByApp } from "./components/DailySnapshotsByApp";
import { NormalizedTurbosnapsByApp } from "./components/NormalizedTurbosnapsByApp";
import { DailyNormalizedTurbosnaps } from "./components/DailyNormalizedTurbosnaps";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1>Chromatic Usage Tool</h1>

        <FileUpload />
        <div className="grid grid-flow-row grid-cols-3 gap-5">
          <DailySnapshotsByApp />
          <CumulativeSnapshotsByApp />
          <CumulativeSnapshotsByType />
          <DailyNormalizedTurbosnaps />
          <NormalizedTurbosnapsByApp />
        </div>
      </div>
    </main>
  );
}

import { ChromaticApps } from "./chromaticApps";

export default function Settings() {
  return (
    <main className="flex flex-col items-center py-5">
      <h1 className="mb-10 text-3xl text-slate-200">Settings</h1>
      <ChromaticApps />
    </main>
  );
}

import { ChromaticAppForm } from "./ChromaticAppForm";
import { DeleteButton } from "./deleteButton";
import { api } from "~/trpc/server";

export const ChromaticApps = async () => {
  const apps = await api.chromaticApp.getAll();

  return (
    <div className="flex w-[42rem] flex-col items-center">
      <h2 className="mb-3 text-xl font-semibold text-slate-200">
        Chromatic Apps
      </h2>
      <div className="mb-4 w-[38rem] text-center">
        <p className="mb-2">
          The Chromatic usage CSV gives us the App ID for each build. To convert
          that to the name of your Project, add the name and ID to this table.
        </p>
        <p>
          You can find the App ID by going to your project&apos;s Build page and
          grabbing the `appId` query string parameter from the URL.
        </p>
      </div>
      <table className="w-[38rem]">
        <thead className="border-b border-slate-400/20 text-lg font-semibold">
          <tr>
            <th className="w-5/12 text-left">Project Name</th>
            <th className="w-5/12 text-left">App ID</th>
            <th className="w-1/6">Delete</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr className="border-b border-slate-400/10" key={app.id}>
              <td className="py-1">{app.name}</td>
              <td>{app.id}</td>
              <td className="text-center">
                <DeleteButton id={app.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className="m-8 h-px w-full border-0 bg-slate-400" />
      <ChromaticAppForm />
    </div>
  );
};

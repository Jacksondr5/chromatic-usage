import { api } from "~/trpc/react";

export const ChromaticAppForm = () => {
  const createChromaticApp = api.chromaticApp.add.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("test");
        console.log(e.currentTarget.id.value);
        createChromaticApp.mutate({
          id: e.currentTarget.id.value,
          name: e.currentTarget.name.value,
        });
      }}
      className="flex w-60 flex-col gap-4 text-black"
    >
      <input type="text" name="id" placeholder="App ID" />
      <input type="text" name="name" placeholder="App Name" />
      <button
        className="text-white"
        type="submit"
        disabled={createChromaticApp.isPending}
      >
        {createChromaticApp.isPending ? "Submitting..." : "Add Chromatic App"}
      </button>
    </form>
  );
};

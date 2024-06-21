import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";

type Inputs = {
  id: string;
  name: string;
};

export const ChromaticAppForm = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const createChromaticApp = api.chromaticApp.add.useMutation();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    createChromaticApp.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-60 flex-col gap-4 text-black"
    >
      <input
        type="text"
        placeholder="App ID"
        {...register("id", { required: true })}
      />
      <input
        type="text"
        placeholder="App Name"
        {...register("name", { required: true })}
      />
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

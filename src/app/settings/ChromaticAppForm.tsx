"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

type FormInputs = {
  id: string;
  name: string;
};

export const ChromaticAppForm = () => {
  const { register, handleSubmit } = useForm<FormInputs>();
  const createChromaticApp = api.chromaticApp.add.useMutation();
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    createChromaticApp.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[38rem] gap-4 text-black"
    >
      <Input
        className="w-5/12"
        type="text"
        placeholder="App Name"
        {...register("name", { required: true })}
      />
      <Input
        className="w-5/12"
        type="text"
        placeholder="App ID"
        {...register("id", { required: true })}
      />
      <Button
        className="w-2/12"
        type="submit"
        disabled={createChromaticApp.isPending}
      >
        Add
      </Button>
    </form>
  );
};

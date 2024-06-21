"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { parseChromaticCsv } from "~/server/parseChromaticCsv";
import { api } from "~/trpc/react";

type FormInputs = {
  file: FileList;
};

export const FileUpload = () => {
  const { register, handleSubmit } = useForm<FormInputs>();
  const uploadBuilds = api.build.uploadBatch.useMutation();
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log(data);
    const file = data.file[0];
    if (!file) {
      console.error("no file");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target?.result;
      if (typeof csv === "string") {
        const builds = parseChromaticCsv(csv);
        console.log(builds);
        uploadBuilds.mutate(builds);
      }
    };
    reader.readAsText(file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="chromatic-csv">Upload Chromatic CSV</Label>
      <Input
        id="chromatic-csv"
        type="file"
        accept=".csv"
        // onChange={async (e) => {
        //   const file = e.target.files ? e.target.files[0] : undefined;
        //   if (!file) return;
        //   const reader = new FileReader();
        //   reader.onload = async (e) => {
        //     const csv = e.target?.result;
        //     if (typeof csv === "string") {
        //       // console.log(csv);
        //       const builds = parseChromaticCsv(csv);
        //       // TODO: replace with trpc mutation
        //       // await loadFile(builds);
        //     }
        //   };
        //   reader.readAsText(file);
        //   // onChange(e.target.files ? e.target.files[0] : undefined);
        // }}
        {...register("file", { required: true })}
      />
      <Button type="submit">Upload</Button>
    </form>
  );
};

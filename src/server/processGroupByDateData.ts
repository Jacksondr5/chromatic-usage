import dayjs from "dayjs";

type GroupByDateData = {
  date: string;
};

type UseDateType<T extends GroupByDateData> = Omit<T, "date"> & { date: Date };

function fill<T extends GroupByDateData, K>(
  data: T[],
  doFill: (currentDate: dayjs.Dayjs) => K[],
) {
  // Dayjs treats undefined as the current date, null as invalid
  const firstDate = dayjs(data[0]?.date ?? null);
  const lastDate = dayjs(data[data.length - 1]?.date ?? null);
  if (!firstDate.isValid() || !lastDate.isValid()) {
    return [];
  }

  const res = [];
  let currentDate = firstDate.clone();
  while (currentDate <= lastDate) {
    res.push(...doFill(currentDate));
    currentDate = currentDate.add(1, "day");
  }
  return res;
}

/**
 * Ensures that there is an object in the array for each date between the first and last date
 */
export function fillGroupByDate<T extends GroupByDateData>(
  data: T[],
  defaultData: Omit<T, keyof GroupByDateData>,
): UseDateType<T>[] {
  return fill(data, (currentDate) => {
    const dateString = currentDate.format("YYYY-MM-DD");
    const existing = data.find((x) => x.date === dateString);
    if (existing) {
      return [{ ...existing, date: currentDate.toDate() }];
    } else {
      return [{ ...defaultData, date: currentDate.toDate() }];
    }
  });
}

type GroupByDateAndAppData = GroupByDateData & {
  appName: string;
};

type UseDateAndAppNameType<T extends GroupByDateAndAppData> = Omit<
  T,
  "date" | "appName"
> & { date: Date; appName: string };

export function fillGroupByDateAndApp<T extends GroupByDateAndAppData>(
  data: T[],
  defaultData: Omit<T, keyof GroupByDateAndAppData>,
): UseDateAndAppNameType<T>[] {
  const appNames = [...new Set(data.map((x) => x.appName))];
  return fill(data, (currentDate: dayjs.Dayjs) => {
    const dateString = currentDate.format("YYYY-MM-DD");
    const matchingRows = data.filter((x) => x.date === dateString);
    return appNames.map((appName) => {
      const existing = matchingRows.find((x) => x.appName === appName);
      if (existing) {
        return { ...existing, date: currentDate.toDate() };
      } else {
        return { ...defaultData, date: currentDate.toDate(), appName };
      }
    });
  });
}

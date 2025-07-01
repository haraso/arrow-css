interface Item<T = any> {
  id: string;
  weightAvg: number;
  count: number;
  weightSum: number;
  data: T;
}

export function createList<T>() {
  const record: Record<string, Item<T>> = {};
  let sorted: Item<T>[] = [];
  return {
    has(id: string) {
      return id in record;
    },
    addItem(id: string, weight: number, data: T) {
      if (id in record) {
        return {
          item: record[id].data,
          itemBefore: sorted[sorted.indexOf(record[id]) - 1]?.data || null,
        };
      }
      record[id] = {
        id,
        count: 1,
        weightSum: weight,
        weightAvg: weight,
        data,
      };

      sorted.push(record[id]);
      sorted = sorted.sort((a, b) => a.weightAvg - b.weightAvg);
      return {
        item: record[id].data,
        itemBefore: sorted[sorted.indexOf(record[id]) - 1]?.data || null,
      };
    },
    delItem(id: string, weight: number) {
      if (record[id].count === 1) {
        const item = record[id];
        delete record[id];
        const idx = sorted.findIndex((item) => {
          return id === item.id;
        });
        sorted.splice(idx, 1);
        return {
          item: item.data,
          deleted: true,
          itemBefore: null,
        };
      }

      record[id].weightSum -= weight!;
      record[id].count -= 1;
      record[id].weightAvg = record[id].weightSum / record[id].count;
      sorted = sorted.sort((a, b) => a.weightAvg - b.weightAvg);
      return {
        item: record[id].data,
        deleted: false,
        itemBefore: sorted[sorted.indexOf(record[id]) - 1]?.data || null,
      };
    },
    setWeight(id: string, weight: number) {
      const item = record[id];
      item.weightSum += weight;
      item.count += 1;
      item.weightAvg = item.weightSum / item.count;

      sorted = sorted.sort((a, b) => a.weightAvg - b.weightAvg);

      return {
        item: record[id].data,
        itemBefore: sorted[sorted.indexOf(record[id]) - 1]?.data || null,
      };
    },
  };
}

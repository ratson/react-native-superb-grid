import { useCallback, useEffect } from 'react';
import { chunkArray } from '../utils';

function useRows({
  data,
  itemsPerRow,
  invertedRow,
  keyExtractor,
  onItemsPerRowChange,
}: {
  data: unknown[];
  itemsPerRow: number;
  invertedRow: boolean;
  keyExtractor: (item, index: number) => string;
  onItemsPerRowChange: (n: number) => void;
}) {
  let rows = chunkArray(data, itemsPerRow); // Splitting the data into rows

  if (invertedRow) {
    rows = rows.map((r) => r.reverse());
  }

  const localKeyExtractor = useCallback(
    (rowItems, index: number) => {
      if (keyExtractor) {
        return rowItems.map((rowItem, rowItemIndex) => keyExtractor(rowItem, rowItemIndex)).join('_');
      }
      return `row_${index}`;
    },
    [keyExtractor],
  );

  useEffect(() => {
    if (onItemsPerRowChange) {
      onItemsPerRowChange(itemsPerRow);
    }
  }, [itemsPerRow, onItemsPerRowChange]);

  return { rows, keyExtractor: localKeyExtractor };
}

export default useRows;

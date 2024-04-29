import type React from 'react';
import { useCallback } from 'react';
import { type ListRenderItemInfo, type StyleProp, View, type ViewStyle } from 'react-native';

function useRenderRow<T extends { _fullWidth?: number }>({
  renderItem,
  spacing,
  keyExtractor,
  externalRowStyle,
  itemContainerStyle,
  horizontal,
  invertedRow,
}: {
  renderItem: (
    props: ListRenderItemInfo<T> & {
      rowIndex: number;
    },
  ) => React.ReactElement;
  spacing: number;
  keyExtractor: (item: T, index: number) => string;
  externalRowStyle: StyleProp<ViewStyle>;
  itemContainerStyle: StyleProp<ViewStyle>;
  horizontal: boolean;
  invertedRow: boolean;
}) {
  return useCallback(
    ({
      rowItems,
      rowIndex,
      separators,
      isLastRow,
      itemsPerRow,
      rowStyle,
      containerStyle,
      containerFullWidthStyle,
    }: Partial<ListRenderItemInfo<T>> & {
      rowItems: T[];
      rowIndex: number;
      isLastRow: boolean;
      itemsPerRow: number;
      rowStyle: typeof externalRowStyle;
      containerStyle: typeof itemContainerStyle;
      containerFullWidthStyle: StyleProp<ViewStyle>;
    }) => {
      // To make up for the top padding
      const additionalRowStyle = isLastRow
        ? {
            [horizontal ? 'marginRight' : 'marginBottom']: spacing,
          }
        : {};

      const hasFullWidthItem = !!rowItems.find((i) => i._fullWidth);

      return (
        <View style={[rowStyle, additionalRowStyle, externalRowStyle, hasFullWidthItem ? { flexDirection: 'column', paddingBottom: 0 } : {}]}>
          {rowItems.map((item, index) => {
            const i = invertedRow ? -index + itemsPerRow - 1 : index;

            return (
              <View
                key={keyExtractor ? keyExtractor(item, rowIndex * itemsPerRow + i) : `item_${rowIndex * itemsPerRow + i}`}
                style={[item._fullWidth ? containerFullWidthStyle : containerStyle, itemContainerStyle]}
              >
                {renderItem({
                  item,
                  index: rowIndex * itemsPerRow + i,
                  separators,
                  rowIndex,
                })}
              </View>
            );
          })}
        </View>
      );
    },
    [renderItem, spacing, keyExtractor, externalRowStyle, itemContainerStyle, horizontal, invertedRow],
  );
}

export default useRenderRow;

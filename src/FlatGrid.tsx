import type React from 'react';
import { forwardRef, memo, useMemo } from 'react';
import { FlatList, type FlatListProps } from 'react-native';
import useDimensions from './hooks/useDimensions';
import useRenderRow from './hooks/useRenderRow';
import useRows from './hooks/useRows';
import { type CommonProps, generateStyles } from './utils';

/**
 * React Native Super Grid Properties
 */
interface FlatGridBaseProps<ItemType> extends FlatListProps<ItemType>, CommonProps<ItemType> {
  /**
   * Items to be rendered. renderItem will be called with each item in this array.
   */
  data: ItemType[];

  /**
   * Overwrites FlatList with custom interface
   */
  customFlatList?: typeof FlatList;
}

export type FlatGridProps<ItemType = unknown> = FlatGridBaseProps<ItemType> & React.RefAttributes<FlatList<ItemType>>;

const FlatGrid = memo<FlatGridProps>(
  forwardRef((props, ref) => {
    const {
      style,
      spacing,
      fixed,
      data,
      itemDimension,
      renderItem,
      horizontal,
      onLayout: _,
      staticDimension,
      maxDimension,
      additionalRowStyle: externalRowStyle,
      itemContainerStyle,
      keyExtractor: customKeyExtractor,
      invertedRow,
      maxItemsPerRow,
      adjustGridToStyles,
      customFlatList: FlatListComponent = FlatList,
      onItemsPerRowChange,
      ...restProps
    } = {
      fixed: false,
      itemDimension: 120,
      spacing: 10,
      style: {},
      additionalRowStyle: undefined,
      itemContainerStyle: undefined,
      staticDimension: undefined,
      horizontal: false,
      onLayout: null,
      keyExtractor: null,
      listKey: undefined,
      maxDimension: undefined,
      invertedRow: false,
      maxItemsPerRow: undefined,
      adjustGridToStyles: false,
      onItemsPerRowChange: undefined,
      customFlatList: undefined,
      ...props,
    };

    const { onLayout, totalDimension, itemsPerRow, containerDimension, fixedSpacing } = useDimensions(props);

    const { containerStyle, containerFullWidthStyle, rowStyle } = useMemo(
      () =>
        generateStyles({
          horizontal,
          itemDimension,
          containerDimension,
          spacing,
          fixedSpacing,
          fixed,
          itemsPerRow,
        }),
      [horizontal, itemDimension, containerDimension, itemsPerRow, spacing, fixedSpacing, fixed],
    );

    const { rows, keyExtractor } = useRows({
      data,
      invertedRow,
      itemsPerRow,
      keyExtractor: customKeyExtractor,
      onItemsPerRowChange,
    });

    const renderRow = useRenderRow({
      renderItem,
      spacing,
      keyExtractor: customKeyExtractor,
      externalRowStyle,
      itemContainerStyle,
      horizontal,
      invertedRow,
    });

    return (
      <FlatListComponent
        data={rows}
        ref={ref}
        extraData={totalDimension}
        // @ts-ignore
        renderItem={({ item, index }) =>
          renderRow({
            rowItems: item,
            rowIndex: index,
            isLastRow: index === rows.length - 1,
            itemsPerRow,
            rowStyle,
            containerStyle,
            containerFullWidthStyle,
          })
        }
        style={[
          {
            ...(horizontal ? { paddingLeft: spacing } : { paddingTop: spacing }),
          },
          style,
        ]}
        onLayout={onLayout}
        keyExtractor={keyExtractor}
        {...restProps}
        horizontal={horizontal}
      />
    );
  }),
);

FlatGrid.displayName = 'FlatGrid';

export default FlatGrid;

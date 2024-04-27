import type React from 'react';
import { forwardRef, memo, useMemo } from 'react';
import { View, type ViewProps } from 'react-native';
import type { FlatGridProps } from './FlatGrid';
import useDimensions from './hooks/useDimensions';
import useRenderRow from './hooks/useRenderRow';
import useRows from './hooks/useRows';
import { generateStyles } from './utils';

export type SimpleGridProps<ItemType = unknown> = React.PropsWithoutRef<
  Pick<
    FlatGridProps<ItemType>,
    | 'data'
    | 'fixed'
    | 'itemDimension'
    | 'spacing'
    | 'style'
    | 'additionalRowStyle'
    | 'itemContainerStyle'
    | 'staticDimension'
    | 'horizontal'
    | 'onLayout'
    | 'keyExtractor'
    | 'maxDimension'
    | 'invertedRow'
    | 'maxItemsPerRow'
    | 'adjustGridToStyles'
    | 'onItemsPerRowChange'
    | 'renderItem'
  >
> &
  React.RefAttributes<View> &
  ViewProps;

const SimpleGrid = memo<SimpleGridProps>(
  forwardRef((props, ref) => {
    const {
      style,
      spacing,
      fixed,
      data,
      itemDimension,
      renderItem,
      horizontal,
      additionalRowStyle: externalRowStyle,
      itemContainerStyle,
      keyExtractor: customKeyExtractor,
      invertedRow,
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
      ...props,
    };

    const { onLayout, itemsPerRow, containerDimension, fixedSpacing } = useDimensions(props);

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
      <View
        style={[
          {
            ...(horizontal ? { paddingLeft: spacing } : { paddingTop: spacing }),
          },
          style,
        ]}
        ref={ref}
        {...restProps}
      >
        {rows.map((row, index) => (
          <View key={keyExtractor(row, index)} onLayout={onLayout}>
            {renderRow({
              rowItems: row,
              rowIndex: index,
              isLastRow: index === rows.length - 1,
              itemsPerRow,
              rowStyle,
              containerStyle,
              containerFullWidthStyle,
              separators: null,
            })}
          </View>
        ))}
      </View>
    );
  }),
);

SimpleGrid.displayName = 'SimpleGrid';

export default SimpleGrid;

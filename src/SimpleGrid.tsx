import type React from 'react';
import { forwardRef, memo, useMemo } from 'react';
import { View, type ViewProps } from 'react-native';
import type { FlatGridProps } from './FlatGrid';
import useDimensions from './hooks/useDimensions';
import useRenderRow from './hooks/useRenderRow';
import useRows from './hooks/useRows';
import { generateStyles } from './utils';

export type SimpleGridProps<ItemType> = ViewProps &
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
  >;

const SimpleGrid = forwardRef(<T,>(props: SimpleGridProps<T>, ref: React.Ref<View>) => {
  const {
    style = {},
    spacing = 10,
    fixed = false,
    data,
    itemDimension = 120,
    renderItem,
    horizontal = false,
    additionalRowStyle: externalRowStyle,
    itemContainerStyle,
    keyExtractor: customKeyExtractor = null,
    invertedRow = false,
    onItemsPerRowChange,
    ...restProps
  } = {
    onLayout: null,
    listKey: undefined,
    adjustGridToStyles: false,
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
            rowItems: row as never,
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
});

export default memo(SimpleGrid);

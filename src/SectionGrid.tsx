import type React from 'react';
import { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, SectionList, type SectionListProps, type SectionListRenderItemInfo, View } from 'react-native';
import { type CommonProps, calculateDimensions, chunkArray, generateStyles, getAdjustedTotalDimensions } from './utils';

export type SectionGridRenderItemInfo<ItemT> = SectionListRenderItemInfo<ItemT> & {
  rowIndex: number;
};

export type SectionGridRenderItem<ItemT> = (info: SectionGridRenderItemInfo<ItemT>) => React.ReactElement | null;

export type SectionItem<ItemType> = {
  title?: string;
  data: ItemType[];
  renderItem?: SectionGridRenderItem<ItemType>;
};

// Original section list component props
type SectionGridAllowedProps<ItemType = unknown> = Omit<
  SectionListProps<ItemType>,
  //  This prop doesn't affect the SectionGrid, which only scrolls vertically.
  'horizontal' | 'sections' | 'renderItem'
>;

export interface SectionGridProps<ItemType = unknown> extends SectionGridAllowedProps<ItemType>, CommonProps<ItemType> {
  sections: SectionItem<ItemType>[];

  renderItem?: SectionGridRenderItem<ItemType>;

  /**
   * Overwrites SectionList with custom interface
   */
  customSectionList?: typeof SectionList;
}

const SectionGrid = memo<SectionGridProps>(
  forwardRef((props, ref) => {
    const {
      sections,
      style,
      spacing,
      fixed,
      itemDimension,
      staticDimension,
      maxDimension,
      renderItem: originalRenderItem,
      keyExtractor,
      onLayout,
      additionalRowStyle: externalRowStyle,
      itemContainerStyle,
      invertedRow,
      maxItemsPerRow,
      adjustGridToStyles,
      customSectionList: SectionListComponent = SectionList,
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
      onLayout: null,
      listKey: undefined,
      maxDimension: undefined,
      invertedRow: false,
      keyExtractor: null,
      maxItemsPerRow: undefined,
      adjustGridToStyles: false,
      customSectionList: undefined,
      onItemsPerRowChange: null,
      ...props,
    };

    const [totalDimension, setTotalDimension] = useState(() => {
      let defaultTotalDimension = staticDimension;

      if (!staticDimension) {
        defaultTotalDimension = getAdjustedTotalDimensions({
          totalDimension: Dimensions.get('window').width,
          maxDimension,
          contentContainerStyle: restProps.contentContainerStyle,
          style,
          adjustGridToStyles,
        });
      }

      return defaultTotalDimension;
    });

    const onLocalLayout = useCallback(
      (e) => {
        if (!staticDimension) {
          let { width: newTotalDimension } = e.nativeEvent.layout || {};

          newTotalDimension = getAdjustedTotalDimensions({
            totalDimension: newTotalDimension,
            maxDimension,
            contentContainerStyle: restProps.contentContainerStyle,
            style,
            adjustGridToStyles,
          });

          if (totalDimension !== newTotalDimension && newTotalDimension > 0) {
            setTotalDimension(newTotalDimension);
          }
        }

        // call onLayout prop if passed
        if (onLayout) {
          onLayout(e);
        }
      },
      [staticDimension, maxDimension, totalDimension, onLayout, adjustGridToStyles, restProps.contentContainerStyle, style],
    );

    const renderRow = useCallback(
      ({ renderItem, rowItems, rowIndex, section, itemsPerRow, rowStyle, separators, isFirstRow, containerStyle, containerFullWidthStyle }) => {
        // Add spacing below section header
        let additionalRowStyle = {};
        if (isFirstRow) {
          additionalRowStyle = {
            marginTop: spacing,
          };
        }

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
                    section,
                    separators,
                    rowIndex,
                  })}
                </View>
              );
            })}
          </View>
        );
      },
      [spacing, keyExtractor, externalRowStyle, itemContainerStyle, invertedRow],
    );

    const { containerDimension, itemsPerRow, fixedSpacing } = useMemo(
      () =>
        calculateDimensions({
          itemDimension,
          staticDimension,
          totalDimension,
          spacing,
          fixed,
          maxItemsPerRow,
        }),
      [itemDimension, staticDimension, totalDimension, spacing, fixed, maxItemsPerRow],
    );

    const { containerStyle, containerFullWidthStyle, rowStyle } = useMemo(
      // @ts-ignore
      () =>
        generateStyles({
          itemDimension,
          containerDimension,
          spacing,
          fixedSpacing,
          fixed,
          itemsPerRow,
        }),
      [itemDimension, containerDimension, itemsPerRow, spacing, fixedSpacing, fixed],
    );

    const groupSectionsFunc = useCallback(
      (section) => {
        let chunkedData = chunkArray(section.data, itemsPerRow);

        if (invertedRow) {
          chunkedData = chunkedData.map(($0) => $0.reverse());
        }

        const renderItem = section.renderItem || originalRenderItem;

        return {
          ...section,
          // @ts-ignore
          renderItem: ({ item, index, section: s }) =>
            renderRow({
              renderItem,
              rowItems: item,
              rowIndex: index,
              section: s,
              isFirstRow: index === 0,
              itemsPerRow,
              rowStyle,
              containerStyle,
              containerFullWidthStyle,
            }),
          data: chunkedData,
          originalData: section.data,
        };
      },
      [itemsPerRow, originalRenderItem, renderRow, rowStyle, containerStyle, containerFullWidthStyle, invertedRow],
    );

    const groupedSections = sections.map(groupSectionsFunc);

    const localKeyExtractor = useCallback(
      (rowItems, index) => {
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

    return (
      <SectionListComponent
        onLayout={onLocalLayout}
        extraData={totalDimension}
        sections={groupedSections}
        keyExtractor={localKeyExtractor}
        style={style}
        ref={ref}
        {...restProps}
      />
    );
  }),
);

SectionGrid.displayName = 'SectionGrid';

export default SectionGrid;

import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

function chunkArray<T extends { _fullWidth?: number }>(array: T[], size: number) {
  if (array.length === 0) return [];

  return array.reduce((acc, val) => {
    if (acc.length === 0) acc.push([]);

    const last = acc[acc.length - 1];
    const rowHadFullWidth = last[0]?._fullWidth;
    const currentIsFullWidth = !!val._fullWidth;

    if (last.length < size && !rowHadFullWidth && !currentIsFullWidth) {
      last.push(val);
    } else {
      acc.push([val]);
    }
    return acc;
  }, [] as T[][]);
}

function calculateDimensions({ itemDimension, staticDimension, totalDimension, fixed, spacing, maxItemsPerRow }) {
  const usableTotalDimension = staticDimension || totalDimension;
  const availableDimension = usableTotalDimension - spacing; // One spacing extra
  const itemTotalDimension = Math.min(itemDimension + spacing, availableDimension); // itemTotalDimension should not exceed availableDimension
  const itemsPerRow = Math.min(Math.floor(availableDimension / itemTotalDimension), maxItemsPerRow || Number.POSITIVE_INFINITY);
  const containerDimension = availableDimension / itemsPerRow;

  let fixedSpacing: number;
  if (fixed) {
    fixedSpacing = (totalDimension - itemDimension * itemsPerRow) / (itemsPerRow + 1);
  }

  return {
    itemTotalDimension,
    availableDimension,
    itemsPerRow,
    containerDimension,
    fixedSpacing,
  };
}

function getStyleDimensions(style, horizontal = false) {
  let space1 = 0;
  let space2 = 0;
  let maxStyleDimension: number;
  if (style) {
    const flatStyle = Array.isArray(style) ? StyleSheet.flatten(style) : style;
    let sMaxDimensionXY = 'maxWidth';
    let sPaddingXY = 'paddingHorizontal';
    let sPadding1 = 'paddingLeft';
    let sPadding2 = 'paddingRight';
    if (horizontal) {
      sMaxDimensionXY = 'maxHeight';
      sPaddingXY = 'paddingVertical';
      sPadding1 = 'paddingTop';
      sPadding2 = 'paddingBottom';
    }

    if (flatStyle[sMaxDimensionXY] && typeof flatStyle[sMaxDimensionXY] === 'number') {
      maxStyleDimension = flatStyle[sMaxDimensionXY];
    }

    const padding = flatStyle[sPaddingXY] || flatStyle.padding;
    const padding1 = flatStyle[sPadding1] || padding || 0;
    const padding2 = flatStyle[sPadding2] || padding || 0;
    space1 = typeof padding1 === 'number' ? padding1 : 0;
    space2 = typeof padding2 === 'number' ? padding2 : 0;
  }
  return { space1, space2, maxStyleDimension };
}

function getAdjustedTotalDimensions({ totalDimension, maxDimension, contentContainerStyle, style, horizontal = false, adjustGridToStyles = false }) {
  let adjustedTotalDimension = totalDimension;
  let actualMaxDimension = totalDimension; // keep track of smallest max dimension

  // adjust for maxDimension prop
  if (maxDimension && totalDimension > maxDimension) {
    actualMaxDimension = maxDimension;
    adjustedTotalDimension = maxDimension;
  }

  if (adjustGridToStyles) {
    if (contentContainerStyle) {
      const { space1, space2, maxStyleDimension } = getStyleDimensions(contentContainerStyle, horizontal);
      // adjust for maxWidth or maxHeight in contentContainerStyle
      if (maxStyleDimension && adjustedTotalDimension > maxStyleDimension) {
        actualMaxDimension = maxStyleDimension;
        adjustedTotalDimension = maxStyleDimension;
      }
      // subtract horizontal or vertical padding from adjustedTotalDimension
      if (space1 || space2) {
        adjustedTotalDimension = adjustedTotalDimension - space1 - space2;
      }
    }

    if (style) {
      const edgeSpaceDiff = (totalDimension - actualMaxDimension) / 2; // if content is floating in middle of screen get margin on either side
      const { space1, space2 } = getStyleDimensions(style, horizontal);
      // only subtract if space is greater than the margin on either side
      if (space1 > edgeSpaceDiff) {
        adjustedTotalDimension -= space1 - edgeSpaceDiff; // subtract the padding minus any remaining margin
      }
      if (space2 > edgeSpaceDiff) {
        adjustedTotalDimension -= space2 - edgeSpaceDiff; // subtract the padding minus any remaining margin
      }
    }
  }

  return adjustedTotalDimension;
}

function generateStyles({
  itemDimension,
  containerDimension,
  spacing,
  fixed,
  horizontal,
  fixedSpacing,
  itemsPerRow,
}: {
  itemDimension;
  containerDimension;
  spacing: number;
  fixed: boolean;
  horizontal?: boolean;
  fixedSpacing: number;
  itemsPerRow: number;
}) {
  let rowStyle: ViewStyle = {
    flexDirection: 'row',
    paddingLeft: fixed ? fixedSpacing : spacing,
    paddingBottom: spacing,
  };

  let containerStyle: ViewStyle = {
    flexDirection: 'column',
    justifyContent: 'center',
    width: fixed ? itemDimension : containerDimension - spacing,
    marginRight: fixed ? fixedSpacing : spacing,
  };

  const containerFullWidthStyle: StyleProp<ViewStyle> = {
    flexDirection: 'column',
    justifyContent: 'center',
    width: containerDimension * itemsPerRow - spacing,
    marginBottom: spacing,
  };

  if (horizontal) {
    rowStyle = {
      flexDirection: 'column',
      paddingTop: fixed ? fixedSpacing : spacing,
      paddingRight: spacing,
    };

    containerStyle = {
      flexDirection: 'row',
      justifyContent: 'center',
      height: fixed ? itemDimension : containerDimension - spacing,
      marginBottom: fixed ? fixedSpacing : spacing,
    };
  }

  return {
    containerFullWidthStyle,
    containerStyle,
    rowStyle,
  };
}

export { calculateDimensions, chunkArray, generateStyles, getAdjustedTotalDimensions };

// Custom props that are present in both grid and list
export type CommonProps<ItemType> = {
  /**
   * Additional styles for rows (rows render multiple items within), apart from the generated ones.
   */
  additionalRowStyle?: StyleProp<ViewStyle>;

  /**
   * Minimum width or height for each item in pixels (virtual).
   */
  itemDimension?: number;

  /**
   * If true, the exact itemDimension will be used and won't be adjusted to fit the screen.
   */
  fixed?: boolean;

  /**
   * Spacing between each item.
   */
  spacing?: number;

  /**
   * Specifies a static width or height for the GridView container.
   * If your container dimension is known or can be calculated at runtime
   * (via Dimensions.get('window'), for example), passing this prop will force the grid container
   * to that dimension size and avoid the reflow associated with dynamically calculating it
   */
  staticDimension?: number;

  /**
   * Specifies a maximum width or height for the container. If not passed, full width/height
   * of the screen will be used.
   */
  maxDimension?: number;

  /**
   * Specifies the style about content row view
   */
  itemContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Reverses the direction of each row item. It can be used with the [`inverted`](https://reactnative.dev/docs/flatlist#inverted) property.
   * ex) [0, 1, 2] -> [2, 1, 0]
   */
  invertedRow?: boolean;

  /**
   * Specifies the maximum items to render per row
   */
  maxItemsPerRow?: number;

  /**
   * When set to true the library will calculate the total dimensions taking into account padding in style prop, and padding + maxWidth/maxHeight in contentContainerStyle prop
   */
  adjustGridToStyles?: boolean;

  /**
   * When number of items per row is determined, this callback is called.
   * @param itemsPerRow Number of items per row
   */
  onItemsPerRowChange?: (itemsPerRow: number) => void;
};

# React Native Superb Grid

![npm version](https://img.shields.io/npm/v/react-native-superb-grid.svg?colorB=brightgreen&style=flat-square)
![npm download](https://img.shields.io/npm/dt/react-native-superb-grid.svg?style=flat-square)

Responsive Grid View for React Native.

## Features

This is a fork of [react-native-super-grid](https://github.com/saleel/react-native-super-grid) with the following differences,

- Rewrite in TypeScript
- Remove 'prop-types` dependency
- Remove usage of `defaultProps`
- Various fixes to React hooks usages

## Getting Started

This library export two components - FlatGrid (similar to FlatList) and SectionGrid (similar to SectionList). Both components render a Grid layout that adapts itself to various screen resolutions.

Instead of passing an itemPerRow argument, you pass `itemDimension` and each item will be rendered with a dimension size equal to or more than (to fill the screen) the given dimension.

Internally, these components use the native [FlatList](https://facebook.github.io/react-native/docs/flatlist.html) and [SectionList](https://facebook.github.io/react-native/docs/sectionlist.html).

### Installing

You can install the package via npm.

```
npm install react-native-superb-grid
```

### Usage (FlatGrid)

```javascript
import { FlatGrid } from "react-native-superb-grid";
```

```javascript
<FlatGrid
  itemDimension={130}
  data={[1, 2, 3, 4, 5, 6]}
  renderItem={({ item }) => <Text>{item}</Text>}
/>
```

### Usage (SimpleGrid)

This component is similar to the FlatGrid but does not use a FlatList, instead, it simply maps over the data items. This is useful if you need to put a grid inside a ScrollView or if you have a small array.

```javascript
import { SimpleGrid } from "react-native-superb-grid";
```

```javascript
<SimpleGrid
  itemDimension={130}
  data={[1, 2, 3, 4, 5, 6]}
  renderItem={({ item }) => <Text>{item}</Text>}
/>
```

### Usage (SectionGrid)

```javascript
import { SectionGrid } from "react-native-superb-grid";
```

```javascript
<SectionGrid
  itemDimension={130}
  sections={[
    {
      title: "Numbers",
      data: [1, 2, 3, 4, 5, 6],
    },
    {
      title: "Alphabets",
      data: ["A", "B", "C", "D", "E"],
    },
  ]}
  renderItem={({ item }) => <Text>{item}</Text>}
  renderSectionHeader={({ section }) => (
    <Text style={{ fontSize: 20 }}>{section.title}</Text>
  )}
/>
```

#### Properties

| Property                                       | Type                                                                                   | Default Value | Description                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------------- | -------------------------------------------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| renderItem                                     | Function                                                                               |               | Function to render each object. Should return a react native component. Same signature as that of FlatList/SectionList's renderItem (with an additional key `rowIndex`).                                                                                                                                        |
| data (for FlatGrid) sections (for SectionGrid) | Array                                                                                  |               | Data to be rendered. renderItem will be called with each item in this array. Same signature as that of FlatList/SectionList.                                                                                                                                                                                    |     |
| itemDimension                                  | Number                                                                                 | 120           | Minimum width or height for each item in pixels (virtual).                                                                                                                                                                                                                                                      |
| fixed                                          | Boolean                                                                                | false         | If true, the exact `itemDimension` will be used and won't be adjusted to fit the screen.                                                                                                                                                                                                                        |
| spacing                                        | Number                                                                                 | 10            | Spacing between each item.                                                                                                                                                                                                                                                                                      |
| style                                          | [FlatList](https://facebook.github.io/react-native/docs/flatlist.html) styles (Object) |               | Styles for the container. Styles for an item should be applied inside `renderItem`. Note: If you set `adjustGridToStyles` to `true` then padding added in this prop will be used to adjust the total dimensions of the grid to reflect the padding in this style object.                                        |
| additionalRowStyle                             | styles (Object)                                                                        |               | Additional styles for rows (rows render multiple items within), apart from the generated ones.                                                                                                                                                                                                                  |
| itemContainerStyle                             | styles (Object)                                                                        |               | Style for item's container. Not needed for most cases.                                                                                                                                                                                                                                                          |
| staticDimension                                | Number                                                                                 |               | Specifies a static width or height for the container. If not passed, `maxDimension` will be used.                                                                                                                                                                                                               |
| maxDimension                                   | Number                                                                                 |               | Specifies a maximum width or height for the container. If not passed, full width/height of the screen will be used. Note: If you set `adjustGridToStyles` to `true` then you can alternatively use the `contentContainerStyle` prop and set `maxWidth` or `maxHeight`.                                          |
| horizontal                                     | boolean                                                                                | false         | If true, the grid will be scrolling horizontally. If you want your item to fill the height when using a horizontal grid, you should give it a height of '100%'. This prop doesn't affect the SectionGrid, which only scrolls vertically.                                                                        |
| onLayout                                       | Function                                                                               |               | Optional callback ran by the internal `FlatList` or `SectionList`'s `onLayout` function, thus invoked on mount and layout changes.                                                                                                                                                                              |
| listKey                                        | String                                                                                 |               | A unique identifier for the Grid. This key is necessary if you are nesting multiple FlatGrid/SectionGrid inside another Grid (or any VirtualizedList).                                                                                                                                                          |
| keyExtractor                                   | Function                                                                               |               | A function `(item, rowItemIndex) => {String}` that should return a unique key for the item passed.                                                                                                                                                                                                              |
| invertedRow                                    | boolean                                                                                |               | Reverses the direction of row items. It can be used with the [`inverted`](https://reactnative.dev/docs/flatlist#inverted) property.                                                                                                                                                                             |
| maxItemsPerRow                                 | number                                                                                 |               | Specifies the maximum number of items to render per row                                                                                                                                                                                                                                                         |
| contentContainerStyle                          | styles (Object)                                                                        |               | This is the regular FlatList/SectionList prop. If you set `adjustGridToStyles` to `true` and specify `maxWidth` or `maxHeight` it will be used the same as `maxDimension`. In addition, padding added here will be used to adjust the total dimensions of the grid to reflect the padding in this style object. |
| adjustGridToStyles                             | boolean                                                                                |               | Set to true when you want the library to automatically adjust the total dimensions of the grid based on `style` and `contentContainerStyle` props                                                                                                                                                               |
| customFlatList (for FlatGrid)                  | ElementType                                                                            |               | Replaces `FlatList` in FlatGrid with ElementType. E.g. `Animated.FlatList`                                                                                                                                                                                                                                      |
| customSectionList (for SectionGrid)            | ElementType                                                                            |               | Replaces `SectionList` in SectionGrid with ElementType. E.g. `Animated.SectionList`                                                                                                                                                                                                                             |
| onItemsPerRowChange                            | Function                                                                               |               | A callback `(itemsPerRow: number) => void` that is called when number of items per row is determined.                                                                                                                                                                                                           |

All additional props you pass will be passed on to the internal FlatList/SectionList. This means you can make use of various props and methods like `ListHeaderComponent`, `onEndReached`, `onRefresh`...etc. While these are not tested for compatibility, most of them should work as expected.

In **SectionGrid**, `section` argument in methods like `renderSectionHeader`, `renderSectionFooter`, `ItemSeparatorComponent` will slightly different from the actual section you passed. The `data` key in the `section` will be the grouped versions of items (items that go in one row), and the original list of items can be found in `originalData` key. All other keys will remain intact.

#### Full width items

To make an item full width, simply include `_fullWidth: true` in the data object for that item. For example:

```javascript
{ name: 'TURQUOISE', code: '#1abc9c', _fullWidth: true }
```

## FlatGrid Example

```javascript
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { FlatGrid } from "react-native-superb-grid";

export default function Example() {
  const [items, setItems] = React.useState([
    { name: "TURQUOISE", code: "#1abc9c" },
    { name: "EMERALD", code: "#2ecc71" },
    { name: "PETER RIVER", code: "#3498db" },
    { name: "AMETHYST", code: "#9b59b6" },
    { name: "WET ASPHALT", code: "#34495e" },
    { name: "GREEN SEA", code: "#16a085" },
    { name: "NEPHRITIS", code: "#27ae60" },
    { name: "BELIZE HOLE", code: "#2980b9" },
    { name: "WISTERIA", code: "#8e44ad" },
    { name: "MIDNIGHT BLUE", code: "#2c3e50" },
    { name: "SUN FLOWER", code: "#f1c40f" },
    { name: "CARROT", code: "#e67e22" },
    { name: "ALIZARIN", code: "#e74c3c" },
    { name: "CLOUDS", code: "#ecf0f1" },
    { name: "CONCRETE", code: "#95a5a6" },
    { name: "ORANGE", code: "#f39c12" },
    { name: "PUMPKIN", code: "#d35400" },
    { name: "POMEGRANATE", code: "#c0392b" },
    { name: "SILVER", code: "#bdc3c7" },
    { name: "ASBESTOS", code: "#7f8c8d" },
  ]);

  return (
    <FlatGrid
      itemDimension={130}
      data={items}
      style={styles.gridView}
      // staticDimension={300}
      // fixed
      spacing={10}
      renderItem={({ item }) => (
        <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCode}>{item.code}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: "flex-end",
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
});
```

| ![iPhone6 Portrait](/screenshots/iphone6_portrait.png?raw=true "iPhone6 Portrait") | ![iPhone6 Landscape](/screenshots/iphone6_landscape.png?raw=true "iPhone6 Landscape") |
| :--------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: |
|                                  iPhone6 Portrait                                  |                                   iPhone6 Landscape                                   |

| ![iPad Air 2 Portrait](/screenshots/ipadair2_portrait.png?raw=true "iPad Air 2 Portrait") | ![iPad Air 2 Landscape](/screenshots/ipadair2_landscape.png?raw=true "iPad Air 2 Landscape") |
| :---------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------: |
|                                    iPad Air 2 Portrait                                    |                                     iPad Air 2 Landscape                                     |

| ![Android Portrait](/screenshots/android_portrait.png?raw=true "Android Portrait") | ![Android Landscape](/screenshots/android_landscape.png?raw=true "Android Landscape") |
| :--------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------: |
|                                  Android Portrait                                  |                                   Android Landscape                                   |

| ![Android Horizontal Portrait](/screenshots/android_horizontal_portrait.png?raw=true "Android Horizontal Portrait") | ![Android Horizontal Landscape](/screenshots/android_horizontal_landscape.png?raw=true "Android Horizontal Landscape") |
| :-----------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: |
|                                             Android Horizontal Portrait                                             |                                              Android Horizontal Landscape                                              |

| ![iPhone Horizontal Portrait](/screenshots/iphone_horizontal_portrait.png?raw=true "iPhone Horizontal Portrait") | ![iPhone Horizontal Landscape](/screenshots/iphone_horizontal_landscape.png?raw=true "iPhone Horizontal Landscape") |
| :--------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------: |
|                                            iPhone Horizontal Portrait                                            |                                             iPhone Horizontal Landscape                                             |

## SectionGrid Example

```javascript
import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { SectionGrid } from "react-native-superb-grid";

export default function Example() {
  const [items, setItems] = React.useState([
    { name: "TURQUOISE", code: "#1abc9c" },
    { name: "EMERALD", code: "#2ecc71" },
    { name: "PETER RIVER", code: "#3498db" },
    { name: "AMETHYST", code: "#9b59b6" },
    { name: "WET ASPHALT", code: "#34495e" },
    { name: "GREEN SEA", code: "#16a085" },
    { name: "NEPHRITIS", code: "#27ae60" },
    { name: "BELIZE HOLE", code: "#2980b9" },
    { name: "WISTERIA", code: "#8e44ad" },
    { name: "MIDNIGHT BLUE", code: "#2c3e50" },
    { name: "SUN FLOWER", code: "#f1c40f" },
    { name: "CARROT", code: "#e67e22" },
    { name: "ALIZARIN", code: "#e74c3c" },
    { name: "CLOUDS", code: "#ecf0f1" },
    { name: "CONCRETE", code: "#95a5a6" },
    { name: "ORANGE", code: "#f39c12" },
    { name: "PUMPKIN", code: "#d35400" },
    { name: "POMEGRANATE", code: "#c0392b" },
    { name: "SILVER", code: "#bdc3c7" },
    { name: "ASBESTOS", code: "#7f8c8d" },
  ]);

  return (
    <SectionGrid
      itemDimension={90}
      // staticDimension={300}
      // fixed
      // spacing={20}
      sections={[
        {
          title: "Title1",
          data: items.slice(0, 6),
        },
        {
          title: "Title2",
          data: items.slice(6, 12),
        },
        {
          title: "Title3",
          data: items.slice(12, 20),
        },
      ]}
      style={styles.gridView}
      renderItem={({ item, section, index }) => (
        <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCode}>{item.code}</Text>
        </View>
      )}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 20,
    flex: 1,
  },
  itemContainer: {
    justifyContent: "flex-end",
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
  sectionHeader: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    alignItems: "center",
    backgroundColor: "#636e72",
    color: "white",
    padding: 10,
  },
});
```

| ![iPhone SectionGrid Portrait](/screenshots/iphone_section_grid_portrait.png?raw=true "iPhone SectionGrid Portrait") | ![iPhone6 Landscape](/screenshots/iphone_section_grid_landscape.png?raw=true "iPhone6 Landscape") |
| :------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
|                                             iPhone SectionGrid Portrait                                              |                                         iPhone6 Landscape                                         |

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

Colors in the example from https://flatuicolors.com/.

Screenshot Mockup generated from https://mockuphone.com.

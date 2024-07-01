import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import KeywordSearch from "../components/search/KeywordSearch";
import CategorySearch from "../components/search/CategorySearch";

const Search = (): JSX.Element => {
  const [selectedBar, setSelectedBar] = useState<string>("keyword");

  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        {["keyword", "category"].map((item: string, index: number) => (
          <TouchableOpacity
            key={item}
            activeOpacity={0.9}
            style={[
              styles.topBar,
              item === selectedBar && styles.selectedBar,
              index === 0 && styles.leftRadius,
              index === 1 && styles.rightRadius,
            ]}
            onPress={() => setSelectedBar(item)}
          >
            <Text style={styles.topBarLabel}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedBar === "keyword" ? <KeywordSearch /> : <CategorySearch />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  topBarContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  topBar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#C0B4D5",
  },
  selectedBar: {
    backgroundColor: "#8978A4",
  },
  leftRadius: {
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  rightRadius: {
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  topBarLabel: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});

export default Search;

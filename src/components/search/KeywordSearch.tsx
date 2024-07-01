import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { API_ACCESS_TOKEN } from "@env";
import { useNavigation } from "@react-navigation/native";
import MovieItem from "../movies/MovieItem";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 100) / 3;

const KeywordSearch = (): JSX.Element => {
  const [keyword, setKeyword] = useState<string>("");
  const [movies, setMovies] = useState<any[]>([]);
  const navigation = useNavigation();

  const fetchMoviesByKeyword = async (keyword: string) => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US&page=1`,
        options
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
      Alert.alert("Error", "Failed to fetch movies");
    }
  };

  const handleSearch = () => {
    if (keyword.trim() === "") {
      Alert.alert("Error", "Keyword cannot be empty");
      return;
    }
    fetchMoviesByKeyword(keyword);
    setKeyword("");
  };

  const handleMoviePress = (id: number) => {
    navigation.navigate("MovieDetail", { id });
  };

  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.movieItemContainer}
      onPress={() => handleMoviePress(item.id)}
    >
      <MovieItem
        movie={item}
        size={{ width: ITEM_WIDTH, height: ITEM_WIDTH * 1.5 }}
        coverType="poster"
        onPress={() => handleMoviePress(item.id)} // Pastikan onPress di-pass ke MovieItem
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter keyword..."
          value={keyword}
          onChangeText={(text) => setKeyword(text)}
          onSubmitEditing={handleSearch}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },
  row: {
    gap: 10,
    alignItems: "flex-start",
  },
  movieItemContainer: {
    width: "30%",
    marginBottom: 10,
  },
  movieItem: {
    alignItems: "center",
    position: "relative",
  },
  poster: {
    width: "100%", // Adjusted width to fit container
    aspectRatio: 0.67, // 2:3 aspect ratio for posters
    borderRadius: 10,
  },
  ratingContainer: {
    position: "absolute",
    bottom: 5,
    left: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  ratingText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default KeywordSearch;

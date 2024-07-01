import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieItem from "../components/movies/MovieItem";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import type { Movie } from "../types/app";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 100) / 3; // Ukuran item dengan margin total 16 di antara

const Favorite = (): JSX.Element => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("@FavoriteList");
        if (storedFavorites !== null) {
          const favorites: Movie[] = JSON.parse(storedFavorites);
          setFavoriteMovies(favorites);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    if (isFocused) {
      fetchFavoriteMovies();
    }
  }, [isFocused]);

  const handleMoviePress = (id: number) => {
    navigation.navigate("MovieDetail", { id });
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
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
      <FlatList
        data={favoriteMovies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={3} // Mengatur jumlah kolom menjadi 3 untuk grid
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 8,
    paddingBottom: 32,
    alignItems: "flex-start", // Mulai dari kiri
  },
  movieItemContainer: {
    width: ITEM_WIDTH,
    marginBottom: 8,
    marginRight: 8, // Margin kanan untuk item dalam satu baris
  },
});

export default Favorite;

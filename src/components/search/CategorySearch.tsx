import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_ACCESS_TOKEN } from "@env";

const CategorySearch = (): JSX.Element => {
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [numColumns, setNumColumns] = useState(2); // State for numColumns
  const navigation = useNavigation();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      };
      const response = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=en",
        options
      );
      const data = await response.json();
      setGenres(data.genres);
      setLoadingGenres(false);
    } catch (error) {
      console.error("Error fetching genres:", error);
      setLoadingGenres(false);
    }
  };

  const fetchMoviesByGenre = async (genreId: number) => {
    try {
      setLoadingMovies(true);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      };
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`,
        options
      );
      const data = await response.json();
      setMovies(data.results);
      setLoadingMovies(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoadingMovies(false);
    }
  };

  const handleGenrePress = (genreId: number) => {
    setSelectedGenre(genreId);
  };

  const handleSearch = () => {
    if (selectedGenre !== null) {
      fetchMoviesByGenre(selectedGenre);
    }
  };

  const handleMoviePress = (id: number) => {
    navigation.navigate("MovieDetail", { id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose a Genre</Text>
      {loadingGenres ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={genres}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.genreItem,
                {
                  backgroundColor:
                    selectedGenre === item.id ? "#b3e0ff" : "#ffffff",
                },
              ]}
              onPress={() => handleGenrePress(item.id)}
            >
              <Text style={styles.genreText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.genreList}
          numColumns={2}
          key={numColumns.toString()} // Key prop for forcing re-render when numColumns changes
        />
      )}

      <Button title="Search" onPress={handleSearch} />

      <Text style={styles.header}>Movies</Text>
      {loadingMovies ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={movies}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.movieItemContainer}
              onPress={() => handleMoviePress(item.id)}
            >
              <View style={styles.movieItem}>
                <Text style={styles.movieTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.movieList}
          numColumns={2}
          key={numColumns === 2 ? "twoColumns" : "other"} // Different key for different numColumns
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 10,
  },
  genreList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  genreItem: {
    width: "45%",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    marginRight: "5%",
  },
  genreText: {
    fontSize: 16,
    textAlign: "center",
  },
  movieList: {
    flexGrow: 1,
  },
  movieItemContainer: {
    flex: 1,
    alignItems: "center",
    margin: 5,
  },
  movieItem: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    aspectRatio: 0.75, // 3:4 aspect ratio for movie item
  },
  movieTitle: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default CategorySearch;

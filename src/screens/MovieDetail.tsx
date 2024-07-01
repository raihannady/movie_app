import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { API_ACCESS_TOKEN } from "@env";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieList from "../components/movies/MovieList";
import type { Movie } from "../types/app";

const MovieDetail = ({ navigation }: any): JSX.Element => {
  const route = useRoute();
  const { id } = route.params;

  const [movie, setMovie] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMovie(data);
        checkIsFavorite(data.id).then((result) => setIsFavorite(result)); // Check if the current movie is in favorites
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovie();
  }, [id]);

  const checkIsFavorite = async (movieId: number): Promise<boolean> => {
    try {
      const storedFavorites = await AsyncStorage.getItem("@FavoriteList");
      if (storedFavorites !== null) {
        const favorites: Movie[] = JSON.parse(storedFavorites);
        return favorites.some((fav) => fav.id === movieId);
      }
      return false;
    } catch (error) {
      console.error("Error checking favorite:", error);
      return false;
    }
  };

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      // Mengambil data favorit dari AsyncStorage
      const initialData: string | null = await AsyncStorage.getItem(
        "@FavoriteList"
      );
      let favMovieList: Movie[] = [];

      if (initialData !== null) {
        favMovieList = [...JSON.parse(initialData), movie];
      } else {
        favMovieList = [movie];
      }

      // Menyimpan kembali data favorit yang diperbarui ke AsyncStorage
      await AsyncStorage.setItem("@FavoriteList", JSON.stringify(favMovieList));

      // Memperbarui state lokal untuk menampilkan perubahan secara langsung
      // setFavoriteMovies(favMovieList);
      setIsFavorite(true); // Jika perlu untuk menandai bahwa film ini adalah favorit
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFavorite = async (movieId: number): Promise<void> => {
    try {
      let favMovieList: Movie[] = [];
      const initialData: string | null = await AsyncStorage.getItem(
        "@FavoriteList"
      );

      if (initialData !== null) {
        favMovieList = JSON.parse(initialData).filter(
          (movie: Movie) => movie.id !== movieId
        );
        await AsyncStorage.setItem(
          "@FavoriteList",
          JSON.stringify(favMovieList)
        );
        setIsFavorite(false);
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  if (!movie) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${
              movie.backdrop_path || movie.poster_path
            }`,
          }}
          style={styles.poster}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>{movie.title}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={24} color="gold" />
            <Text style={styles.ratingText}>{movie.vote_average}</Text>
            <TouchableOpacity
              onPress={handleFavoriteToggle}
              style={styles.favoriteIcon}
            >
              <FontAwesome
                name={isFavorite ? "heart" : "heart-o"}
                size={24}
                color="red"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.overview}>{movie.overview}</Text>
      <View style={styles.detailRow}>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Language:</Text>
          <Text style={styles.detailValue}>{movie.original_language}</Text>
          <Text style={styles.detailLabel}>Release Date:</Text>
          <Text style={styles.detailValue}>{movie.release_date}</Text>
        </View>
        <View style={styles.detailColumn}>
          <Text style={styles.detailLabel}>Popularity:</Text>
          <Text style={styles.detailValue}>{movie.popularity}</Text>
          <Text style={styles.detailLabel}>Vote Count:</Text>
          <Text style={styles.detailValue}>{movie.vote_count}</Text>
        </View>
      </View>
      <MovieList
        title="Recommendations"
        path={`movie/${id}/recommendations?language=en-US`}
        coverType="poster"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
  poster: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 4,
  },
  favoriteIcon: {
    marginLeft: 16,
  },
  overview: {
    fontSize: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detailValue: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default MovieDetail;

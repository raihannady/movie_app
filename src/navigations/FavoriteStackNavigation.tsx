import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Favorite from "../screens/Favorite";
import MovieDetail from "../screens/MovieDetail";

const Stack = createNativeStackNavigator();

const FavoriteStackNavigation = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="FavoriteScreen">
      <Stack.Screen name="FavoriteScreen" component={Favorite} />
      <Stack.Screen name="MovieDetail" component={MovieDetail} />
    </Stack.Navigator>
  );
};

export default FavoriteStackNavigation;

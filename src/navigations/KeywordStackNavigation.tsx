import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "../screens/Search";
import MovieDetail from "../screens/MovieDetail";

const Stack = createNativeStackNavigator();

const KeywordStackNavigation = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="KeywordScreen">
      <Stack.Screen name="KeywordScreen" component={Search} />
      <Stack.Screen name="MovieDetail" component={MovieDetail} />
    </Stack.Navigator>
  );
};

export default KeywordStackNavigation;

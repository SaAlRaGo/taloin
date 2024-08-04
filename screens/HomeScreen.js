import React from "react";
import NavOptions from "../components/NavOptions";
import NavFavourites from "../components/NavFavourites";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import LayoutScreen from "./LayoutScreen";
import { Text } from "react-native";
const HomeScreen = () => {
  const { user, setUser } = useContext(UserContext);
  return (
    <LayoutScreen>
      <Text style={{fontSize:18}}>Bienvenido {user.name} {user.userType === "user" ? "¿Tienes algún problema?":", es hora de trabajar"}</Text>
      <NavOptions />
      <NavFavourites />
    </LayoutScreen>
  );
};

export default HomeScreen;
import React from "react";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import NavFavourites from "../components/NavFavourites";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import LayoutScreen from "./LayoutScreen";
const HomeScreen = () => {
  const { user, setUser } = useContext(UserContext);
  return (
    <LayoutScreen>
      <GooglePlacesAutocomplete
        placeholder={`Bienvenido ${user.name}, ${
          user.userType !== "user"
            ? "es hora de trabajar"
            : "¿Tienes algún problema?"
        }`}
        styles={{
          container: {
            flex: 0,
          },
          textInput: {
            fontSize: 18,
          },
        }}
        fetchDetails={true}
        returnKeyType={"search"}
        enablePoweredByContainer={false}
        minLength={2}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: "es",
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={400}
      />

      <NavOptions />
      <NavFavourites />
    </LayoutScreen>
  );
};

export default HomeScreen;
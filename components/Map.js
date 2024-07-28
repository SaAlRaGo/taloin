import React, { Component, useEffect, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectDestination, selectOrigin } from "../slices/navSlice";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useRef, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { ResultsContext } from "../contexts/ResultsContext";
import config from "../config.json";
import { Modal, Pressable } from "react-native";
import * as Location from "expo-location";
import StarRating from "./StarRating";
const Map = () => {
  const mapRef = useRef(null);
  const { user, setUser } = useContext(UserContext);
  const { results, setResults } = useContext(ResultsContext);
  const [modalOpenned, setModalOpenned] = useState(false);
  const [workerView, setWorkerView] = useState({});
  const [region, setRegion] = useState({});

  const getCurrentLocation = async () => {
    const response = { status: false, location: null };
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Debes dar permisos para la localización.");
      return response;
    }

    const position = await Location.getCurrentPositionAsync({});
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };
    response.status = true;
    response.location = location;
    return response;
  };

  useEffect(() => {
    if (results.length > 0) {
      setRegion({
        latitude: user.latitude,
        longitude: user.longitude,
        latitudeDelta: Math.abs(user.latitude - results[0].latitude+0.0001) * 2,
        longitudeDelta: Math.abs(user.longitude - results[0].longitude+0.01) * 2,
      });
    }
  }, [results]);

  useEffect(() => {
    getCurrentLocation().then((response) => {
      if (response.status) {
        setUser({
          ...user,
          latitude: response.location.latitude,
          longitude: response.location.longitude,
        });
      }
    });
  }, []);

  const styles = StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    markerContainer: {
      alignItems: "center",
    },
    marker: {
      justifyContent: "center",
      alignItems: "center",
      width: 50,
      height: 50,
      backgroundColor: "white",
      borderRadius: 25,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "black",
      zIndex: 2,
    },
    image: {
      width: 40,
      height: 40,
    },
    triangle: {
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 20,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderTopColor: "black",
      marginTop: -3,
      zIndex: 1,
    },
    triangleBlue: {
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 20,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderTopColor: "#56D3DE",
      marginTop: -3,
      zIndex: 1,
    },
  });

  const modalStyles = StyleSheet.create({
    fondo: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      height: "100%",
      width: "100%",
    },
    modal: {
      backgroundColor: "white",
      width: "90%",
      borderRadius: 20,
      padding: 20,
      position: "relative"
    },
    btnCerrar: {
      position: "absolute",
      top: 15,
      right: 15,
      zIndex: 3,
    },

    btnCerrarImg: {
      width: 15,
      height: 15,
    },
    tituloModal: {
      fontSize: 20,
      fontWeight: "bold",
      width: "100%",
      textAlign: "center",
      zIndex: 1,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginVertical: 10,
      gap: 20,
    },
    cardText: {
      fontSize: 16,
      fontWeight: "bold",
    },
    image: {
      borderRadius: 10,
      height:100,
      width:100
    },
    nombre: {
      fontSize: 16,
      fontWeight: "bold",
    },
    leftCard: {
      flexDirection: "column",
      justifyContent: "flex-start",
      gap: 10,
      height:100
    },
    calificaciones: {
      justifyContent: "flex-start",
      gap: 5,
    },
    button: {
      backgroundColor: "#C319D2",
      height: 45,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
  return (
    <>
      <MapView
        ref={mapRef}
        style={tw`flex-1`}
        mapType="mutedStandard"
        initialRegion={{
          latitude: user.latitude,
          longitude: user.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
        region={region}
      >
        <Marker
          coordinate={{
            latitude: user.latitude,
            longitude: user.longitude,
          }}
        >
          <View style={styles.markerContainer}>
            <View style={styles.marker}>
              <Image
                source={{ uri: `${config.endpoint}/${user.profile_photo}` }}
                style={styles.image}
              />
            </View>
            <View style={styles.triangleBlue} />
          </View>
        </Marker>
        {results.map((result, index) => {
          return (
            <Marker
              key={result.id}
              coordinate={{
                latitude: result.latitude,
                longitude: result.longitude,
              }}
              onPress={() => {
                setWorkerView(result);
                setModalOpenned(true);
              }}
            >
              <View style={styles.markerContainer}>
                <View style={styles.marker}>
                  <Image
                    source={{
                      uri: `${config.endpoint}/${result.profile_photo}`,
                    }}
                    style={styles.image}
                  />
                </View>
                <View style={styles.triangle} />
              </View>
            </Marker>
          );
        })}
      </MapView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalOpenned}
        
        onRequestClose={() => {
          setModalOpenned(!modalOpenned);
        }}
      >
        <View
          style={modalStyles.fondo}
        >
          <View style={modalStyles.modal}>
            <Pressable onPress={() => setModalOpenned(false)} style={modalStyles.btnCerrar}>
              <Image source={require("../assets/close.png")} style={modalStyles.btnCerrarImg}/>
            </Pressable>
            <View>
              <Text style={modalStyles.tituloModal}>¿Qué te parece este trabajador?</Text>
            </View>
            <View style={modalStyles.card}>
              <View style={modalStyles.image}>
                <Image source={{uri: `${config.endpoint}/${workerView.profile_photo}`}} style={modalStyles.image}/>
              </View>
              <View style={modalStyles.leftCard}>
                <Text style={modalStyles.nombre}>{`${workerView.name} ${workerView.lastname}`}</Text>
                <View style={modalStyles.calificaciones}>
                  <StarRating rating={workerView.average_stars}/>
                  <Text>{workerView.average_stars} estrellas</Text>
                  <Text>{workerView.total_opinions} calificaciones totales</Text>
                </View>
              </View>
            </View>
            <Pressable style={modalStyles.button}>
              <Text style={modalStyles.buttonText}>Sí, sigamos</Text>
            </Pressable>
          </View>
        </View>
      </Modal>  
      
    </>
  );
};

export default Map;
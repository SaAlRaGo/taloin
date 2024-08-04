import React, { Component, useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from "react-native";
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
import * as ImagePicker from "expo-image-picker";
import SelectedImage from "./SelectedImage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
const Map = () => {
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const { results, setResults } = useContext(ResultsContext);
  const [modalOpenned, setModalOpenned] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);
  const [workerView, setWorkerView] = useState({});
  const [region, setRegion] = useState({});
  const [descripcion, setDescripcion] = useState("");
  const [fotos, setFotos] = useState([]);
  const [showDeleteImages, setShowDeleteImages] = useState({});
  const toggleShowDeleteImage = (foto) => {
      setShowDeleteImages(prevState => ({
          ...prevState,
          [foto]: !prevState[foto]
      }));
  };

  const hideAllDeleteImages = () => {
      const newShowDeleteImages = {};
      fotos.forEach(foto => {
          newShowDeleteImages[foto] = false;
      });
      setShowDeleteImages(newShowDeleteImages);
  };
  const pickImage = async () => {
    // Solicita permisos para acceder a la biblioteca de imágenes
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permiso para acceder a la biblioteca de imágenes es requerido."
      );
      return;
    }

    // Permite al usuario seleccionar una imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      let uriParts = result.assets[0].uri.split(".");
      let fileType = uriParts[uriParts.length - 1];
      setFotos([...fotos, {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
        type: `image/${fileType}`,
      }]);
    }
  };
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

  const deleteFoto = (foto) => {
    setFotos(fotos.filter((f) => f.uri !== foto));
    setShowDeleteImages(prevState => {
      const newState = { ...prevState };
      delete newState[foto];
      return newState;
    });
  }

  const createRequest = async () => {
    const formData = new FormData();
    formData.append("description", descripcion);
    formData.append("user_id", user.id);
    formData.append("worker_id", workerView.id);
    fotos.forEach((foto) => {
      formData.append("photos", foto);
    });
    try {
      const response = await axios.post(`${config.endpoint}/create/request`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if(response.data.id){
        Alert.alert("Solicitud creada con éxito");
        navigation.navigate("HomeScreen");
      }
    }catch (error) {
      
    }
  }

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
      position: "relative",
      gap: 20,
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
      gap: 10,
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
    input: {
      minHeight: 50,
      paddingHorizontal: 20,
      borderColor: "#C319D2",
      borderWidth: 1,
      borderRadius: 7,
    },
    addPhoto: {
      width: 30,
      height: 30,
      borderRadius: 15,
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
      zIndex: 3
    },
    addPhotoImg:{
      borderRadius: 5,
      width: 40,
      height: 40,
      zIndex: 2
    }
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
        <View style={modalStyles.fondo}>
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
            <Pressable style={modalStyles.button} onPress={() => {
              setModalOpenned(false);
              setModalRequest(true);
            }}>
              <Text style={modalStyles.buttonText}>Contactar trabajador</Text>
            </Pressable>
          </View>
        </View>
      </Modal>  
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalRequest}
        onRequestClose={() => {
          setModalRequest(!modalRequest);
        }}
      >
        <Pressable 
          style={modalStyles.fondo}
          onPress={hideAllDeleteImages}  
        >
          <View style={modalStyles.modal}>
            <Pressable onPress={() => setModalRequest(false)} style={modalStyles.btnCerrar}>
              <Image source={require("../assets/close.png")} style={modalStyles.btnCerrarImg}/>
            </Pressable>
            <View>
              <Text style={modalStyles.tituloModal}>Solicitud de trabajo</Text>
            </View>
            <Text style={modalStyles.nombre}>Ingresa los detalles de tu problema:</Text>
            <TextInput
              style={modalStyles.input}
              placeholder="Ingresa la descripción de tu problema"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline={true}
              autoCorrect={false}
              autoCapitalize={true}
            />
            <View style={modalStyles.card}>
              {fotos.map((foto) => {
                return (
                  <SelectedImage
                    key={foto.uri}
                    foto={foto.uri}
                    deleteFoto={deleteFoto}
                    showDeleteImage={!!showDeleteImages[foto.uri]}
                    toggleShowDeleteImage={() => toggleShowDeleteImage(foto.uri)}
                  />
                );
              })}
              <TouchableOpacity style={modalStyles.addPhoto} onPress={pickImage}>
                <Image 
                  source={require("../assets/addPhoto.png")}
                  style={modalStyles.addPhotoImg}
                />
              </TouchableOpacity>
            </View>
            <Pressable style={modalStyles.button}
              onPress={() => createRequest()}
            >
              <Text style={modalStyles.buttonText}>Completar solicitud</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default Map;
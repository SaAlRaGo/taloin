import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as Constants from "expo-constants";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import tw from "tailwind-react-native-classnames";
const logo = require("../images/logo.png");
import axios from "axios";
import config from "../config.json";
import { ScrollView } from "react-native-gesture-handler";

const SignupSCreen = () => {
  const statusBarHeight = Constants.default.statusBarHeight;
  const navigation = useNavigation();
  const [click, setClick] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setconfPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [direccion, setDireccion] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("usuario");
  const [selectedImage, setSelectedImage] = useState(null);
  const [idServicio, setIdServicio] = useState(-1);
  const [profesionEscrita, setProfesionEscrita] = useState("");

  const photo = null;

  const [servicios, setServicios] = useState([]);
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
  useEffect(() => {
    const getServicios = async () => {
      try {
        const response = await axios.get(`${config.endpoint}/services`);
        setServicios(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    getServicios();
  }, []);

  useEffect(() => {
    try{
        if(profesionEscrita.length > 0){
            setServiciosFiltrados(servicios.filter(servicio => servicio.name.includes(profesionEscrita)));
        }else{
            setServiciosFiltrados([]);
        }
    }catch(e){
        console.log(e);
    }
}, [profesionEscrita]);

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

  const register = async () => {
    console.log("register");
    const location = await getCurrentLocation();
    if (!location.status) {
      return;
    }

    let uriParts = selectedImage.split(".");
    let fileType = uriParts[uriParts.length - 1];

    const form = new FormData();
    form.append("email", email);
    form.append("password", password);
    form.append("username", username);
    form.append("name", nombre);
    form.append("lastname", apellidos);
    tipoUsuario !== "trabajador" && form.append("address", direccion);
    tipoUsuario === "trabajador" && form.append("service_id", idServicio);
    form.append("latitude", location.location.latitude);
    form.append("longitude", location.location.longitude);
    form.append("prophile_photo", {
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
      uri: selectedImage,
    });
    try {
      const response = await axios.post(
        `${config.endpoint}/create/${
          tipoUsuario === "trabajador" ? "worker" : "user"
        }`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.id) {
        Alert.alert("Usuario creado");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log(error);
    }
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
      setSelectedImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if(idServicio === -1){
      return;
    }
    setProfesionEscrita(servicios.find(servicio => servicio.id === idServicio).name);

  }, [idServicio]);

  const Item = ({ servicio }) => {
    return (
        <TouchableOpacity style={{...styles.option, width:"100%"}} onPress={() => setIdServicio(servicio.id)}>
            <Text style={{width:"100%"}}>{servicio.name}</Text>
        </TouchableOpacity>
    );
}
  return (
    <SafeAreaView style={styles.container}>
    <Image source={logo} style={styles.image} resizeMode="contain" />

    <FlatList
      data={[""]}
      style={{width:"100%"}}
      renderItem={() =>
        <View>
          <View style={styles.containerImage}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.imageSelected}
              />
            )}
            <TouchableOpacity onPress={pickImage} style={styles.buttonOpcion}>
              <Text style={styles.buttonText}>Seleccionar Imagen</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.opciones}>
            <TouchableOpacity
              style={
                tipoUsuario === "usuario"
                  ? styles.buttonOpcion
                  : styles.buttonOpcionNoSeleccionado
              }
              onPress={() => setTipoUsuario("usuario")}
            >
              <Text
                style={
                  tipoUsuario === "usuario"
                    ? styles.buttonText
                    : styles.buttonTextUnselected
                }
              >
                Soy empleador
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                tipoUsuario !== "usuario"
                  ? styles.buttonOpcion
                  : styles.buttonOpcionNoSeleccionado
              }
              onPress={() => {
                setTipoUsuario("trabajador");
              }}
            >
              <Text
                style={
                  tipoUsuario !== "usuario"
                    ? styles.buttonText
                    : styles.buttonTextUnselected
                }
              >
                Soy Trabajador
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Registrate</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              autoCorrect={false}
              autoCapitalize="true"
            />
            <TextInput
              style={styles.input}
              placeholder="Apellidos"
              value={apellidos}
              onChangeText={setApellidos}
              autoCorrect={false}
              autoCapitalize="true"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Nombre de Usuario"
              value={username}
              onChangeText={setUsername}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Repetir Contraseña"
              secureTextEntry
              value={confpassword}
              onChangeText={setconfPassword}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {tipoUsuario === "usuario" && (
              <TextInput
                style={styles.input}
                placeholder="Dirección"
                value={direccion}
                onChangeText={setDireccion}
                autoCorrect={false}
                autoCapitalize="true"
              />
            )}
            {tipoUsuario === "trabajador" && (
              <View style={tw`border-t border-gray-200 flex-shrink`}>
                <View style={styles.textInputContainer}>
                  <TextInput
                    placeholder="Ingresa una profesión"
                    value={profesionEscrita}
                    onChangeText={setProfesionEscrita}
                    autoCorrect={true}
                    autoCapitaliz={true}
                    style={styles.input}
                  />
                </View>
                <View style={{...styles.input, paddingTop:5, marginTop: 10, height: "auto"}}>
                  <Text style={styles.selectText}>Selecciona una opción: </Text>
                  {
                    serviciosFiltrados.length > 0 &&
                    serviciosFiltrados.map((servicio) => <Item key={servicio.id} servicio={servicio} />)
                  }
                </View>
                
              </View>
            )}
          </View>
          <View style={styles.buttonView}>
            <Pressable style={styles.button} onPress={() => register()}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </Pressable>
          </View>

          <Text style={styles.footerText}>
            ¿Ya tienes una cuenta?
            <Pressable
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text style={styles.signup}>Inicia Sesion</Text>
            </Pressable>
          </Text>
      </View>
      }
    />
    </SafeAreaView>
  );
};

export default SignupSCreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: Constants.default.statusBarHeight + 60,
    position: "relative",
    gap: 10,
  },
  image: {
    height: 40,
    width: 40,
    position: "absolute",
    top: Constants.default.statusBarHeight + 10,
    right: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 40,
    color: "#C319D2",
  },
  inputView: {
    width: "100%",
    paddingHorizontal: 40,
    gap: 10,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "#C319D2",
    borderWidth: 1,
    borderRadius: 7,
  },
  rememberView: {
    width: "100%",
    paddingHorizontal: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  switch: {
    flexDirection: "row",
    gap: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberText: {
    fontSize: 13,
  },
  forgetText: {
    fontSize: 11,
    color: "#C319D2",
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
  buttonView: {
    width: "100%",
    paddingHorizontal: 50,
    marginTop: 10,
  },
  optionsText: {
    textAlign: "center",
    paddingVertical: 10,
    color: "gray",
    fontSize: 13,
    marginBottom: 6,
  },
  mediaIcons: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 23,
  },
  icons: {
    width: 40,
    height: 40,
  },
  footerText: {
    textAlign: "center",
    color: "gray",
  },
  signup: {
    color: "#C319D2",
    fontSize: 13,
  },
  opciones: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  buttonOpcion: {
    backgroundColor: "#C319D2",
    height: 45,
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonOpcionNoSeleccionado: {
    backgroundColor: "#fff",
    height: 45,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonTextUnselected: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageSelected: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  containerImage: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  scrollView: {
    width: "100%",
  },
  selectText: {
    fontWeight: "bold",
  },
  optionsContainer: {
    width: "100%",
  },
  option: {
    backgroundColor: "#DDDDDF",
    borderRadius: 5,
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 5,
    width: "100%"
  }
});

//class="h-14 bg-gradient-to-r from-cyan-500 to-blue-500"


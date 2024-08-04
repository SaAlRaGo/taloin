import { View, Text, StyleSheet, FlatList, Image, Modal, Pressable, TextInput, Alert } from "react-native";
import * as Constants from 'expo-constants';
import config from "../config.json";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
function Solicitud({solicitud}) {
    const [modalQuotation, setModalQuotation] = useState(false);
    const [precio, setPrecio] = useState(0);
    const [addPixels, setAddPixels] = useState(false);
    const navigation = useNavigation();

    const styles = StyleSheet.create({
        titulo: {
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
            color: "#C319D2"
        },
        text:{
            fontSize: 20,
        },
        container: {
            width: "100%",
            marginBottom: Constants.default.statusBarHeight + (480 + (addPixels ? 140 : 0)),
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
            maxWidth: "97%",
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

    useEffect(() => {
        solicitud.user && setAddPixels(true);
    }, []);

    const createQuotation = async () => {
        const formData = new FormData();
        formData.append("request_id", solicitud.id);
        formData.append("initial_quote", precio);

        try {
            const response = await axios.post(`${config.endpoint}/create/quotation`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setModalQuotation(false);

            if(response.data.id){
                Alert.alert("Cotización enviada", "Tu cotización ha sido enviada con éxito");
                navigation.navigate("HomeScreen");
            }
        } catch (error) {
            
        }
    }
    return (
        <View>
            <Text style={styles.titulo}>{solicitud.worker ? "Para:" : "De:"} {solicitud.worker ? solicitud.worker.name : solicitud.user.name} {solicitud.worker ? solicitud.worker.lastname : solicitud.user.lastname}</Text>
            <Text style={styles.text}>{solicitud.description}</Text>
            {solicitud.user && <Text style={styles.text}>Dirección: {solicitud.user.address}</Text>}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MapRequestScreen", {objetivo: solicitud.user ? solicitud.user : solicitud.worker})}><Text style={styles.buttonText}>Ver ubicación</Text></TouchableOpacity>
            <Text style={styles.titulo}>Imágenes del problema</Text>
            <FlatList
                data={solicitud.photos}
                style={styles.container}
                renderItem={({ item }) => {
                    return (<Image 
                    source={{ uri: `${config.endpoint}/${item.file}` }}
                    style={{ width: "100%", height: undefined, aspectRatio: 1, borderRadius: 5, borderColor: "gray", borderWidth: 2, marginBottom: 10 }}
                    resizeMode="contain"
                    />)
                }}
                keyExtractor={(item) => item.file}
                ListFooterComponent={
                    solicitud.user && !solicitud.accepted && (
                        <View>
                            <TouchableOpacity style={styles.button} onPress={() => setModalQuotation(true)}>
                                <Text style={styles.buttonText}>Aceptar solicitud</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            />
            {
                solicitud.user && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalQuotation}
                        onRequestClose={() => {
                        setModalQuotation(!modalQuotation);
                        }}
                    >
                        <Pressable 
                            style={modalStyles.fondo}
                        >
                            <View style={modalStyles.modal}>
                                <Pressable onPress={() => setModalQuotation(false)} style={modalStyles.btnCerrar}>
                                    <Image source={require("../assets/close.png")} style={modalStyles.btnCerrarImg}/>
                                </Pressable>
                                <View>
                                    <Text style={modalStyles.tituloModal}>¿Cuánto va a cobrar por este trabajo?</Text>
                                </View>
                                <Text style={modalStyles.nombre}>Ingresa el costo de este trabajo:</Text>
                                <TextInput
                                    style={modalStyles.input}
                                    placeholder="Ingresa el costo de este trabajo"
                                    value={precio}
                                    onChangeText={setPrecio}
                                    multiline={true}
                                    autoCorrect={false}
                                    autoCapitalize={true}
                                    keyboardType="numeric"
                                />
                                <Pressable style={modalStyles.button}
                                    onPress={createQuotation}
                                >
                                    <Text style={modalStyles.buttonText}>Enviar cotización</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    </Modal>
                )
            }
        </View>
    );

    
}


export default Solicitud;
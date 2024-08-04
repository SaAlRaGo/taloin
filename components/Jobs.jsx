import React from 'react';
import { FlatList, Text, View, Image, TouchableOpacity, StyleSheet, Modal, Pressable, TextInput } from 'react-native';
import {useState, useEffect, useContext} from 'react';
import * as Constants from 'expo-constants';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import config from '../config.json';
import moment from 'moment-timezone';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Star from './Star';
import SelectedImage from './SelectedImage';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
function Jobs() {
    const [trabajos, setTrabajos] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const [modalFotos, setModalFotos] = useState(false);
    const [fotos, setFotos] = useState([]);
    const navigation = useNavigation();
    const [cargando, setCargando] = useState(false);

    const getTrabajos = async () => {
        try {
            setCargando(true);
            const response = await axios.get(`${config.endpoint}/jobs/${user.userType}/${user.id}`);
            
            setTrabajos(response.data);
            setCargando(false);
        } catch (error) {
            console.error(error.message);
        }
    }
    useEffect(() => {
        getTrabajos();
    }, []);

    const styles = StyleSheet.create({
        container: {
            width: "100%",
            marginBottom: Constants.default.statusBarHeight + 130,
            maxHeight: "90vh",
        },
        fotos: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
        },
        button:{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 20,
            width: "100%",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            marginBottom: 10,
            gap: 10,
        },
        titulo: {
            fontSize: 20,
        },
        bold: {
            fontWeight: "bold",
        },
        buttonOpcion: {
            backgroundColor: "#C319D2",
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 5,
            paddingVertical: 5,
        },
        buttonText: {
            color: "white",
            fontSize: 16,
            paddingVertical:0,
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

    const Item = ({ item }) => (
        <View>
            <View style={styles.button}>
                <Text>{item.observations}</Text>
                <Text>Fecha del trabajo: {moment.utc(item.date).local().format('DD/MM/YY HH:mm:ss')}</Text>
                <Text>${item.initial_quote}</Text>
                <View style={styles.fotos}>
                    {
                        item.photos.map((photo, index) => {
                            return (<Image
                                source={{ uri: `${config.endpoint}/${photo.file}` }}
                                style={{ width: 40, height: 40, borderRadius: 5 }}
                                key={index}
                            />)
                        })
                    }
                </View>
                <TouchableOpacity style={styles.buttonOpcion} onPress={() =>
                    navigation.navigate("JobScreen", {job:{...item, accepted:true}})
                    }>
                    <Text style={styles.buttonText}>Ver detalles del trabajo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonOpcion} onPress={() =>{
                    navigation.navigate("SolicitudScreen", {solicitud:{...item.request, accepted:true}
                    })}}>
                    <Text style={styles.buttonText}>Ver las solicitud original</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
    return (
    <>
    { cargando &&
        <Image
            source={require('../assets/loading.gif')}
            style={{ width: 200, height: 200, alignSelf: "center", marginBottom: 20 }}
        />}
        <FlatList
            data={trabajos}
            style={styles.container}
            renderItem={({ item }) => (
                <Item item={item} />      
            )}
            keyExtractor={(item) => item.id}
        />
    </>
    );
}

export default Jobs;
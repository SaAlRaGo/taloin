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

function Citas() {
    const [citas, setCitas] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const [modalCalificar, setModalCalificar] = useState(false);
    const [stars, setStars] = useState(0);
    const navigation = useNavigation();
    const [fotos, setFotos] = useState([]);
    const [showDeleteImages, setShowDeleteImages] = useState({});
    const [descripcion, setDescripcion] = useState("");
    const [modalTrabajo, setModalTrabajo] = useState(false);
    const [idAppointment, setIdAppointment] = useState(0);
    const [idJob, setIdJob] = useState(0);

    const getCitas = async () => {
        const response = await axios.get(`${config.endpoint}/appointments/${user.userType}/${user.id}`);
        setCitas(response.data);
    }
    const deleteFoto = (foto) => {
        setFotos(fotos.filter(f => f.uri !== foto));
    };

    const toggleShowDeleteImage = (foto) => {
        setShowDeleteImages(prevState => ({
            ...prevState,
            [foto]: !prevState[foto]
        }));
    };

    const completarTrabajo = async () => {
        const formData = new FormData();
        formData.append("appointment_id", idAppointment);
        formData.append("observations", descripcion);
        formData.append("completed", true);
        fotos.forEach((foto) => {
            formData.append("photos", foto);
        });
        try {
            const response = await axios.post(`${config.endpoint}/create/job`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setModalTrabajo(false);
            Alert.alert("Trabajo completado", "El trabajo ha sido completado exitosamente");
            getCitas();
        }catch(e){
            console.log(e.response.data.error);
        }
    }

    const crearReview = async () => {
        const formData = new FormData();
        formData.append("job_id", idJob);
        formData.append("stars", stars);
        formData.append("description", descripcion);
        fotos.forEach((foto) => {
            formData.append("photos", foto);
        }
        );
        try {
            const response = await axios.post(`${config.endpoint}/create/review`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setModalCalificar(false);
            Alert.alert("Calificación enviada", "Tu calificación ha sido enviada con éxito");
            getCitas();
        }catch(e){
            console.log(e.response.data.error);
        }
    }

  
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
    useEffect(() => {
        getCitas();
    }, []);

    const styles = StyleSheet.create({
        container: {
            width: "100%",
            marginBottom: Constants.default.statusBarHeight + 130,
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
            flexDirection: "row",
            justifyContent: "center",
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
                <Text>{item.description}</Text>
                <Text>Fecha de la cita: {moment.utc(item.date).local().format('DD/MM/YY HH:mm:ss')}</Text>
                <View style={styles.fotos}>
                    {
                        item.photos.map((photo) => {
                            return (<Image
                                source={{ uri: `${config.endpoint}/${photo.file}` }}
                                style={{ width: 40, height: 40, borderRadius: 5 }}
                                key={photo.file}
                            />)
                        })
                    }
                </View>
                {
                    moment.utc(item.date).local().isBefore(moment()) && user.userType === "worker" && item.job === null &&
                    <TouchableOpacity style={styles.buttonOpcion} onPress={() => { 
                        setIdAppointment(item.id);
                        setModalTrabajo(true) }
                        }>
                        <Text style={styles.buttonText}>¿Ya fuiste a la cita?</Text>
                    </TouchableOpacity>
                }
                {
                    item.job && user.userType === "user" && item.review === null &&
                    <TouchableOpacity style={styles.buttonOpcion} onPress={() => {
                        setIdJob(item.job.id);
                        setModalCalificar(true)}}>
                        <Text style={styles.buttonText}>Calificar visita del trabajador</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity style={styles.buttonOpcion} onPress={() => navigation.navigate("SolicitudScreen", {solicitud:{...item, accepted:true}})}>
                    <Text style={styles.buttonText}>Ver solicitud en detalle</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )
    return (
        <>
        <FlatList
            data={citas}
            style={styles.container}
            renderItem={({ item }) => (
                <Item item={item} />      
            )}
            keyExtractor={(item) => item.id}
        />
        <Modal
                animationType="fade"
                transparent={true}
                visible={modalCalificar}
                onRequestClose={() => {
                setModalCalificar(!modalCalificar);
                }}
            >
                <Pressable 
                    style={modalStyles.fondo}
                    onPress={hideAllDeleteImages}  
                >
                    <View style={modalStyles.modal}>
                        <Pressable onPress={() => setModalCalificar(false)} style={modalStyles.btnCerrar}>
                            <Image source={require("../assets/close.png")} style={modalStyles.btnCerrarImg}/>
                        </Pressable>
                        <View>
                            <Text style={modalStyles.tituloModal}>Calificar trabajador</Text>
                        </View>
                        <Text style={modalStyles.nombre}>¿Cuántas estrellas merece este trabajador por el trabajo que realizó?</Text>
                        <View style={modalStyles.calificaciones}>
                            {
                                [1,2,3,4,5].map((star) => {
                                    return (
                                        <Pressable key={star} onPress={() => setStars(star)}>
                                            <Star filled={star <= stars} />
                                        </Pressable>
                                    )
                                })
                            }
                        </View>
                        <Text style={modalStyles.nombre}>¿Por qué esa calificación?:</Text>
                        <TextInput
                        style={modalStyles.input}
                        placeholder="Ingresa la razón de esa calificación"
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
                        <Pressable style={modalStyles.button} onPress={() => crearReview()}>
                                <Text style={modalStyles.buttonText}>Calificar</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalTrabajo}
                onRequestClose={() => {
                setModalTrabajo(!modalTrabajo);
                }}
            >
                <Pressable 
                    style={modalStyles.fondo}
                    onPress={hideAllDeleteImages}  
                >
                    <View style={modalStyles.modal}>
                        <Pressable onPress={() => setModalTrabajo(false)} style={modalStyles.btnCerrar}>
                            <Image source={require("../assets/close.png")} style={modalStyles.btnCerrarImg}/>
                        </Pressable>
                        <View>
                            <Text style={modalStyles.tituloModal}>Completitud de trabajo</Text>
                        </View>
                        <Text style={modalStyles.nombre}>Describe tu experiencia realizando este trabajo:</Text>
                        <TextInput
                        style={modalStyles.input}
                        placeholder="¿Cómo te fue en la cita?"	
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
                        <TouchableOpacity style={modalStyles.button} onPress={() => completarTrabajo()}>
                                <Text style={modalStyles.buttonText}>Completar trabajo</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

export default Citas;
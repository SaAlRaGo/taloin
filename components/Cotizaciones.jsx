import { FlatList, View, Text, StyleSheet, Image, Pressable, Modal, TextInput} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import config from "../config.json";
import axios from "axios";
import * as Constants from  'expo-constants'
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Alert } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
function Cotizaciones() {
    const [cotizaciones, setCotizaciones] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const navigation = useNavigation();
    const [modalQuotation, setModalQuotation] = useState(false);
    const [modalDate, setModalDate] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);
    const [showHour, setShowHour] = useState(false);
    const [idQuotation, setIdQuotation] = useState(0);
    const [precio, setPrecio] = useState(0);
    const [cargando, setCargando] = useState(true);
    const getCotizaciones = async () => {
        setCargando(true);
        const response = await axios.get(`${config.endpoint}/quotations/${user.userType}/${user.id}`);
        setCotizaciones(response.data);
        setCargando(false);
    }
    useEffect(() => {
        getCotizaciones();
    }, []);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        setShowDate(false);
        setShowHour(true);
    };

    const onChangeHour = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        setShowDate(false);
        setShowHour(false);
    }
    
    const showDatepicker = () => {
        setShowDate(true);
    };
    const acceptCotizacion = async (id) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("accepted", 1);
        try {
            const response = await axios.post(`${config.endpoint}/quotation/accept/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if(response.status === 200){
                Alert.alert("Cotización aceptada", "La cotización ha sido aceptada con éxito");
                navigation.navigate("CotizacionesScreen");
                getCotizaciones();
            }
        } catch (error) {
            
        }
    }

    const acceptNewPrice = async (id) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("negotiating", 1);
        try {
            const response = await axios.post(`${config.endpoint}/quotation/acceptNegotiation/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if(response.status === 200){
                Alert.alert("Cotización aceptada", "La negociación ha sido aceptada con éxito");
                navigation.navigate("CotizacionesScreen");
                getCotizaciones();
            }
        } catch (error) {
            
        }
    }

    const negotiate = async (id) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("negotiating", 1);
        formData.append("new_price", precio);
        try {
            const response = await axios.post(`${config.endpoint}/quotation/negotiate/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if(response.status === 200){
                Alert.alert("Cotización enviada", "La negociación ha sido enviada con éxito");
                setModalQuotation(false);
                navigation.navigate("CotizacionesScreen");
                getCotizaciones();
            }
        } catch (error) {
            
        }
    }

    const createAppointment = async (id) => {
        const formData = new FormData();
        formData.append("quote_id", id);

        //date en YYYY-MM-DD HH:MM:SS
        formData.append("date", date.toISOString().split(".")[0]);
        try {
            const response = await axios.post(`${config.endpoint}/create/appointment`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if(response.status === 200){
                Alert.alert("Cita creada", "La cita ha sido creada con éxito");
                setModalDate(false);
                navigation.navigate("CotizacionesScreen");
                getCotizaciones();
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }


    const Item = ({ item }) => (
        <View>
            <View style={styles.button}>
                <Text>{item.description}</Text>
                <Text>Cotización actual: ${item.initial_quote}</Text>
                <Text>{item.accepted === 1 ? "Aceptada" : item.negotiating === 1 ? "Negociando" : "Pendiente de aceptar"}</Text>
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
                item.accepted === 0 ? (
                <View style={{flexDirection:"row", alignItems:"center", gap:5, justifyContent:"center"}}>
                    {item.negotiating === 0 && user.userType === "user" ? (
                    <TouchableOpacity style={styles.buttonOpcion} onPress={() => acceptCotizacion(item.id)}>
                        <Text style={styles.buttonText}>Aceptar cotizacion</Text>
                    </TouchableOpacity>
                    ) : user.userType === "worker" && item.negotiating === 1 && 
                        (
                        <TouchableOpacity style={styles.buttonOpcion} onPress={() => acceptNewPrice(item.id)}>
                            <Text style={styles.buttonText}>Aceptar nuevo precio</Text>
                        </TouchableOpacity>
                        )
                    }
                    <TouchableOpacity style={styles.buttonOpcion} onPress={() => {
                        setIdQuotation(item.id);
                        setModalQuotation(true);
                    }}>
                        <Text style={styles.buttonText}>Renegociar</Text>
                    </TouchableOpacity>
                </View>
                ) : (
                    item.appointment === null && (
                    <View style={{flexDirection:"row", alignItems:"center", gap:5, justifyContent:"center"}}>
                        <TouchableOpacity style={styles.buttonOpcion} onPress={() => {
                            setIdQuotation(item.id);
                            setModalDate(true);
                        }}>
                            <Text style={styles.buttonText}>Crear cita</Text>
                        </TouchableOpacity>
                </View>
                ))}
                <TouchableOpacity style={styles.buttonOpcion} onPress={() => navigation.navigate("SolicitudScreen", {solicitud:{...item, accepted:true}})}>
                    <Text style={styles.buttonText}>Ver solicitud en detalle</Text>
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
                data={cotizaciones}
                style={styles.container}
                renderItem={({ item }) => (
                    <Item item={item} />      
                )}
                keyExtractor={(item) => item.id}
            />
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
                            <Text style={modalStyles.tituloModal}>¿Cuál es el nuevo precio que quieres?</Text>
                        </View>
                        <Text style={modalStyles.nombre}>Ingresa el nuevo costo de este trabajo:</Text>
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Ingresa el nuevo costo de este trabajo"
                            value={precio}
                            onChangeText={setPrecio}
                            multiline={true}
                            autoCorrect={false}
                            autoCapitalize={true}
                            keyboardType="numeric"
                        />
                        <Pressable style={modalStyles.button}
                            onPress={() => negotiate(idQuotation)}
                        >
                            <Text style={modalStyles.buttonText}>Enviar cotización</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalDate}
                onRequestClose={() => {
                setModalDate(!modalDate);
                }}
            >
                <Pressable 
                    style={modalStyles.fondo}
                >
                    <View style={modalStyles.modal}>
                        <Pressable onPress={() => setModalDate(false)} style={modalStyles.btnCerrar}>
                            <Image source={require("../assets/close.png")} style={modalStyles.btnCerrarImg}/>
                        </Pressable>
                        <View>
                            <Text style={modalStyles.tituloModal}>Crear cita</Text>
                        </View>
                        <Text style={modalStyles.nombre}>Ingresa la fecha para la cita de este trabajo</Text>

                        <Pressable style={modalStyles.button}
                            onPress={showDatepicker}
                        >
                            <Text style={modalStyles.buttonText}>Seleccionar fecha</Text>
                        </Pressable>
                        {showDate && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={'date'}
                            is24Hour={true}
                            onChange={onChange}
                        />)}

                        {showHour && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={'time'}
                            is24Hour={true}
                            onChange={onChangeHour}
                        />)}
                        <Text>Fecha seleccionada: {date.toLocaleString()}</Text>
                        <Pressable style={modalStyles.button}
                            onPress={() => createAppointment(idQuotation)}
                        >
                            <Text style={modalStyles.buttonText}>Crear cita</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

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

export default Cotizaciones;
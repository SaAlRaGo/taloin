import { FlatList, View, Text, StyleSheet, Image, Pressable} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import config from "../config.json";
import axios from "axios";
import * as Constants from  'expo-constants'
import { useNavigation } from "@react-navigation/native";
function Solicitudes() {
    const [solicitudes, setSolicitudes] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const navigation = useNavigation();
    useEffect(() => {
        const getSolicitudes = async () => {
            const response = await axios.get(`${config.endpoint}/requests/${user.userType}/${user.id}`);
            setSolicitudes(response.data);
        }
        getSolicitudes();
    }, []);

    const Item = ({ item }) => (
        <Pressable style={styles.button} onPress={() => navigation.navigate("SolicitudScreen", {solicitud: item})}>
            <Text style={styles.titulo}>{user.userType === "user" ? "Para " : "De "} 
                <Text style={styles.bold}>
                    {user.userType === "user" ? item.worker.name : item.user.name} {user.userType === "user" ? item.worker.lastname : item.user.lastname}
                </Text>
            </Text>
            <Text>{item.description}</Text>
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
        </Pressable>
    )

    return (
        <FlatList
            data={solicitudes}
            style={styles.container}
            renderItem={({ item }) => (
                <Item item={item} />      
            )}
            keyExtractor={(item) => item.id}
        />
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
    }
});

export default Solicitudes;
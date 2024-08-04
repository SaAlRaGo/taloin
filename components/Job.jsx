import { View, StyleSheet, Text, FlatList, Image } from "react-native";
import config from "../config.json";
import moment from 'moment-timezone';

import * as Constants from 'expo-constants';

function Job({job}) {
    
    

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
            marginBottom: Constants.default.statusBarHeight + (400),
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
        <View>
            <Text style={styles.titulo}>{job.request.worker ? "Para:" : "De:"} {job.request.worker ? job.request.worker.name : job.request.user.name} {job.request.worker ? job.request.worker.lastname : job.request.user.lastname}</Text>
            <Text style={styles.text}>{job.observations}</Text>
            <Text style={styles.text}>Fecha: {moment.utc(job.date).local().format('DD/MM/YY HH:mm:ss')}</Text>
            <Text style={styles.text}>Costo: ${job.initial_quote}</Text>
            <FlatList
                data={job.photos}
                style={styles.container}
                renderItem={({ item }) => {
                    return (<Image 
                    source={{ uri: `${config.endpoint}/${item.file}` }}
                    style={{ width: "100%", height: undefined, aspectRatio: 1, borderRadius: 5, borderColor: "gray", borderWidth: 2, marginBottom: 10 }}
                    resizeMode="contain"
                    />)
                }}
                keyExtractor={(item) => item.file}
            />
        </View>
    );
}


export default Job;
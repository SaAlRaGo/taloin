import { View, StyleSheet, Text, FlatList, Image } from "react-native";
import config from "../config.json";
import moment from 'moment-timezone';
import Star from "./Star";
import * as Constants from 'expo-constants';

function Job({review}) {
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
        card: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
        },
    });
    return (
        <View>
            <Text style={styles.titulo}>{review.request.worker ? "Para:" : "De:"} {review.request.worker ? review.request.worker.name : review.request.user.name} {review.request.worker ? review.request.worker.lastname : review.request.user.lastname}</Text>
            <Text>{review.description}</Text>
            <Text>Fecha del trabajo: {moment.utc(review.date).local().format('DD/MM/YY HH:mm:ss')}</Text>
            <Text>${review.initial_quote}</Text>
            <View style={styles.card}>
                {
                    [1,2,3,4,5].map((star, index) => {
                        return <Star key={index} filled={star <= review.stars} />
                    })
                }
            </View>
            <FlatList
                data={review.reviewPhotos}
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
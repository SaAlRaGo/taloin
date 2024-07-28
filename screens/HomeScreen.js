import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import tw from "tailwind-react-native-classnames"
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from 
"react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import NavFavourites from "../components/NavFavourites";
import { UserContext } from "../contexts/UserContext";
import { useContext, useState, useEffect } from "react";
import config from "../config.json";
import * as Constants from  'expo-constants'
import axios from 'axios';
const HomeScreen = () => {
    const dispatch = useDispatch();
    const {user, setUser} = useContext(UserContext);
    const perfilFoto = `${config.endpoint}/${user.profile_photo}`
    return(
        <SafeAreaView style={styles.container}>
            <View style = {tw`p-5`}>
                <View
                    style={
                        {
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }
                    }
                >
                    <View
                        style={
                            {
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 10
                            }
                        }
                    >
                        <Image 
                            style={{
                                width: 50, 
                                height: 50, 
                                resizeMode:"contain"
                            }}
                            source={{uri: perfilFoto}}
                        />
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold"
                            }}
                        >
                            {user.name} {user.lastname}
                        </Text>
                    </View>
                    <Image 
                        style={{
                            width: 50, 
                            height: 50, 
                            resizeMode:"contain"
                        }}
                        source={require("../images/logo.png")}
                    />
                </View>
                
                <GooglePlacesAutocomplete
                placeholder={`Bienvenido ${user.name}, ${user.userType === "user" ? "es hora de trabajar" : "¿Tienes algún problema?"}`}
                styles={{
                    container: {
                        flex: 0,
                    },
                    textInput: {
                        fontSize: 18,
                    }
                }}
                onPress={(data, details = null) =>{
                    dispatch(setOrigin({
                        location: details.geometry.location,
                        description: data.description
                    }))

                    dispatch(setDestination(null))
                }}
                fetchDetails= {true}
                returnKeyType={"search"}
                enablePoweredByContainer={false}
                minLength={2}
                query={{
                    key: GOOGLE_MAPS_APIKEY,
                    language: 'es',
                }}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    debounce={400}
                />

                <NavOptions/>
                <NavFavourites/>
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    text: {
        color: "blue",
    },
    container: {
        backgroundColor: "white",
        paddingTop: Constants.default.statusBarHeight,
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        position: "relative",
    },
})
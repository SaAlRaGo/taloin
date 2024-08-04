import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { UserContext } from "../contexts/UserContext";
import { useContext, useState, useEffect } from "react";
import config from "../config.json";
import * as Constants from  'expo-constants'
import tw from "tailwind-react-native-classnames"
function LayoutScreen({children}) {
    const {user, setUser} = useContext(UserContext);
    const perfilFoto = `${config.endpoint}/${user.profile_photo}`
    return (
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
                <View>
                    {children}
                </View>
            </View>
        </SafeAreaView>
    );
}

export default LayoutScreen;

const styles = StyleSheet.create({
    text: {
        color: "blue",
    },
    container: {
        backgroundColor: "white",
        paddingTop: 10,
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        position: "relative",
    },
})
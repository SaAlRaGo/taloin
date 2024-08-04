import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, FlatList, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames"
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectOrigin } from "../slices/navSlice";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

const data = [
    {
        id:"123",
        title: "Solicitar servicio",
        image: require("../images/Soli.png"),
        screen: "MapScreen",
    },
    {
        id:"456",
        title: "Mis citas",
        image: require("../images/Work.png"),
        screen: "CitasScreen", //se cambia al rato
    },
]

const NavOptions = () => {
    
    const navigation = useNavigation();
    const origin = useSelector(selectOrigin)
    const {user, setUser} = useContext(UserContext);
    const item = data[user.userType !== "user" ? 1 : 0];
    return(
        
        <TouchableOpacity
            onPress={() => navigation.navigate(item.screen)}
            style ={styles.button}
        >
            <View style={styles.card}>
                <View style={styles.up}>
                    <Image style = {{ width: 120, height: 120, resizeMode:"contain"}}
                        source={item.image}
                    />
                <Icon
                    style={tw`p-2 bg-black rounded-full w-10 mt-4`} 
                    name="arrowright"
                    color= "white"
                    type="antdesign"
                />
                </View>
                <Text style={tw `mt-2 text-lg font-semibold`}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

styles = StyleSheet.create({
    button:{
        backgroundColor: "white",
        padding: 10,
        borderRadius: 20,
        width: "100%",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    up: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    card:{
        alignItems: "center",
    }
})

export default NavOptions;


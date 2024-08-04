import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, FlatList, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames"
import { Icon } from "react-native-elements";
import SolicitudesScreen from "../screens/SolicitudesScreen";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectOrigin } from "../slices/navSlice";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";



const NavFavourites = () => {
    const navigation = useNavigation();
    const { user, setUser } = useContext(UserContext);
    const data = [
        {
            id:"123",
            icon: "plumbing",
            location: "Solicitudes",
            screen: "SolicitudesScreen",
        },
        {
            id:"789",
            icon: "request-quote",
            location: "Cotizaciones",
            screen: "CotizacionesScreen",
        },
        
        {
            id:"456",
            icon: "date-range",
            location: "Citas",
            screen: "CitasScreen",
        },
        {
            id:"101",
            icon: "check-circle-outline",
            location: "Trabajos finalizados",
            screen: "TrabajosScreen",
        },
        {
            id:"102",
            icon: "star",
            location: "Calificaciones",
            screen: "CalificacionesScreen",
        }
    ]
   return(
    <FlatList  
    data={data} 
    keyExtractor={(item) => item.id}
    style={tw`mt-3`}
    renderItem={({item: {location, icon, screen}, index}) => (
        user.userType === "worker" && index === 2 ? null :
        <TouchableOpacity style={tw`flex-row items-center p-2 rounded-xl mb-3 bg-gray-100`} onPress={() => navigation.navigate(screen)}>
            <Icon
                style={tw`mr-6 rounded-full bg-gray-500 p-3`}
                name={icon}
                type="material"
                color="white"
                size={18}
            />
            <View>
                <Text style={tw `font-semibold text-lg`}>{location}</Text>
            </View>
        </TouchableOpacity>
    )}/>
   ) 
   
}

export default NavFavourites;


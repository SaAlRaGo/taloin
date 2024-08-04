import React, { Component, useState, useEffect, useContext } from 'react'
import tw from "tailwind-react-native-classnames"
import { 
    Text, 
    View, 
    StyleSheet, 
    TouchableOpacity,
    FlatList
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ResultsContext } from '../contexts/ResultsContext';
import { UserContext } from '../contexts/UserContext';
import config from '../config.json';
import axios from 'axios';


const NavigateCard = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [profesionEscrita, setProfesionEscrita] = useState("");
    const [servicios, setServicios] = useState([]);
    const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
    const {results, setResults} = useContext(ResultsContext);
    const {user, setUser} = useContext(UserContext);
    useEffect(() => {
        const getServicios = async () => {
            try {
                const response = await axios.get(`${config.endpoint}/services`);
                setServicios(response.data);
            }catch(e){
                
            }
        }
        getServicios();
    }, []);

    useEffect(() => {
        try{
            if(profesionEscrita.length > 0){
                setServiciosFiltrados(servicios.filter(servicio => servicio.name.includes(profesionEscrita)));
            }else{
                setServiciosFiltrados([]);
            }
        }catch(e){
            
        }
    }, [profesionEscrita]);

   
    const getWorkers = async (idServicioBuscar) => {
        const response = await axios.post(`${config.endpoint}/workers/service/${idServicioBuscar}`, {
            lat: user.latitude,
            lon: user.longitude
        });
        setResults(response.data);
    }
                

    const Item = ({ servicio }) => {
        return (
            <TouchableOpacity style={toInputBoxStyles.option} onPress={() => getWorkers(servicio.id)}>
                <Text>{servicio.name}</Text>
            </TouchableOpacity>
        );
    }
    return(
        <View style={toInputBoxStyles.mainContainer}>
            <Text style={tw`text-center py-5 text-xl`}>¿Qué tipo de empleado necesitas?</Text>
            <View style={tw`border-t border-gray-200 flex-shrink`}>
                <View style={toInputBoxStyles.textInputContainer}>
                    <TextInput 
                        placeholder='Ingresa una profesión' 
                        value={profesionEscrita} 
                        onChangeText={setProfesionEscrita} 
                        autoCorrect={true}
                        autoCapitaliz={true}
                        style={toInputBoxStyles.textInput}
                    />
                </View>
                <Text style={toInputBoxStyles.txtSelect}>Selecciona una opción: </Text>
                <FlatList
                    data={serviciosFiltrados}
                    renderItem={({ item }) => <Item servicio={item} />}
                    keyExtractor={item => item.id}
                    style={toInputBoxStyles.optionsContainer}
                />
            </View>
        </View>
    );
};

export default NavigateCard;

const toInputBoxStyles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        paddingTop: 20,
        flex: 0,
    },
    textInput: {
        backgroundColor: "#DDDDDF",
        borderRadius: 5,
        fontSize: 18,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    textInputContainer: {
        backgroundColor: "white",
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 10,
        gap: 10,
    },
    mainContainer:{
        borderRadius: 20,
        backgroundColor: "white",
        height: "100%",
        flex: 1,
    },
    optionsContainer: {
        flexDirection: "column",
        paddingHorizontal: 10,
    },
    txtSelect: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
        marginBottom: 5,
        paddingHorizontal: 10,
    },
    option: {
        backgroundColor: "#DDDDDF",
        borderRadius: 5,
        fontSize: 18,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 5,
    }
})
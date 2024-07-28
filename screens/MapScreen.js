import React, { Component } from 'react'
import tw from "tailwind-react-native-classnames"
import { Text, View, StyleSheet } from 'react-native'
import Map from '../components/Map';
import NavigateCard from '../components/NavigateCard';
import RideOptionsCard from '../components/RideOptionsCard';
import MapView from 'react-native-maps'
import { createStackNavigator } from '@react-navigation/stack';
import { ResultsContextProvider } from "../contexts/ResultsContext";
import * as Location from "expo-location";

const MapScreen = () => {
    const Stack = createStackNavigator();
    return(
        <ResultsContextProvider>
            <View>
                <View style={tw`h-1/2`}>
                    <Map/>
                </View>
                
                <View style={tw`h-1/2`}>
                <Stack.Navigator>
                    <Stack.Screen
                    name="NavigateCard"
                    component={NavigateCard}
                    options={{
                        headerShown: false,
                    }}
                    />
                </Stack.Navigator>
                </View>
            </View>
        </ResultsContextProvider>
    );
};

export default MapScreen;

const styles = StyleSheet.create({})
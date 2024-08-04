import React, { Component, useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRef, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import config from "../config.json";
import tw from "tailwind-react-native-classnames";
function MapRequest({objetivo}) {
    const { user, setUser } = useContext(UserContext);
    const mapRef = useRef(null);
    
    const styles = StyleSheet.create({
        map: {
          ...StyleSheet.absoluteFillObject,
        },
        markerContainer: {
          alignItems: "center",
        },
        marker: {
          justifyContent: "center",
          alignItems: "center",
          width: 50,
          height: 50,
          backgroundColor: "white",
          borderRadius: 25,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "black",
          zIndex: 2,
        },
        image: {
          width: 40,
          height: 40,
        },
        triangle: {
          width: 0,
          height: 0,
          borderLeftWidth: 10,
          borderRightWidth: 10,
          borderTopWidth: 20,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: "black",
          marginTop: -3,
          zIndex: 1,
        },
        triangleBlue: {
          width: 0,
          height: 0,
          borderLeftWidth: 10,
          borderRightWidth: 10,
          borderTopWidth: 20,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: "#56D3DE",
          marginTop: -3,
          zIndex: 1,
        },
      });
    
    return (
        <MapView
        ref={mapRef}
        style={tw`flex-1`}
        mapType="mutedStandard"
        initialRegion={{
          latitude: user.latitude,
          longitude: user.longitude,
          latitudeDelta: Math.abs(user.latitude - objetivo.latitude - 0.001) * 2,
          longitudeDelta:  Math.abs(user.longitude - objetivo.longitude - 0.001) * 2,
        }}
      >
        <Marker
          coordinate={{
            latitude: user.latitude,
            longitude: user.longitude,
          }}
        >
          <View style={styles.markerContainer}>
            <View style={styles.marker}>
              <Image
                source={{ uri: `${config.endpoint}/${user.profile_photo}` }}
                style={styles.image}
              />
            </View>
            <View style={styles.triangleBlue} />
          </View>
        </Marker>
        <Marker
          coordinate={{
            latitude: objetivo.latitude,
            longitude: objetivo.longitude,
          }}
        >
          <View style={styles.markerContainer}>
            <View style={styles.marker}>
              <Image
                source={{ uri: `${config.endpoint}/${objetivo.profile_photo}` }}
                style={styles.image}
              />
            </View>
            <View style={styles.triangle} />
          </View>
        </Marker>
    </MapView>
    );
}

export default MapRequest;
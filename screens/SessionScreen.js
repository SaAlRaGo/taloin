import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, TextInput, Alert, TouchableOpacity } from "react-native";
import { UserContext } from "../contexts/UserContext";
import axios from 'axios';
import tw from "tailwind-react-native-classnames"
import config from "../config.json"
const logo = require("../images/logo.png")

const SessionSCreen = () => {

    const { user, setUser } = useContext(UserContext);
    const navigation = useNavigation();
    const [click,setClick] = useState(false);
    const [email,setUsername]=  useState("");
    const [password,setPassword]=  useState("");
    const [tipoUsuario,setTipoUsuario]=  useState("usuario"); 
    const login = async () => {
      const form = new FormData();
      form.append("email", email);
      form.append("password", password);
      try {
        const response = await axios.post(`${config.endpoint}/login/${tipoUsuario === "trabajador" ? "worker" : "user"}`, {
          email: email,
          password: password
        }, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        response.data.userType = tipoUsuario === "usuario" ? "worker" : "user";
        if(response.data.id){
          setUser(response.data);
          navigation.navigate("HomeScreen");
        }else{
        }
      } catch (error) {
        console.log(error.response.data.error);
        Alert.alert("Error", error.response.data.error);
      }
    };
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.opciones}>
          <TouchableOpacity style={tipoUsuario === "usuario" ? styles.buttonOpcion : styles.buttonOpcionNoSeleccionado} onPress={()=>setTipoUsuario("usuario")}>
            <Text style={tipoUsuario === "usuario" ? styles.buttonText : styles.buttonTextUnselected}>
              Soy empleador
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={tipoUsuario !== "usuario" ? styles.buttonOpcion : styles.buttonOpcionNoSeleccionado} onPress={()=>{setTipoUsuario("trabajador")}}>
            <Text style={tipoUsuario !== "usuario" ? styles.buttonText : styles.buttonTextUnselected}>
              Soy Trabajador
            </Text>
          </TouchableOpacity>
        </View>
        <Image source={logo} style={styles.image} resizeMode='contain' />
        <Text style={styles.title}>Bienvenido</Text>
        <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setUsername} autoCorrect={false}
        autoCapitalize='none' />
            <TextInput style={styles.input} placeholder='Contraseña' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
        autoCapitalize='none'/>
        </View>
        <View style={styles.rememberView}>
            <View>
                <Pressable onPress={() => Alert.alert("Forget Password!")}>
                    <Text style={styles.forgetText}>Olvide mi contraseña</Text>
                </Pressable>
            </View>
        </View>

        <View style={styles.buttonView}>
            <Pressable style={styles.button} onPress={() => login()}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </Pressable>
        </View>
        
 

        <Text style={styles.footerText}>¿No tienes una cuenta?
          <Pressable onPress={() => {
              navigation.navigate("Signup")
          }}
          style={styles.pressable}
          >
                      <Text style={styles.signup}>Registrate</Text>
          </Pressable>
        </Text>
    </SafeAreaView>
  )
}

export default SessionSCreen;

const styles = StyleSheet.create({
    container : {
      alignItems : "center",
      paddingTop: 70,
    },
    image : {
      height : 160,
      width : 170
    },
    title : {
      fontSize : 30,
      fontWeight : "bold",
      textTransform : "uppercase",
      textAlign: "center",
      paddingVertical : 40,
      color : "#C319D2"
    },
    inputView : {
      gap : 15,
      width : "100%",
      paddingHorizontal : 40,
      marginBottom  :5
    },
    input : {
      height : 50,
      paddingHorizontal : 20,
      borderColor : "#C319D2",
      borderWidth : 1,
      borderRadius: 7
    },
    rememberView : {
      width : "100%",
      paddingHorizontal : 50,
      justifyContent: "space-between",
      alignItems : "center",
      flexDirection : "row",
      marginBottom : 8
    },
    switch :{
      flexDirection : "row",
      gap : 1,
      justifyContent : "center",
      alignItems : "center"
      
    },
    rememberText : {
      fontSize: 13
    },
    forgetText : {
      fontSize : 11,
      color : "#C319D2"
    },
    button : {
      backgroundColor : "#C319D2",
      height : 45,
      borderColor : "gray",
      borderWidth  : 1,
      borderRadius : 5,
      alignItems : "center",
      justifyContent : "center"
    },
    buttonText : {
      color : "white"  ,
      fontSize: 18,
      fontWeight : "bold"
    }, 
    buttonView :{
      width :"100%",
      paddingHorizontal : 50
    },
    optionsText : {
      textAlign : "center",
      paddingVertical : 10,
      color : "gray",
      fontSize : 13,
      marginBottom : 6
    },
    mediaIcons : {
      flexDirection : "row",
      gap : 15,
      alignItems: "center",
      justifyContent : "center",
      marginBottom : 23
    },
    icons : {
      width : 40,
      height: 40,
    },
    footerText : {
      textAlign: "center",
      color : "gray",
    },
    signup : {
      color : "#C319D2",
      fontSize : 13,
      alignSelf : "center",
    },
    pressable : {
      alignItems : "center",
      marginRight: 10,
      justifyContent : "center"
    },
    opciones: {
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      gap:20
    },
    buttonOpcion:{
      backgroundColor : "#C319D2",
      height : 45,
      borderColor:"transparent",
      borderWidth  : 1,
      borderRadius : 5,
      alignItems : "center",
      justifyContent : "center",
      paddingHorizontal: 20
    },
    buttonOpcionNoSeleccionado:{
      backgroundColor : "#fff",
      height : 45,
      borderWidth  : 1,
      borderColor:"transparent",
      borderRadius : 5,
      alignItems : "center",
      justifyContent : "center",
      paddingHorizontal: 20
    },
    buttonTextUnselected : {
      color : "black"  ,
      fontSize: 18,
      fontWeight : "bold",
    }, 
  })

//class="h-14 bg-gradient-to-r from-cyan-500 to-blue-500"
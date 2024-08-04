import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { Provider } from  "react-redux"
import { store } from './store';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import { SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
 } from "react-native-safe-area-context";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler'
import { Platform } from 'react-native';
import SessionSCreen from './screens/SessionScreen';
import SignupSCreen from './screens/SignupScreen';
import { UserContextProvider } from './contexts/UserContext';
import SolicitudesScreen from './screens/SolicitudesScreen';
import SolicitudScreen from './screens/SolicitudScreen';
import CotizacionesScreen from './screens/CotizacionesScreen';
import CitasScreen from './screens/CitasScreen';
import MapRequestScreen from './screens/MapRequestScreen';
import JobsScreen from './screens/JobsScreen';
import JobScreen from './screens/JobScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import ReviewScreen from './screens/ReviewScreen';
export default function App() {
  const Stack = createStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
          >
          <UserContextProvider>
            <Stack.Navigator>
              
                <Stack.Screen
                  name="Login"
                  component={SessionSCreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Signup"
                  component={SignupSCreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="MapScreen"
                    component={MapScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="SolicitudesScreen"
                    component={SolicitudesScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name = "SolicitudScreen"
                    component = {SolicitudScreen}
                    options = {{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name = "CotizacionesScreen"
                    component = {CotizacionesScreen}
                    options = {{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name = "CitasScreen"
                    component = {CitasScreen}
                    options = {{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name = "MapRequestScreen"
                    component = {MapRequestScreen}
                    options = {{
                      headerShown: false,
                    }}
                    />
                  <Stack.Screen
                    name = "TrabajosScreen"
                    component = {JobsScreen}
                    options = {{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name = "JobScreen"
                    component = {JobScreen}
                    options = {{
                      headerShown: false,
                    }}
                  />

                  <Stack.Screen
                    name = "CalificacionesScreen"
                    component = {ReviewsScreen}
                    options = {{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ReviewScreen"
                    component={ReviewScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
            </Stack.Navigator>
            </UserContextProvider>
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

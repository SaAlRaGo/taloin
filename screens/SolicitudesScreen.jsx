import LayoutScreen from "./LayoutScreen";
import {Text, StyleSheet} from "react-native";
import Solicitudes from "../components/Solicitudes";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
function SolicitudesScreen() {
    const { user, setUser } = useContext(UserContext);
    return (
        <LayoutScreen>
            <Text style={styles.titulo}>{user.userType === "user" ? "Mis solicitudes" : "Me solicitan en" }</Text>
            <Solicitudes />
        </LayoutScreen>
    );
}

const styles = StyleSheet.create({
    titulo: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        color: "#C319D2"
    }
});

export default SolicitudesScreen;
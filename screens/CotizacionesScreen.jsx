import LayoutScreen from "./LayoutScreen";
import {Text, StyleSheet} from "react-native";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import Cotizaciones from "../components/Cotizaciones";
function CotizacionesScreen() {
    const { user, setUser } = useContext(UserContext);
    return (
        <LayoutScreen>
            <Text style={styles.titulo}>{user.user ? "Cotizaciones recibidas" : "Mis cotizaciones enviadas"}</Text>
            <Cotizaciones />
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

export default CotizacionesScreen;
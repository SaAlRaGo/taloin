import LayoutScreen from "./LayoutScreen";
import {Text, StyleSheet} from "react-native";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import Citas from "../components/Citas";
function CitasScreen() {
    const { user, setUser } = useContext(UserContext);
    return (
        <LayoutScreen>
            <Text style={styles.titulo}>Todas mis citas</Text>
            <Citas />
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

export default CitasScreen;
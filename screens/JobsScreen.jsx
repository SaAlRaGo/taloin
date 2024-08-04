import LayoutScreen from "./LayoutScreen";
import { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import { UserContext } from "../contexts/UserContext";
import Jobs from "../components/Jobs";
function JobsScreen() {
    const { user, setUser } = useContext(UserContext);

    return (
    <LayoutScreen>
        <Text style={styles.titulo}>{user.userType === "user" ? "Todos los trabajos solicitados completados" : "Todos mis trabajos"}</Text>
        <Jobs />
    </LayoutScreen>);
}

const styles = StyleSheet.create({
    titulo: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        color: "#C319D2"
    }
});


export default JobsScreen;
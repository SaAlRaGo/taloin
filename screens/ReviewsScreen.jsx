import LayoutScreen from "./LayoutScreen";
import { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import { UserContext } from "../contexts/UserContext";
import Jobs from "../components/Jobs";
import Reviews from "../components/Reviews";
function ReviewsScreen() {
    const { user, setUser } = useContext(UserContext);

    return (
    <LayoutScreen>
        <Text style={styles.titulo}>{user.userType === "user" ? "Todas mis calificaciones dadas" : "Todas las calificiones que me han dado"}</Text>
        <Reviews />
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


export default ReviewsScreen;
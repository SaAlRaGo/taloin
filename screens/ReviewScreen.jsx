import LayoutScreen from "./LayoutScreen";
import { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import { UserContext } from "../contexts/UserContext";
import Job from "../components/Job";
import Review from "../components/Review";
function JobScreen({route}) {
    const { user, setUser } = useContext(UserContext);
    const { review } = route.params;
    return (
    <LayoutScreen>
        <Review review={review}/>
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


export default JobScreen;
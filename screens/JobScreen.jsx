import LayoutScreen from "./LayoutScreen";
import { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import { UserContext } from "../contexts/UserContext";
import Job from "../components/Job";
function JobScreen({route}) {
    const { user, setUser } = useContext(UserContext);
    const { job } = route.params;
    return (
    <LayoutScreen>
        <Job job={job}/>
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
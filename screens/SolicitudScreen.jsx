import LayoutScreen from "./LayoutScreen";
import Solicitud from "../components/Solicitud";
function SolicitudScreen({route}) {
    const { solicitud } = route.params;
    return (
        <LayoutScreen>
            <Solicitud solicitud={solicitud}/>
        </LayoutScreen>
    );
}

export default SolicitudScreen;
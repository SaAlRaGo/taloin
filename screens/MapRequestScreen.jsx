import MapRequest from "../components/MapRequest";
function MapRequestScreen({route}) {
    const {objetivo} = route.params;
    return (
        <MapRequest objetivo={objetivo}/>
    );
}

export default MapRequestScreen;
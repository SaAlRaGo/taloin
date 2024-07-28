import {useState} from 'react'
import {View, Image, Modal} from 'react-native'
function ModalWorker({openned, children}) {
    const [modalOpenned, setModalOpenned] = useState(openned);
    if(modalOpenned){
        return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalOpenned}
            onRequestClose={() => {
                setModalOpenned(!modalOpenned);
            }}>
            <Pressable onPress = {() => setModalOpenned(false)}>
                <Image 
                    source={require("../assets/close.png")}
                />
            </Pressable>
            <View>
                {children}
            </View>
        </Modal>);
    }else{
        return (
            <></>
        );
    }
}

export default ModalWorker;
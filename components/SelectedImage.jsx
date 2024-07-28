import { Pressable, Image, StyleSheet, View } from "react-native";

function SelectedImage({foto, deleteFoto, showDeleteImage, toggleShowDeleteImage}) {
    const styles = StyleSheet.create({
        addPhotoImg:{
            borderRadius: 5,
            width: 40,
            height: 40,
            zIndex: 2,
            position: 'relative',
        },
        deleteImage: {
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 3,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: showDeleteImage ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

    return (
        <Pressable style={styles.addPhotoImg} key={foto} onPress={() => showDeleteImage ? deleteFoto(foto) : toggleShowDeleteImage()}>
            <View style={[styles.addPhotoImg, styles.deleteImage]}>
                <Image source={require('../assets/delete.png')} style={{width: 30, height: 30}}/>
            </View>
            <Image source={{uri: foto}} style={styles.addPhotoImg}/>
        </Pressable>
    );
}

export default SelectedImage;

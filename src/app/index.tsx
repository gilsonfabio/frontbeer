import { Link } from "expo-router";
import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

export default function Index(){
    const {height, width, scale, fontScale} = useWindowDimensions();
    return(
        <View style={styles.container}>
            <ImageBackground source={require('@/assets/images/banner.jpg')} alt="" resizeMode="cover" style={styles.image}>
                <View>
                    <Image source={require('@/assets/images/logowhite.png')} alt="" resizeMode="cover" style={styles.imgLogo} />
                </View>
                <View style={styles.boxTitle}>
                    <Text style={styles.txtTitle}>A melhor </Text>
                    <Text style={styles.txtTitle}>rede social, sempre</Text>
                    <Text style={styles.txtTitle}>vai ser uma rodada</Text>
                    <Text style={styles.txtTitle}>de cerveja com os</Text>
                    <Text style={styles.txtTitle}>amigos!</Text>
                </View>
                <Link href={{pathname: "./login"}} asChild>
                    <Pressable style={styles.button}>
                        <Text style={styles.txtButton}>Vamos bebemorar hoje</Text>
                    </Pressable>
                </Link>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    imgLogo: {
        width: 150,
        height: 150,
        alignItems: 'center'      
    }, 

    image: {
        flex: 1,
        alignItems: 'center'      
    },

    boxTitle: {
        marginTop: 60,
        marginBottom: 80,
    },

    txtTitle: {
        fontSize: 35,
        color: "#FFF",
        textAlign: 'center',
    },

    button: {
        width: 250,
        height: 60,
        backgroundColor: "#facc15",
        borderRadius: 12,
        justifyContent: 'center',
    },

    txtButton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#000",
        textAlign: 'center',
    },

})
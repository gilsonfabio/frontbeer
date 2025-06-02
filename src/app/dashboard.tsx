import Header from "@/components/header";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Produtos from "./produtos";

type paramsProps = {
    idUsr: string;
    name: string;
    title: string;
    saldo: string;
}

export default function Dashboard(){
    const navigation = useNavigation();
    const router = useRouter();
    const { idUsr, name, title, saldo } = useLocalSearchParams<paramsProps>();
    const [usrSaldo, setUsrSaldo] = useState(0);

    return(
        <View style={styles.container}>
            <Header user={idUsr} nomUser={name} sysTitle={title} />
            <View style={styles.box}>
                <View style={styles.boxSaldo}>
                    <Text style={styles.txtSld}>Saldo Atual</Text>
                    <Text style={styles.infSld}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(Number(saldo))}</Text>
                </View>                    
            </View>
            <View style={styles.boxInfo}>
                
            </View>
            <Produtos />
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    box: {
        flexDirection: 'row',
        width: "90%",
        height: 120,
        backgroundColor: "#CCC",
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
        marginLeft: 20,
        marginTop: 10,
    },

    boxSaldo: {
        flexDirection: 'column',
        width: "50%",
        height: 90,
        backgroundColor: "#FFF",
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
        marginRight: 55,
    },

    txtSld: {
        fontSize: 14,
        fontWeight: "500"
    },

    infSld: {
        fontSize: 28,
        marginTop: 5,
    },

    boxRecarga: {

    },

    txtContainer: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#facc15",
    },

    button: {
        width: 100,
        height: 90,
        backgroundColor: "#facc15",
        borderRadius: 12,
        justifyContent: 'center',
    },

    txtButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#000",
        textAlign: 'center',        
    },

    boxInfo: {
        flexDirection: 'row',
        width: "90%",
        height: 150,
        backgroundColor: "#CCC",
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
        marginLeft: 20,
        marginTop: 10,
    },
})

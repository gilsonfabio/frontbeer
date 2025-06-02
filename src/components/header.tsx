import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation, useRouter, Link } from "expo-router";

type userProps = {
    user?: string;
    nomUser?: string;
    sysTitle?: string;
}

export default function Header({user, nomUser, sysTitle}: userProps){
    const navigation = useNavigation();
    const router = useRouter();

    return(
        <View style={styles.container}>
            <View style={styles.btn}>
                <TouchableOpacity onPress={() => router.back()} >
                    <View>                      
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.btn}>
                <Text style={styles.nomUser}>{nomUser}</Text>
            </View>
            <View style={styles.btn}>
                <TouchableOpacity onPress={() => router.back()} >
                    <View>                      
                    <Ionicons name="beer" size={24} color="black" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        width: "100%",
        height: 80,
        backgroundColor: "#facc15",
        justifyContent: 'center',
        padding: 10,
    },

    btn: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    nomUser: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        color: "#000",
        paddingHorizontal: 65, 
    },
})
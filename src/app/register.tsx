import { Text, View, StyleSheet } from "react-native";

export default function Register(){
    return(
        <View>
            <Text>Register Page</Text>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#020617",
        alignContent: 'center',
        alignItems: 'center',
    },

    txtContainer: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#facc15",
    },

})
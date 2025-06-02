import { Stack } from "expo-router"

export default function RootLayout(){
    return(
        <Stack screenOptions={{}}>
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="login" options={{title:'Login', headerShown: false}} />
            <Stack.Screen name="register" options={{title:'Register', headerShown: false}} />
            <Stack.Screen name="dashboard" options={{title:'Dashboard', headerShown: false}} />
            <Stack.Screen name="Prodetalhe/[id]" options={{title:'Detalhes', headerShown: false}} />
            <Stack.Screen name="cronometro" options={{title:'Cronometro', headerShown: false}} />
            <Stack.Screen name="liberaChopp" options={{title:'LiberaChopp', headerShown: false}} />
        </Stack>
    )
}


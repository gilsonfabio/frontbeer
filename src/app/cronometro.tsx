import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";


import { api } from "@/server/api";

export default function Cronometro() {
    const router = useRouter();
    const local = useLocalSearchParams();
    const navigation = useNavigation();

    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [segundos, setSegundos] = useState(0);
    const [minutos, setMinutos] = useState(0);
    const [customInterval, setCustomInterval] = useState<NodeJS.Timer>();
    const [atualiza, setAtualiza] = useState(0);

    const [baseUrl, setBaseUrl] = useState('');
    const [count, setCount] = useState(0);
    
    let titulo = 'Consumo';
    
    useEffect(() => {
        let limiteTmp = Number(local.tempo);
        setAtualiza(1)    
        if (count <= limiteTmp) {
            setInterval(() => {
                setCount(count + 1) 
            }, 1000)
        }else {
            handleStop();
        }     

    }, [count]);

    const handleStop = () => {
        let nroTor = local.torneira;
        
        const fetchData = async () => {
            try {
              const response = await fetch(`http://192.168.0.100/?s=GMCD${nroTor}`);
          
              if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
              }
          
              const text = await response.text();
              console.log("Resposta da API:", text); // Debug
              setData(text || "Resposta vazia");
            } catch (error: any) {
              console.error("Erro ao buscar dados:", error);
              setError(error.message);
            } finally {
              setLoading(false);
            }
          };
      
        fetchData();
    
        api.post('newconsumo', {
            conUsrId: local.idUsr,
            conPrdId: local.idPro,
            conPrdQtd: local.qtde,
            conPrdVlr: local.valor,
            sldDisponivel: local.saldo, 
        }).then(() => {
            alert('Consumo realizado com sucesso!')
        }).catch(() => {
            alert('Erro no cadastro!');
        }) 
        
        router.back(); 
    }

    return(
        <View style={styles.container}>
            <Text style={styles.txtContador}>
                {baseUrl}
            </Text>
            <Text style={styles.txtContador}>
                {count}
            </Text>
            <View style={styles.box}>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    txtContador: {
        fontSize: 28,
        fontWeight: '500',
        marginTop: 20,
        marginBottom: 20,
    },

    box: {
        flexDirection: 'row',
    },

    boxPlay: {
        width: "30%",
        height: 40,
        backgroundColor: "#22c55e",
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },

    txtPlay: {
        fontSize: 16,
        fontWeight: '500',
        color: "#FFF",
    },

    boxPause: {
        width: "30%",
        height: 40,
        backgroundColor: "#eab308",
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },

    txtPause: {
        fontSize: 16,
        fontWeight: '500',
        color: "#FFF",
    },

    boxReset: {
        width: "30%",
        height: 40,
        backgroundColor: "#dc2626",
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },

    txtReset: {
        fontSize: 16,
        fontWeight: '500',
        color: "#FFF",
    },


})
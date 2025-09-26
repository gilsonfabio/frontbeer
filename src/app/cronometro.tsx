import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

import { api } from "@/server/api";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

export default function Cronometro() {
  const router = useRouter();
  const local = useLocalSearchParams();
  const navigation = useNavigation();

  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tempoRestante, setTempoRestante] = useState<number>(
    Number(local.tempo) || 0
  );

  useEffect(() => {
    if (tempoRestante <= 0) {
      handleStop();
      return;
    }

    const interval = setInterval(() => {
      setTempoRestante((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [tempoRestante]);

  const handleStop = () => {
    let nroTor = local.torneira;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/?s=GMCD${nroTor}`);

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const text = await response.text();
        console.log("Resposta da API:", text);
        setData(text || "Resposta vazia");
      } catch (error: any) {
        console.error("Erro ao buscar dados:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    api
      .post("newconsumo", {
        conUsrId: local.idUsr,
        conPrdId: local.idPro,
        conPrdQtd: local.qtde,
        conPrdVlr: local.valor,
        sldDisponivel: local.saldo,
      })
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Consumo realizado com sucesso!",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Erro no cadastro!",
        });
      });

    router.replace("/login");
  };

  // formata em mm:ss
  const formatTime = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.txtContador}>{formatTime(tempoRestante)}</Text>
      <View style={styles.box}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  txtContador: {
    fontSize: 28,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 20,
  },

  box: {
    flexDirection: "row",
  },
});

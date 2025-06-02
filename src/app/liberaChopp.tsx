import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";

const LiberaChopp = () => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.0.100/?s=GMCL5");
    
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
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={{ color: "red" }}>Erro: {error}</Text>}
      {data !== null && data !== undefined ? (
        <Text>Resposta: {data.toString()}</Text>
      ) : (
        <Text>Nenhuma resposta recebida.</Text>
      )}
    </View>
  );
};

export default LiberaChopp;

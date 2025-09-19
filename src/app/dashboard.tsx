import Header from "@/components/header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Produtos from "./produtos";

type paramsProps = {
  idUsr: string;
  name: string;
  title: string;
  saldo: string;
};

export default function Dashboard() {
  const router = useRouter();
  const { idUsr, name, title, saldo } = useLocalSearchParams<paramsProps>();
  const [usrSaldo, setUsrSaldo] = useState(0);

  const handleLogout = () => {
    // aqui você pode limpar token/estado global se tiver
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Header user={idUsr} nomUser={name} sysTitle={title} />

      <View style={styles.box}>
        <View style={styles.boxSaldo}>
          <Text style={styles.txtSld}>Saldo Atual</Text>
          <Text style={styles.infSld}>
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(saldo))}
          </Text>
        </View>
      </View>

      <View style={styles.boxInfo}>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>

      <Produtos />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flexDirection: "row",
    width: "90%",
    height: 120,
    backgroundColor: "#CCC",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    marginLeft: 20,
    marginTop: 10,
  },
  boxSaldo: {
    flexDirection: "column",
    width: "50%",
    height: 90,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    marginRight: 55,
  },
  txtSld: {
    fontSize: 14,
    fontWeight: "500",
  },
  infSld: {
    fontSize: 28,
    marginTop: 5,
  },
  boxInfo: {
    flexDirection: "row",
    width: "90%",
    height: 150,
    backgroundColor: "#CCC",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginLeft: 20,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#e63946",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

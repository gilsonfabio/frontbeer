import { Link, useLocalSearchParams } from "expo-router";
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

type produtoProps = {
  idProd: string;
  proDescricao: string;
  proReferencia: string;
  proPreVdaGrd: number;
  proAvatar: string;
};

type paramsProps = {
  idUsr: string;
  name: string;
  title: string;
};

interface LisProdutosProps {
  data: produtoProps;
}

const LisProdutos: React.FC<LisProdutosProps> = ({ data }) => {
  const { idUsr, name, title } = useLocalSearchParams<paramsProps>();

  return (
    <View style={styles.container}>
      <Link href={{ pathname: "./Prodetalhe/[id]", params: { id: data.idProd, idUsr, name, title } }} asChild>
        <Pressable style={({ pressed }) => [styles.box, pressed && { opacity: 0.7 }]}>
          <View style={styles.cardContent}>
            <Image source={{ uri: `https://thumbs2.imgbox.com/${data.proAvatar}` }} style={styles.imgLogo} />
            <Text style={styles.txtDescricao}>{data.proDescricao}</Text>
            <Text style={styles.txtReferencia}>{data.proReferencia}</Text>
            <Text style={styles.txtPreco}>
              {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.proPreVdaGrd)}
            </Text>
            <Text style={styles.txtVolume}>/500ml. cada</Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
};

export default LisProdutos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    marginRight: 2,
    marginLeft: 2,
    marginBottom: 5,
    borderRadius: 10,
  },
  imgLogo: {
    width: Dimensions.get('window').width / 2 - 22,
    height: 180,
    borderRadius: 10,
  },
  box: {
    backgroundColor: "#e2e8f0",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    alignItems: 'center',
    gap: 4,
  },
  txtDescricao: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  txtReferencia: {
    fontSize: 13,
    color: '#666',
  },
  txtPreco: {
    backgroundColor: "#dc2626",
    color: "#FFF",
    borderRadius: 10,
    fontWeight: 'bold',
    padding: 5,
    marginTop: 5,
  },
  txtVolume: {
    fontSize: 12,
    color: '#888',
  },
});

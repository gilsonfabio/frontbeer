import React, { useState} from 'react';
import { TouchableOpacity, View, Image, Text, Dimensions, Pressable, StyleSheet} from 'react-native';
import {Link, router, useLocalSearchParams } from "expo-router";

type produtoProps = {
  idProd: string; 
  proDescricao: string; 
  proReferencia: string; 
  proSegmento: number;
  proMarca: number; 
  proGrupo: number; 
  proLinha: number; 
  proCodBarra: string; 
  proUnidade: string; 
  proCodNcm: string; 
  proUltCusto: number;
  proQtdPeq: number; 
  proPreVdaPeq: number; 
  proQtdMed: number; 
  proPreVdaMed: number;
  proQtdGrd: number;  
  proPreVdaGrd: number; 
  proTributacao: string; 
  proCodCst: string; 
  proStatus: string; 
  proAvatar: string;
}

type paramsProps = {
  idUsr: string;
  name: string;
  title: string;
}

const LisProdutos = ({ data }:any) => {
  
  function handleDetalhes(){
    setTimeout(() => {
      handleGetToken()
    }, 1000)         
  }

  const { idUsr, name, title } = useLocalSearchParams<paramsProps>();
  
  const handleGetToken = async () => {
    //const token = await AsyncStorage.getItem('auth.token');
    
    //if (!token) {
    //    navigation.navigate('SignIn')
    //}else {
    //    navigation.navigate(data.srvLink)
    //}        
  }

  //<Link href={{pathname: "/Prodetalhes/[id]", params: { id: data.itePrmProId, idUsr, name, title}}} asChild>

  return (
    <View style={styles.container}>
      <Link href={{pathname: "./Prodetalhe/[id]", params: { id: data.idProd, idUsr, name, title}}} asChild>
        <TouchableOpacity>
          <View style={styles.box}>
            <View>
              <Image source={{uri: `https://thumbs2.imgbox.com/${data.proAvatar}`}} resizeMode="cover" style={styles.imgLogo} />
              <View style={styles.boxDescricao}>
                <Text style={styles.txtDescricao}>{data.proDescricao}</Text>
              </View>
              <View>
                <Text>{data.proReferencia}</Text>
              </View>
              <View>
                <Text style={styles.txtPreco}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(Number(data.proPreVdaGrd))}</Text>
                <Text>/500ml. cada</Text>
              </View>
            </View>             
          </View>  
        </TouchableOpacity>
      </Link>
    </View>
  );
};
  
export default LisProdutos;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    imgLogo: {
        width: 180,
        height: 200,
        alignItems: 'center',
        borderRadius: 10,      
    },

    box: {
        backgroundColor: "#CCC",
        padding: 4,
        borderRadius: 10,
        marginTop: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    
    boxDescricao: {
        width: "100%",
        height: 40,
    }, 

    txtDescricao: {
        fontSize: 15,
        fontWeight: '500'
    },

    txtPreco: {
      backgroundColor: "#dc2626",
      color: "#FFF",
      borderRadius: 10,
      fontWeight: '500',
      padding: 5,
    },

})
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import Header from '@/components/header';
import { api } from '@/server/api';
import { useLocalSearchParams, useRouter } from 'expo-router';

type produtoProps = {
  idProd: string;
  proDescricao: string;
  proReferencia: string;
  proSegmento: number;
  proMarca: number;
  proGrupo: number;
  proLinha: number;
  proCodBarra: string;
  proTorneira: number;
  proUnidade: string;
  proCodNcm: string;
  proUltCusto: number;
  proQtdPeq: number;
  proPreVdaPeq: number;
  proTmpPeq: number;
  proQtdMed: number;
  proPreVdaMed: number;
  proTmpMed: number;
  proQtdGrd: number;
  proPreVdaGrd: number;
  proTmpGrd: number;
  proTributacao: string;
  proCodCst: string;
  proStatus: string;
  proAvatar: string;
};

type UserData = {
  usrId: number;
  usrNome: string;
  usrSldDisponivel: number;
};

const BASE_TAP_URL = 'http://192.168.0.100/?s=GMCL';

export default function Prodetalhe() {
  const local = useLocalSearchParams();
  const { idUsr, name: nomUsuario, id: idPro } = local;
  const router = useRouter();

  const [produto, setProduto] = useState<produtoProps | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorProduct, setErrorProduct] = useState<string | null>(null);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [isTapRequestLoading, setIsTapRequestLoading] = useState(false);
  const [tapRequestError, setTapRequestError] = useState<string | null>(null);

  const fetchUserSaldo = useCallback(async () => {
    setLoadingUser(true);
    setErrorUser(null);
    try {
      const resp = await api.get(`searchSaldo/${idUsr}`);
      setUserData(resp.data[0]);
    } catch (error) {
      setErrorUser('Falha no acesso do saldo do usuário! Tente novamente.');
      showToastAndGoLogin('error', 'Falha ao acessar saldo do usuário!');
    } finally {
      setLoadingUser(false);
    }
  }, [idUsr]);

  const fetchProductDetails = useCallback(async () => {
    setLoadingProduct(true);
    setErrorProduct(null);
    try {
      const response = await api.get(`searchPro/${idPro}`);
      setProduto(response.data);
    } catch (error) {
      setErrorProduct('Falha no acesso ao produto! Tente novamente.');
      showToastAndGoLogin('error', 'Falha ao acessar o produto!');
    } finally {
      setLoadingProduct(false);
    }
  }, [idPro]);

  useEffect(() => {
    fetchUserSaldo();
    fetchProductDetails();
  }, [fetchUserSaldo, fetchProductDetails]);

  const sendTapRequest = async (tapNumber: number) => {
    setIsTapRequestLoading(true);
    setTapRequestError(null);
    try {
      const response = await fetch(`${BASE_TAP_URL}${tapNumber}`);
      if (!response.ok) throw new Error(`Erro na requisição da torneira: ${response.status}`);
      const text = await response.text();
      console.log('Resposta da API da torneira:', text);
    } catch (error: any) {
      setTapRequestError(error.message);
      showToastAndGoLogin('error', 'Não foi possível ativar a torneira!');
    } finally {
      setIsTapRequestLoading(false);
    }
  };

  const showToastAndGoLogin = (type: 'success' | 'error', message: string) => {
    Toast.show({
      type,
      text1: message,
      position: 'top',
      visibilityTime: 2000,
      onHide: () => {
        router.push('/login');
      },
    });
  };

  const handleProductSelection = async (qtde: number, valor: number, tempo: number) => {
    if (!produto || !userData) return;

    await sendTapRequest(produto.proTorneira);
    fetchUserSaldo();

    if (userData.usrSldDisponivel >= valor) {
      router.push(
        `/cronometro?idUsr=${idUsr}&name=${nomUsuario}&idPro=${idPro}&qtde=${qtde}&valor=${valor}&tempo=${tempo}&torneira=${produto.proTorneira}&saldo=${userData.usrSldDisponivel}` as any
      );
      showToastAndGoLogin('success', 'Consumo realizado com sucesso!');
    } else {
      showToastAndGoLogin('error', 'Saldo insuficiente! Favor recarregar.');
    }
  };

  const titulo = 'Detalhes';

  if (loadingProduct || loadingUser) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando detalhes do produto e saldo...</Text>
      </View>
    );
  }

  if (errorProduct || errorUser) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Erro ao carregar dados:</Text>
        {errorProduct && <Text style={styles.errorText}>{errorProduct}</Text>}
        {errorUser && <Text style={styles.errorText}>{errorUser}</Text>}
      </View>
    );
  }

  if (!produto || !userData) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Nenhum dado de produto ou usuário encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header user={idUsr.toString()} nomUser={nomUsuario.toString()} sysTitle={titulo} />
      <View style={styles.box}>
        <Image source={{ uri: `https://thumbs2.imgbox.com/${produto.proAvatar}` }} resizeMode="contain" style={styles.imgLogo} />
        <View style={styles.boxDescricao}>
          <Text style={styles.txtDescricao}>{produto.proDescricao}</Text>
        </View>
        <View style={styles.boxReferencia}>
          <Text style={styles.txtReferencia}>{produto.proReferencia}</Text>
        </View>
      </View>
      <View style={styles.boxTorneira}>
        <Text style={styles.txtTorneira}>Atenção!</Text>
        <View style={styles.lnhTorneira}>
          <Text style={styles.txtTorneira}>Posicione o copo na torneira:</Text>
          <Text style={styles.nroTorneira}>{produto.proTorneira}</Text>
        </View>
        <Text style={styles.txtTamanho}>Escolha abaixo o tamanho da sua sede!</Text>
      </View>
      <View style={styles.boxTamanho}>
        <Pressable style={styles.button} onPress={() => handleProductSelection(produto.proQtdPeq, produto.proPreVdaPeq, produto.proTmpPeq)}>
          <Ionicons name="beer" size={30} color="black" />
          <Text style={styles.txtPeq}>{produto.proQtdPeq} ml</Text>
          <Text style={styles.prcPeq}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.proPreVdaPeq)}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleProductSelection(produto.proQtdMed, produto.proPreVdaMed, produto.proTmpMed)}>
          <Ionicons name="beer" size={40} color="black" />
          <Text style={styles.txtMed}>{produto.proQtdMed} ml</Text>
          <Text style={styles.prcMed}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.proPreVdaMed)}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => handleProductSelection(produto.proQtdGrd, produto.proPreVdaGrd, produto.proTmpGrd)}>
          <Ionicons name="beer" size={60} color="black" />
          <Text style={styles.txtGrd}>{produto.proQtdGrd} ml</Text>
          <Text style={styles.prcGrd}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.proPreVdaGrd)}</Text>
        </Pressable>
      </View>
      {isTapRequestLoading && <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#0000ff" />}
      {tapRequestError && <Text style={styles.errorText}>Erro ao ativar torneira: {tapRequestError}</Text>}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginBottom: 10 },
  box: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  boxDescricao: { width: '90%', marginTop: 30 },
  txtDescricao: { fontSize: 18, fontWeight: '500', textAlign: 'center' },
  boxReferencia: { width: '90%', marginBottom: 30 },
  txtReferencia: { fontSize: 18, fontWeight: '500', textAlign: 'center' },
  imgLogo: { width: 300, height: 300 },
  boxTamanho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  button: { flexDirection: 'column', width: 120, height: 120, backgroundColor: '#CCC', borderRadius: 12, padding: 10, marginLeft: 5, alignItems: 'center' },
  txtPeq: { fontSize: 12, fontWeight: '500' },
  prcPeq: { fontSize: 18, fontWeight: '800', color: '#dc2626' },
  txtMed: { fontSize: 12, fontWeight: '500' },
  prcMed: { fontSize: 18, fontWeight: '800', color: '#dc2626' },
  txtGrd: { fontSize: 12, fontWeight: '500' },
  prcGrd: { fontSize: 18, fontWeight: '800', color: '#dc2626' },
  boxTorneira: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  txtTorneira: { fontSize: 24, fontWeight: '500', color: '#b91c1c' },
  nroTorneira: { fontSize: 32, fontWeight: '800', color: '#166534', marginLeft: 5 },
  lnhTorneira: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  txtTamanho: { fontSize: 20, fontWeight: '500', color: '#1d4ed8' },
});

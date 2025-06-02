import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Header from '@/components/header';
import { api } from '@/server/api';
import { isAxiosError } from 'axios';
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
      console.error('Erro ao buscar saldo do usuário:', error);
      setErrorUser('Falha no acesso do saldo do usuário! Tente novamente.');
      Alert.alert('Erro', 'Falha no acesso do saldo do usuário! Tente novamente.');
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
      console.error('Erro ao buscar detalhes do produto:', error);
      setErrorProduct('Falha no acesso ao produto! Tente novamente.');
      Alert.alert('Erro', 'Falha no acesso ao produto! Tente novamente.');
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
      if (!response.ok) {
        throw new Error(`Erro na requisição da torneira: ${response.status}`);
      }
      const text = await response.text();
      console.log('Resposta da API da torneira:', text);
    } catch (error: any) {
      console.error('Erro ao buscar dados da torneira:', error);
      setTapRequestError(error.message);
      Alert.alert('Erro na torneira', 'Não foi possível ativar a torneira. Tente novamente.');
    } finally {
      setIsTapRequestLoading(false);
    }
  };

  const handleProductSelection = async (qtde: number, valor: number, tempo: number) => {
    if (!produto || !userData) return;

    await sendTapRequest(produto.proTorneira);
    // Rebusca o saldo após a tentativa de ativar a torneira, caso haja um delay na atualização
    fetchUserSaldo();

    if (userData.usrSldDisponivel >= valor) {
      try {
        router.push(
          `/cronometro?idUsr=${idUsr}&name=${nomUsuario}&idPro=${idPro}&qtde=${qtde}&valor=${valor}&tempo=${tempo}&torneira=${produto.proTorneira}&saldo=${userData.usrSldDisponivel}` as any
        );
      } catch (error) {
        if (isAxiosError(error)) {
          Alert.alert('Erro', error.response?.data);
        } else {
          Alert.alert('Erro', 'Não foi possível entrar no cronômetro.');
        }
      }
    } else {
      Alert.alert('Saldo Insuficiente!', 'Favor recarregar seu saldo.');
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
        <TouchableOpacity onPress={() => { fetchUserSaldo(); fetchProductDetails(); }}>
          <Text style={styles.retryButton}>Tentar Novamente</Text>
        </TouchableOpacity>
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
        <View>
          <Image source={{ uri: `https://thumbs2.imgbox.com/d9/79/uhgnjIks_t.jpg` }} resizeMode="contain" width={100} height={100} style={styles.imgLogo} />
        </View>
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
        <View style={styles.button}>
          <Pressable onPress={() => handleProductSelection(produto.proQtdPeq, produto.proPreVdaPeq, produto.proTmpPeq)}>
            <View style={styles.boxImg}>
              <Ionicons name="beer" size={30} color="black" />
            </View>
            <View>
              <Text style={styles.txtPeq}>{produto.proQtdPeq} ml</Text>
            </View>
            <View>
              <Text style={styles.prcPeq}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.proPreVdaPeq)}</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => handleProductSelection(produto.proQtdMed, produto.proPreVdaMed, produto.proTmpMed)}>
            <View style={styles.boxImg}>
              <Ionicons name="beer" size={40} color="black" style={styles.imgPeq} />
            </View>
            <View>
              <Text style={styles.txtMed}>{produto.proQtdMed} ml</Text>
            </View>
            <View>
              <Text style={styles.prcMed}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.proPreVdaMed)}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => handleProductSelection(produto.proQtdGrd, produto.proPreVdaGrd, produto.proTmpGrd)}>
            <View style={styles.boxImg}>
              <Ionicons name="beer" size={60} color="black" />
            </View>
            <View>
              <Text style={styles.txtGrd}>{produto.proQtdGrd} ml</Text>
            </View>
            <View>
              <Text style={styles.prcGrd}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.proPreVdaGrd)}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {isTapRequestLoading && <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#0000ff" />}
      {tapRequestError && <Text style={styles.errorText}>Erro ao ativar torneira: {tapRequestError}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    marginTop: 10,
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  box: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxDescricao: {
    width: '90%',
    height: 'auto',
    marginTop: 30,
  },
  txtDescricao: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center', // Adicionado para centralizar o texto
  },
  boxReferencia: {
    width: '90%',
    height: 'auto',
    marginBottom: 30,
  },
  txtReferencia: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center', // Adicionado para centralizar o texto
  },
  imgLogo: {
    width: 300,
    height: 300,
  },
  boxTamanho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    flexDirection: 'column',
    width: 120,
    height: 120,
    backgroundColor: '#CCC',
    borderRadius: 12,
    padding: 10,
    marginLeft: 5,
    alignItems: 'center', // Centraliza conteúdo dentro do botão
  },
  boxImg: {
    width: '100%',
    height: 60,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o ícone verticalmente
  },
  imgPeq: {
    alignContent: 'center',
  },
  txtPeq: {
    fontSize: 12,
    fontWeight: '500',
  },
  prcPeq: {
    fontSize: 18,
    fontWeight: '800',
    color: '#dc2626',
  },
  txtMed: {
    fontSize: 12,
    fontWeight: '500',
  },
  prcMed: {
    fontSize: 18,
    fontWeight: '800',
    color: '#dc2626',
  },
  txtGrd: {
    fontSize: 12,
    fontWeight: '500',
  },
  prcGrd: {
    fontSize: 18,
    fontWeight: '800',
    color: '#dc2626',
  },
  boxTorneira: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Adicionado para espaçamento
  },
  txtTorneira: {
    fontSize: 24,
    fontWeight: '500',
    color: '#b91c1c',
  },
  nroTorneira: {
    fontSize: 32,
    fontWeight: '800',
    color: '#166534',
    marginLeft: 5, // Aumentado para melhor espaçamento
  },
  lnhTorneira: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  txtTamanho: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1d4ed8',
  },
});





/*
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Header from '@/components/header';
import { api } from '@/server/api';
import { isAxiosError } from "axios";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";

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
    proTmpMed: number,
    proQtdGrd: number;  
    proPreVdaGrd: number;
    proTmpGrd: number; 
    proTributacao: string; 
    proCodCst: string; 
    proStatus: string; 
    proAvatar: string;
}

type paramsProps = {
    idUsr: string;
    name: string;
    title: string;
    saldo: string;
}

export default function Prodetalhe(){
    const [produtos, setProdutos] = useState<Array<produtoProps>>([]);
    const local = useLocalSearchParams();

    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [proAvatar, setProAvatar] = useState('');
    const [proDescricao, setProDescricao] = useState('');
    const [proReferencia, setProReferencia] = useState('');
    const [proVdaPeq, setProVdaPeq] = useState(0);
    const [proQtdPeq, setProQtdPeq] = useState(0);
    const [proTmpPeq, setProTmpPeq] = useState(0);
    const [proVdaMed, setProVdaMed] = useState(0);
    const [proQtdMed, setProQtdMed] = useState(0);
    const [proTmpMed, setProTmpMed] = useState(0);
    const [proVdaGrd, setProVdaGrd] = useState(0);
    const [proQtdGrd, setProQtdGrd] = useState(0);
    const [proTmpGrd, setProTmpGrd] = useState(0);
    const [proTorneira, setProTorneira] = useState(0);

    const [atualiza, setAtualiza] = useState(0);
    const [qtde, setQtde] = useState(0);
    const [vlrTotal, setVlrTotal] = useState(0);

    const [user, setUser] = useState(0);
    const [usrSaldo, setUsrSaldo] = useState(0);
    const [usrNome, setUsrNome] = useState(0);

    const navigation = useNavigation();
    const router = useRouter();

    const [carshop, setCarShop] = useState([]);
    const [count, setCount] = useState(0);

    let usuario = local.idUsr;
    let nomUsuario = local.name;
    let titulo = 'Detalhes';
        
    useEffect(() => {
        let id = local.idUsr;
        api({
            method: 'get',    
            url: `searchSaldo/${id}`,                 
        }).then(function(resp) {
            setUser(resp.data[0].usrId)
            setUsrNome(resp.data[0].usrNome)  
            setUsrSaldo(resp.data[0].usrSldDisponivel)        
        }).catch(function(error) {
            alert(`Falha no acesso do saldo do usuário! Tente novamente.`);
        }) 

        let idPro = local.id;
        api({
            method: 'get',    
            url: `searchPro/${idPro}`,                 
        }).then(function(response) {
            setProdutos(response.data)  
            setProAvatar(response.data.proAvatar)
            setProDescricao(response.data.proDescricao)
            setProReferencia(response.data.proReferencia)
            setProVdaPeq(response.data.proPreVdaPeq)
            setProQtdPeq(response.data.proQtdPeq)
            setProTmpPeq(response.data.proTmpPeq)
            setProVdaMed(response.data.proPreVdaMed)
            setProQtdMed(response.data.proQtdMed)
            setProTmpMed(response.data.proTmpMed)            
            setProVdaGrd(response.data.proPreVdaGrd)
            setProQtdGrd(response.data.proQtdGrd)
            setProTmpGrd(response.data.proTmpGrd)             
            setProTorneira(response.data.proTorneira)
        }).catch(function(error) {
            alert(`Falha no acesso ao produto! Tente novamente.`);
        })       
       
    }, []);

    useEffect(() => {
        let id = local.idUsr;
        api({
            method: 'get',    
            url: `searchSaldo/${id}`,                 
        }).then(function(resp) {
            setUser(resp.data[0].usrId)
            setUsrNome(resp.data[0].usrNome)  
            setUsrSaldo(resp.data[0].usrSldDisponivel)        
        }).catch(function(error) {
            alert(`Falha no acesso do saldo do usuário! Tente novamente.`);
        }) 
                                 
    }, [atualiza]);

    const postData = () => {
        //console.log('2');
        
        //fetch('http://192.168.0.100/?s=GMCL1')
        //    .then(response => response.text()) // ou .json() se for JSON
        //    .then(data => console.log('Resposta:', data))
        //.catch(error => console.error('Erro na requisição:', error));

        //console.log('3');
    };

    async function onPressPeq() {
        //console.log('1')
        
        const fetchData = async () => {
            try {
              const response = await fetch(`http://192.168.0.100/?s=GMCL${proTorneira}`);
          
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

        //postData();
        //console.log('4')
        setAtualiza(atualiza + 1 );
        if (usrSaldo >= proVdaPeq) {
            try {
              router.push(`/cronometro?idUsr=${local.idUsr}&name=${nomUsuario}&idPro=${local.id}&qtde=${proQtdPeq}&valor=${proVdaPeq}&tempo=${proTmpPeq}&torneira=${proTorneira}&saldo=${usrSaldo}` as any );         
            } catch (error) {
                if (isAxiosError(error)) {
                    return Alert.alert(error.response?.data)
                }
                Alert.alert("Não foi possÃ­vel entrar.")
            }
        }else {
            Alert.alert("Saldo Insuficiente! Favor recarregar seu saldo.")
        }
    }

    async function onPressMed() {
        const fetchData = async () => {
            try {
              const response = await fetch(`http://192.168.0.100/?s=GMCL${proTorneira}`);
          
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
        setAtualiza(atualiza + 1 );
        if (usrSaldo >= proVdaMed) {
            try {
              router.push(`/cronometro?idUsr=${local.idUsr}&idPro=${local.id}&qtde=${proQtdMed}&valor=${proVdaMed}&tempo=${proTmpMed}&torneira=${proTorneira}&saldo=${usrSaldo}` as any );         
            } catch (error) {
                if (isAxiosError(error)) {
                    return Alert.alert(error.response?.data)
                }
                Alert.alert("Não foi possÃ­vel entrar.")
            }
        }else {
            Alert.alert("Saldo Insuficiente! Favor recarregar seu saldo.")
        }
    }

    async function onPressGrd() {
        const fetchData = async () => {
            try {
              const response = await fetch(`http://192.168.0.100/?s=GMCL${proTorneira}`);
          
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
        setAtualiza(atualiza + 1 );
        if (usrSaldo >= proVdaPeq) {
            try {
              router.push(`/cronometro?idUsr=${local.idUsr}&idPro=${local.id}&qtde=${proQtdGrd}&valor=${proVdaGrd}&tempo=${proTmpGrd}&torneira=${proTorneira}&saldo=${usrSaldo}` as any );         
            } catch (error) {
                if (isAxiosError(error)) {
                    return Alert.alert(error.response?.data)
                }
                Alert.alert("Não foi possível entrar.")
            }
        }else {
            Alert.alert("Saldo Insuficiente! Favor recarregar seu saldo.")
        }
    }

    return(
        <View style={styles.container}>            
            <Header user={usuario.toString()} nomUser={nomUsuario.toString()} sysTitle={titulo} />
            <View style={styles.box}>
                <View>
                     <Image source={{uri: `https://thumbs2.imgbox.com/d9/79/uhgnjIks_t.jpg`}} resizeMode="contain" width={100} height={100} style={styles.imgLogo}/>
                </View>                
                <View style={styles.boxDescricao}>
                    <Text style={styles.txtDescricao}>{proDescricao}</Text>
                </View>
                <View style={styles.boxReferencia}>
                    <Text style={styles.txtReferencia}>{proReferencia}</Text>
                </View>                
            </View> 
            <View style={styles.boxTorneira}>
                <Text style={styles.txtTorneira}>Atenção!</Text>
                <View style={styles.lnhTorneira}>
                    <Text style={styles.txtTorneira}>Posicione o copo na torneira:</Text>
                    <Text style={styles.nroTorneira}>{proTorneira}</Text>
                </View>
                <Text style={styles.txtTamanho}>Escolha abaixo o tamanho da sua sede!</Text>
            </View>    
            <View style={styles.boxTamanho}>
                <View style={styles.button}>
                    <Pressable onPress={onPressPeq}> 
                        <View style={styles.boxImg}>                      
                            <Ionicons name="beer" size={30} color="black" />
                        </View>
                        <View>                      
                            <Text style={styles.txtPeq} >{proQtdPeq} ml</Text>
                        </View>
                        <View>                      
                            <Text style={styles.prcPeq}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(proVdaPeq)}</Text>
                        </View>
                    </Pressable>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity onPress={onPressMed}> 
                        <View style={styles.boxImg}>                      
                            <Ionicons name="beer" size={40} color="black" style={styles.imgPeq}/>
                        </View>
                        <View>                      
                            <Text style={styles.txtMed}>{proQtdMed} ml</Text>
                        </View>
                        <View >                      
                            <Text style={styles.prcMed}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(proVdaMed)}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity onPress={onPressGrd}> 
                        <View style={styles.boxImg}>                      
                            <Ionicons name="beer" size={60} color="black" />
                        </View>
                        <View >                      
                            <Text style={styles.txtGrd}>{proQtdGrd} ml</Text>
                        </View>
                        <View >                      
                            <Text style={styles.prcGrd}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(proVdaGrd)}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },

    box: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },

    boxDescricao: {
        width: "90%",
        height: 'auto',
        marginTop: 30,
    },

    txtDescricao: {
        fontSize: 18,
        fontWeight: '500',
    },

    boxReferencia: {
        width: "90%",
        height: 'auto',
        marginBottom: 30,
    },

    txtReferencia: {
        fontSize: 18,
        fontWeight: '500',
    },

    imgLogo: {
        width: 300,
        height: 300,
    },

    boxTamanho: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },

    button: {
        flexDirection: 'column',
        width: 120,
        height: 120,
        backgroundColor: "#CCC",
        borderRadius: 12,
        padding: 10,
        marginLeft: 5,
    },

    boxImg: {
        width: "100%",
        height: 60,
        alignContent: 'center',
        alignItems: 'center',
    },

    imgPeq: {
        alignContent: 'center',
    },

    txtPeq: {
        fontSize: 12,
        fontWeight: '500',
    },

    prcPeq: {
        fontSize: 18,
        fontWeight: '800',
        color: "#dc2626"
    },

    txtMed: {
        fontSize: 12,
        fontWeight: '500',
    },

    prcMed: {
        fontSize: 18,
        fontWeight: '800',
        color: "#dc2626"
    },
   
    txtGrd: {
        fontSize: 12,
        fontWeight: '500',
    },

    prcGrd: {
        fontSize: 18,
        fontWeight: '800',
        color: "#dc2626"
    },

    boxTorneira: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },

    txtTorneira: {
        fontSize: 24,
        fontWeight: '500',
        color: "#b91c1c"
    },

    nroTorneira: {
        fontSize: 32,
        fontWeight: '800',
        color: "#166534",
        marginLeft: 2,
    },
    
    lnhTorneira: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },

    txtTamanho: {
        fontSize: 20,
        fontWeight: '500',
        color: "#1d4ed8"
    },

})

*/
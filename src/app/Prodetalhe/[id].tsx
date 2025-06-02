import React, { useState, useEffect} from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Pressable, Alert } from "react-native"
import { Ionicons, AntDesign } from '@expo/vector-icons';

import { api } from '@/server/api';
import { useNavigation, useRouter, useLocalSearchParams, Link } from "expo-router";
import Header from '@/components/header';
import { isAxiosError } from "axios"
import axios from 'axios';

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
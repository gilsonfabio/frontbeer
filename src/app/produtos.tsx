import React, { useState, useEffect } from 'react';
import {Pressable, StatusBar, View, Text, Image, FlatList, StyleSheet} from "react-native"
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRouter, useLocalSearchParams, Link } from "expo-router";

import {api} from '@/server/api';
import LisProdutos from '@/components/lisProdutos';

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
    proQtdMed: number; 
    proPreVdaMed: number;
    proQtdGrd: number;  
    proPreVdaGrd: number; 
    proTributacao: string; 
    proCodCst: string; 
    proStatus: string; 
    proAvatar: string;
}

export default function Produtos() {
    const [produtos, setProdutos] = useState<Array<produtoProps>>([]);

    const navigation = useNavigation();
    const router = useRouter();
    const { id, name } = useLocalSearchParams()

    useEffect(() => {
        
        api({
            method: 'get',    
            url: `produtos`,                 
        }).then(function(resp) {
            setProdutos(resp.data)
        }).catch(function(error) {
            alert(`Falha no acesso as produtos! Tente novamente.`);
        })
                          
    }, []);

    return(
        <View style={styles.container}>            
            <View style={styles.boxTitle}>
                <Text style={styles.txtTitle}>Destaques</Text>
            </View>
            <FlatList
                data={produtos}
                horizontal={false}
                numColumns={2}
                renderItem={({item}) => <LisProdutos data={item} />}
                keyExtractor={(item) => item.idProd}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,          
    },

    boxTitle: {
        width: "100%",
        height: 35,
    },

    txtTitle: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 10,
    },
})
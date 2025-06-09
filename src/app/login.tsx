import { api } from '@/server/api';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width, height } = Dimensions.get('window');

const bottomHeight = height * 0.5;
const horizontalMargin = 8;

const slideWidth = width - horizontalMargin * 2;
const slideHeight = bottomHeight * 0.8; 
const imageHeight = slideHeight * 0.7;  

const slides = [
  {
    title: 'Leia o QR Code',
    description: 'Aponte a câmera para o QR Code do cliente.',
    image: require('@/assets/images/slide1.png'),
  },
  {
    title: 'Autenticação Rápida',
    description: 'Você será redirecionado automaticamente.',
    image: require('@/assets/images/slide2.png'),
  },
  {
    title: 'Segurança Garantida',
    description: 'Todos os dados são criptografados.',
    image: require('@/assets/images/slide3.png'),
  },
];

export default function Login() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarcodeScanned = async (scanningResult: BarcodeScanningResult) => {
    if (scanned) return;

    const code = scanningResult.data;
    if (!code || code.length < 23) {
      Alert.alert('Erro', 'QR Code inválido');
      return;
    }

    const qrCpf = code.substring(12, 23);
    setScanned(true);
    setLoading(true);

    try {
      const response = await api.post(`/loginCpf`, { qrCpf });
      const { id, name, saldo } = response.data;

      router.push({
        pathname: '/dashboard',
        params: { idUsr: id, name, saldo },
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar os dados');
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  const renderSlide = (item: any, index: number) => (
    <View style={styles.slide} key={index}>
      <Image source={item.image} style={styles.slideImage} />
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </View>
  );

  if (!permission) return <Text>Solicitando permissão da câmera...</Text>;
  if (!permission.granted) return <Text>Permissão para usar a câmera foi negada.</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="front"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.instructionText}>Aponte o QR Code para a câmera</Text>

        <Carousel
          width={width}
          height={slideHeight}
          data={slides}
          scrollAnimationDuration={500}
          onSnapToItem={(index) => setActiveSlide(index)}
          renderItem={({ item, index }) => renderSlide(item, index)}
          loop
          autoPlay
          autoPlayInterval={3000}
        />

        <View style={styles.pagination}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeSlide ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  slide: {
    width: slideWidth,
    height: slideHeight,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  slideImage: {
    width: '100%',
    height: imageHeight,
    resizeMode: 'contain',
    marginBottom: 10,
    borderRadius: 12,
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 18,
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

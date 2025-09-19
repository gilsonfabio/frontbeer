import { api } from '@/server/api';
import { BlurView } from 'expo-blur';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const { width, height } = Dimensions.get('window');

const bottomHeight = height * 0.5;
const horizontalMargin = 8;

const slideWidth = width - horizontalMargin * 2;
const slideHeight = bottomHeight * 0.8;
const imageHeight = slideHeight * 0.6;

const slides = [
  {
    title: 'Receita simples p/ o estresse',
    description: 'Chopp gelado, um ou mais amigos e boas risadas!',
    image: require('@/assets/images/slide1.png'),
  },
  {
    title: 'Felicidade tem gosto de cerveja!',
    description: 'Tristeza tem cheiro de academia! Qual você quer?',
    image: require('@/assets/images/slide2.png'),
  },
  {
    title: 'Cerveja gelada, boi na invernada e ',
    description: 'mulher pelada... Quem conhece esses versos?',
    image: require('@/assets/images/slide3.png'),
  },
];

export default function Login() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const router = useRouter();

  // Animação do título e descrição com delay
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const descOpacity = useSharedValue(0);
  const descTranslateY = useSharedValue(20);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  useEffect(() => {
    // Reset
    titleOpacity.value = 0;
    titleTranslateY.value = 20;
    descOpacity.value = 0;
    descTranslateY.value = 20;

    // Título anima primeiro
    titleOpacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) });
    titleTranslateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) });

    // Descrição anima com pequeno delay
    descOpacity.value = withDelay(
      150,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) })
    );
    descTranslateY.value = withDelay(
      150,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.exp) })
    );
  }, [activeSlide]);

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const animatedDescStyle = useAnimatedStyle(() => ({
    opacity: descOpacity.value,
    transform: [{ translateY: descTranslateY.value }],
  }));

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

      router.replace({
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
    <LinearGradient
      colors={['#fff', '#f3f3f3']}
      style={styles.slide}
      key={index}
    >
      <Image source={item.image} style={styles.slideImage} />

      <BlurView intensity={80} tint="dark" style={styles.textContainer}>
        <Animated.Text style={[styles.slideText, animatedTitleStyle]}>
          {item.title}
        </Animated.Text>
        <Animated.Text style={[styles.slideText, animatedDescStyle]}>
          {item.description}
        </Animated.Text>
      </BlurView>
    </LinearGradient>
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
    color: '#222',
  },
  slide: {
    width: slideWidth,
    height: slideHeight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  slideImage: {
    width: '100%',
    height: imageHeight,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 12,
  },
  textContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  slideText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 6,
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
    backgroundColor: '#cbd5e1',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});

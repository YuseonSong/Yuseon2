import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Easing, Text} from 'react-native';

const LoadingScreen: React.FC = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startRotation();
  }, []);

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../Picture/loading.png')}
        style={[styles.image, {transform: [{rotate: rotateInterpolation}]}]}
      />
      <Text style={styles.text}>서버와 통신중...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 24,
    fontFamily: 'omyupretty',
  },
});

export default LoadingScreen;

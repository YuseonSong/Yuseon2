import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import LoadingScreen from './LoadingScreen';

GoogleSignin.configure({
  webClientId:
    '524129112575-th2grqvp9tcni1h1gqv1ldv9c8jvajkn.apps.googleusercontent.com',
});

const LoginPage: React.FC = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  async function onGoogleButtonPress() {
    if (isSigningIn) {
      return;
    }
    setIsSigningIn(true);
    setIsLoading(true);
    try {
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningIn(false);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoTextContainer}>
        <Image
          source={require('../Picture/mainlogo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}> 반가워요, 로그인을 해주세요!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={onGoogleButtonPress}>
          <Image
            source={require('../Picture/googleIcon.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Google로 로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoTextContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: 50,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 100,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default LoginPage;

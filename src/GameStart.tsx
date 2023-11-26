import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {GameContext} from '../App';

type RootStackParamList = {
  GameStart: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'GameStart'>;

const GameStart: React.FC = () => {
  const {setIsGameStarted} = useContext(GameContext);
  const navigation = useNavigation<NavigationProp>();

  return (
    <ImageBackground
      source={require('../Picture/background.png')}
      style={styles.container}
      resizeMode="cover">
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          setIsGameStarted(true);
          navigation.navigate('YourDrawTurn');
        }}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>Game Start</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 440,
    height: 60,
    width: '60%',
    backgroundColor: '#1C1C1C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 10,
    borderRadius: 50,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'omyupretty',
  },
});

export default GameStart;

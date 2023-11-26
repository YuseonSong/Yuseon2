import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useContext,
} from 'react';
import RNFS from 'react-native-fs';
import axios from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import auth from '@react-native-firebase/auth';
import {labelImageMap} from '../setting/ImageMap';
import commonStyles from '../react-native.config';
import {GameContext} from '../App';
import LoadingScreen from './LoadingScreen';

type StackParamList = {
  ResultPage: {prediction: any; label: any; probability: number};
};

type NavigationProps = {
  navigation: StackNavigationProp<StackParamList>;
};

const YourDrawTurn: React.FC<NavigationProps> = ({navigation}) => {
  const canvasRef = useRef<RNSketchCanvas>(null);
  const [label, setLabel] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const headerColor = '#FFFFFF';
  const {setIsGameStarted} = useContext(GameContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsGameStarted(true);

    return () => {
      setIsGameStarted(false);
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {backgroundColor: headerColor},
      title: timeLeft !== null ? `남은 시간: ${timeLeft}` : '게임 시작!',
    });
  }, [navigation, timeLeft]);

  useEffect(() => {
    axios
      .get('http://10.0.2.2:3000/prompt')
      .then(response => {
        const prompt = response.data.prompt;
        console.log(prompt);
        setLabel(prompt);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
        }, 1200);
      })

      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (timeLeft && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleSketchSave(true);
    }

    return;
  }, [timeLeft]);

  const startTimer = () => {
    if (timeLeft === null) {
      setTimeLeft(15);
    }
  };
  const handleSketchSave = async (success: boolean, path?: string) => {
    if (success && path) {
      setIsLoading(true);
      const base64Image = await RNFS.readFile(path, 'base64');
      const userId = auth().currentUser.uid;

      axios
        .post('http://10.0.2.2:3000/predict', {
          image: base64Image,
          userId,
          label,
        })
        .then(response => {
          setIsLoading(false);
          const {prediction, predictedLabel, predictedProbability} =
            response.data;
          console.log(predictedProbability);

          return navigation.navigate('ResultPage', {
            prediction,
            label: predictedLabel,
            probability: predictedProbability,
            userImagePath: path,
            promptImageSource: labelImageMap[label],
          });
        })
        .catch(error => {
          setIsLoading(false);
          console.error(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textcontainer}>
        {timeLeft !== null && <Text>{timeLeft}</Text>}
      </View>
      <Modal
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 30, color: 'white', marginTop: 30}}>
            {label}
          </Text>

          <Image
            source={labelImageMap[label]}
            style={{width: 200, height: 200, marginTop: 100}}
          />
          <Text style={{fontSize: 20, color: 'white', marginTop: 70}}>
            Ai가 생각하는 그림입니다
          </Text>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              borderRadius: 12,
              padding: 12,
              paddingRight: 20,
              paddingLeft: 20,
              marginTop: 25,
              backgroundColor: '#2E2E2E',
            }}>
            <Text style={{color: 'white'}}>네!</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: '#000000',
        }}>
        <RNSketchCanvas
          ref={canvasRef}
          onStrokeStart={startTimer}
          onSketchSaved={handleSketchSave}
          containerStyle={{backgroundColor: 'transparent', flex: 1}}
          canvasStyle={{backgroundColor: 'transparent', flex: 1}}
          defaultStrokeIndex={0}
          defaultStrokeWidth={5}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 375,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
          }}>
          <View style={styles.functionButton}>
            <Text style={{color: 'white'}}>닫기</Text>
          </View>
          <View style={styles.functionButton}>
            <Text style={{color: 'white'}}>뒤로</Text>
          </View>
          <View style={styles.functionButton}>
            <Text style={{color: 'white'}}>다시</Text>
          </View>
          <View style={styles.functionButton}>
            <Text style={{color: 'white'}}>지우개</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => canvasRef.current?.save()}>
          <Text style={styles.buttonText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textcontainer: {
    height: 50,
    alignItems: 'center',
    fontSize: '100',
  },
  text: {
    fontSize: 20,
    color: '#000',
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: '#424242',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  functionSubmit: {
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default YourDrawTurn;

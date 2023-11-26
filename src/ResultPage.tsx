import React, {useLayoutEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';

type StackParamList = {
  ResultPage: {
    prediction: any;
    label: any;
    probability: any;
    promptLabel: string;
  };
};

type RouteProps = {
  route: RouteProp<StackParamList, 'ResultPage'>;
};

const ResultPage: React.FC<RouteProps> = ({route}) => {
  const navigation = useNavigation();
  const {prediction, label, probability, userImagePath, promptImageSource} =
    route.params;
  const score = Math.round(probability * 100);

  console.log(probability);

  const headerColor = '#ffffff';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {backgroundColor: headerColor},
    });
  }, [navigation]);

  let comment = '';
  if (score >= 90) {
    comment = '완벽해요! 정말 잘 그리셨네요.';
  } else if (score >= 70) {
    comment =
      '   잘했어요!!                               조금만 더 노력해주세요!!';
  } else if (score >= 50) {
    comment = '다시 도전해보세요!!';
  } else {
    comment = '다른걸 그리신건 아닌가요...?  저는 잘모르겠어요.';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}를 잘 그리셨나요?</Text>
      <View style={styles.line} />

      <View style={styles.imageContainer}>
        <View style={styles.imageBlock}>
          <Text style={styles.imageLabel}>AI가 생각한 이미지</Text>
          <Image source={promptImageSource} style={styles.image} />
        </View>
        <View style={styles.lineVertical} />
        <View style={styles.imageBlock}>
          <Text style={styles.imageLabel}>사용자가 그린 이미지</Text>
          <Image
            source={{uri: `file://${userImagePath}`}}
            style={styles.image}
          />
        </View>
      </View>

      <View style={styles.line} />

      <Text style={styles.score}>AI가 생각하는 점수에요</Text>
      <Text style={styles.scoreboard}>{score}%일치</Text>

      <Text style={styles.comment}>{comment}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('TabNavigator', {screen: '게임시작'})
        }>
        <Text style={styles.buttonText}>홈으로</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  score: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#050505',
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  scoreboard: {
    fontSize: 50,
    fontFamily: 'omyupretty',
    color: '#151515',
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  imageBlock: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: 100,
    height: 100,
  },
  imageLabel: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginTop: 30,
  },
  line: {
    height: 3,
    width: 400,
    backgroundColor: '#000',
  },
  lineVertical: {
    width: 3,
    height: 200,
    backgroundColor: '#000',
    marginHorizontal: 50,
  },
  comment: {
    fontSize: 30,
    fontFamily: 'omyupretty',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
});
export default ResultPage;

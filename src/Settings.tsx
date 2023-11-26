import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const Settings: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const appVersion = '11.2.9';

  useEffect(() => {
    const user = auth().currentUser;
    setCurrentUser(user);
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFeedback = () => {
    Alert.prompt('피드백', '어떤 피드백을 주시겠습니까?', feedback => {
      console.log(feedback);
    });
  };

  const handleRate = () => {
    const url = 'https://www.appstore.com/your-app';
    Linking.openURL(url);
  };
  const handleGameDescription = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="cogs" size={24} color="white" style={styles.icon} />
        <Text style={styles.headerText}>설정</Text>
      </View>
      <View style={styles.content}>
        {currentUser && (
          <View style={styles.userInfo}>
            <Icon name="user" size={30} color="#333" />
            <Text style={styles.userText}>
              현재 로그인한 계정: {currentUser.email}
            </Text>
          </View>
        )}
        <Text style={styles.appVersion}>앱 버전: {appVersion}</Text>
        <TouchableOpacity onPress={handleFeedback} style={styles.button}>
          <Text style={styles.buttonText}>피드백 제출</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRate} style={styles.button}>
          <Text style={styles.buttonText}>앱 평가하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGameDescription} style={styles.button}>
          <Text style={styles.buttonText}>게임 설명</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>게임 설명</Text>
              <Text style={styles.modalText}>
                플레이어가 짧게 지나가는 제시어와 AI가 생각하는 그림을 보고 15초
                이내에 빠르게 그림을 그리고 제출을 해야합니다 당신이 제출한
                그림은 학습된 AI가 당신의 그림의 점수를 알려줄 것입니다. 자 그럼
                시작해볼까요!
              </Text>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 60,
    backgroundColor: '#1A202C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'omyupretty',
  },
  appVersion: {
    marginTop: 20,
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'omyupretty',
  },
  button: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'omyupretty',
  },
  logoutButton: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#E53E3E',
    marginHorizontal: 15,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'omyupretty',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'justify',
    fontSize: 20,
    color: 'white',
    fontFamily: 'omyupretty',
  },
  buttonClose: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Settings;

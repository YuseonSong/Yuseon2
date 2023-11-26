import * as React from 'react';
import {useState, useEffect, createContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

import GameStart from './src/GameStart';
import Settings from './src/Settings';
import LoginPage from './src/LoginPage';
import YourDrawTurn from './src/YourDrawTurn';
import MyFicture from './src/MyFicture';
import ResultPage from './src/ResultPage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Text} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const GameContext = createContext();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: '#000000',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
      },
    }}>
    <Tab.Screen
      name="게임시작"
      component={GameStart}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="game-controller-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="내그림"
      component={MyFicture}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="image-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="설정"
      component={Settings}
      options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="settings-outline" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

const StackNavigator = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="YourDrawTurn"
        component={YourDrawTurn}
        options={{
          headerShown: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{marginLeft: 10}}>
              <Text style={{color: '#000000'}}>Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="ResultPage"
        component={ResultPage}
        options={{headerTitle: ''}}
      />
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user =>
      setIsLoggedIn(!!user),
    );
    return unsubscribe;
  }, []);

  return (
    <GameContext.Provider value={{isGameStarted, setIsGameStarted}}>
      <NavigationContainer>
        {isLoggedIn ? <StackNavigator /> : <LoginPage />}
      </NavigationContainer>
    </GameContext.Provider>
  );
};

export default App;

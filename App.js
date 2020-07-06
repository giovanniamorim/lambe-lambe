import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';

import Feed from './src/screens/Feed';
import AddPhoto from './src/screens/AddPhoto';
import Profile from './src/screens/Profile';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import { setMessage } from './src/store/actions/message'
import { connect } from 'react-redux';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthRouter = createStackNavigator()

import axios from 'axios'
axios.defaults.baseURL = 'https://lambe-code-react.firebaseio.com'


function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBarOptions={{
        activeTintColor: '#6114B1',
        showIcon: true,
        showLabel: true,
        size: 30,
        color: 'tintColor'
      }}>

      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <Icon name='home' color={color} size={size} />
          )
        }} />
      <Tab.Screen
        name="AddPhoto"
        component={AddPhoto}
        options={{
          tabBarLabel: 'Enviar Foto',
          tabBarIcon: ({ color, size }) => (
            <Icon name='camera-iris' color={color} size={size} />
          )
        }} />
      <Tab.Screen
        name="Profile"
        component={LoginOrProfileRouter}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Icon name='account' color={color} size={size} />
          )
        }} />
    </Tab.Navigator>
  );
}

function LoginOrProfileRouter() {
  return (
    <Stack.Navigator
      initialRouteName="Auth">
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Auth" component={authRota} />
    </Stack.Navigator>
  );
}

function authRota() {
  return (
    <AuthRouter.Navigator
      initialRouteName="Login">
      <AuthRouter.Screen
        name="Login"
        component={Login} />
      <AuthRouter.Screen
        name="Register"
        component={Register} />
    </AuthRouter.Navigator>
  );
}
//export default class App extends Component {
export class App extends Component {

  componentDidUpdate = () => {
    if (this.props.text && this.props.text.trim()) {
      Alert.alert(this.props.title || 'Mensagem', this.props.text)
      this.props.clearMessage()
    }
  }

  render() {
    return (
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    )
  }
}

const mapStateToProps = ({ message }) => {
  return {
    title: message.title,
    text: message.text
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clearMessage: () => {
      dispatch(setMessage({ title: '', text: '' }))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

import React from 'react';
import {ScrollView, StyleSheet, View, Text, AsyncStorage} from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';

const Auth = () => {
  AsyncStorage.getItem('@SessionStorage:key').then(session => {
    if (!session) {
      logIn();
    } else {
      console.log('session: ', session)
    }
  });

  return (<View>
    <Text>Auth loggedIn</Text>
  </View>);
}
const Home = () => (<View><Text>Home</Text></View>);

export default class App extends React.Component {
  render() {
    return (
      <NativeRouter>
        <View style={styles.container}>
          <View>
            <Link to="/"><Text>Home</Text></Link>
            <Link to="/auth"><Text>Auth</Text></Link>
          </View>
          <ScrollView>
            <Route exact path="/" component={Home}/>
            <Route exact path="/auth" component={Auth}/>
          </ScrollView>
        </View>
      </NativeRouter>

    )
  }
}

async function logIn() {
  try {
    const { token, type } = await Expo.Facebook.logInWithReadPermissionsAsync('642334106103399', {
      permissions: ['public_profile'],
    });

    console.log('session: ', token, type);
    if (type === 'success') {
      const { sessionToken, profile} = await getSessionToken({ token, provider: 'fb' });
      debugger;
      await AsyncStorage.setItem('@SessionStorage:key', sessionToken);
    }
  } catch(err) {
    console.log(err);
  }

}

async function getSessionToken(body) {
  return fetch('http://localhost:3000/auth/signin', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(resp => resp.json());
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'cyan',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
  },
});


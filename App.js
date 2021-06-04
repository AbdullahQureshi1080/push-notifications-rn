/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  Button,
  TextInput,
  FlatList,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  // var admin = require('firebase-admin');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [notifications, setNotifcations] = useState([]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      setNotifcations([...notifications, remoteMessage]);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        return setToken(token);
        // return saveTokenToDatabase(token);
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      setToken(token);
      // saveTokenToDatabase(token);
    });
  }, []);

  // async function saveTokenToDatabase(token) {
  //   // Assume user is already signed in
  //   const userId = 'user-101-test-1';

  //   // Add the token to the users datastore
  //   await firestore()
  //     .collection('users')
  //     .doc(userId)
  //     .update({
  //       tokens: firestore.FieldValue.arrayUnion(token),
  //     });
  // }

  const SendNotification = async () => {
    // Get the owners details
    // const owner = firestore().collection('users').doc(ownerId).get();

    // Get the users details
    // const user = firestore().collection('users').doc(userId).get();

    await messaging().sendToDevice(
      token, // ['token_1', 'token_2', ...]
      {
        data: {
          message: 'This is a notification',
          // owner: JSON.stringify(owner),
          // user: JSON.stringify(user),
          // picture: JSON.stringify(picture),
        },
      },
      {
        // Required for background/quit data-only messages on iOS
        contentAvailable: true,
        // Required for background/quit data-only messages on Android
        priority: 'high',
      },
    );
    setMessage('');
  };

  const viewToken = () => {
    console.log('token', token);
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Push Notifications</Text>
              <Text style={styles.sectionDescription}>
                Let's' <Text style={styles.highlight}>do this</Text>
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              {/* <Text style={styles.sectionTitle}>Push Notifications</Text> */}
              <Text style={styles.sectionDescription}>
                Setting up the notifications
              </Text>
              <Button title="View Token" onPress={viewToken} />
              <Text>{token}</Text>
              <TextInput
                placeholder="Enter Notification Message"
                onChangeText={(value) => setMessage(value)}
              />
              <Button title="Notify" onPress={SendNotification} />
              <Text>{message}</Text>
            </View>
            <FlatList
              data={notifications}
              renderItem={({item}) => (
                <View>
                  <Text>{item.title}</Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

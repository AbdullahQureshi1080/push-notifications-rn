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
import {create} from 'apisauce';
import {serverKey} from './config-server';

const App = () => {
  // var admin = require('firebase-admin');
  const client = create({baseURL: 'https://fcm.googleapis.com/fcm/'});
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
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      setToken(token);
    });
  }, []);

  const sendMessage = (recievers, notification, data) =>
    client.post(
      'send',
      {
        registration_ids: recievers,
        collapse_key: 'type_a',
        notification: {
          body: notification?.body,
          title: notification?.title,
          image: notification?.image,
        },
        data: {
          body: data.body,
          title: data.title,
        },
      },
      {headers: {Authorization: `key=${serverKey}`}},
    );

  const onSendNotification = async () => {
    let recievers = [
      'c2CGPpOWTUqmeQEfmWQh_e:APA91bFThpw3p9OGu3snzEp0Tp3W_VFfFtV8dXoSH_-b-_9vL3ZoV4yp_7kceAgVv53SegJoHeup03yXjyXfYDNIAX7v5DxidRyQD8g8A9sblUqkeIkLz-DcrG-VCoHS0-E0YpWdZ1Pj',
      'cp4JfHbQQtWG5F1kynh38X:APA91bFvDXMvPNS5IkRLtNonnijQ6JbnZe0NQjSr84oEpaaKaq6oUCYVGCb3hd_7kM-htq9sVgwHCF3FAzliTG9KYFPwTNcfnw6S68kpqxw3uAJeOnr0MdjXyiex-s1mJD6f26Ru2V3s',
    ];
    //  "collapse_key" = "type_a",
    let notification = {
      body: message,
      title: 'FCM API Test',
      image:
        'https://images.unsplash.com/photo-1612151855475-877969f4a6cc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    };
    let data = {
      body: 'Testing the fcm api using a test notification and understanding how it works',
      title: 'Test For FCM API',
    };
    const send = await sendMessage(recievers, notification, data);
    if (!send.ok) {
      Alert.alert('This is not working');
      console.log('Error Message :', send);
    }
    console.log('Result from fcm API:', send.results);
    setMessage('');
  };

  const viewToken = () => {
    console.log('token', token);
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.scrollView}>
        <FlatList
          style={styles.body}
          contentInsetAdjustmentBehavior="automatic"
          ListHeaderComponentStyle={styles.body}
          ListEmptyComponent={
            <View style={styles.sectionContainer}>
              <Text>No Notifications</Text>
            </View>
          }
          ListHeaderComponent={
            <>
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
                <Button
                  title="Notify"
                  onPress={onSendNotification}
                  disabled={!message}
                />
                <Text>{message}</Text>
              </View>
            </>
          }
          data={notifications}
          renderItem={({item}) => (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
            </View>
          )}
        />
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

import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const FireBeltCheck = ({navigation}) => {
  const [beltNo, setBelt] = useState('');
  const [beltError, setBeltError] = useState('');

  const checkBeltNoExists = async beltNo => {
    setBeltError('');
    try {
      //check phone number is exist in firestore
      const policeRef = firestore().collection('firebelt');
      let result = await policeRef.where('beltno', '==', beltNo).get();
      console.log('!!Documents Length', result.docs.length);

      if (result.docs.length) {
        console.log('User Exists');
        return true;
      } else {
        console.log('User Doesnot exists');
        return false;
      }
    } catch (error) {
      console.error('Error checking phone number:', error);
      console.log('not match');
      return false;
    }
  };

  const handleCheckBeltNo = async () => {
    setBeltError('');
    try {
      // Check if the phone number exists in Firebase Authentication
      const beltNumberExists = await checkBeltNoExists(beltNo);
      if (beltNumberExists) {
        // Navigate to the next screen or perform further actions
        console.log('Belt number exists in Firestore');
        navigation.navigate('FireLogin');
        alert('You are Verified successfully');
      } else {
        // Display error message or take appropriate action
        console.log('Belt number does not exist in Firestore');
        setBeltError('Please enter correct Belt Number');

      }
    } catch (error) {
      console.error('Error submitting Belt Number:', error);
      // Handle OTP submission error
      return;
    }
  };

  return (
    <ScrollView style={styles.main}>
      <View style={styles.container}>
        <View>
          <Image
            source={require('../../images/logo.jpg')}
            style={styles.image}
          />
        </View>
        <View style={styles.box}>
          <Text style={styles.title}>Enter Your Belt Number</Text>

          <TextInput
            style={styles.input}
            placeholder="Belt Number"
            autoCapitalize="none"
            value={beltNo}
            onChangeText={text => setBelt(text)}></TextInput>
          {beltError ? <Text style={styles.errorText}>{beltError}</Text> : null}

          <TouchableOpacity onPress={handleCheckBeltNo} style={styles.button}>
            <Text style={styles.buttonText}>Check</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.note}>
        Note: {'\n'}
        1: make sure ................ {'\n'}
        2: dont enter wrong belt number {'\n'}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 270,
    marginTop: -10,
    marginBottom: -20,
  },
  box: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    elevation: 10,
    padding: 30,
    marginTop: 30,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 20,
  },
  title: {
    alignSelf: 'center',
    margin: 30,
    fontSize: 24,
    color: '#000000',
    fontFamily: 'Arial',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 8,
    borderBottomWidth: 1.5,
    borderTopColor: 'white',
    borderBottomColor: 'gray',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    flexDirection: 'row',
    fontSize: 20,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#e60000',
    padding: 10,
    width: '40%',
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 15,
    textAlign: 'left',
  },
  note: {
    margin: 30,
    fontSize: 14,
    textAlign: 'left',
  },
});

export default FireBeltCheck;

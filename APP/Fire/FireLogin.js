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

const FireLoginForm = ({navigation}) => {
  const [phoneNo, setPhone] = useState('');
  const [OTP, setOTP] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [OTPError, setOTPError] = useState('');

  // database
  const [myData, setMyData] = useState(null);
  const [confirmData, setConfirmData] = useState('');

  //remove first zere(0) from number
  const PN = phoneNo.slice(1);
  const PNo = '+92' + PN;

  //authentication , send OTP
  const sendOtp = async () => {
    setPhoneError('');
    try {
      const response = await auth().signInWithPhoneNumber(PNo);
      setConfirmData(response);
      // console.log('!!!!Authentication Response :',response);
      // console.log('Current User User id : ', auth().currentUser.uid);
      alert('OTP is sent successfully');
    } catch (error) {
      if (!phoneNo) {
        setPhoneError('Please enter your Phone Number');
        return;
      }
      const phoneRegex = /^03[0-9]{9}$/; //for 03081111111
      if (!phoneRegex.test(phoneNo)) {
        setPhoneError('Please enter a valid Phone Number');
        return;
      }
    }
  };

  //function for move next Main page // check otp is valed or not valid
  const submitOtp = async () => {
    setOTPError('');
    try {
      const response = await confirmData.confirm(OTP);
      // Check if the phone number exists in Firebase Authentication
      const phoneNumberExists = await checkPhoneNumberExists(PNo);
      if (phoneNumberExists) {
        // Navigate to the next screen or perform further actions
        console.log('Phone number exists in Firebase Authentication');
        navigation.navigate('Fire');
        alert('You are login successfully');
      } else {
        // Display error message or take appropriate action
        console.log('Phone number does not exist in Firebase Authentication');
        let userId = auth().currentUser.uid;
        let phoneNo = auth().currentUser.phoneNumber;
        await saveUserInDB(userId, phoneNo).then(function (result) {
          // alert(
            //   'Data Saved in DB with ID ' + userId + 'Phone Number' + phoneNo,
            // );
          });
          navigation.navigate('FireSignUp');
        }
    } catch (error) {
      // console.error('Error submitting OTP:', error);
      // Handle OTP submission error
      if (!OTP) {
        setOTPError('Please enter your OTP');
      }
      if (OTP !== true) {
        setOTPError('Incorrect OTP');
        return;
      }
    }
  };

  const saveUserInDB = async (userId, phoneNo) => {
    const userRef = firestore().collection('fireUsers');
    userRef.doc(userId).set({
      cnic: '',
      phoneNumber: phoneNo,
    });
  };

  //phone number and other data exists in firestore or not
  const checkPhoneNumberExists = async (phoneNumber) => {
    try {
      // Check if the user exists with the given phone number and CNIC is not empty
      const userRef = firestore().collection('fireUsers');
      const result = await userRef.where('phoneNumber', '==', phoneNumber).get();
      console.log('!!Documents Length', result.docs.length);
  
      if (result.empty) {
        console.log('User does not exist');
        return false;
      }
  
      // Check CNIC field is empty or not
      const userData = result.docs[0].data();
      if (userData.cnic) {
        console.log('CNIC is not empty');
        return true;
      }
      else{
        console.log('CNIC is empty');
      return false;
      }
      
    } catch (error) {
      console.error('Error checking user and CNIC:', error);
      return false;
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
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.text}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Phone No"
            keyboardType="numeric"
            autoCapitalize="none"
            value={phoneNo}
            onChangeText={text => setPhone(text)}></TextInput>
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}

          <TouchableOpacity onPress={sendOtp} style={styles.button}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="OTP"
            keyboardType="numeric"
            onChangeText={text => setOTP(text)}></TextInput>
          {OTPError ? <Text style={styles.errorText}>{OTPError}</Text> : null}

          <TouchableOpacity onPress={submitOtp} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '90%',
    elevation: 10,
    padding: 30,
    marginTop: -10,
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 40,
    color: '#000000',
    fontFamily: 'Arial',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderBottomWidth: 1.5,
    borderTopColor: 'white',
    borderBottomColor: 'gray',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    flexDirection: 'row',
    fontSize: 16,
  },
  button: {
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
    marginBottom: 4,
  },
});

export default FireLoginForm;

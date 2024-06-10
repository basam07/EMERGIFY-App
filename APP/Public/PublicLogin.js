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

const PublicLoginForm = ({navigation}) => {
  //State variables for form inputs and errors
  const [phoneNo, setPhone] = useState('');
  const [OTP, setOTP] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [OTPError, setOTPError] = useState('');

  // database
  const [confirmData, setConfirmData] = useState('');
  const [updateData, seUpdateData] = useState(null);

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

  //function for move next Main page // check otp is valid or not valid
  const submitOtp = async () => {
    setOTPError('');
    try {
      const response = await confirmData.confirm(OTP);
  
      // Check if the phone number exists in Firestore and if CNIC is not empty
      const phoneNumberExists = await checkPhoneNumberExists(PNo);
      const cnicExists = await checkCnicExists(PNo);
      const bloodGroupExists = await checkBloodGroupExists(PNo);
  
      if (phoneNumberExists && cnicExists && bloodGroupExists) {
        // Both phone number and CNIC exist, navigate to Medical Wallet page
        navigation.navigate('PublicMain');
        alert('You are logged in successfully');
      } 
      else if (phoneNumberExists && cnicExists) {
        // Both phone number and CNIC exist, navigate to Medical Wallet page
        navigation.navigate('Medical Details');
        alert('You are logged in successfully');
      } 
      else {
        // Either phone number or CNIC is missing, navigate to PublicSignUp
        let userId = auth().currentUser.uid;
        let phoneNo = auth().currentUser.phoneNumber;
  
        // Save user in Firestore
        await saveUserInDB(userId, phoneNo);
  
        navigation.navigate('PublicSignUp');
      }
    } catch (error) {
      if (!OTP) {
        setOTPError('Please enter your OTP');
      } else {
        setOTPError('Incorrect OTP');
      }
    }
  };

  //save user data in firestore
  const saveUserInDB = async (userId, phoneNo) => {
    const userRef = firestore().collection('publicUsers');
    userRef.doc(userId).set({
      cnic: '',
      phoneNumber: phoneNo,
    });
  };

  //phone number and other data exists in firestore or not
  const checkPhoneNumberExists = async phoneNumber => {
    try {
      // Check if the user exists with the given phone number and CNIC is not empty
      const userRef = firestore().collection('publicUsers');
      const result = await userRef
        .where('phoneNumber', '==', phoneNumber)
        .get();
      // console.log('!!Documents Length', result.docs.length);

      if (result.empty) {
        // console.log('User does not exist');
        return false;
      }

      // Check CNIC field is empty or not
      const userData = result.docs[0].data();
      if (userData.cnic) {
        // console.log('CNIC is not empty');
        return true;
      } else {
        // console.log('CNIC is empty');
        return false;
      }
    } catch (error) {
      // console.error('Error checking user and CNIC:', error);
      return false;
    }
  };

  // Function to check if CNIC exists in Firestore
  const checkCnicExists = async phoneNumber => {
    try {
      const userRef = firestore().collection('publicUsers');
      const result = await userRef
        .where('phoneNumber', '==', phoneNumber)
        .get();

      if (result.empty) {
        return false; // User does not exist
      }

      const userData = result.docs[0].data();
      console.log(userData.cnic);
      return !!userData.cnic; // Return true if CNIC exists and is not empty
    } catch (error) {
      console.error('Error checking CNIC:', error);
      return false;
    }
  };
  const checkBloodGroupExists = async phoneNumber => {
    try {
      const userRef = firestore().collection('publicUsers');
      const result = await userRef
        .where('phoneNumber', '==', phoneNumber)
        .get();

      if (result.empty) {
        return false; // User does not exist
      }

      const userData = result.docs[0].data();
      return !!userData.bloodGroup; // Return true if CNIC exists and is not empty
    } catch (error) {
      console.error('Error checking Blood Group:', error);
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
    marginTop: 10,
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

export default PublicLoginForm;

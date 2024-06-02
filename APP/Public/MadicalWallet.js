import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
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
} from 'react-native';

const MadicalWallet = ({navigation}) => {
  //main states
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhoneNo, setGuardianPhoneNo] = useState('');
  const [emergencyPhoneNo, setEmergencyPhoneNo] = useState('');
  const [married, setMarried] = useState('');
  const [disability, setDisability] = useState('');
  const [diabetes, setDiabetes] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  //error states
  const [guardianNameError, setGuardianNameError] = useState('');
  const [guardianPhoneNoError, setGuardianPhoneNoError] = useState('');
  const [emergencyPhoneNoError, setEmergencyPhoneNoError] = useState('');
  const [marriedError, setMarriedError] = useState('');
  const [disabilityError, setDisabilityError] = useState('');
  const [diabetesError, setDiabetesError] = useState('');
  const [bloodGroupError, setBloodGroupError] = useState('');

  //database
  // const [updateData, setUpdateData] = useState(null);

  const handleCreate = async () => {
    setGuardianNameError('');
    setGuardianPhoneNoError('');
    setEmergencyPhoneNoError('');
    setMarriedError('');
    setDisabilityError('');
    setDiabetesError('');
    setBloodGroupError('');

    if (!guardianName) {
      setGuardianNameError('Please enter your Guardian/Parent Name');
      return;
    }
    if (!guardianPhoneNo) {
      setGuardianPhoneNoError('Please enter Gardian/Parent Phone Number');
      return;
    }
    if (!emergencyPhoneNo) {
      setEmergencyPhoneNoError('Please enter any Emergency Phone Number');
      return;
    }
    if (!married) {
      setMarriedError('Please select your Married Status');
      return;
    }
    if (!disability) {
      setDisabilityError('Enter Disability Status, if not mention none');
      return;
    }
    if (!diabetes) {
      setDiabetesError('Please enter your Diabetes Status(Yes/No)');
      return;
    }
    if (!bloodGroup) {
      setBloodGroupError('Please select your Blood Group');
      return;
    }

    // update data in firebase
    await updateUserData(userId).then(function () {
      navigation.navigate('PublicMain');
    });
  };

  // const handleCreate = async () => {
  //   console.log('check user' , updateUserData());
  // };

  const userId = auth().currentUser.uid;
  const updateUserData = async () => {
    try {
      console.log('109 user id', userId);
      const updateRef = firestore().collection('publicUsers').doc(userId);
      await updateRef.update({
        guardianName: guardianName,
        guardianPhoneNo: guardianPhoneNo,
        emergencyPhoneNo: emergencyPhoneNo,
        married: married,
        disability: disability,
        diabetes: diabetes,
        bloodGroup: bloodGroup,
      });
      console.log('data updated');
      return true;
    } catch (error) {
      console.log('data cannot updated');
      return false;
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Image
            source={require('../../images/logo.jpg')}
            style={styles.image}
          />
        </View>

        <View style={styles.box}>
          <Text style={styles.title}>Medical Wallet</Text>
          <Text style={styles.text}>Enter your Medical Details</Text>

          <TextInput
            style={styles.input}
            placeholder="Guardian/Parent Name"
            value={guardianName}
            onChangeText={text => setGuardianName(text)}
          />
          {guardianNameError ? (
            <Text style={styles.errorText}>{guardianNameError}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Guardian/Parent Phone Number"
            keyboardType="numeric"
            value={guardianPhoneNo}
            onChangeText={text => setGuardianPhoneNo(text)}
          />
          {guardianPhoneNoError ? (
            <Text style={styles.errorText}>{guardianPhoneNoError}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Emergency Phone Number"
            keyboardType="numeric"
            value={emergencyPhoneNo}
            onChangeText={text => setEmergencyPhoneNo(text)}
          />
          {emergencyPhoneNoError ? (
            <Text style={styles.errorText}>{emergencyPhoneNoError}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Any Diabetes"
            value={diabetes}
            onChangeText={text => setDiabetes(text)}
          />
          {diabetesError ? (
            <Text style={styles.errorText}>{diabetesError}</Text>
          ) : null}

          <Picker
            selectedValue={married}
            style={styles.input}
            onValueChange={itemValue => setMarried(itemValue)}>
            <Picker.Item label="Select Status" value="" />
            <Picker.Item label="Married" value="Married" />
            <Picker.Item label="Unmarried" value="Unmarried" />
          </Picker>
          {marriedError ? (
            <Text style={styles.errorText}>{marriedError}</Text>
          ) : null}

          <Picker
            selectedValue={disability}
            style={styles.input}
            onValueChange={itemValue => setDisability(itemValue)}>
            <Picker.Item label="Any Disability" value="" />
            <Picker.Item label="Yes" value="Yes" />
            <Picker.Item label="No" value="No" />
          </Picker>
          {disabilityError ? (
            <Text style={styles.errorText}>{disabilityError}</Text>
          ) : null}

          <Picker
            selectedValue={bloodGroup}
            style={styles.input}
            onValueChange={itemValue => setBloodGroup(itemValue)}>
            <Picker.Item label="Select Blood Group" value="" />
            <Picker.Item label="A+" value="A+" />
            <Picker.Item label="A-" value="A-" />
            <Picker.Item label="B+" value="B+" />
            <Picker.Item label="B-" value="B-" />
            <Picker.Item label="O+" value="O+" />
            <Picker.Item label="O-" value="O-" />
            <Picker.Item label="AB+" value="AB+" />
            <Picker.Item label="AB-" value="AB-" />
            <Picker.Item label="Not Confirmed" value="Not Confirmed" />
          </Picker>
          {bloodGroupError ? (
            <Text style={styles.errorText}>{bloodGroupError}</Text>
          ) : null}

          <TouchableOpacity onPress={handleCreate} style={styles.button}>
            <Text style={styles.buttonText}>Save Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 50,
  },
  image: {
    width: 170,
    height: 190,
    marginTop: -30,
    marginBottom: -20,
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '90%',
    elevation: 10,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
  },
  ctg: {
    flex: 0,
    fontSize: 20,
    fontWeight: 'bold',
    elevation: 10,
    backgroundColor: '#FFFFFF',
    padding: 30,
    marginTop: -10,
    paddingTop: 10,
    paddingBottom: 30,
    borderRadius: 20,
  },
  title: {
    fontSize: 37,
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
    marginBottom: 10,
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
    width: '50%',
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
    margin: 10,
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

export default MadicalWallet;

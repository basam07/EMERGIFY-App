import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
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

const PoliceSignupForm = ({navigation}) => {
  //States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cnic, setCNIC] = useState('');
  const [dateofbirth, setDateofBirth] = useState('Date of Birth');
  const [gender, setGender] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  //Error States
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [cnicError, setCNICError] = useState('');
  const [dateofbirthError, setDateofBirthError] = useState('');
  const [genderError, setGenderError] = useState('');

  const handleCreate = async () => {
    setFirstNameError('');
    setLastNameError('');
    setCNICError('');
    setDateofBirthError('');
    setGenderError('');

    if (!firstName) {
      setFirstNameError('Please enter your First Name');
      return;
    }
    if (!lastName) {
      setLastNameError('Please enter your Last Name');
      return;
    }
    if (!cnic) {
      setCNICError('Please enter your CNIC');
      return;
    }
    if (!dateofbirth) {
      setDateofBirthError('Please enter your Date of Birth');
      return;
    }
    if (!gender) {
      setGenderError('Please select your Gender');
      return;
    }
    // update data in firebase
    await updateUserData(userId).then(function () {
      // alert(
      //   'Data Saved in DB with ID ' + userId + 'Phone Number' + phoneNo,
      // );
      navigation.navigate('Police');
    });
  };

  // function update user data in firebase
  const userId = auth().currentUser.uid;
  const updateUserData = async () => {
    try {
      console.log('109 user id', userId);
      const updateRef = firestore().collection('policeUsers').doc(userId);
      await updateRef.update({
        firstName: firstName,
        lastName: lastName,
        cnic: cnic,
        dateOfBirth: dateofbirth,
        gender: gender,
      });
      console.log('data updated');
      return true;
    } catch (error) {
      console.log('data cannot updated');
      return false;
    }
  };

  const onChange = (event, selectedData) => {
    const currentData = selectedData || date;

    let tempDate = new Date(currentData);
    let fDate =
      tempDate.getDate() +
      '/' +
      (tempDate.getMonth() + 1) +
      '/' +
      tempDate.getFullYear();
    setDateofBirth(fDate);
    setShow(false);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
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

        <Text style={styles.ctg}>POLICE</Text>

        <View style={styles.box}>
          <Text style={styles.title}>Lets Gets Started</Text>
          <Text style={styles.text}>Create an Account</Text>

          <TextInput
            style={styles.input}
            placeholder="First Names"
            value={firstName}
            onChangeText={text => setFirstName(text)}
          />
          {firstNameError ? (
            <Text style={styles.errorText}>{firstNameError}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={text => setLastName(text)}
          />
          {lastNameError ? (
            <Text style={styles.errorText}>{lastNameError}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="CNIC"
            keyboardType="numeric"
            value={cnic}
            onChangeText={text => setCNIC(text)}
          />
          {cnicError ? <Text style={styles.errorText}>{cnicError}</Text> : null}

          <View>
            <TouchableOpacity
              style={styles.input}
              onPress={() => showMode('date')}>
              <Text style={styles.show} keyboardType="numeric">
                {dateofbirth}
              </Text>
            </TouchableOpacity>
          </View>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              display="default"
              onChange={(event, date) => onChange(event, date)}
            />
          )}
          {dateofbirthError ? (
            <Text style={styles.errorText}>{dateofbirthError}</Text>
          ) : null}

          <Picker
            selectedValue={gender}
            style={styles.input}
            onValueChange={itemValue => setGender(itemValue)}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
          {genderError ? (
            <Text style={styles.errorText}>{genderError}</Text>
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
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: 250,
    height: 270,
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
    marginTop: -20,
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
  show: {
    width: '100%',
    marginTop: 10,
    marginBottom: 16,
    borderBottomWidth: 1.5,
    borderColor: 'white',
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

export default PoliceSignupForm;

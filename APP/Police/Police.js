import React, {useState, useEffect} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const Police = ({navigation}) => {
  const [victimData, setVictimData] = useState([]);

  const fetchData = async () => {
    try {
      const usersRef = firestore().collection('policeAccepts'); // Initialize Firestore correctly
      const querySnapshot = await usersRef.get(); // Use get() method to fetch documents

      const userDataArray = [];
      querySnapshot.forEach(doc => {
        if (doc.exists) {
          const userData = doc.data();
          const UId = doc.id;
          const {firstName, lastName, phoneNumber} = userData;

          userDataArray.push({firstName, lastName, phoneNumber, UId});
        } else {
          console.log('No such document!');
        }
      });

      setVictimData(userDataArray);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleAccept = async (userId) => {
    navigation.navigate("PoliceDetails", { userId: userId });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Requests</Text>
        <ScrollView style={styles.list}>
          {victimData.map((victim, index) => (
            <TouchableOpacity
              key={index} // Add key prop
              style={styles.view}
              onPress={() => handleAccept(victim.UId)}>
              <Image
                source={require('../../images/alert-icon.png')}
                style={styles.icon}
              />
              <View style={styles.text}>
                <Text style={styles.name}>
                  {victim.firstName + ' ' + victim.lastName}
                </Text>
                <Text style={styles.detail}>{victim.phoneNumber}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: '100%',
    padding: 10,
    backgroundColor: 'lightgray',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 7,
    marginLeft: 11,
    color: '#000000',
  },
  list: {
    padding: 10,
  },
  view: {
    marginBottom: 4,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 7,
    elevation: 5,
  },
  icon: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  text: {
    margin: 3,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  detail: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Police;

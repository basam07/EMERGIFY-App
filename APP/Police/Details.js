import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const PoliceDetails = ({route, navigation}) => {
  const {userId} = route.params;
  //   console.log('userId:', userId);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          return; // Exit early if userId is undefined
        }

        // const userRef = doc(db, "policerequests", userId);
        const userRef = firestore().collection('policeAccepts').doc(userId);
        const userSnapshot = await userRef.get();
        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          setUserData(userData);
        } else {
          console.log('User not found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleAccept = async userId => {
    try {
      // Get the user data from policeAccepts collection
      const userRef = firestore().collection('policeAccepts').doc(userId);
      const userSnapshot = await userRef.get();

      if (userSnapshot.exists) {
        // Get the user data
        const userData = userSnapshot.data();

        // Set the user data in policeCompleted collection
        await firestore()
          .collection('policeCompleted')
          .doc(userId)
          .set(userData);

        // Delete the user data from policeAccepts collection
        await userRef.delete();
        navigation.navigate('Police');
        console.log('Police request completed successfully.');
      } else {
        console.log('User not found in policeAccepts collection.');
      }
    } catch (error) {
      console.error('Error completing police request:', error);
    }

    console.log('userId:', userId);
  };

  //declare latitude and longitude
  const latitudePoint = userData ? userData.latitude : null;
  const longitudePoint = userData ? userData.longitude : null;

  //Import map view

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>Location and Details</Text>
        <ScrollView style={styles.list}>
          {userData ? (
            <View style={styles.view}>
              <View style={styles.text}>
                <Text style={styles.name}>
                  Name: {userData.firstName} {userData.lastName}
                </Text>
                <Text style={styles.detail}>
                  Phone Number: {userData.phoneNumber}
                </Text>
                {/* <Text>
                  Location: {userData.latitude}, {userData.longitude}
                </Text> */}
              </View>

              <View style={styles.containerMap}>
                <MapView
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={styles.map}
                  region={{
                    latitude: latitudePoint,
                    longitude: longitudePoint,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  showsUserLocation
                  showsTraffic
                  showsScale
                  ></MapView>
              </View>
            </View>
          ) : (
            <Text>Loading user data...</Text>
          )}
          <TouchableOpacity
            onPress={() => handleAccept(userId)}
            style={styles.button}>
            <Text>Request Completed</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: '100%',
    padding: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 7,
    marginBottom: -8,
    color: '#000000',
    alignSelf: 'center',
  },
  list: {
    padding: 10,
  },
  view: {
    marginBottom: 4,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    backgroundColor: 'lightgray',
  },

  containerMap: {
    // ...StyleSheet.absoluteFillObject,
    height: 600,
    width: "100vh",
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 10,
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    height: 600,
    width: "100%",
  },
});

export default PoliceDetails;

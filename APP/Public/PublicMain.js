import * as React from 'react';
import {useRef, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Geolocation from '@react-native-community/geolocation';

const PMain = ({navigation}) => {
  const wave1Scale = useRef(new Animated.Value(0)).current;
  const wave1Opacity = useRef(new Animated.Value(1)).current;
  const wave2Scale = useRef(new Animated.Value(0)).current;
  const wave2Opacity = useRef(new Animated.Value(1)).current;
  const wave3Scale = useRef(new Animated.Value(0)).current;
  const wave3Opacity = useRef(new Animated.Value(1)).current;
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const createWaveAnimation = (scale, opacity, delay) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 2.5,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scale, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]);
    };

    const wave1 = createWaveAnimation(wave1Scale, wave1Opacity, 0);
    const wave2 = createWaveAnimation(wave2Scale, wave2Opacity, 400);
    const wave3 = createWaveAnimation(wave3Scale, wave3Opacity, 800);

    Animated.loop(Animated.parallel([wave1, wave2, wave3])).start();
  }, [
    wave1Scale,
    wave1Opacity,
    wave2Scale,
    wave2Opacity,
    wave3Scale,
    wave3Opacity,
  ]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Emergify Location Permission',
            message: 'Emergify needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use locations ');
          // getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();
  }, []);

  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      async info => {
        const {latitude, longitude} = info.coords;
        setCurrentLocation({latitude, longitude});
        console.log('Current Location:', {latitude, longitude});

        const userId = auth().currentUser.uid;
        await firestore().collection('policerequests').doc(userId).update({
          longitude: longitude,
          latitude: latitude,
        });

        navigation.navigate('camera');
      },
      error => {
        console.log(error);
        Alert.alert('Error', 'Turn on Your GPS-Location');
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 10000},
    );
  };

  const updateData = async () => {
    try {
      const {latitude, longitude} = currentLocation;
      const userId = auth().currentUser.uid;
      const latitudeNo = Number(latitude);
      const longitudeNo = Number(longitude);
      await firestore().collection('policerequests').doc(userId).update({
        longitude: longitudeNo,
        latitude: latitudeNo,
      });
      console.log('Data updated successfully');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleFetchAndSaveData = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.log('No user is currently logged in');
        return;
      }

      const userId = currentUser.uid;
      const userDoc = await firestore()
        .collection('publicUsers')
        .doc(userId)
        .get();
      const userData = userDoc.data();

      if (!userData) {
        console.log('User data not found in Public Users collection');
        return;
      }

      await firestore().collection('policerequests').doc(userId).set(userData);
      await firestore().collection('firerequests').doc(userId).set(userData);
      await firestore()
        .collection('ambulancerequests')
        .doc(userId)
        .set(userData);

      getCurrentLocation();

      console.log('Data fetched and saved successfully:', userData);
    } catch (error) {
      console.error('Error fetching and saving data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <Image
            source={require('../../images/logo.jpg')}
            style={styles.image}
          />
        </View>

        <TouchableOpacity
          style={styles.center}
          onPress={handleFetchAndSaveData}
          activeOpacity={0.5}>
          <View style={styles.button}>
            <Text style={styles.btnText}>SOS</Text>
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{scale: wave1Scale}],
                  opacity: wave1Opacity,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{scale: wave2Scale}],
                  opacity: wave2Opacity,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                {
                  transform: [{scale: wave3Scale}],
                  opacity: wave3Opacity,
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.note}>
            Note: {'\n'}
            Your safety is our priority, tap to notify. {'\n'}
            The app automatically shares your location with emergency. {'\n'}
            Quick access to emergency departments during critical situations."
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  center: {
    margin: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 270,
    marginTop: -30,
    alignSelf: 'center',
  },
  btnText: {
    fontSize: 30,
    fontFamily: 'Lobster',
    fontWeight: 'bold',
    color: 'white',
  },
  note: {
    color: 'black',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginTop: '20%',
    margin: 10,
    flex: 1,
  },
  button: {
    flex: 1,
    width: 150,
    height: 150,
    borderRadius: 80,
    backgroundColor: '#d20000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#d20000',
    zIndex: -1,
  },
});

export default PMain;

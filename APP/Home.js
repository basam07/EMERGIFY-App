import React, {useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';

const HomePage = ({navigation}) => {
  const handlePublic = () => {
    navigation.navigate('PublicLogin');
  };
  const handlePolice = () => {
    navigation.navigate('PoliceBelt');
  };
  const handleFire = () => {
    navigation.navigate('FireBelt');
  };
  const handleAmbulance = () => {
    navigation.navigate('AmbulanceBelt');
  };

  return (
    <ScrollView style={styles.container}>
      <View >
        <View>
          <Image source={require('../images/logo.jpg')} style={styles.image} />
        </View>
        <View style={styles.box}>
          <TouchableOpacity style={styles.btn} onPress={handlePublic}>
            <ImageBackground
              style={styles.imgstyle}
              source={require('../images/public.jpg')}>
              <View style={styles.background}>
                <Text style={styles.text}>Public</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={handlePolice}>
            <ImageBackground
              style={styles.imgstyle}
              source={require('../images/police.jpg')}>
              <View style={styles.background}>
                <Text style={styles.text}>Police</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={handleAmbulance}>
            <ImageBackground
              style={styles.imgstyle}
              source={require('../images/rescue.jpg')}>
              <View style={styles.background}>
                <Text style={styles.text}>Rescue</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={handleFire}>
            <ImageBackground
              style={styles.imgstyle}
              source={require('../images/fire.jpg')}>
              <View style={styles.background}>
                <Text style={styles.text}>Fire Fighters</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  image: {
    width: 200,
    height: 250,
    marginTop: -30,
    alignSelf: 'center',
  },

  box: {
    flex: 0,
    backgroundColor: '#FFFFFF',
    marginTop: -5,
    height: '100%',
    width: '100%',
  },

  btn: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '90%',
    height: 100,
    alignSelf: 'center',
    elevation: 5,
    margin: 10,
  },

  imgstyle: {
    height: '100%',
    resizeMode: 'stretch',
  },
  background: {
    backgroundColor: 'rgba(100,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    height: '100%',
    textAlignVertical: 'center',
  },
});

export default HomePage;

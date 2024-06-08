import React from 'react';
import {View, Text} from 'react-native';

const CameraLocation = () => {
    return (
        <View>
            <Text>
                this is camera page
            </Text>
        </View>
    );
};


export default CameraLocation;

// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, PermissionsAndroid, Platform } from 'react-native';
// import { Camera, useCameraDevices } from 'react-native-vision-camera';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// const CameraScreen = () => {
//   const [cameraPermission, setCameraPermission] = useState(false);
//   const devices = useCameraDevices();
//   const device = devices.back;

// //   useEffect(() => {
// //     const requestCameraPermission = async () => {
// //       if (Platform.OS === 'android') {
// //         const granted = await PermissionsAndroid.request(
// //           PermissionsAndroid.PERMISSIONS.CAMERA,
// //           {
// //             title: 'Camera Permission',
// //             message: 'This app needs access to your camera',
// //             buttonNeutral: 'Ask Me Later',
// //             buttonNegative: 'Cancel',
// //             buttonPositive: 'OK',
// //           }
// //         );
// //         setCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
// //       } else {
// //         const result = await request(PERMISSIONS.IOS.CAMERA);
// //         setCameraPermission(result === RESULTS.GRANTED);
// //       }
// //     };

// //     requestCameraPermission();
// //   }, []);

// //   if (!cameraPermission) {
  
//     useEffect(() => {
//         checkpermissions();
//     }, []);

//     const checkpermissions = async () => {
//         const newCameraPermission = await Camera. requestCameraPermission();
//         const newMicrophonePermission = await Camera.requestMicrophonePermission();
//         console.log('newCameraPermission', newCameraPermission);
//         console.log('newMicrophonePermission', newMicrophonePermission);
//         setCameraPermission(newCameraPermission === 'authorized' && newMicrophonePermission === 'authorized');
//     }

// return (
//     // <View style={{ flex: 1 }}>
//     //   {cameraPermission && device ? (
//     //     <Camera
//     //       style={{ flex: 1 }}
//     //       device={device}
//     //       isActive={true}
//     //     />
//     //   ) : (
//     //     <Text>No access to camera</Text>
//     //   )}
//     // </View>
//     <View>
//         <Text>
//             app
//         </Text>
//     </View>
//   );
// };

// export default CameraScreen;
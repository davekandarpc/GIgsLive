import {
    Platform
  } from 'react-native';
import NetInfo from "@react-native-community/netinfo";


export const CheckConnectivity = async() => {
    // For Android devices
    if (Platform.OS === "android") {
       return NetInfo.fetch().then(state  => {
            console.log("Connection type android =", state.type);
            console.log("Is connected android =", state.isConnected);
            if (state.isConnected ) {
              return true
            } else {
             return false
            }
          });
    }else{
       return NetInfo.addEventListener(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            if (state.isConnected ) {
                return true
              } else {
               return false
              }
          });
    }     
  };
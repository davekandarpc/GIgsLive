import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
export class LiveNowScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {};
      }
      componentDidMount = () => {
        this.reload();
      }
      reload = () => {
        global.currentRoute = 'LiveNow'
      };
      render() {
        return (
            <View style={{flex:1,backgroundColor:'black',justifyContent:'center',alignItems:'center'}}>
                <NavigationEvents
              onWillFocus={(payload) => this.reload()}
        />
                <Image 
                    style={{height:100,width:100,resizeMode:'contain',margin:10}} 
                    resizeMode={'contain'} 
                    source={require('../../assets/images/whitelogo.png')} />
                <Text style={{color:'white'}}>Coming Soon !!!</Text>
            </View>
        )
      }
}

export default LiveNowScreen;
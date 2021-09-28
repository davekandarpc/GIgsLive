import React, {Component} from 'react';
import {SafeAreaView,View, Dimensions, Platform} from 'react-native';
import {WebView} from 'react-native-webview';
import {Header} from '../../components/Header'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Orientation from 'react-native-orientation-locker';
import {NavigationEvents} from 'react-navigation';
export class DisclaimerScreen extends Component {
  componentDidMount(){
    Orientation.lockToPortrait();
    global.currentRoute = '';
  }
  reload = ()=>{
    global.currentRoute = '';
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <NavigationEvents
        onWillFocus={() => this.reload()}/>
          <View style={{width:'100%',height:'7%'}}>
          <Header />
          </View>
        <WebView
          source={{uri: 'https://gigs.live/disclaimer?navigation=0'}}
          style={{marginTop: Platform.OS === 'ios' ? -39 : -27}}
        />
      </SafeAreaView>
    );
  }
}
export default DisclaimerScreen;

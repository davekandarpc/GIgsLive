import React, {Component} from 'react';
import {SafeAreaView,View} from 'react-native';
import {WebView} from 'react-native-webview';
import {Header} from '../../components/Header'
import Orientation from 'react-native-orientation-locker';
import {NavigationEvents} from 'react-navigation';
export class FAQScreen extends Component {
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
          source={{uri: 'https://dev.gigs.live/faq?navigation=0'}}
         // style={{marginTop:-15}}
        />
      </SafeAreaView>
    );
  }
}
export default FAQScreen;

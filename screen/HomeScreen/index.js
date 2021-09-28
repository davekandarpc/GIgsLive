import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Animated,
  Modal
} from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import { connect } from 'react-redux';
import { GettingReady, Header, GettingReadyLight } from '../../components';
import { ArtistTabVideo } from '../../components/ArtistTabVideo';
import { GenreOptionBtn } from '../../components/GenreOptionBtn';
import { Genres_round_view } from '../../components/Genres_round_view';
import { RBDailog } from '../../components/RBDailog';
import { SimilarEvent } from '../../components/SimilarEvent';
import Footer from '../../components/Footer';
import { Similar_artist } from '../../components/Similar_artist';
import { GetHomeDetails } from '../../store/HomeScreenStore/actions';
import { getToken } from '../../store/AuthStore/actions';
import { GetEventDetails } from '../../store/EventDetatilStore/actions';
import { animatedStyles, scrollInterpolator } from '../../Utils/animations';
import { APICALL_v1 } from '../../common/ApiConfig';
import { styles } from './styles';
import { getFormattedDate, getResponsiveImage } from '../../common/functions';
import { CheckConnectivity } from '../../Utils/NetInfoUtils';
import FastImage from 'react-native-fast-image';
import { Images } from '../../common/Images';
import { showToast } from '../../common/Toaster';
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import 'react-native-gesture-handler';
import { NetworkConsumer, NetworkProvider } from 'react-native-offline';
import NoInternetView from '../../components/NoInternetView';
import SomethingWentWrongView from '../../components/SomethingWentWrongView';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import Orientation from 'react-native-orientation-locker';
import { getAccessToken, splitEndPoint, ShareIt } from '../../Utils';
import analytics from '@react-native-firebase/analytics';
import { TrackingApp } from '../../common/TrackingApp';
import Spinner from 'react-native-loading-spinner-overlay';
const sliderWidth = Dimensions.get('window').width;
const sliderheight = Dimensions.get('window').height;
const itemHeight = sliderheight / 3.7;
console.disableYellowBox = true;

export class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageloading: true,
      disabled: false,
      musicOff: true,
      mainImage: '',
      eventName: '',
      eventGenres: [],
      sliderActiveIndex: 0,
      intcount: 0,
      gigsDetail: [],
      SelectedGenre: [],
      SelectedGenersFilter: [],
      noInternet: false,
      loadingPage: false,
      GettingReadyLightSmall: false,
      featureFanList: [
        // {
        //   name: 'Alice Janes',
        //   address: 'Minnessota, US',
        //   img_url:
        //     'https://sklktecdnems02.cdnsrv.jio.com/c.saavncdn.com/artists/Selena_Gomez_002_20200226073835_500x500.jpg',
        // },
        // {
        //   name: 'Paul Pogba',
        //   address: 'Nashville, US',
        //   img_url:
        //     'https://sklktcdnems02.cdnsrv.jio.com/c.saavncdn.com/artists/David_Guetta_500x500.jpg',
        // },
        // {
        //   name: 'Alice Janes',
        //   address: 'Minnessota, US',
        //   img_url:
        //     'https://schnncdnems02.cdnsrv.jio.com/c.saavncdn.com/artists/Demi_Lovato_002_20200312120805_500x500.jpg',
        // },
        // {
        //   name: 'Alice Janes',
        //   address: 'Minnessota, US',
        //   img_url:
        //     'https://sklktcdnems01.cdnsrv.jio.com/c.saavncdn.com/artists/Martin_Garrix_004_20200303120820_500x500.jpg',
        // },
      ],
      sliderData: [],
      isConnected: false,
      selectedTicket: null,
    };
    //this.getResponsiveImage = getRespoznsiveImage.bind(this)
    ///global.isLoggedIn = false;
    global.startHomeInterval = false;
    global.myNavigation = this.props.navigation;
    global.myProps = this.props;
    global.isMiniplayer = false;
    this.animatedValue = new Animated.Value(0);
    // global.activeRoute = 'HomeScreen';
    global.currentRoute = 'HomeScreen';
  }

  componentDidMount = async () => {
    // this.getToken()
    // this.checkPermission();
    // this.requestUserPermission()
    // this.App();
    this.createNotificationListeners();
    this.checkPermission();
    if (Platform.OS == 'ios') {
      this.requestUserPermissionIOS();
    }
    console.log(
      'In home screen -----------------------------------------------------',
    );
    /*  await  analytics().logEvent('HomeScreen', {
      screen: 'HomeScreen',
      purpose: 'Viewing more info on a user',
    }) */
    //await analytics().setCurrentScreen("HomeScreen", "HomeScreen");
    Orientation.lockToPortrait();
    this.onLoad_method();
    this.reload();
  };
  requestUserPermissionIOS = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };
  async checkPermission() {
    const enabled = await messaging().hasPermission();
    console.log('hello check ' + JSON.stringify(enabled));
    // If Premission granted proceed towards token fetch
    if (enabled) {
      this.getToken();
    } else {
      // If permission hasn’t been granted to our app, request user in requestPermission method.
      this.requestPermission();
    }
    console.log('INIT : ' + enabled);
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    console.log('FCM Token : ' + fcmToken);
  }

  async requestPermission() {
    try {
      await messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }
  async createNotificationListeners() {
    // This listener triggered when notification has been received in foreground
    /*  this.notificationListener = messaging().onNotification(() => {
       this.displayNotification();
       this.TempdisplayNotification(notificationOpen.notification);
     }); */
    /* this.notificationListener = (() => {
      this.displayNotification();
      this.TempdisplayNotification(notificationOpen.notification);
    }); */
    console.log('Notification Init 2: ');
    // This listener triggered when app is in backgound and we click, tapped and opened notifiaction
    this.notificationOpenedListener = messaging().onNotificationOpenedApp(
      (notificationOpen) => {
        console.log('Notification Init 2: ', notificationOpen);
        this.displayNotification();
        this.TempdisplayNotification(notificationOpen);
      },
    );

    // This listener triggered when app is closed and we click,tapped and opened notification
    const notification_Open = await messaging().getInitialNotification();
    console.log('Notification Init 3: ', notification_Open);
    if (notification_Open) {
      this.displayNotification();
      this.TempdisplayNotification(notification_Open);
    }
  }

  TempdisplayNotification(body) {
    console.log('displayNotification  BODY : ', body);
    var ref = body.data.UUID;
    var Event_type = body.data.EventType;
    if (Event_type === 'Artist Detail') {
      // this.props.navigation.navigate('')
      // this.goToEventDetailsScreen(uuid)
      console.log('ARTIST_DATA ===> :', ref);
      // this.props.navigation.navigate('ArtistScreen', { endpoint: ref });
      global.myNavigation.push('ArtistScreen', { id: ref });
    } else if (Event_type === 'Event Detail') {
      // this.props.navigation.navigate('')
      // this.goToEventDetailsScreen(uuid)
      console.log('Event_DATA ===> :', ref);
      // this.props.navigation.navigate('ArtistScreen', { endpoint: ref });
      // global.myNavigation.push('ArtistScreen', {id: ref});
      this.props.navigation.navigate('EventDetailScreen', {
        endpoint: `api/events/${ref}`,
      });
    }
    // we display notification in alert box with title and body
    // Alert.alert(
    //   title, body,
    //   [
    //     { text: 'Ok', onPress: () => console.log('ok pressed Home Screen') },
    //   ],
    //   { cancelable: false },
    // );
  }
  displayNotification() {
    console.log('displayNotification');
    // we display notification in alert box with title and body
    // Alert.alert(
    //   title, body,
    //   [
    //     { text: 'Ok', onPress: () => console.log('ok pressed Home Screen') },
    //   ],
    //   { cancelable: false },
    // );
  }
  // componentWillUnmount = () => {
  //   // alert('hlo')
  //   global.currentRoute = 'EventListing';
  //   // alert(global.currentRoute)
  //   this.setState({
  //     disabled: false,
  //   });
  // };
  onLoad_method = async () => {
    global.currentRoute = 'HomeScreen';
    // alert('hello')
    // alert(global.currentRoute)
    this.props.GetHomeDetails();
  };

  reload = () => {
    // alert('go back');
    global.currentRoute = 'HomeScreen';
    this.onLoad_method();
    // global.activeRoute = 'HomeScreen'
    console.log('my screen name: ' + global.currentRoute);
    this.setState({
      disabled: false,
      sliderActiveIndex: 0,
    });
    this.handleSlider();
  };

  volumProcess = () => {
    this.setState({ musicOff: !this.state.musicOff });
  };

  clearRunningInterval = () => {
    clearInterval(this.sliderIntervalID);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.type === 'HOMESCREEN_ON_LOAD_SUCCESS') {
      if (nextProps.frontData) {
        if (nextProps.frontData.slider) {
          this.setState({ sliderData: nextProps.frontData.slider });
        }
        if (nextProps.frontData.gigs != undefined) {
          this.setState(
            {
              gigs: nextProps.frontData.gigs,
              gigsDetail: nextProps.frontData.gigs.gigs,
            },
            () => {
              console.log('Responsive : ', nextProps.frontData.gigs.gigs[0]);
              console.log(
                'Responsive : ',
                nextProps.frontData.gigs.gigs[0]['image-responsive'],
              );
            },
          );
          //   , () => {
          //   this.handelgigs(nextProps.frontData.gigs);
          // });
        }
      }
    }
  }

  handleSlider = () => {
    console.log(
      'this.state.sliderActiveIndex : ' + this.state.sliderActiveIndex,
    );
    let index = this.state.sliderActiveIndex;
    this.sliderIntervalID = setInterval(() => {
      // if (intcount >= 1) {
      //   intcount = 0;
      //   this.setState({ intcount });
      //   if (this.state.sliderData.length !== 0) {
      //     if (index + 1 < this.state.sliderData.length) {
      //       index = index + 1;
      //     } else {
      //       index = 0;
      //     }
      //     this.setState({ sliderActiveIndex: index });
      //   }
      // } else {
      //   intcount += 0.2;
      //   // console.log('Count : ' + intcount);
      //   this.setState({ intcount });
      // }
      if (this.state.sliderData.length !== 0) {
        if (index + 1 < this.state.sliderData.length) {
          index = index + 1;
        } else {
          index = 0;
        }
        this.setState({ sliderActiveIndex: index });
      }
    }, 10000);
    // this.setState({ sliderIntervalID: sliderIntervalID });
  };

  handelgigs = (gigs) => {
    this.setState({ gigsDetail: gigs.gigs }, () => {
      console.log('componentWillReceiveProps ENDDD');
    });
  };

  selectedGeners = (val) => {
    var gigs = [];
    for (var i = 0; this.state.gigs.gigs.length > i; i++) {
      for (var j = 0; j < this.state.gigs.gigs[i].category.length; j++) {
        for (var k = 0; k < val.length; k++) {
          if (this.state.gigs.gigs[i].category[j] == val[k]) {
            gigs.push(this.state.gigs.gigs[i]);
          }
        }
      }
    }
    this.setState({ gigsDetail: gigs });
  };

  SelectedGenreView = (val) => {
    if (val.length == 0) {
      this.setState({ gigsDetail: this.state.gigs.gigs });
    } else {
      this.selectedGeners(val);
    }
    this.scrollTOTop();
  };

  scrollTOTop = () => {
    setTimeout(() => {
      if (this.scrollview_Ref !== null) {
        this.scrollview_Ref.scrollTo({ x: 0, y: 0, animated: false });
      }
    }, 100);
  };
  // animate() {
  //   this.animatedValue.setValue(0)
  //   Animated.timing(
  //     this.animatedValue,
  //     {
  //       toValue: 100,
  //       duration: 10000,
  //       easing: Easing.quad,
  //     }
  //   ).start(() => this.animate())
  //   console.log("animantion")

  animateReset() {
    this.animatedValue.setValue(0);
  }
  setMainImgae = (index, item) => {
    // this.clearRunningInterval();
    clearInterval(this.sliderIntervalID);

    this.animateReset();
    this.animatedValue.setValue(0);
    this.animatedValue.stopTracking(() => {
      this.animate();
    });
    this.animatedValue.stopAnimation(
      () => (this.animatedValue = new Animated.Value(0)),
    );
    this.animatedValue.stopAnimation(() =>
      this.animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
      }),
    );
    this.setState({ sliderActiveIndex: index }, () => {
      this.handleSlider();
      this.goToEventDetailsScreen(
        item.ref,
      )
      console.log('Actiove index : ' + this.state.sliderActiveIndex);
      console.log('Animated Value: ', this.animatedValue);
    });
  };

  showProgress = () => {
    var myAnimatedValue = new Animated.Value(0);
    myAnimatedValue.setValue(0);
    Animated.timing(myAnimatedValue, {
      toValue: 100,
      duration: 10000,
      useNativeDriver: false,
    }).start();
    var spinValue = myAnimatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });
    return (
      <Animated.View style={styles.watched_video_line}>
        <Animated.View
          style={{
            height: 2,
            width: spinValue,
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e70047',
            // borderRadius:40,
            borderTopLeftRadius: 200,
            borderTopRightRadius: 200,
            borderBottomLeftRadius: 200,
            borderBottomRightRadius: 200,
          }}></Animated.View>
      </Animated.View>
      // <ProgressBar
      //   style={styles.progress_bar_continue_watching}
      //   styleAttr="Horizontal"
      //   color={'#dddddd'}
      //   indeterminate={false}
      //   progress={this.state.intcount}
      // />
    );
  };

  _renderItem = ({ item }) => {
    return (
      <View
        style={{
          width: '97%',
          alignSelf: 'center',
          borderRadius: 5,
          elevation: 5,
          height: itemHeight,
        }}>
        <TouchableOpacity
          style={{ height: itemHeight }}
          // onPress={() => this.goToEventDetailsScreen(item.ref)}
          onPress={() => this.goToVODScreen(item.ref)}>
          <ImageBackground
            source={getResponsiveImage(item, false)}
            // source={{uri: item.image}}
            // source={
            //   Platform.isPad == true &&
            //   item['image-responsive'].normal != undefined
            //     ? {
            //         uri: item['image-responsive'].normal['<767'],
            //       }
            //     : item['image-responsive'] != undefined &&
            //       item['image-responsive'] != null &&
            //       item['image-responsive'].normal != undefined &&
            //       item['image-responsive'].normal != null
            //     ? {
            //         uri: item['image-responsive'].normal['<767'],
            //       }
            //     : {
            //         uri: item['image-responsive'].original,
            //       }
            // }
            //onLoadEnd={() => this.setState({imageloading: false})}
            imageStyle={{
              width: '100%',
              borderRadius: 5,
              resizeMode: 'cover',
              height: itemHeight,
            }}
            style={[styles.img_bg, { height: itemHeight }]}>
            <Image
              source={Images.play_btn_white}
              style={{
                width: sliderWidth / 15,
                height: sliderheight / 25,
                resizeMode: 'contain',
              }}></Image>
            {Platform.isPad && (
              <Text
                numberOfLines={1}
                style={styles.singer_name_event_name_text_style}>
                {item.title} &nbsp; • &nbsp; {item.band.title}
              </Text>
            )}
            <Text
              numberOfLines={1}
              style={[styles.singer_name_event_name_text_style]}>
              {item.title} &nbsp; • &nbsp; {item.band.title}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };
  _renderUpcommingItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.goToEventDetailsScreen(item.ref)}
        // style={[styles.similar_artist_box_view__style,{marginLeft:index == 0 ? 16 : 8}]}
        style={styles.similar_artist_box_view__style}>
        <ImageBackground
          imageStyle={{ borderRadius: 5 }}
          source={{ uri: item.image }}
          style={styles.similar_artist_img__style}>
          <LinearGradient
            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0,0.91)', '#000']}
            style={styles.linearGradient2}>
            <View style={{ flex: 1 }}></View>
            <View style={styles.inside_contant}>
              <View style={{ marginHorizontal: 5 }}>
                <Text style={styles.similar_artist_name_text__style}>
                  {/* {this.props.homescreen == true
                    ? item.band.title
                    : this.props.artistScreen == true
                    ? item.artist.title
                    : item.artistName} */}
                  {/* {item.ref} */}
                  {item.band.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={styles.similar_artist_event_name_text__style}>
                  {item.title}
                </Text>
                <Text style={styles.similar_artist_event_time_name_text__style}>
                  {getFormattedDate(item.date)}
                </Text>
              </View>
              <View style={{ marginBottom: 5 }}>
                <RBDailog
                  btn_style={styles.similar_artist_event_buy_ticket_btn__style}
                  lbl_style={
                    styles.similar_artist_event_buy_ticket_text_btn__style
                  }
                  lableText={'Buy Tickets'}
                />
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  goToArtistListingScreen = () => {
    this.setState({
      disabled: true,
    });
    this.props.navigation.navigate('ArtistListingScreen');
  };
  goToEventListingScreen = () => {
    this.setState({
      disabled: true,
    });
    this.props.navigation.navigate('EventListingScreen');
  };
  goToVODScreen = (url) => {
    this.setState({
      disabled: true,
    });
    this.props.navigation.navigate('VODScreen', { videoId: splitEndPoint(url) });
  };

  goToEventDetailsScreen = (ref) => {
    this.setState(
      {
        disabled: true,
      },
      () => {
        var data = {
          pageid: 'Home',
          pagetypeid: 'event',
          metric: 'select',
          value: 'click',
          title: `${ref}`,
          ticket: '', //{ticket-type}
          customparam: '', //{play:1,stop:0,pause:0}
        };
        TrackingApp(data);
      },
    );
    console.log('Ref : ' + ref);
    this.animatedValue.stopAnimation();
    this.props.navigation.navigate('EventDetailScreen', { endpoint: ref });
  };

  openSheet = async () => {
    var isLoggedIn;
    await AsyncStorage.getItem('isLoggedIn', (err, value) => {
      if (err) {
        console.log(err);
      } else {
        //console.log("isLoggedIn =>",JSON.parse(value)  )
        isLoggedIn = JSON.parse(value);
        // boolean false
      }
    });
    if (!isLoggedIn) {
      this.RBSheet.open();
    } else {
      this.props.navigation.navigate('TicketFlowScreen');
    }
  };

  closeSheet = () => {
    this.RBSheet.close();
  };

  onLogin = () => {
    this.RBSheet.close();
    this.props.navigation.navigate('LoginScreen');
  };

  getEventDate = (timestamp) => {
    let formattedDate = '';
    let formattedTime = '';
    let formattedTimeStamp = `${new Date(parseInt(timestamp) * 1000)}`;
    formattedDate = formattedTimeStamp.substring(3, 10);
    formattedTime = formattedTimeStamp.substring(16, 21);
    var hours = parseInt(formattedTimeStamp.substring(16, 18));
    var ampm = hours >= 12 ? 'PM' : 'AM';

    return formattedDate + ' ' + formattedTime + ' ' + ampm + ' (IST)';
  };

  selctedEvent = async (ref) => {
    var endPointNew = ref.substring(4);
    // alert("Buy Ticket"+refVal[2])
    var data = {
      endpoint: endPointNew,
      baseUrlNew: 'new',
      debug: true,
    };
    var eventDetail = await APICALL_v1(data);

    this.setState(
      {
        selectedTicket: Object.values(eventDetail.tickets),
      },
      () => {
        console.log(
          'Selected Event Detail = > ' +
          JSON.stringify(this.state.selectedTicket),
        );
      },
    );
  };

  BuyTicket = async (ref) => {
    // this.props.navigation.navigate('TicketFlowScreen',{eventDetail:false})
    this.setState({ loadingPage: true }, async () => {
      var endPointNew = ref.substring(4);
      // alert("Buy Ticket"+refVal[2])
      var data = {
        endpoint: endPointNew,
        baseUrlNew: 'new',
        debug: true,
      };
      var eventDetail = await APICALL_v1(data);
      // console.log('EVENTDETAIL_USERDATA_SUCCESS : ',endPointNew);
      // console.log('EVENTDETAIL_USERDATA_SUCCESS : ',eventDetail);
      this.buyTicketScreen(eventDetail, endPointNew);
      // this.props.GetEventDetails(endPoint);
    });
  };

  buyTicketScreen = (data, eventID) => {
    // alert('EVENTDETAIL_USERDATA_SUCCESS : ');
    // console.log('EVENTDETAIL_USERDATA_SUCCESS : ',data);
    console.log(
      'EVENTDETAIL_USERDATA_SUCCESS : ' + JSON.stringify(data.tickets),
    );
    // alert("EVENTDETAIL_USERDATA_SUCCESS", this.props.eventDetails.tickets)
    var ticketData_array = [];
    for (let i = 0; i < Object.values(data.tickets).length; i++) {
      var ticketData = {
        concertName: data.title,
        event_id_new: data.event_id,
        id: data.tickets[i].id,
        tickettype: data.tickets[i].ticket_type,
        description: data.tickets[i].description,
        image: data.tickets[i].image,
        price: data.tickets[i].price,
        left: data.tickets[i].left,
        merchandise_title: data.tickets[i].merchandise_title,
        merchandise_options: data.tickets[i].merchandise_options,
        merchandise_image: data.tickets[i].merchandise_image,
        clicks: 0,
        dateTime: data.date,
        dateTo: data.tickets[i].date_to,
        dateFrom: data.tickets[i].date_from,
      };
      ticketData_array.push(ticketData);
    }
    console.log('ticket Object data = ', ticketData);
    var event = eventID.split('/');
    console.log('ticket Object data = ', event[1]);
    // var input = this.props.navigation.state.params.endpoint;
    // var fields = input.split('/');
    // //var name = fields[0];
    // var eventID = fields[2];
    // console.log('event Endpoint', eventID);
    this.setState({ loadingPage: false }, () => {
      this.props.navigation.navigate('TicketFlowScreen', {
        ticketData: ticketData_array,
        event_id: event[1],
      });
    });
  };

  goToArtistScreen = (id) => {
    this.setState(
      {
        disabled: true,
      },
      () => { },
    );
    console.log('Call goToArtistScreen' + JSON.stringify(id));
    // if (this.props.homeScreen == true) {
    this.clearRunningInterval();
    // }
    const split_id = id.split('/');
    this.props.navigation.push('ArtistScreen', { id: split_id[2] });
  };
  render() {
    // console.log("No internet == ",global.noInternet)
    let { fetchingHomeDetail } = this.props;
    let { sliderData, sliderActiveIndex } = this.state;

    return (
      <NetworkProvider>
        <NetworkConsumer>
          {({ isConnected }) =>
            !isConnected ? (
              <NoInternetView onLoad_method={() => this.onLoad_method()} />
            ) : fetchingHomeDetail == true || this.state.loadingPage == true ? (
              <GettingReady />
            ) : !this.props.homeScreenDataLoaded ? (
              <SomethingWentWrongView
                onLoad_method={() => this.onLoad_method()}
              />
            ) : (
              <SafeAreaView style={styles.safe_area_view}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'padding' : null}
                  style={styles.main_container}>
                  <NavigationEvents
                    onWillFocus={() => this.reload()}
                    onWillBlur={() => this.clearRunningInterval()}
                  />
                  <Header noBellIcon={true} />
                  <ScrollView contentContainerStyle={styles.scrlView_container}>
                    {sliderData.length !== 0 && (
                      <ImageBackground
                        source={getResponsiveImage(
                          sliderData[sliderActiveIndex],
                          true,
                        )}
                        style={styles.img_bg_style}>
                        <LinearGradient
                          colors={[
                            'rgba(0, 0, 0,0)',
                            'rgba(0, 0, 0,0)',
                            'rgba(0, 0, 0,0.9)',
                            'rgba(0, 0, 0,5)',
                          ]}
                          style={[
                            styles.linearGradient2,
                            {
                              borderRadius: 0,
                              justifyContent: 'flex-end',
                              alignItems: 'flex-end',
                            },
                          ]}>
                          <View style={{ width: '100%' }}>
                            <View style={styles.time_view}>
                              <Text style={styles.time_text_style}>
                                {getFormattedDate(
                                  sliderData[sliderActiveIndex].date,
                                )}
                              </Text>
                            </View>
                            <View style={styles.Show_name_and_sound}>
                              <TouchableOpacity
                                onPress={this.volumProcess}
                                style={
                                  styles.sound_icon_view
                                }></TouchableOpacity>
                              <TouchableOpacity
                                onPress={() =>
                                  this.goToEventDetailsScreen(
                                    sliderData[sliderActiveIndex].ref,
                                  )
                                }
                                style={styles.Show_title_view}>
                                <Text
                                  style={styles.title_text_style}
                                  numberOfLines={2}>
                                  {sliderData[sliderActiveIndex].title}
                                </Text>
                              </TouchableOpacity>
                              <View style={styles.go_btn_view}>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.goToEventDetailsScreen(
                                      sliderData[sliderActiveIndex].ref,
                                    )
                                  }
                                  style={styles.go_btn_round_style}>
                                  <Image
                                    resizeMode={'contain'}
                                    style={styles.forword_icon_style}
                                    source={Images.forward_arrow_home}></Image>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <View style={styles.genre_type_text_view}>
                              {sliderData[sliderActiveIndex].genres.length !==
                                0 &&
                                sliderData[sliderActiveIndex].genres.map(
                                  (item, index) => {
                                    return (
                                      <View style={{ flexDirection: 'row' }}>
                                        <Text
                                          style={styles.genre_type_text_style}>
                                          {item.title}{' '}
                                        </Text>
                                        {sliderData[sliderActiveIndex].genres
                                          .length -
                                          1 !==
                                          index && (
                                            <Text
                                              style={
                                                styles.genre_type_text_style
                                              }>
                                              {' '}
                                            •{' '}
                                            </Text>
                                          )}
                                      </View>
                                    );
                                  },
                                )}
                            </View>
                            <View style={styles.event_status_view}>
                              {sliderData[sliderActiveIndex].labels !=
                                undefined &&
                                sliderData[sliderActiveIndex].labels != null &&
                                sliderData[sliderActiveIndex].labels.length !=
                                0 &&
                                sliderData[sliderActiveIndex].labels.map(
                                  (item, index) => {
                                    return (
                                      <View
                                        style={{
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          marginRight: 10,
                                        }}>
                                        <Image
                                          source={
                                            sliderData[sliderActiveIndex]
                                              .labels[index].type == 'live'
                                              ? Images.live_stream_icon
                                              : sliderData[sliderActiveIndex]
                                                .labels[index].type ==
                                                'demand'
                                                ? Images.ondemand
                                                : Images.event_expired
                                          }
                                          style={
                                            styles.status_img_style
                                          }></Image>
                                        <Text
                                          style={styles.live_stream_text_style}>
                                          {
                                            sliderData[sliderActiveIndex]
                                              .labels[index].label
                                          }
                                        </Text>

                                        {index + 1 ===
                                          sliderData[sliderActiveIndex].labels
                                            .length -
                                          1 && (
                                            <Text
                                              style={[
                                                styles.live_stream_text_style,
                                                { fontSize: 16 },
                                              ]}>
                                              +{' '}
                                            </Text>
                                          )}
                                      </View>
                                    );
                                  },
                                )}
                            </View>
                            <View style={styles.Video_view_slide}>
                              <ScrollView
                                horizontal={true}
                                contentContainerStyle={{ paddingLeft: 16 }}
                                showsHorizontalScrollIndicator={false}>
                                {sliderData.length !== 0 &&
                                  sliderData.map((item, index) => {
                                    return (
                                      <TouchableOpacity
                                        onPress={() =>
                                          // this.goToEventDetailsScreen(item.ref)
                                          this.setMainImgae(index, item)
                                        }
                                        style={
                                          styles.video_thumb_n_name_container
                                        }>
                                        {/* <View style={styles.thumb_img_style}> */}
                                        <ImageBackground
                                          resizeMode="stretch"
                                          imageStyle={{ borderRadius: 10 }}
                                          style={styles.thumb_img_style}
                                          source={getResponsiveImage(
                                            item,
                                            true,
                                          )}>
                                          {sliderActiveIndex !== index ? (
                                            <LinearGradient
                                              colors={[
                                                'rgba(0, 0, 0,0.5)',
                                                'rgba(0, 0, 0,0.5)',
                                                'rgba(0, 0, 0,0.5)',
                                              ]}
                                              style={[
                                                styles.linearGradient2,
                                                {
                                                  borderRadius: 0,
                                                  overflow: 'hidden',
                                                },
                                              ]}></LinearGradient>
                                          ) : null}
                                        </ImageBackground>
                                        {/* </View> */}
                                        <View
                                          style={styles.sliderTextViewStyle}>
                                          <Text
                                            numberOfLines={1}
                                            style={
                                              styles.thumb_title_text_style
                                            }>
                                            {item.title}
                                          </Text>
                                        </View>
                                        {this.state.sliderActiveIndex ===
                                          index ? (
                                          this.showProgress()
                                        ) : (
                                          <View
                                            style={styles.watched_video_line}>
                                            <View
                                              style={{
                                                height: 2,
                                                width: '0%',
                                                backgroundColor: '#fff',
                                                borderTopLeftRadius: 30,
                                                borderTopRightRadius: 30,
                                                borderBottomLeftRadius: 30,
                                                borderBottomRightRadius: 30,
                                              }}></View>
                                          </View>
                                        )}
                                      </TouchableOpacity>
                                    );
                                  })}
                              </ScrollView>
                            </View>
                          </View>
                        </LinearGradient>
                      </ImageBackground>
                    )}

                    {this.props.frontData.upcoming != undefined &&
                      this.props.frontData.upcoming.length > 0 && (
                        <View>
                          <View style={styles.upcoming_event_title_view}>
                            <Text style={styles.upcoming_event_text_style}>
                              Editor's Picks
                            </Text>
                            <TouchableOpacity
                              onPress={() => this.goToEventListingScreen()}>
                              <Text
                                style={[
                                  styles.see_all_text_style,
                                  { marginRight: 0 },
                                ]}>
                                See All
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={{ flexDirection: 'row', marginTop: 16 }}>
                            <ScrollView
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{ marginLeft: 16 }}>
                              <SimilarEvent
                                artistData={this.props.frontData.upcoming}
                                goToEventDetailsScreen={(ref) =>
                                  this.goToEventDetailsScreen(ref)
                                }
                                homescreen={true}
                                loginClick={this.openSheet}
                                buyTicket={(ref) => this.BuyTicket(ref)}
                                selctedEvent={(ref) => this.selctedEvent(ref)}
                                ticket={this.state.selectedTicket}
                              />
                              {/* <Carousel
                      ref={(c) => (this.carousel = c)}
                      data={this.props.frontData.upcoming}
                      renderItem={this._renderUpcommingItem}
                      layout={'stack'}
                      sliderWidth={sliderWidth}
                      itemWidth={115}
                      itemHeight={itemHeight + 50}
                      onSnapToItem={(index) =>
                        this.setState({ activeEventIndex: index })
                      }
                      inactiveSlideShift={0}
                      scrollInterpolator={scrollInterpolatorInfinite}
                      slideInterpolatedStyle={animatedStylesInfinite}
                    /> */}
                            </ScrollView>
                          </View>
                        </View>
                      )}

                    {/* {this.props.frontData.recommended.length !== 0 && ( */}
                    {this.props.frontData.recommended != undefined &&
                      this.props.frontData.recommended.length > 0 && (
                        <ImageBackground
                          imageStyle={{
                            resizeMode: 'stretch',
                            height: '90%',
                            width: '100%',
                            marginTop: 54,
                          }}
                          source={Images.wave}
                          style={styles.slider_event_that_broke_internet_view}>
                          <Text
                            style={styles.event_that_broke_internet_text_style}>
                            Top Videos
                          </Text>
                          <View
                            style={{
                              marginTop: 16,
                              width: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            {Platform.isPad == true ? (
                              <Carousel
                                ref={(c) => (this.carousel = c)}
                                // data={this.props.frontData.recommended}
                                data={this.props.frontData.videos}
                                renderItem={this._renderItem}
                                sliderWidth={sliderWidth}
                                itemWidth={sliderWidth / 1.1}
                                itemHeight={itemHeight}
                                loop={false}
                                activeSlideAlignment="center"
                                onSnapToItem={(index) =>
                                  this.setState({ activeIndex: index })
                                }
                                inactiveSlideShift={0.7}
                                scrollInterpolator={scrollInterpolator}
                                slideInterpolatedStyle={animatedStyles}
                              />
                            ) : (
                              <Carousel
                                ref={(c) => (this.carousel = c)}
                                // data={this.props.frontData.recommended}
                                data={this.props.frontData.videos}
                                renderItem={this._renderItem}
                                sliderWidth={sliderWidth}
                                itemWidth={sliderWidth / 1.1}
                                itemHeight={itemHeight}
                                loop={false}
                                activeSlideAlignment="center"
                                onSnapToItem={(index) =>
                                  this.setState({ activeIndex: index })
                                }
                                inactiveSlideShift={0.7}
                                scrollInterpolator={scrollInterpolator}
                                slideInterpolatedStyle={animatedStyles}
                              />
                            )}
                          </View>
                        </ImageBackground>
                      )}

                    {this.props.frontData.for_you != undefined &&
                      this.props.frontData.for_you.length != 0 && (
                        <View style={styles.event_for_you_text_view}>
                          <View
                            style={{
                              flexDirection: 'row',
                              width: '100%',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              alignSelf: 'center',
                            }}>
                            <Text style={[styles.event_for_you_text_style]}>
                              Top Gigs
                            </Text>
                            <TouchableOpacity
                              onPress={() => this.goToEventListingScreen()}>
                              <Text style={styles.see_all_text_style}>
                                See All
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <ScrollView
                            showsHorizontalScrollIndicator={false}
                            style={{ marginTop: 16, alignSelf: 'center' }}>
                            <ArtistTabVideo
                              ShowTitleData={this.props.frontData.for_you}
                              homeForYou={true}
                              Horizontal={true}
                              goToEventDetailsScreen={(ref) =>
                                this.goToEventDetailsScreen(ref)
                              }></ArtistTabVideo>
                          </ScrollView>
                        </View>
                      )}

                    <View>
                      <View style={styles.upcoming_event_title_view}>
                        <Text style={styles.upcoming_event_text_style}>
                          Trending Artists
                        </Text>
                        <TouchableOpacity
                          onPress={this.goToArtistListingScreen}>
                          <Text
                            style={[
                              styles.see_all_text_style,
                              { marginRight: 0 },
                            ]}>
                            See All
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.similat_atist_view}>
                        <Similar_artist
                          disabled={this.state.disabled}
                          goToArtistScreen={(ref) => {
                            this.goToArtistScreen(ref);
                          }}
                          similarArtistData={this.props.frontData.artists}
                          clearInterval={() => this.clearRunningInterval()}
                        />
                      </View>
                    </View>
                    {this.props.frontData.promoted != undefined &&
                      this.props.frontData.promoted.length > 0 && (
                        <ImageBackground
                          source={getResponsiveImage(
                            this.props.frontData.promoted[0],
                            false,
                          )}
                          style={styles.img_bg_style}
                          resizeMode="contain"
                          imageStyle={{}}>
                          <LinearGradient
                            colors={[
                              'rgba(0, 0, 0,0.5)',
                              'rgba(0, 0, 0,0.5)',
                              'rgba(0, 0, 0,0.5)',
                            ]}
                            style={styles.linearGradientFullEventSection}>
                            <View
                              style={{
                                width: sliderWidth,
                                justifyContent: 'center',
                                alignItems: 'center',
                                bottom: 38,
                                position: 'absolute',
                              }}>
                              <Text
                                style={styles.img_background_two_artist_text}>
                                {/* Bruno Mar’s */}
                                {this.props.frontData.promoted[0].band.title}
                              </Text>
                              <Text
                                style={styles.img_background_two_event_text}>
                                {this.props.frontData.promoted[0].title}
                              </Text>
                              <Text
                                style={
                                  styles.img_background_two_event_time_text
                                }>
                                {/* Aug 25 4:30 PM (PST) */}
                                {getFormattedDate(
                                  this.props.frontData.promoted[0].date,
                                )}
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                {/* <Image
                                        source={Images.live_stream_icon}
                                        style={styles.status_img_style}></Image> */}
                                {/* {  this.props.frontData.promoted[0].labels !== undefined && this.props.frontData.promoted[0].labels !== null && this.props.frontData.promoted[0].labels.length !== 0 &&
                              <Text style={styles.live_stream_text_style}>
                                  {
                                    this.props.frontData.promoted[0].labels[0].label
                                  }
                                </Text>
                                } */}
                                {this.props.frontData.promoted[0].labels !=
                                  undefined &&
                                  this.props.frontData.promoted[0].labels !=
                                  null &&
                                  this.props.frontData.promoted[0].labels
                                    .length != 0 &&
                                  this.props.frontData.promoted[0].labels.map(
                                    (item, index) => {
                                      return (
                                        <View
                                          style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            marginRight: 10,
                                          }}>
                                          <Image
                                            source={
                                              this.props.frontData.promoted[0]
                                                .labels[index].type == 'live'
                                                ? Images.live_stream_icon
                                                : this.props.frontData
                                                  .promoted[0].labels[index]
                                                  .type == 'demand'
                                                  ? Images.ondemand
                                                  : Images.event_expired
                                            }
                                            style={
                                              styles.status_img_style
                                            }></Image>
                                          <Text
                                            style={
                                              styles.live_stream_text_style
                                            }>
                                            {
                                              this.props.frontData.promoted[0]
                                                .labels[index].label
                                            }
                                          </Text>

                                          {index + 1 ===
                                            this.props.frontData.promoted[0]
                                              .labels.length -
                                            1 && (
                                              <Text
                                                style={[
                                                  styles.live_stream_text_style,
                                                  { fontSize: 16 },
                                                ]}>
                                                +{' '}
                                              </Text>
                                            )}
                                        </View>
                                      );
                                    },
                                  )}
                              </View>
                              <View
                                style={{
                                  marginTop: 16,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignSelf: 'center',
                                  alignItems: 'center',
                                  width: '90%',
                                  height: '30%',
                                }}>
                                <View style={{ flex: 0.9, marginRight: 3 }}>
                                  <RBDailog
                                    buyTicket={() =>
                                      this.BuyTicket(
                                        this.props.frontData.promoted[0].ref,
                                      )
                                    }
                                    selctedEvent={() =>
                                      this.selctedEvent(
                                        this.props.frontData.promoted[0].ref,
                                      )
                                    }
                                    ticket={this.state.selectedTicket}
                                    BtnTypePrimary={false}
                                    lableText={'Buy Tickets'}
                                    btn_style_second={
                                      styles.buyTicketFullEventSectionStyle
                                    }
                                    lbl_style_second={
                                      styles.buyTicketFullEventSectionTextStyle
                                    }
                                  />
                                </View>
                                <View
                                  style={{
                                    flex: 0.9,
                                    marginLeft: 3
                                  }}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.goToEventDetailsScreen(
                                        this.props.frontData.promoted[0].ref,
                                      )
                                    }
                                    style={[
                                      styles.img_background_two_buy_secend_ticket_style,
                                    ]}>
                                    <Text
                                      style={
                                        styles.img_background_two_buy_ticket_second_text_style
                                      }>
                                      More Info
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </LinearGradient>
                        </ImageBackground>
                      )}
                    {/* <View style={[styles.explor_the_genre_view]}>
                            <Genres_round_view
                              homeScreenUse={true}
                              genres={this.props.frontData.genres}
                            // goToGenesListingScreen={() => this.props.navigation.navigate('GenreListingScreen')}
                            />
                          </View> */}
                    {this.props.frontData.gigs.categories != undefined
                      ? this.props.frontData.gigs.categories.length > 0 && (
                        <View>
                          <View style={styles.upcoming_event_title_view}>
                            <Text style={styles.upcoming_event_text_style}>
                              Explore Gigs
                              </Text>
                            <TouchableOpacity
                              onPress={() => this.goToEventListingScreen()}>
                              <Text
                                style={[
                                  styles.see_all_text_style,
                                  { marginRight: 0 },
                                ]}>
                                See All
                                </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.genre_option_btn_view}>
                            <ScrollView
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{ flexGrow: 1 }}>
                              {this.props.frontData.gigs.categories !=
                                undefined && (
                                  <GenreOptionBtn
                                    genreOption={
                                      this.props.frontData.gigs.categories
                                    }
                                    SelectedGenre={this.state.SelectedGenre}
                                    selectedGenreList={(val) =>
                                      this.SelectedGenreView(val)
                                    }
                                  />
                                )}
                            </ScrollView>
                            {this.state.gigsDetail.length > 0 && (
                              <View style={{ marginTop: 17 }}>
                                <ScrollView
                                  horizontal={true}
                                  ref={(ref) => {
                                    this.scrollview_Ref = ref;
                                  }}
                                  contentContainerStyle={{ paddingRight: 15 }}
                                  showsHorizontalScrollIndicator={false}>
                                  <ArtistTabVideo
                                    ExploreGigs={true}
                                    ShowTitleData={this.state.gigsDetail}
                                    homeGigs={true}
                                    goToEventDetailsScreen={(ref) =>
                                      this.goToEventDetailsScreen(ref)
                                    }
                                  />
                                </ScrollView>
                              </View>
                            )}
                          </View>
                        </View>
                      )
                      : null}
                    {this.props.frontData.for_you.length !== 0 && (
                      <View style={styles.featured_Fans_view}>
                        {/* <Text style={styles.upcoming_event_text_style}>
                    Featured Fans
                  </Text> */}
                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: 40,
                            marginTop: 28,
                          }}>
                          <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {this.props.frontData.fans.length !== 0 &&
                              this.props.frontData.fans.map((item) => {
                                return (
                                  <View style={styles.featureFanView}>
                                    <Image
                                      source={{ uri: item.img_url }}
                                      style={styles.featureFanUserImg}
                                    />
                                    <Text
                                      style={
                                        styles.feature_Fan_name_text_style
                                      }>
                                      {item.name}
                                    </Text>
                                    <Text
                                      style={
                                        styles.feature_Fan_address_text_style
                                      }>
                                      {item.address}
                                    </Text>
                                  </View>
                                );
                              })}
                          </ScrollView>
                        </View>
                      </View>
                    )}
                    <Footer />
                  </ScrollView>
                  <RBSheet
                    ref={(ref) => {
                      this.RBSheet = ref;
                    }}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={291}
                    openDuration={250}
                    customStyles={{
                      container: {
                        backgroundColor: '#e7e7e7',
                        opacity: 0.97,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      },
                      wrapper: {
                        backgroundColor: 'transparent',
                      },
                      draggableIcon: {
                        backgroundColor: 'transparent',
                      },
                    }}>
                    <View style={styles.close_view_container}>
                      <TouchableOpacity onPress={this.closeSheet}>
                        <Icon name="close" size={30} color="#1b1c20"></Icon>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.btn_n_details_container}>
                      {/* <TouchableOpacity
                  style={styles.modal_buy_btn_style}
                  onPress={this.check_login}>
                  <Text style={styles.buy_ticket_text_style}>Buy Tickets</Text>
                </TouchableOpacity> */}
                      <Text style={styles.lefting_ticket_text_style}>
                        Starting from $10 Only 10 Left
                      </Text>
                      <Text style={styles.get_ticket_to_unlock_text_style}>
                        Get the tickets to Unlock the chat.
                      </Text>
                      {!global.isLoggedIn ? (
                        <View style={styles.login_line_modal_style}>
                          <Text style={styles.already_have_login_text_style}>
                            Already have the tickets?
                          </Text>
                          <TouchableOpacity onPress={this.onLogin}>
                            <Text style={styles.login_text_modal_style}>
                              {' '}
                              Login
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  </RBSheet>
                </KeyboardAvoidingView>
                {/* {this.state.GettingReadyLightSmall == true && ( */}
                <Spinner
                  size={"large"}
                  overlayColor={'rgba(0, 0, 0, 0.5)'}
                  visible={this.state.GettingReadyLightSmall}
                  textContent={'Loading...'}
                  textStyle={styles.spinnerTextStyle}
                />
                {/* )} */}
              </SafeAreaView>
            )
          }

        </NetworkConsumer>
      </NetworkProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    type: state.HomeScreenStore.type,
    fetchingHomeDetail: state.HomeScreenStore.fetchingHomeDetail,
    frontData: state.HomeScreenStore.frontData,
    homeScreenDataLoaded: state.HomeScreenStore.homeScreenDataLoaded,
  };
}
function matchDispatchToProps(dispatch) {
  return {
    GetHomeDetails: () => dispatch(GetHomeDetails()),
    GetEventDetails: (endpoint) => dispatch(GetEventDetails(endpoint)),
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(HomeScreen);

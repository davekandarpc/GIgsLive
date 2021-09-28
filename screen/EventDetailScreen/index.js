import AsyncStorage from '@react-native-community/async-storage';
import {BlurView, VibrancyView} from '@react-native-community/blur';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  InteractionManager,
  View,
} from 'react-native';
import {APICALL_v1} from '../../common/ApiConfig';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import Stripe from 'react-native-stripe-api';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import {getFormattedDate, getResponsiveImage} from '../../common/functions';
import {
  colors,
  Fonts,
  Images,
  keyConstants,
  navigationKeys,
  showToast,
  strings,
  VODIcons,
} from '../../common';
import {Constaint} from '../../common/Const';
import {
  AddCommentBox,
  GettingReady,
  OpenCloseChatRow,
  Similar_artist,
  TipPayment,
  UserChatActionButtons,
  Header,
  ChatRoomSelectionView,
  ConfirmPopUp,
} from '../../components';
import Footer from '../../components/Footer';
import VideoPlayer from '../../components/VideoPlayer';
import {
  leaveRoom,
  deleteRoom,
  deleteApiBlank,
  addCommentToChat,
  getChatList,
  getRoomInfoDetail,
  appendRecievedMessage,
  modrateUser,
  modrateUserClear
} from '../../store/ChatRoomStore/actions';
import {
  EventDetailsBuyTicket,
  EventDetailsFollow,
  EventDetailsSendComment,
  FollowUnfollowArtist,
  GetEventDetails,
  GetRoomList,
  InviteUser,
  RemoveCachedEventData,
  SendNewMessage,
  validTicket,
  validTicketClear,
  WatchlistUnwatchlistEvent,
} from '../../store/EventDetatilStore/actions';
import {actionType} from '../../store/EventDetatilStore/actionType';
import {
  CheckConnectivity,
  dayDiff,
  formatDateFromMilliseconds,
  getAccessToken,
  getLoggedInUserDataObject,
  ShareIt,
  splitEndPoint,
  validateEmail,
} from '../../Utils';
import {styles} from './styles';
import io from 'socket.io-client';
import md5 from 'md5';
import FastImage from 'react-native-fast-image';
import {NetworkConsumer, NetworkProvider} from 'react-native-offline';
import NoInternetView from '../../components/NoInternetView';
import {normalize} from '../../common/normalize';
import Orientation from 'react-native-orientation-locker';
import analytics from '@react-native-firebase/analytics';
import {TrackingApp} from '../../common/TrackingApp';
import {getBasicAuthForAPi} from '../../common/functions';
import Spinner from 'react-native-loading-spinner-overlay';
//const HLS = require('hls-parser');
import { color } from 'react-native-reanimated';
const M3U8FileParser = require('m3u8-file-parser');
const SLIDER_HEIGHT = Dimensions.get('window').height;
// const apiKey = Constaint.SECRET_KEY;
// const apiKey = global.ApiURL == true ? Constaint.PROD_SECRET_KEY : Constaint.SECRET_KEY;
var apiKey = '';
const height = Dimensions.get('window').height;
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Dimensions.get('window').height;

const utcDateToString = (momentInUTC) => {
  let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  return s;
};
var url = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
//var urlData = Hls.parse(url)
const reader = new M3U8FileParser();
reader.read('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
// calender function start
//console.log("reader HLS ===> "+ JSON.stringify(urlData))
console.log("reader m3u8 file reader ===> "+ JSON.stringify(reader.getResult()))
const addToCalendar = (title, startDateUTC) => {
  const eventConfig = {
    title,
    // title:'',
    url: 'https://gigs.live/',
    startDate: utcDateToString(startDateUTC),
    endDate: utcDateToString(moment.utc(startDateUTC).add(1, 'hours')),
    notes: 'https://gigs.live/',
    navigationBarIOS: {
      tintColor: 'orange',
      backgroundColor: 'green',
      titleColor: 'blue',
    },
  };

  AddCalendarEvent.presentEventCreatingDialog(eventConfig)
    .then((eventInfo) => {
      // alert('eventInfo -> ' + JSON.stringify(eventInfo));
      console.log('eventInfo -> ' + JSON.stringify(eventInfo));
      var calAction = eventInfo.action;
      if (calAction == 'CANCELED') {
        showToast('Event not added', 'success');
      } else {
        showToast('Event Added successfully', 'success');
      }
    })
    .catch((error) => {
      // handle error such as when user rejected permissions
      // alert('Error -> ' + error);
      console.log('Error -> ' + error);
      showToast('Event cancelled', 'success');
    });
};
// calender function stop
var messageContainer = [];
var timer = 50;
export class EventDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userdata: null,
      isUserLoggedIn: false,
      timer: 5,
      upperTab: 0,
      lowerTab: 0,
      eventUUID: '',
      eventStarted: undefined,
      liveEventCompleted: 0,
      isEventCompleted: undefined,
      waitOf30MinsStarted: undefined,
      //#region -> Chat & Room Variables
      SelectedValue: null,
      availableRooms: [],
      commentTextValue: '',
      modalTipVisible: false,
      //#endregion
      followArtist: false,
      buyTicket: false,
      IsTicket: 0,
      isReady: false,
      //#region -> Modal: Image preview carousel
      modalVisible: false,
      num: 0,
      galleryIndex: 0,
      //#endregion
      ticketCode: '',
      time_left_to_event_start: [],
      //#region ->Video Player property fields
      PlayEventVideo: true,
      isVidePlayerOff: true,
      videoUrl: strings.videoId,
      fullScreen: false,
      expand: true,
      miniplay: true,
      autostartTimer: false,
      //#endregion
      inviteModalVisibility: false,
      GettingReadyLightSmall: false,
      noInternet: false,
      token: '',
      valid_ticket: false,
      autoStartDone: false,
      valid_ticket_data: null,
      uuid: '',
      tip_uid: '',
      wh_uid: '',
      peace_uid: '',
      rock_uid: '',
      love_uid: '',
      lit_uid: '',
      nostalgic_uid: '',
      clap_uid: '',
      total_participant: 0,
      selectedGroup: 0,
      message: '',
      createAtmessage: '',
      messageType: 0,
      tip_amount: '',
      field_username_value: '',
      picture:
        'https://themindsetproject.com.au/wp-content/uploads/2017/08/avatar-icon.png',
      participants: null,
      showModal: false,
      fullScreenModeON: false,
      email: '',
      isLoggedIn: false,
      error: false,
      emptyEmail: false,
      user_name: '',
      userImage: '',
      event_id_new: '',
      userLogedIn: false,
      fullScreenClick: false,
      disabled: false,
      latestMessage: [],
      tipAmount: 0,
      confirmPopupModel: false,
      confirmPopupMessage: '',
      confirmPopupAction: 0,
      modalisVisibleDelete: false,
      second: 3,
      firsttimeCall: false,
      followBtn: false,
      istimerOn: true,
      tag: '',
      error_msg: '',
      disabledFollow: false,
      enterTicketCodeClick: false,
      IsEvetntDetail: true,
      reportMsgUuid: null,
      reportUserUid: null,
      reportUserName: null,
      reportMsg: null,
      repoertMessageVal: 0,
    };
    global.myNavigation = this.props.navigation;
    global.selectedRoom = 'global';
    global.selectedRoom1 = 'global';
    global.isAdmin = false;
    global.istimerOn = false;
    this.getSelectedImages = this.getSelectedImages.bind(this);
    this.eventIntervalId = 0;
    // this.socket = io('https://gigs.live:3000', {
    // this.socket = io('https://dev.gigs.live:3000', {
    this.socket = io(global.socketEndpoint, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      jsonp: false,
    });
  }
  //#region -> Modal: Image preview carousel
  getSelectedImages(images) {
    var num = images.length;

    this.setState({
      num: num,
      selected: images,
    });
  }

  setModalVisible(visible, indexImage) {
    this.setState({modalVisible: visible, galleryIndex: indexImage}, () => {});
  }

  _renderItem = ({item}, parallaxProps) => {
    return (
      <ParallaxImage
        // source={{ uri: item.image }}
        source={
          Platform.isPad == true
            ? {
                uri: item['image-responsive'].normal['<767'],
              }
            : item['image-responsive'] != undefined &&
              item['image-responsive'] != null &&
              item['image-responsive'].normal != undefined &&
              item['image-responsive'].normal != null
            ? {
                uri: item['image-responsive'].normal['>767'],
              }
            : {
                uri: item.image,
              }
        }
        containerStyle={styles.imageContainer}
        style={styles.image}
        parallaxFactor={0.4}
        {...parallaxProps}>
        {/* <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Image
            source={{
              uri: item.image,
            }}
            style={styles.modal_image_style}
          />
        </View> */}
      </ParallaxImage>
    );
  };
  //#endregion
  HandelSendTip = () => {
    if (this.state.isLoggedIn == false) {
      this.setState({tag: 'Chat'}, () => {
        console.log('Tag : ' + this.state.tag);
        this.RBSheet.open();
      });
    } else if (
      this.state.isLoggedIn == true &&
      this.props.eventDetails.purchased_tickets > 0
    ) {
      this.setState({modalTipVisible: true, tipsStep: 1}, () => {
        // this.RBSheet_Tips.open();
      });
    } else {
      this.setState({tag: 'Buy Tickets'}, () => {
        console.log('Tag : ' + this.state.tag);
        this.RBSheet.open();
      });
    }
  };
  closeTips = () => {
    // this.RBSheet_Tips.close();
    this.setState({modalTipVisible: false});
  };
  SelectedAmount = (val) => {
    this.setState({SelectedAmount: val});
  };
  /* stepHandel = async (_amount, _message) => {
    if (this.state.tipsStep == 1) {
      this.setState({tipsStep: 2});
    } else if (this.state.tipsStep == 2) {
      console.log('in else');
      this.setState({tipsStep: 3});
    }
  }; */
  stepHandel = async (
    cardNumber,
    cardHolderName,
    cvv,
    expiryMonth,
    expiryYear,
    amount,
    message,
  ) => {
    console.log(
      'Amount message ==== ' +
        JSON.stringify(amount) +
        ' ' +
        JSON.stringify(message),
    );
    if (this.state.tipsStep == 1) {
      this.setState({tipsStep: 2});
    } else if (this.state.tipsStep == 2) {
      let amut = amount * 100;
      console.log('in else');
      // this.setState({tipsStep: 3});
      var ref = this.props.navigation.state.params.endpoint;
      var endPoint = ref.substring(4);
      var uuid = endPoint.split('/');
      const client = new Stripe(apiKey);
      await client
        .createToken({
          number: cardNumber,
          exp_month: `${expiryMonth}`,
          exp_year: `${expiryYear}`,
          cvc: `${cvv}`,
        })
        .then((token) => {
          const customer = {
            email: `${this.state.email}`,
            name: `${cardHolderName}`,
            source: `${token.id}`,
          };
          if (token.error != undefined) {
            showToast(token.error.message, 'warning');
          }
          client
            .stripePostRequest('customers', customer)
            .then((response) => {
              const card = {
                amount: `${amut}`,
                currency: 'usd',
                customer: `${response.id}`,
              };
              client
                .stripePostRequest('charges', card)
                .then((response) => {
                  //alert('Success');
                  showToast('Payment successfully completed');
                  console.log('response ===> ' + JSON.stringify(response));
                  if (response.error === undefined) {
                    var data = {
                      bodyData: {
                        message: message,
                        action: this.state.tip_uid,
                        room: global.selectedRoom1,
                        event: uuid[1],
                        amount: `${amount}`,
                      },
                      headerData: {
                        token: this.state.token,
                      },
                    };
                    this.props.addCommentToChat(data);
                    this.closeTips();
                    this.AddTip(amount, message);
                  } else {
                    this.closeTips();
                    console.log(
                      'hewre is error ' + JSON.stringify(response.error.code),
                    );
                    showToast('Payment Failed', 'warning');
                    // alert('Payment Failed.Your card number is incorrect.');
                  }
                })
                .catch((error) => {
                  // this.setState({tipsStep: 4});
                  console.log('error ===> ' + JSON.stringify(error));
                  this.AddTip(amount, message);
                });
            })
            .catch((error) => {
              // this.setState({tipsStep: 4});
              console.log('error ===> ' + JSON.stringify(error));
              this.AddTip(amount, message);
            });
        })
        .catch((error) => {
          // this.setState({tipsStep: 4});
          console.log('error ===> ' + JSON.stringify(error));
          this.AddTip(amount, message);
        });
    }
  };

  InAppSuccessfullyDone = (amount, message) => {
    console.log('Event detail Screen : ');
    var ref = this.props.navigation.state.params.endpoint;
    var endPoint = ref.substring(4);
    var uuid = endPoint.split('/');
    var data = {
      bodyData: {
        message: message,
        action: this.state.tip_uid,
        room: global.selectedRoom1,
        event: uuid[1],
        amount: `${amount}`,
      },
      headerData: {
        token: this.state.token,
      },
    };
    this.props.addCommentToChat(data);
  };

  AddTip = () => {
    this.setState({sendTip: true}, () => {
      if (this.state.sendTip == true) {
        this.setState({tipAmount: 0});
      }
    });
    this.setState({isComment: false});
    // this.addComment(message, amount);
  };
  takeOneStepBack = () => {
    this.setState({tipsStep: this.state.tipsStep - 1});
  };

  // countDown=()=>{
  //   this.stoptimer()
  //   this.interval = setInterval(() => {
  //     this.setState({
  //       second: this.state.second - 1
  //     },()=>{
  //       console.log("hello ==== >", this.state.second)
  //     })
  //   }, 1000);

  // }
  stoptimer = () => {
    // console.log('Time : 2 calllllll lllllll llll ' + this.state.second);
    this.setState(
      {
        GettingReadyLightSmall: false,
        autoStartDone: true,
      },
      () => {
        // console.log('Time : 1 ' + this.state.second);
        this.fullScreen('start');
      },
    );
    // if (this.state.second === 0) {
    //   this.setState({
    //     GettingReadyLightSmall: false,
    //   });
    // }
    // if (this.state.second > 0) {
    //   // setTimeout(() => {
    //   this.setState(
    //     {
    //       // second: this.state.second - 1
    //     },
    //     () => {
    //       if (this.state.second > 0) {
    //         this.setState(
    //           {
    //             second: this.state.second - 1,
    //           },
    //           () => {
    //             if (
    //               // this.state.time_left_to_event_start[1] == 0 &&
    //               // this.state.time_left_to_event_start[2] <= 30 &&
    //               this.state.second === 0
    //             ) {
    //               this.setState(
    //                 {
    //                   GettingReadyLightSmall: false,
    //                   autoStartDone: true,
    //                 },
    //                 () => {
    //                   console.log('Time : 1 ' + this.state.second);
    //                   this.fullScreen('start');
    //                 },
    //               );
    //             }
    //           },
    //         );
    //       }

    //       console.log(
    //         'time left =====> ' +
    //           JSON.stringify(this.state.time_left_to_event_start[2]),
    //       );
    //       // this.stoptimer();
    //     },
    //   );
    //   // }, 1000);
    // }
    /* if(this.state.second === 0){
      this.fullScreen('start');
    } */
  };

  componentDidMount = async () => {
    // this.onLoad_method()
    // this.props.validTicketClear();

    console.log('interaction ===== >DDID MOUNT');
    apiKey =
      global.ApiURL == true ? Constaint.PROD_SECRET_KEY : Constaint.SECRET_KEY;
    console.log('Srtripe API KEY Event : ' + apiKey);

    // this.socket.disconnect();
    // this.socket.on("disconnect", () => {
    //   console.log("disconnect Socket : "+socket.connected); // false
    // });
    // this.socket.reconnect();
    // this.socket.connect();

    let userdata = await AsyncStorage.getItem('loginData');
    let sessionId = null;
    console.log('User Data 123456: ' + JSON.stringify(userdata));
    if (userdata !== null) {
      console.log('User Data 123456 IFFFF : ' + JSON.stringify(userdata));
      let user_token =
        userdata !== null ? JSON.parse(userdata).token : undefined;
      let user_session_id =
        userdata !== undefined && userdata !== null
          ? JSON.parse(userdata).sessid
          : undefined;
      let user_email = JSON.parse(userdata).user.mail;
      var input = this.props.navigation.state.params.endpoint;
      var fields = input.split('/');
      //var name = fields[0];
      var eventID = fields[2];
      sessionId = md5(user_session_id);
      let eventMD5Id = md5(eventID);
      let selectedRoomMD5 = md5(global.selectedRoom1);

      //alert("seetion id covert in MD5 "+JSON.stringify(sessionId))
      /* Define at upper side in constructor
      this.socket = io('https://gigs.live:3000', {
        transports: ['websocket'],
        rejectUnauthorized: false,
        jsonp: false,
      }); */
      // this.socket.on("disconnect", () => {
      //   console.log("disconnect Socket : "+socket.connected); // false
      // });
      this.socket.connect();
      this.socket.on('connect', () => {
        console.log('socket connected' + this.socket.connected);
        var authMessage = {
          //authToken:"4c12f9ac8a5f6a27e3020389bacad605"
          authToken: sessionId,
        };
        this.socket.emit('authenticate', authMessage);
        this.socket.connect(
          `gigs_rest_event_${eventID}_${global.selectedRoom1}`,
        );
        console.log('just befor data===> ' + JSON.stringify(eventID));
      });
    }
    if (global.LoadSocket === false) {
      this.loadSocketData();
    }
    // global.isSelected = 6
    // var input = this.props.navigation.state.params.endpoint;
    // var fields = input.split('/');
    // var eventID = fields[2];
    // var track_Data = {
    //   'session-id': 'asdasdadsdasd',
    //   'device-id': 'djsdoijfhsdfjhsdjkf',
    //   env: 'dev',
    //   'user-id': '{user-id}',
    //   device: '{web|TVOS|Roku|mobile-ios|mobile-android}',
    //   version: '{device-os-version}',
    //   build: '{build-version}',
    //   'page-id': '{Home|Listing|Profile|Video|Artist|Event}',
    //   'page-type-id': '{artist|event|Genre|video}',
    //   metric: '{visits|select}',
    //   value: '{click|play|add}',
    //   'time-stamp': '{UTC-time}',
    //   map: {
    //     title: '{event-title|video-title|artist-title}',
    //     ticket: '{ticket-type}',
    //     'custom-param': '{play:1,stop:0,pause:0}',
    //   },
    // };
    this.ScreenLoadEvent();
  };

  ScreenLoadEvent = () => {
    // this.setState({ IsEvetntDetail: true }, () => {
    this.onLoad_method();
    this.setState({latestMessage: []}, async () => {
      console.log('interaction ===== >');
      this.props.validTicketClear();
      global.currentTime = 0;
      global.isSelected = 6;
      var input = this.props.navigation.state.params.endpoint;
      var fields = input.split('/');
      var eventID = fields[2];
      var track_Data = {
        'session-id': 'asdasdadsdasd',
        'device-id': 'djsdoijfhsdfjhsdjkf',
        env: 'dev',
        'user-id': '{user-id}',
        device: '{web|TVOS|Roku|mobile-ios|mobile-android}',
        version: '{device-os-version}',
        build: '{build-version}',
        'page-id': '{Home|Listing|Profile|Video|Artist|Event}',
        'page-type-id': '{artist|event|Genre|video}',
        metric: '{visits|select}',
        value: '{click|play|add}',
        'time-stamp': '{UTC-time}',
        map: {
          title: '{event-title|video-title|artist-title}',
          ticket: '{ticket-type}',
          'custom-param': '{play:1,stop:0,pause:0}',
        },
      };
      this.setState(
        {
          isReady: false,
          error_msg: '',
          liveEventCompleted: 0,
          waitOf30MinsStarted: undefined,
          autostartTimer: false,
        },
        async () => {
          Orientation.lockToPortrait();
          this.onClose();
          //this.stoptimer()

          //#region -> Below call needs to be called at the first glance,
          //           so don't put code above this calls.
          this.reload();
          this.props.RemoveCachedEventData();

          let userData = await getLoggedInUserDataObject();
          let validTicket = await AsyncStorage.getItem('validTicketData');
          console.log(
            'valid tricket data ======> ' + JSON.stringify(validTicket),
          );
          console.log(
            'Here is in will update nextProps.eventType nextProps.eventType ',
            this.props.validTicketData,
          );
          var input = this.props.navigation.state.params.endpoint;
          var fields = input.split('/');
          //var name = fields[0];
          var eventID = fields[2];

          this.setState(
            {
              userdata: userData,
              eventUUID: eventID,
            },
            () => {},
          );
          //#endregion

          //        this.loadSocketData();

          /*  BackHandler.addEventListener('hardwareBackPress', () => {
    alert("here is data ====> hoahajnf;kln aodfk[sadofijasdklfjs'adfpsijf[sapdfkja[']]] ")
    this.backToScreen();
    return true;
  }); */
          //#region -> Interval for showing count down ie. 3 Days 23 Hours 30 Minutes
          this.setState(
            {
              isLoading: true,
              liveEventCompleted: 0,
              PlayEventVideo: true,
              IsEvetntDetail: true,
            },
            () => {
              console.log('global.istimerOn 1 : ');
              global.istimerOn = true;
              this.eventStartCountDown();
            },
          );
          //#endregion
          //#region ->Updating flag, if user logged in or not
          this.getFlagIsUserLoggedIn();
          //#endregion
          //});
        },
      );
    });
    // });
  };

  onLoad_method = async () => {
    console.log('On Load Method Callllllll ============');
    var status = await CheckConnectivity();
    if (!status) {
      this.setState({
        noInternet: true,
      });
      showToast('No Internet', 'warning');
    } else {
      console.log(
        'On Load Method Callllllll ============' + global.currentRoute,
      );
      if (global.currentRoute != 'EventListing') {
        global.currentRoute = 'HomeScreen';
        console.log('RELOAD Callllllll ============' + global.currentRoute);
      }
      // else
      // {
      //   global.currentRoute = 'EventListing';
      //   console.log('RELOAD Callllllll ============'+global.currentRoute);
      // }
      this.setState(
        {
          noInternet: false,
        },
        () => {
          this.props.GetEventDetails();
        },
      );
    }
  };

  addRoom = async () => {
    await this.getAsyncLoggedInFlag().then((flag) => {
      if (this.props.eventDetails.purchased_tickets === 0 && !flag) {
        this.RBSheet.open();
      } else {
        global.istimerOn = false;
        var input = this.props.navigation.state.params.endpoint;
        var fields = input.split('/');
        //var name = fields[0];
        var eventID = fields[2];
        console.log('event Endpoint', eventID);
        this.setState({IsEvetntDetail: false}, () => {
          this.props.navigation.navigate('AddRoomScreen', {eventId: eventID});
        });
      }
    });
  };

  changeRoom = (selectedRoom) => {
    console.log('Selected room ::::::::::   ' + selectedRoom);
    var input = this.props.navigation.state.params.endpoint;
    var fields = input.split('/');
    //var name = fields[0];
    var eventID = fields[2];
    global.selectedRoom1 = selectedRoom;
    // this.props.getChatList(this.state.eventUUID, selectedRoom);
    this.props.getChatList(eventID, selectedRoom);
    var getParticepetsData = {
      body: {
        eventUUID: eventID,
        uuid: global.selectedRoom1,
      },
    };
    this.props.getRoomInfoDetail(getParticepetsData);
  };

  handelValue = (item) => {
    /* console.log(
      'here is data this.props.availableRooms ===> ',
      this.props.getRoomListResponse.rooms,
    ); */
    console.log('here is data item ===> ', item);
    console.log('here is data item ===> ', this.props.availableRooms);
    console.log('here is data item ===> ', this.props.getRoomListResponse);
    /* console.log(
      'here is data item ===> ',
      Object.keys(this.props.getRoomListResponse.rooms[item]),
    ); */
    // global.selectedRoom1 = this.props.availableRooms.rooms[item].id;
    global.selectedRoom1 = item;
    this.setState(
      {
        selectedGroup: item,
      },
      () => {
        console.log('here is data ===> ', global.selectedRoom1);
        var ref = this.props.navigation.state.params.endpoint;
        var endPoint = ref.substring(4);
        var uuid = endPoint.split('/');
        console.log('Event UUID : ' + uuid[0]);
        this.props.getChatList(uuid[1], global.selectedRoom1);
        var getParticepetsData = {
          body: {
            eventUUID: uuid[1],
            uuid: global.selectedRoom1,
          },
        };
        this.props.getRoomInfoDetail(getParticepetsData);
      },
    );
    // this.props.changeRoom(item)
  };

  async loadSocketData() {
    let userdata = await AsyncStorage.getItem('loginData');
    let user_session_id = JSON.parse(userdata).sessid;
    let user_token = userdata !== null ? JSON.parse(userdata).token : undefined;
    let user_email = JSON.parse(userdata).user.mail;
    var input = this.props.navigation.state.params.endpoint;
    var fields = input.split('/');
    //var name = fields[0];
    var eventID = fields[2];

    // //alert("seetion id covert in MD5 "+JSON.stringify(sessionId))
    // /* Define at upper side in constructor
    // this.socket = io('https://gigs.live:3000', {
    //   transports: ['websocket'],
    //   rejectUnauthorized: false,
    //   jsonp: false,
    // }); */
    // // this.socket.on("disconnect", () => {
    // //   console.log("disconnect Socket : "+socket.connected); // false
    // // });
    // this.socket.connect();
    // this.socket.on('connect', () => {
    //   console.log('socket connected' + this.socket.connected);
    //   var authMessage = {
    //     //authToken:"4c12f9ac8a5f6a27e3020389bacad605"
    //     authToken: sessionId,
    //   };
    //   this.socket.emit('authenticate', authMessage);
    //   this.socket.connect(`gigs_rest_event_${eventID}_${global.selectedRoom1}`);
    //   console.log('just befor data===> ' + JSON.stringify(eventID));
    // });
    // this.socket.on('ping', (data) => {
    //   console.log('in ping ===> ', data);
    // });
    this.socket.on('connect_error', (err) => {
      console.log(err);
    });
    // var eventroom =
    //   global.selectedRoom1 === 'global'
    //     ? `gigs_rest_event_${eventID}_`
    //     : `gigs_rest_event_${eventID}_${global.selectedRoom1}`;
    this.socket.on('message', (msgObj) => {
      console.log(
        'recievd message from dserver  Event detail 2 ===> global.selectedRoom1 ==== >' +
          JSON.stringify(msgObj),
      );
      var eventroom =
        global.selectedRoom1 === 'global'
          ? `gigs_rest_event_${eventID}_`
          : `gigs_rest_event_${eventID}_${global.selectedRoom1}`;
      console.log('Event Chenal : ' + eventroom);
      if (msgObj.callback == undefined) {
        if (msgObj.data != undefined) {
          // console.log(
          //   'recievd message from dserver  Event detail 1234===> ' +
          //     JSON.stringify(msgObj),
          // );
          // console.log(
          //   'recievd message from dserver  Event detail 1 ===> ' +
          //     JSON.stringify(msgObj.channel),
          // );
          // console.log(
          //   'recievd message from dserver  Event detail 2 ===> ' +
          //     JSON.stringify(eventroom),
          // );
          console.log('Event : ' + eventroom);
          console.log('Event Socket : ' + msgObj.channel);
          if (eventroom === msgObj.channel) {
            if (msgObj.data.type === undefined) {
              var addData = false;
              this.setState(
                {
                  //latestMessage :  this.state.latestMessage.splice(0,1)
                },
                () => {
                  console.log(
                    'LAtest Mesage : ' +
                      JSON.stringify(this.state.latestMessage),
                  );
                  console.log(
                    'msgObj.dataLAtest Mesage : ' +
                      JSON.stringify(this.state.latestMessage),
                  );
                  // console.log("LAtest Mesage : "+this.state.latestMessage.length)
                  if (
                    this.state.latestMessage == null &&
                    this.state.latestMessage == undefined
                    // this.state.latestMessage.length == 0
                  ) {
                    console.log('IFFF Latest Data 1 : ');
                    var temp = [];
                    temp.push(msgObj.data);
                    this.setState({latestMessage: temp}, () => {
                      this.props.appendRecievedMessage(msgObj);
                    });
                  } else if (
                    this.state.latestMessage.length < 3 &&
                    this.state.latestMessage.length >= 0
                  ) {
                    var temp = this.state.latestMessage;
                    console.log('ELSEEE IFFF Latest Data 2 : ' + temp.length);
                    //temp.push(msgObj.data);
                    this.setState(
                      {
                        latestMessage: [
                          ...this.state.latestMessage,
                          msgObj.data,
                        ],
                      },
                      () => {
                        this.props.appendRecievedMessage(msgObj);
                      },
                    );
                  } else {
                    console.log('ELSEEE Latest Data 3 : ');
                    if (this.state.IsEvetntDetail == true) {
                      this.state.latestMessage.splice(0, 1);
                    }
                    this.state.latestMessage.push(msgObj.data);
                    this.props.appendRecievedMessage(msgObj);
                    console.log(
                      'latestMessage length : ' +
                        this.state.latestMessage.length,
                    );
                    // for (let i = 0; i < this.state.latestMessage.length; i++) {
                    //   if (msgObj.data.uuid !== this.state.latestMessage[i].uuid) {
                    //     console.log('filtered data ===> ' + JSON.stringify(msgObj.data));
                    //     addData = false
                    //   }else{
                    //     addData = true
                    //    // break
                    //   }
                    // }
                  }
                  console.log('IFFF Latest Data : ' + this.state.latestMessage);
                },
              );

              // this.props.appendRecievedMessage(msgObj);
              // if(addData == false){
              // }
              this.setState(
                {
                  //latestMessage : this.state.latestMessage.push(msgObj.data)
                  /* message: msgObj.data.message,
                  createAtmessage: messageTimeSnap(msgObj.data.created),
                  messageType: msgObj.data.message_type,
                  tip_amount: msgObj.data.tip_amount,
                  field_username_value: msgObj.data.field_username_value,
                  picture:
                    msgObj.data.picture !== ''
                      ? msgObj.data.picture
                      : 'https://dev.gigs.live/sites/all/themes/thegigs/img/avatar.png', */
                },
                () => {
                  console.log(
                    'Rooms LIsttt sss event details msgObj ======== : ' +
                      JSON.stringify(msgObj),
                  );

                  // this.props.appendRecievedMessage(msgObj);
                },
              );
            } else {
              console.log(
                'recievd message from socket===> ' +
                  JSON.stringify(msgObj.data),
              );
            }
          }
        }
      }
    });

    console.log('token in event detail screen = ', user_token);
    this.setState(
      {
        token: user_token,
        email: user_email,
      },
      () => {
        console.log('Token IS ::: ======> ' + this.state.token);
      },
    );
  }

  //#region ->Updating flag, if user logged in or not
  async getFlagIsUserLoggedIn() {
    this.setState(
      {
        isUserLoggedIn: await this.getAsyncLoggedInFlag(),
      },
      () => {
        console.log('Login ============= ' + this.state.isUserLoggedIn);
      },
    );
  }
  async getAsyncLoggedInFlag() {
    try {
      let value = await AsyncStorage.getItem(keyConstants.IS_LOGGED_IN);
      return value;
    } catch (err) {
      console.log('err: ' + err);
    }
  }
  thisITR = () => {
    console.log('eventIntervalId Interval ');
  };
  thisITRCancel = () => {
    console.log('eventIntervalId TIME OUT ');
    // this.eventStartCountDown()
    // clearInterval(this.eventIntervalId)
    // clearTimeout(this.eventIntervalId)
  };
  cleartimeout = () => {
    this.setTimeout(eventIntervalId);
    this.setTimeout(interval);
  };
  //#endregion
  eventStartCountDown() {
    console.log(' global.istimerOn 11111 =======> : ' + global.istimerOn);
    if (global.istimerOn == true) {
      console.log(' global.istimerOn =======> : ');
      // var timer = false;
      // if(timer == false){
      // if (this.props.eventDetails !== undefined) {
      //   this.eventIntervalId = setTimeout(()=>{
      //     this.thisITR()
      //     timer = true
      //   },1000)
      //   this.interval = setTimeout (()=>{
      //     this.thisITRCancel()
      //     timer = true
      //   },5000)
      // }
      this.eventIntervalId = setTimeout(() => {
        const eventStartDate = 1000 * this.props.eventDetails.date;
        const eventStartDateEnd = 1000 * this.props.eventDetails.date_end;
        // let eventStartDate = new Date(parseInt(this.props.eventDetails.date) * 1000)
        // console.log('EventStartDate : ' + eventStartDate);
        //#region  Stop interval counter on event starts
        if (this.props.eventDetails.date !== '') {
          const flagToStopCounter = dayDiff(
            new Date().getTime(),
            eventStartDate,
          );
          const flagToStopCounterStop = dayDiff(
            new Date().getTime(),
            eventStartDateEnd,
          );
          // flag Stop dynamic
          // console.log("eventStartDate MAIN : "+this.props.eventDetails.date)
          // console.log("eventStartDateEnd MAIN  : "+this.props.eventDetails.date_end)
          // console.log("flagToStopCounter [0]: "+flagToStopCounter[0])
          // console.log("flagToStopCounter [1]: "+flagToStopCounter[1])
          // console.log("flagToStopCounter [1]: "+flagToStopCounter[2])
          // console.log("flagToStopCounterStop [0] : "+flagToStopCounterStop[0])
          // console.log("flagToStopCounterStop [1] : "+flagToStopCounterStop[1])
          // console.log("flagToStopCounterStop [1] : "+flagToStopCounterStop[2])
          // console.log("flagToStopCounterStop day1 : "+day1)
          // console.log("flagToStopCounterStop hrs1 : "+hrs1)
          // console.log("flagToStopCounterStop min1 : "+min1)
          var day1 = flagToStopCounter[0] - flagToStopCounterStop[0];
          var hrs1 = flagToStopCounter[1] - flagToStopCounterStop[1];
          var min1 = flagToStopCounter[2] - flagToStopCounterStop[2];

          // if (flagToStopCounter[0] <= 0 && flagToStopCounter[1] <= -1) {
          if (flagToStopCounter[0] <= day1 && flagToStopCounter[1] <= hrs1) {
            //this.setState({istimerOn: false})
            global.istimerOn = false;
            // if (flagToStopCounter[2] < -30) {
            if (flagToStopCounter[2] < min1) {
              console.log('flagToStopCounter -IFF: ' + flagToStopCounter[1]);
              // this.eventIntervalId = void 0
              // clearInterval(this.eventIntervalId);
              this.setState(
                {
                  isLoading: false,
                },
                () => {
                  this.StopTimerEvent(flagToStopCounter);
                },
              );
            } else if (flagToStopCounter[1] <= -2) {
              console.log(
                'flagToStopCounter -ELSEEE IFF: ' + flagToStopCounter[1],
              );
              // this.eventIntervalId = void 0
              // clearInterval(this.eventIntervalId);
              this.setState(
                {
                  isLoading: false,
                },
                () => {
                  this.StopTimerEvent(flagToStopCounter);
                },
              );
            }
          } else {
            // console.log(
            //   'flagToStopCounter -ELSEEE IFF: ' + flagToStopCounter[1],
            // );
            if (
              flagToStopCounter[0] < 1 &&
              flagToStopCounter[1] < 1 &&
              flagToStopCounter[2] < 31
            ) {
              this.setState(
                {
                  isLoading: false,

                  waitOf30MinsStarted:
                    flagToStopCounter[0] < 1 &&
                    flagToStopCounter[1] < 1 &&
                    flagToStopCounter[2] < 31,
                  time_left_to_event_start: strings.days_and_hours(
                    eventStartDate,
                    true,
                    this.state.autostartTimer,
                  ),
                },
                () => {
                  // console.log(
                  //   'waitOf30MinsStarted : ' + this.state.waitOf30MinsStarted,
                  // );
                  if (this.state.autoStartDone == false) {
                    this.setState({GettingReadyLightSmall: true}, () => {
                      this.StartAutoTimer();
                    });
                  } else {
                    this.setState(
                      {
                        GettingReadyLightSmall: false,
                        eventStarted: true,
                        liveEventCompleted: 1,
                      },
                      () => {
                        this.eventStartCountDown();
                      },
                    );
                  }
                },
              );
            } else {
              this.eventStartCountDown();
              this.setState({
                isLoading: false,
                eventStarted: false,
                time_left_to_event_start: strings.days_and_hours(
                  eventStartDate,
                  true,
                  this.state.autostartTimer,
                ),
              });
            }
            // this.setState(
            //   {
            //     eventStarted: false,
            //     isEventCompleted: false,
            //     time_left_to_event_start: strings.days_and_hours(
            //       eventStartDate,
            //       true,
            //       this.state.autostartTimer,
            //     ),
            //     waitOf30MinsStarted:
            //       flagToStopCounter[0] < 1 &&
            //       flagToStopCounter[1] < 1 &&
            //       flagToStopCounter[2] < 30,
            //   },
            //   () => {
            //     this.StartAutoTimer();
            //   },
            // );
          }
        }
        //#endregion
      }, 1000);
      // }
    }
  }

  StopTimerEvent = (flagToStopCounter) => {
    console.log('StopTimerEvent==========================StopTimerEvent ');
    this.setState(
      {
        eventStarted: false,
        GettingReadyLightSmall: false,
        liveEventCompleted: 2,
        isEventCompleted: flagToStopCounter[0] < 0,
        waitOf30MinsStarted:
          flagToStopCounter[0] < 1 &&
          flagToStopCounter[1] < 1 &&
          flagToStopCounter[2] < 30,
      },
      () => {
        console.log('IFFF 1 IFFFF');
        global.istimerOn = false;
        // clearInterval(this.eventIntervalId);
      },
    );
    // clearInterval(this.eventIntervalId);
  };
  StartAutoTimer = () => {
    console.log('StartAutoTimer==========================AUTO ');
    if (
      this.state.isLoggedIn == true &&
      this.props.eventDetails.purchased_tickets > 0 &&
      this.state.autoStartDone == false

      // &&
      // this.props.eventDetails.already_redeemed === true
    ) {
      this.setState({
        eventStarted: true,
        liveEventCompleted: 1,
        autostartTimer: true,
        firsttimeCall: true,
        isLoading: false,
      });
      if (this.state.autoStartDone === false) {
        console.log('StartAutoTimer==========================AUTO 1');
        this.stoptimer();
      } else {
        this.setState({
          GettingReadyLightSmall: false,
        });
      }
    } else {
      console.log('StartAutoTimer==========================AUTO 2');
      this.setState({
        eventStarted: true,
        liveEventCompleted: 1,
        isLoading: false,
        GettingReadyLightSmall: false,
      });
    }
  };

  // async UNSAFE_componentWillReceiveProps (nextProps) {
  async componentWillReceiveProps(nextProps) {
    // this.updateChatData();
    // console.log('componentWillReceiveProps : ' + nextProps.type);
    this.setState({isUserLoggedIn: await this.getAsyncLoggedInFlag()});
    if (nextProps.type === 'GET_ROOM_INFO_DETAIL_SUCCESS') {
      if (nextProps.getRoomInfoDetailResponse !== null) {
        console.log(
          'Particites Data : ' +
            JSON.stringify(nextProps.getRoomInfoDetailResponse.actions),
        );
        for (
          let i = 0;
          i < nextProps.getRoomInfoDetailResponse.actions.length;
          i++
        ) {
          if (nextProps.getRoomInfoDetailResponse.actions[i].title === 'Tips') {
            this.setState({
              tip_uid: nextProps.getRoomInfoDetailResponse.actions[i].uuid,
            });
          } else if (
            nextProps.getRoomInfoDetailResponse.actions[i].title === 'Clap'
          ) {
            this.setState({
              clap_uid: nextProps.getRoomInfoDetailResponse.actions[i].uuid,
            });
          } else if (
            nextProps.getRoomInfoDetailResponse.actions[i].title === 'Whistle'
          ) {
            this.setState({
              wh_uid: nextProps.getRoomInfoDetailResponse.actions[i].uuid,
            });
          } else if (
            nextProps.getRoomInfoDetailResponse.actions[i].title === 'peace'
          ) {
            this.setState({
              peace_uid: nextProps.getRoomInfoDetailResponse.actions[i].uuid,
            });
          } else if (
            nextProps.getRoomInfoDetailResponse.actions[i].title === 'rock'
          ) {
            this.setState({
              rock_uid: nextProps.getRoomInfoDetailResponse.actions[i].uuid,
            });
          } else if (
            nextProps.getRoomInfoDetailResponse.actions[i].title === 'love'
          ) {
            this.setState({
              love_uid: nextProps.getRoomInfoDetailResponse.actions[i].uuid,
            });
          } else if (
            nextProps.getRoomInfoDetailResponse.actions[i].title === 'lit'
          ) {
            this.setState({
              lit_uid: nextProps.getRoomInfoDetailResponse.actions[i].uuid,
            });
          } else if (
            nextProps.getRoomInfoDetailResponse.actions[i].title === 'nostalgic'
          ) {
            this.setState({
              nostalgic_uid:
                nextProps.getRoomInfoDetailResponse.actions[i].uuid,
            });
          }
        }
        this.setState(
          {
            total_participant: Object.keys(
              nextProps.getRoomInfoDetailResponse.participants,
            ).length,
            // participants: nextProps.getRoomInfoDetailResponse.participants,
            participants: Object.values(
              nextProps.getRoomInfoDetailResponse.participants,
            ),
          },
          () => {
            //console.log("all participant in global " + JSON.stringify(this.state.total_participant))
            //this.stoptimer()
          },
        );
      }
    } else if (nextProps.type === 'SEND_MODRATE_SAGA_SUCCESS') {
      console.log('EventDetail Rooom Will nextProps.type : ' + nextProps.modrateOrigin);
      console.log('EventDetail Rooom Will this.props.type : ' + this.props.modrateOrigin);
      // if (this.props.type != nextProps.type) {
        if (nextProps.modrateOrigin == "EventDetailRoom") {
      // if (this.props.eventType == nextProps.eventType) {
        if (nextProps.senduserModrate !== null) {
          this.setState({GettingReadyLightSmall: false}, () => {
            this.props.modrateUserClear()
            this.RBSheetReport.close();
            showToast('Thanks for your submission!');
            // if (this.state.repoertMessageVal == 1) {
            // } else {
            //   showToast('Thanks for your submission!');
            // }
          });
        }
      }
    }
    if (nextProps.eventType === 'EVENTDETAIL_USERDATA_SUCCESS') {
      if (this.props.eventType == nextProps.eventType) {
        const eventStartDate = 1000 * nextProps.eventDetails.date;
        if (nextProps.eventDetails.artist.past_events.length > 0) {
          this.setState({upperTab: 0});
        } else if (nextProps.eventDetails.artist.videos.length > 0) {
          this.setState({upperTab: 1});
        } else if (nextProps.eventDetails.artist.gallery.length > 0) {
          this.setState({upperTab: 2});
        }
        var data = strings.days_and_hours(eventStartDate, true);
        //if (data[2].split('-') !== undefined) {
        var data = {
          pageid: 'EventDetail',
          pagetypeid: 'event',
          metric: 'visits', //visits /select
          value: 'click',
          title: `${nextProps.eventDetails.title}`,
          ticket: '', //{ticket-type}
          customparam: '', //{play:1,stop:0,pause:0}
        };
        // TrackingApp(data);
        console.log('');
        //var spilt_data = data[2].split('-')[0]
        console.log('time data willreceive ===== > ' + data[2]);
        // this.handelAPIStart(data)
        console.log('global.istimerOn 2 : ');
        console.log(
          'this.state.IsEvetntDetail  global.istimerOn 2 : ' +
            this.state.IsEvetntDetail,
        );
        if (this.state.IsEvetntDetail == true) {
          global.istimerOn = true;
          this.eventStartCountDown();
        }
        // if (
        //   data[1] === 0 &&
        //   data[2] <= 30 &&
        //   this.state.isUserLoggedIn &&
        //   nextProps.eventDetails.purchased_tickets > 0
        // ) {
        //   this.setState(
        //     {
        //       autostartTimer: true,
        //     },
        //     () => {
        //       this.stoptimer();
        //       if (data[1] === 0 && this.state.second === 0) {
        //         //this.fullScreen('start');
        //         //return
        //       }
        //     },
        //   );
        // } else if (data[2] < 0) {
        //   // console.log("time data willreceive ===== 22 > " + data[2].split('-'))
        //   console.log('time data willreceive ===== 23 > ' + this.state.second);
        //   this.setState(
        //     {
        //       autostartTimer: true,
        //     },
        //     () => {
        //       //global.currentTime = data[2].split('-')[1]
        //       this.stoptimer();
        //       if (this.state.second === 0) {
        //         //this.fullScreen('start');
        //         //return
        //       }
        //     },
        //   );
        // }
        //}
      }
    } else if (nextProps.eventType === actionType.VALID_TICKET_SUCCESS) {
      if (nextProps.eventType === this.props.eventType) {
        console.log(
          'Here is in will update nextProps.eventType nextProps.eventType ',
          nextProps.eventType,
        );

        // console.log('Here is in will update ', nextProps.eventType);

        if (Array.isArray(nextProps.validTicketData)) {
          this.setState(
            {
              valid_ticket: nextProps.validTicketData[0],
            },
            () => {
              this.setState({
                error_msg:
                  'You entered an invalid ticket code, please check the code and try again.',
              });
              showToast(
                'You entered an invalid ticket code, please check the code and try again.',
                'warning',
              );
              this.props.validTicketClear();
            },
          );
        } else {
          this.setState(
            {
              valid_ticket_data: nextProps.validTicketData,
            },
            async () => {
              console.log(
                'here is data from valid_ticket_data ===> ' +
                  JSON.stringify(this.state.valid_ticket_data),
              );
              if (this.state.valid_ticket_data !== null) {
                console.log(
                  'this.state.valid_ticket_data : ' +
                    this.state.valid_ticket_data.status,
                );
                var status = parseInt(this.state.valid_ticket_data.status);
                console.log('this.state.valid_ticket_data : ' + typeof status);
                console.log('this.state.valid_ticket_data : ' + status);
                // if(this.state.valid_ticket_data.status > 0)
                if (this.state.liveEventCompleted == 1) {
                  if (status > 0) {
                    this.setState({error_msg: ''}, () => {
                      this.startWatchingVideo();
                      this.startWatchingVideoNOLogin();
                    });
                  } else {
                    this.setState({
                      error_msg: `Your code has expired because it’s already used on another device. If you think there is an error, please contact us using chat or email contact@gigs.live`,
                    });
                  }
                } else if (this.state.liveEventCompleted == 2) {
                  if (status > 0) {
                    this.setState({error_msg: ''}, () => {
                      // this.startWatchingVideo();
                      this.startWatchingVideoNOLogin();
                    });
                  } else {
                    this.setState({
                      error_msg: `Your code has expired because it’s already used on another device. If you think there is an error, please contact us using chat or email contact@gigs.live`,
                    });
                  }
                } else {
                  this.setState({
                    error_msg: `You have a valid ticket, Doors open at ${getFormattedDate(
                      this.props.eventDetails.date,
                    )}`,
                  });
                  showToast(
                    `You have a valid ticket, Doors open at ${getFormattedDate(
                      this.props.eventDetails.date,
                    )}`,
                  );
                  // this.reload();
                }
              } else {
                showToast('Your code is wrong');
              }
            },
          );
        }
      }
    }

    // else if (nextProps.type == 'GET_CHAT_ROOM_LIST_SUCCESS') {
    // console.log("GET_CHAT_ROOM_LIST_SUCCESS Data : "+nextProps.type)
    //   if (nextProps.getChatListData !== undefined) {
    //     /* console.log(
    //       'Rooms LIsttt sss event details======= 2 = : ' +
    //         JSON.stringify(nextProps.getChatListData),
    //     ); */
    //     if (nextProps.getChatListData.messages.length !== 0) {
    //       var size = nextProps.getChatListData.messages.length;
    //       console.log(
    //         'New Data :::: ' +
    //           JSON.stringify(nextProps.getChatListData.messages),
    //       );
    //       if (nextProps.getChatListData.messages.length > 3) {
    //         if (global.selectedRoom1 !== 'globle') {
    //           messageContainer = [];
    //           messageContainer.push(
    //             nextProps.getChatListData.messages.slice(1).slice(-3),
    //           );
    //         } else {
    //           messageContainer.push(
    //             nextProps.getChatListData.messages.slice(1).slice(-3),
    //           );
    //         }
    //       } else {
    //         if (global.selectedRoom1 !== 'globle') {
    //           messageContainer = [];
    //           messageContainer.push(nextProps.getChatListData.messages);
    //         } else {
    //           messageContainer.push(nextProps.getChatListData.messages);
    //         }
    //       }

    //       console.log(
    //         'Rooms LIsttt sss event details 1 ======== : ' +
    //           JSON.stringify(messageContainer),
    //       );
    //       this.setState(
    //         {
    //           latestMessage: messageContainer[0],
    //         },
    //         () => {
    //           console.log(
    //             'Rooms LIsttt sss event details 2 ======== : ' +
    //               JSON.stringify(this.state.latestMessage),
    //           );
    //         },
    //       );
    //       // this.setState(
    //       //   {
    //       //     /*  message: nextProps.getChatListData.messages[size - 1].message,
    //       //     createAtmessage:
    //       //       nextProps.getChatListData.messages[size - 1].created,
    //       //     messageType:
    //       //       nextProps.getChatListData.messages[size - 1].message_type,
    //       //     tip_amount:
    //       //       nextProps.getChatListData.messages[size - 1].tip_amount,
    //       //     field_username_value:
    //       //       nextProps.getChatListData.messages[size - 1]
    //       //         .field_username_value,
    //       //     picture: nextProps.getChatListData.messages[size - 1].picture, */
    //       //   },
    //       //   () => {
    //       //     /*  for(let i = 1; i <= 3 ; i++){

    //       //      var mesgData ={
    //       //       message: nextProps.getChatListData.messages[size - i].message,
    //       //     createAtmessage:
    //       //       nextProps.getChatListData.messages[size - i].created,
    //       //     messageType:
    //       //       nextProps.getChatListData.messages[size - i].message_type,
    //       //     tip_amount:
    //       //       nextProps.getChatListData.messages[size - i].tip_amount,
    //       //     field_username_value:
    //       //       nextProps.getChatListData.messages[size - i]
    //       //         .field_username_value,
    //       //     picture: nextProps.getChatListData.messages[size - i].picture,
    //       //       }
    //       //     } */
    //       //     // if (nextProps.getChatListData.messages.length > 3) {
    //       //     //   if (global.selectedRoom1 !== 'globle') {
    //       //     //     messageContainer = [];
    //       //     //     messageContainer.push(
    //       //     //       nextProps.getChatListData.messages.slice(1).slice(-3),
    //       //     //     );
    //       //     //   } else {
    //       //     //     messageContainer.push(
    //       //     //       nextProps.getChatListData.messages.slice(1).slice(-3),
    //       //     //     );
    //       //     //   }
    //       //     // } else {
    //       //     //   if (global.selectedRoom1 !== 'globle') {
    //       //     //     messageContainer = [];
    //       //     //     messageContainer.push(nextProps.getChatListData.messages);
    //       //     //   } else {
    //       //     //     messageContainer.push(nextProps.getChatListData.messages);
    //       //     //   }
    //       //     // }

    //       //     // console.log(
    //       //     //   'Rooms LIsttt sss event details 1 ======== : ' +
    //       //     //     JSON.stringify(messageContainer),
    //       //     // );
    //       //     // this.setState(
    //       //     //   {
    //       //     //     latestMessage: messageContainer[0],
    //       //     //   },
    //       //     //   () => {
    //       //     //     console.log(
    //       //     //       'Rooms LIsttt sss event details 2 ======== : ' +
    //       //     //         JSON.stringify(this.state.latestMessage),
    //       //     //     );
    //       //     //   },
    //       //     // );

    //       //     /* console.log(
    //       //       'New event detail ======= > ' +
    //       //       JSON.stringify(this.props.eventDetails),
    //       //     ); */
    //       //   },
    //       // );
    //     } else {
    //       console.log(
    //         'Rooms LIsttt sss event detail length ======== : ' +
    //           JSON.stringify(nextProps.getChatListData.messages.length),
    //       );
    //       this.setState(
    //         {
    //           message: '',
    //           createAtmessage: '',
    //           messageType: '',
    //           tip_amount: 0,
    //           field_username_value: '',
    //           picture:
    //             'https://themindsetproject.com.au/wp-content/uploads/2017/08/avatar-icon.png',
    //         },
    //         () => {
    //           this.setState(
    //             {
    //               latestMessage: null,
    //             },
    //             () => {
    //               console.log(
    //                 'Rooms LIsttt sss event details======== : ' +
    //                   JSON.stringify(this.state.latestMessage),
    //               );
    //             },
    //           );
    //           //console.log('Rooms LIsttt sss event details======== : ' + JSON.stringify(this.state.messageType));
    //         },
    //       );
    //     }
    //     //console.log('Rooms LIsttt sss event details======== : ' + JSON.stringify(nextProps.getChatListData.messages[size - 1]));
    //   }
    // }
    /* else if(nextProps.eventType === 'SEND_NEW_MESSAGE_SUCCESS'){
      console.log('message send successfully ========> : ' + JSON.stringify(nextProps.sendNewMessageResponse));
      var ref = this.props.navigation.state.params.endpoint;
      var endPoint = ref.substring(4);
        var uuid = endPoint.split('/');
        //this.props.GetRoomList(uuid[1]);
        this.props.getChatList(uuid[1], global.selectedRoom);
    }
    if(nextProps.type === 'ADD_COMMENT_TO_CHAT_SUCCESS'){
      console.log('message send successfully tips ========> : ' + JSON.stringify(nextProps.addComment));
    } */
    else if (nextProps.eventType === 'GET_ROOM_LIST_SUCCESS') {
      if (nextProps.getRoomListResponse) {
        console.log(
          'Rooms LIsttt sss event details ++++++++++++ ========== : ' +
            JSON.stringify(this.props.getRoomListResponse),
        );
      }
    } else if (nextProps.eventType === 'FOLLOW_UNFOLLOW_ARTIST_SUCCESS_EDS') {
      console.log('FOLLOW_UNFOLLOW_ARTIST_SUCCESS_EDS ::: ');
      this.setState({followBtn: false});
    }
    if (nextProps.type == 'GET_CHAT_ROOM_LIST_SUCCESS') {
      console.log(
        'GET_CHAT_ROOM_LIST_SUCCESS Data : ' +
          JSON.stringify(nextProps.getChatListData.actions),
      );
      if (nextProps.getChatListData !== undefined) {
        /* console.log(
            'Rooms LIsttt sss event details======= 2 = : ' +
              JSON.stringify(nextProps.getChatListData),
          ); */
        for (let i = 0; i < nextProps.getChatListData.actions.length; i++) {
          {
            if (nextProps.getChatListData.actions[i].title === 'Tips') {
              this.setState({
                tip_uid: nextProps.getChatListData.actions[i].uuid,
              });
            } else if (nextProps.getChatListData.actions[i].title === 'Clap') {
              this.setState({
                clap_uid: nextProps.getChatListData.actions[i].uuid,
              });
            } else if (
              nextProps.getChatListData.actions[i].title === 'Whistle'
            ) {
              this.setState({
                wh_uid: nextProps.getChatListData.actions[i].uuid,
              });
            } else if (nextProps.getChatListData.actions[i].title === 'peace') {
              this.setState({
                peace_uid: nextProps.getChatListData.actions[i].uuid,
              });
            } else if (nextProps.getChatListData.actions[i].title === 'rock') {
              this.setState({
                rock_uid: nextProps.getChatListData.actions[i].uuid,
              });
            } else if (nextProps.getChatListData.actions[i].title === 'love') {
              this.setState({
                love_uid: nextProps.getChatListData.actions[i].uuid,
              });
            } else if (nextProps.getChatListData.actions[i].title === 'lit') {
              this.setState({
                lit_uid: nextProps.getChatListData.actions[i].uuid,
              });
            } else if (
              nextProps.getChatListData.actions[i].title === 'nostalgic'
            ) {
              this.setState({
                nostalgic_uid: nextProps.getChatListData.actions[i].uuid,
              });
            }
          }
        }
        if (nextProps.getChatListData.messages.length !== 0) {
          var size = nextProps.getChatListData.messages.length;
          /*  console.log(
             'New Data :::: ' +
               JSON.stringify(nextProps.getChatListData.messages),
           ); */
          if (nextProps.getChatListData.messages.length > 3) {
            if (global.selectedRoom1 !== 'globle') {
              messageContainer = [];
              messageContainer.push(
                nextProps.getChatListData.messages.slice(1).slice(-3),
              );
            } else {
              messageContainer.push(
                nextProps.getChatListData.messages.slice(1).slice(-3),
              );
            }
          } else {
            if (global.selectedRoom1 !== 'globle') {
              messageContainer = [];
              messageContainer.push(nextProps.getChatListData.messages);
            } else {
              messageContainer.push(nextProps.getChatListData.messages);
            }
          }

          console.log(
            'Rooms LIsttt sss event details 1 ======== : ' +
              JSON.stringify(messageContainer),
          );
          this.setState(
            {
              latestMessage: messageContainer[0],
            },
            () => {
              console.log(
                'Rooms LIsttt sss event details 2 ======== : ' +
                  JSON.stringify(this.state.latestMessage),
              );
            },
          );
          // this.setState(
          //   {
          //     /*  message: nextProps.getChatListData.messages[size - 1].message,
          //     createAtmessage:
          //       nextProps.getChatListData.messages[size - 1].created,
          //     messageType:
          //       nextProps.getChatListData.messages[size - 1].message_type,
          //     tip_amount:
          //       nextProps.getChatListData.messages[size - 1].tip_amount,
          //     field_username_value:
          //       nextProps.getChatListData.messages[size - 1]
          //         .field_username_value,
          //     picture: nextProps.getChatListData.messages[size - 1].picture, */
          //   },
          //   () => {
          //     /*  for(let i = 1; i <= 3 ; i++){

          //      var mesgData ={
          //       message: nextProps.getChatListData.messages[size - i].message,
          //     createAtmessage:
          //       nextProps.getChatListData.messages[size - i].created,
          //     messageType:
          //       nextProps.getChatListData.messages[size - i].message_type,
          //     tip_amount:
          //       nextProps.getChatListData.messages[size - i].tip_amount,
          //     field_username_value:
          //       nextProps.getChatListData.messages[size - i]
          //         .field_username_value,
          //     picture: nextProps.getChatListData.messages[size - i].picture,
          //       }
          //     } */
          //     // if (nextProps.getChatListData.messages.length > 3) {
          //     //   if (global.selectedRoom1 !== 'globle') {
          //     //     messageContainer = [];
          //     //     messageContainer.push(
          //     //       nextProps.getChatListData.messages.slice(1).slice(-3),
          //     //     );
          //     //   } else {
          //     //     messageContainer.push(
          //     //       nextProps.getChatListData.messages.slice(1).slice(-3),
          //     //     );
          //     //   }
          //     // } else {
          //     //   if (global.selectedRoom1 !== 'globle') {
          //     //     messageContainer = [];
          //     //     messageContainer.push(nextProps.getChatListData.messages);
          //     //   } else {
          //     //     messageContainer.push(nextProps.getChatListData.messages);
          //     //   }
          //     // }

          //     // console.log(
          //     //   'Rooms LIsttt sss event details 1 ======== : ' +
          //     //     JSON.stringify(messageContainer),
          //     // );
          //     // this.setState(
          //     //   {
          //     //     latestMessage: messageContainer[0],
          //     //   },
          //     //   () => {
          //     //     console.log(
          //     //       'Rooms LIsttt sss event details 2 ======== : ' +
          //     //         JSON.stringify(this.state.latestMessage),
          //     //     );
          //     //   },
          //     // );

          //     /* console.log(
          //       'New event detail ======= > ' +
          //       JSON.stringify(this.props.eventDetails),
          //     ); */
          //   },
          // );
        } else {
          console.log(
            'Rooms LIsttt sss event detail length ======== : ' +
              JSON.stringify(nextProps.getChatListData.messages.length),
          );
          this.setState(
            {
              message: '',
              createAtmessage: '',
              messageType: '',
              tip_amount: 0,
              field_username_value: '',
              picture:
                'https://themindsetproject.com.au/wp-content/uploads/2017/08/avatar-icon.png',
            },
            () => {
              this.setState(
                {
                  latestMessage: null,
                },
                () => {
                  console.log(
                    'Rooms LIsttt sss event details======== : ' +
                      JSON.stringify(this.state.latestMessage),
                  );
                },
              );
              //console.log('Rooms LIsttt sss event details======== : ' + JSON.stringify(this.state.messageType));
            },
          );
        }
        //console.log('Rooms LIsttt sss event details======== : ' + JSON.stringify(nextProps.getChatListData.messages[size - 1]));
      }
    }
    if (nextProps.type === this.props.type) {
      if (nextProps.type === 'LEAVE_ROOM_BEGIN') {
      } else if (nextProps.type === 'LEAVE_ROOM_SUCCESS') {
        if (nextProps.deleteroomAction == true) {
          showToast('You successfully left this room');
          this.props.deleteApiBlank();
          global.selectedRoom = 'global';
          global.selectedRoom1 = 'global';
          this.reload();
          // this.onCloseChat();
        }
      } else if (nextProps.type === 'LEAVE_ROOM_FAILED') {
      } else if (nextProps.type === 'DELETE_ROOM_BEGIN') {
      } else if (nextProps.type === 'DELETE_ROOM_SUCCESS') {
        // global.selectedRoom = 'global'
        if (nextProps.deleteroomAction == true) {
          showToast('You successfully remove this room');
          global.selectedRoom = 'global';
          global.selectedRoom1 = 'global';
          this.props.deleteApiBlank();
          this.reload();
        }
        // this.onCloseChat();
      } else if (nextProps.type === 'DELETE_ROOM_FAILED') {
      }
    }
    if (nextProps.eventType === 'WATCHLIST_UNWATCHLIST_EVENT_SUCCESS') {
      this.setState({GettingReadyLightSmall: false});
    }
  }

  async startWatchingVideo() {
    await this.getAsyncLoggedInFlag().then((flag) => {
      if (!JSON.parse(flag)) {
        this.RBSheet.open();
      } else {
        this.fullScreen('start');
      }
    });
  }
  startWatchingVideoNOLogin() {
    Orientation.lockToLandscapeLeft();
    this.fullScreen('start');
  }

  UNSAFE_componentWillMount() {
    this.setState({
      isReady: false,
    });
    // clearInterval(this.eventIntervalId);
    // clearInterval(this.interval);
    // Clearing Event to start -> Interval for showing count down ie. 3 Days 23 Hours 30 Minutes
    // BackHandler.removeEventListener("hardwareBackPress", this.backToScreen);
    // this.removeBackHandler();
  }
  // UNSAFE_componentWillUnmount() {
  //   this.backToScreen()
  //   global.currentTime = 0;
  //   global.istimerOn = false;
  //   clearInterval(this.eventIntervalId);
  // }
  UNSAFE_componentWillUnmount() {
    this.backToScreen();
    global.currentTime = 0;
    global.istimerOn = false;
    clearInterval(this.eventIntervalId);
  }

  check_login = async () => {
    console.log('here is tag ==== > ' + JSON.stringify(this.state.tag));
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
    //console.log('Event data = ',this.props.eventDetails.tickets)
    if (isLoggedIn) {
      // this.props.EventDetailsBuyTicket();
      this.RBSheet.close();
      console.log('Event data = ', this.state.eventUUID);

      var ticketData_array = [];
      for (
        let i = 0;
        i < Object.values(this.props.eventDetails.tickets).length;
        i++
      ) {
        console.log(
          'Ticket Data Date TO : ' + this.props.eventDetails.tickets[i].date_to,
        );
        var ticketData = {
          concertName: this.props.eventDetails.title,
          id: this.props.eventDetails.tickets[i].id,
          tickettype: this.props.eventDetails.tickets[i].ticket_type,
          description: this.props.eventDetails.tickets[i].description,
          image: this.props.eventDetails.tickets[i].image,
          price: this.props.eventDetails.tickets[i].price,
          left: this.props.eventDetails.tickets[i].left,
          merchandise_title: this.props.eventDetails.tickets[i]
            .merchandise_title,
          merchandise_options: this.props.eventDetails.tickets[i]
            .merchandise_options,
          merchandise_image: this.props.eventDetails.tickets[i]
            .merchandise_image,
          clicks: 0,
          dateTime: this.props.eventDetails.date,
          dateTo: this.props.eventDetails.tickets[i].date_to,
          dateFrom: this.props.eventDetails.tickets[i].date_from,
        };
        ticketData_array.push(ticketData);
      }
      console.log('ticket Object data = ', ticketData);
      console.log(
        'ticket Object data DATE ++++++++= ',
        this.props.eventDetails.date,
      );
      var input = this.props.navigation.state.params.endpoint;
      var fields = input.split('/');
      //var name = fields[0];
      var eventID = fields[2];
      console.log('event Endpoint', eventID);
      this.setState({IsEvetntDetail: false}, () => {
        this.props.navigation.navigate('TicketFlowScreen', {
          ticketData: ticketData_array,
          event_id: eventID,
          event_id_new: this.state.event_id_new,
        });
      });
    } else {
      this.RBSheet.close();
      this.setState({IsEvetntDetail: false}, () => {
        this.props.navigation.navigate('LoginScreen');
      });
    }
  };

  gotoLogin = () => {
    this.setState({login: true});
    this.RBSheet.close();
    this.RBSheetStartWatching.close();
    // this.RBSheetStartWatching.
    this.setState({IsEvetntDetail: false}, () => {
      this.props.navigation.navigate(navigationKeys.create_new_account_screen);
    });
  };

  gotoRegister = () => {
    this.setState({login: true});
    this.RBSheetStartWatching.close();
    this.setState({IsEvetntDetail: false}, () => {
      this.props.navigation.navigate(navigationKeys.create_new_account_screen);
    });
  };

  BuyTicket = async (ref) => {
    // this.props.navigation.navigate('TicketFlowScreen',{eventDetail:false})
    this.setState({loadingPage: true}, async () => {
      var endPointNew = ref.substring(4);
      // alert("Buy Ticket"+refVal[2])
      var data = {
        endpoint: endPointNew,
        baseUrlNew: 'new',
        debug: true,
      };
      var eventDetail = await APICALL_v1(data);
      this.buyTicketScreen(eventDetail, endPointNew);
    });
  };
  buyTicketScreen = async (data, eventID) => {
    console.log(
      'EVENTDETAIL_USERDATA_SUCCESS : ' + JSON.stringify(data.tickets),
    );

    var isLoggedIn;
    await AsyncStorage.getItem('isLoggedIn', (err, value) => {
      if (err) {
        console.log(err);
      } else {
        isLoggedIn = JSON.parse(value);
      }
    });

    if (!isLoggedIn) {
      this.setState({tag: 'Login to Buy Tickets'}, () => {
        this.RBSheet.open();
      });
    } else {
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
      // global.istimerOn = false
      this.setState({loadingPage: false, IsEvetntDetail: false}, () => {
        this.props.navigation.navigate('TicketFlowScreen', {
          ticketData: ticketData_array,
          event_id: event[1],
        });
      });
    }
  };
  openSheet = async () => {
    console.log('Call openSheet');
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
    console.log('Event data = opensheet ', this.props.eventDetails.tickets);
    if (!isLoggedIn) {
      this.setState({tag: 'Login to Buy Tickets'}, () => {
        this.RBSheet.open();
      });
    } else {
      global.istimerOn = false;
      var ticketData_array = [];
      for (
        let i = 0;
        i < Object.values(this.props.eventDetails.tickets).length;
        i++
      ) {
        var ticketData = {
          concertName: this.props.eventDetails.title,
          event_id_new: this.props.eventDetails.event_id,
          id: this.props.eventDetails.tickets[i].id,
          tickettype: this.props.eventDetails.tickets[i].ticket_type,
          description: this.props.eventDetails.tickets[i].description,
          image: this.props.eventDetails.tickets[i].image,
          price: this.props.eventDetails.tickets[i].price,
          left: this.props.eventDetails.tickets[i].left,
          merchandise_title: this.props.eventDetails.tickets[i]
            .merchandise_title,
          merchandise_options: this.props.eventDetails.tickets[i]
            .merchandise_options,
          merchandise_image: this.props.eventDetails.tickets[i]
            .merchandise_image,
          clicks: 0,
          dateTime: this.props.eventDetails.date,
          dateTo: this.props.eventDetails.tickets[i].date_to,
          dateFrom: this.props.eventDetails.tickets[i].date_from,
        };
        ticketData_array.push(ticketData);
      }
      console.log('ticket Object data = ', ticketData);
      console.log(
        'ticket Object data DATE ++++++++= ',
        this.props.eventDetails.date,
      );
      var input = this.props.navigation.state.params.endpoint;
      var fields = input.split('/');
      //var name = fields[0];
      var eventID = fields[2];
      console.log('event Endpoint', eventID);
      this.setState({IsEvetntDetail: false}, () => {
        this.props.navigation.navigate('TicketFlowScreen', {
          ticketData: ticketData_array,
          event_id: eventID,
        });
      });
    }
  };

  closeSheet = () => {
    this.RBSheet.close();
    this.setState({followBtn: false});
  };

  openChat = async () => {
    console.log('====> atg ==' + JSON.stringify(this.props.eventDetails));
    await this.getAsyncLoggedInFlag().then((flag) => {
      console.log('====> atg  flagf ==' + flag);
      console.log('====> atg  flagf ==' + typeof flag);
      if (!JSON.parse(flag)) {
        this.setState(
          {
            // tag: 'login',
            tag: 'Chat',
          },
          () => {
            console.log('====> IFFF ==');
            this.RBSheet.open();
          },
        );
      } else {
        //global.selectedRoom = 'global';
        if (this.props.eventDetails.purchased_tickets > 0) {
          this.setState({IsEvetntDetail: false}, () => {
            global.istimerOn = false;
            console.log('global.istimerOn ==' + global.istimerOn);
            this.props.navigation.navigate(navigationKeys.chat_room_screen, {
              uuid: this.state.uuid,
            });
          });
        } else {
          this.setState(
            {
              tag: 'Buy Tickets',
            },
            () => {
              console.log('====> ELSEEE ==');
              this.RBSheet.open();
            },
          );
        }
      }
    });
  };

  changeUpperTab = (index) => {
    this.setState({upperTab: index});
  };

  changeLowerTab = (index) => {
    this.setState({lowerTab: index});
  };

  FollowUnfollowArtist = async () => {
    if (this.state.followBtn == false) {
      this.setState({followBtn: true, disabledFollow: true}, async () => {
        const headers = await getLoggedInUserDataObject().then((data) => {
          if (!data) {
            this.setState({tag: 'Follow'}, () => {
              this.RBSheet.open();
            });
          } else {
            var token = data.token;
            return {
              'Content-Type': 'application/json',
              'X-CSRF-Token': token,
            };
          }
        });
        const userData = await getLoggedInUserDataObject();
        console.log('USER DATA : ', userData);
        await this.getAsyncLoggedInFlag().then((flag) => {
          if (!flag) {
            this.RBSheet.open();
          } else {
            const data = {
              headers: headers,
              body: {
                flag_name: 'follow',
                entity_uuid: splitEndPoint(this.props.eventDetails.artist.ref),
                action: this.props.isArtistFollowedEDS ? 'unflag' : 'flag',
                uid: userData.user.uid,
                skip_permission_check: false,
              },
            };
            console.log('FOllow : ', data);
            this.props.FollowUnfollowArtist(data);
            this.setState({disabledFollow: false});
          }
        });
      });
    }
  };

  WatchlistUnwatchlistEvent = async () => {
    console.log(
      'here is user from login data ===' + JSON.stringify(this.state.userData),
    );
    const headers = await getLoggedInUserDataObject().then((data) => {
      var token = data.token;
      return {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
      };
    });
    const userData = await getLoggedInUserDataObject();
    await this.getAsyncLoggedInFlag().then((flag) => {
      if (!flag) {
        this.RBSheet.open();
      } else {
        this.setState({GettingReadyLightSmall: true}, () => {
          const data = {
            headers: headers,
            body: {
              flag_name: 'watchlist',
              entity_uuid: splitEndPoint(
                this.props.navigation.state.params.endpoint,
              ),
              action: this.props.isAddedToWatchlist ? 'unflag' : 'flag',
              uid: userData.user.uid,
              skip_permission_check: false,
            },
          };
          this.props.WatchlistUnwatchlistEvent(data);
        });
      }
    });
  };

  sendInvitation = async () => {
    console.log('sendInvitation');
    let userdata = await AsyncStorage.getItem('loginData');
    let user_token = JSON.parse(userdata).token;
    // let user_token = await AsyncStorage.getItem('token');
    console.log('GEt Token Data : ' + userdata);
    console.log('GEt Token Data : ' + user_token);
    // let user_token = JSON.parse(userdata).token;
    if (this.state.inviteeEmail === '') {
      this.setState({
        emptyEmail: true,
      });
      showToast('Please enter valid email to invite', 'warning');
    } else if (!validateEmail(this.state.inviteeEmail)) {
      this.setState({
        error: true,
      });
      showToast(
        'Invalid email address, please use valid email address to invite',
        'warning',
      );
    } else {
      this.setState({
        emptyEmail: false,
      });
      const data = {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': user_token,
        },
        body: {
          mail: this.state.inviteeEmail,
          event: splitEndPoint(this.props.navigation.state.params.endpoint),
        },
      };
      this.props.InviteUser(data);
    }
  };

  goToEventDetailScreen = (endpointEventDetailApi) => {
    this.props.navigation.push('EventDetailScreen', {
      endpoint: endpointEventDetailApi,
    });
  };
  goToVOD = (endpointVODDetailApi) => {
    console.log('Event UUID : ' + endpointVODDetailApi);
    this.props.navigation.push('VODScreen', {
      videoId: endpointVODDetailApi,
    });
  };

  //#region -> Video Player dependencies
  fullScreen = (value) => {
    // global.currentRoute = ''
    // console.log('global.currentRoute' + global.currentRoute);
    console.log('fullScreen :: ' + value);
    if (
      global.currentRoute == 'HomeScreen' ||
      global.currentRoute == 'EventListing' ||
      global.currentRoute == ''
    ) {
      global.istimerOn = false;
      if (value === 'start') {
        this.setState(
          {
            isLoading: false,
            fullScreen: !this.state.fullScreen,
            expand: !this.state.expand,
            isVidePlayerOff: !this.state.isVidePlayerOff,
            showModal: !this.state.showModal,
            fullScreenModeON: !this.state.fullScreenModeON,
          },
          () => {
            console.log('Expand full button -', this.state.expand);
            console.log(
              'full screen full button -',
              this.state.fullScreenModeON,
            );
            if (this.state.fullScreen) {
              Orientation.lockToLandscapeLeft();
            } else {
              Orientation.lockToPortrait();
            }
          },
        );
      } else {
        this.setState(
          {
            fullScreen: !this.state.fullScreen,
            expand: !this.state.expand,
            isVidePlayerOff: !this.state.isVidePlayerOff,
            showModal: !this.state.showModal,
            fullScreenModeON: !this.state.fullScreenModeON,
            fullScreenClick: !this.state.fullScreenClick,
          },
          () => {
            console.log('Expand full button -', this.state.expand);
            console.log(
              'full screen full button -',
              this.state.fullScreenModeON,
            );
            console.log('fullscreen  -', this.state.fullScreen);
            console.log('isVidePlayerOff -', this.state.isVidePlayerOff);
            console.log('MOdel button -', this.state.showModal);
            console.log(
              'full screen full click button -',
              this.state.fullScreenClick,
            );
            /**
             *    gigs is full screen = true
  [Wed Jan 20 2021 16:56:23.396]  LOG      Expand full button - true
  [Wed Jan 20 2021 16:56:23.397]  LOG      full screen full button - false
  [Wed Jan 20 2021 16:56:23.426]  LOG      fullscreen  - false
  [Wed Jan 20 2021 16:56:23.427]  LOG      isVidePlayerOff - true
  [Wed Jan 20 2021 16:56:23.428]  LOG      MOdel button - false
  [Wed Jan 20 2021 16:56:23.429]  LOG      full screen full click button - true
             */
            if (this.state.fullScreen) {
              Orientation.lockToLandscapeLeft();
            } else {
              Orientation.lockToPortrait();
            }
          },
        );
      }
    }
  };

  backToScreen = () => {
    console.log('back to screen', this.state.fullScreen);
    if (this.state.fullScreen === true) {
      this.setState(
        {
          fullScreen: !this.state.fullScreen,
          expand: !this.state.expand,
          isVidePlayerOff: !this.state.isVidePlayerOff,
          showModal: !this.state.showModal,
          fullScreenModeON: !this.state.fullScreenModeON,
          fullScreenClick: false,
        },
        () => {
          console.log('Expand', this.state.expand);

          if (this.state.fullScreen === false) {
            Orientation.lockToPortrait();
            global.istimerOn = true;
            this.eventStartCountDown();
          } /* else{
            Orientation.lockToLandscapeLeft();
          } */
        },
      );
    } else {
      console.log('back to screen ELSE');
      this.setState(
        {
          fullScreen: !this.state.fullScreen,
          expand: !this.state.expand,
          isVidePlayerOff: !this.state.isVidePlayerOff,
          showModal: !this.state.showModal,
          fullScreenModeON: !this.state.fullScreenModeON,
          fullScreenClick: false,
        },
        () => {
          this.props.navigation.goBack(null);
        },
      );
    }
  };
  onClose = () => {
    this.setState(
      {
        fullScreen: false,
        showModal: false,
        fullScreenModeON: false,
        fullScreenClick: false,
        expand: true,
        isVidePlayerOff: true,
        miniplay: true,
      },
      () => {
        // this.state.miniplay;
      },
    );
  };
  clickToMiniplayer = () => {
    if (this.state.fullScreen === false) {
      this.setState(
        {
          miniplay: !this.state.miniplay,
          fullScreen: false,
          expand: true,
          isVidePlayerOff: true,
          showModal: false,
          fullScreenModeON: false,
          fullScreenClick: !this.state.fullScreenClick,
        },
        () => {
          console.log('full screen', this.state.fullScreenClick);
          if (this.state.fullScreen === false) {
            // this.player.onPause();
            Orientation.lockToPortrait();
          } else {
            Orientation.lockToLandscapeLeft();
          }
        },
      );
    } else {
      this.setState(
        {
          miniplay: !this.state.miniplay,
          fullScreen: false,
          expand: true,
          isVidePlayerOff: true,
          showModal: false,
          fullScreenModeON: false,
          fullScreenClick: false,
        },
        () => {
          console.log('full screen else ', this.state.fullScreenClick);
          if (this.state.fullScreen === false) {
            // this.player.onPause();
            Orientation.lockToPortrait();
          } else {
            Orientation.lockToLandscapeLeft();
          }
        },
      );
    }
  };

  //#endregion
  onWillblur() {
    console.log('onWillblur Callllllll ============');
    /* this.setState({istimerOn: false},()=>{
      console.log("onWillblur ============"+this.state.istimerOn)
    }) */
    global.istimerOn = false;
  }
  async reload() {
    Orientation.lockToPortrait();
    console.log(
      'RELOAD Callllllll navigation ============' +
        JSON.stringify(this.props.navigation),
    );
    console.log(
      'RELOAD Callllllll global.currentRoute ============' +
        global.currentRoute,
    );
    // if(global.currentRoute = 'HomeScreen'){
    //   global.currentRoute = 'HomeScreen';
    //   // console.log('RELOAD Callllllll ============'+global.currentRoute);
    // }else{
    //   global.currentRoute = 'EventListing';
    //   // console.log('RELOAD Callllllll ============'+global.currentRoute);
    // }
    var status = await CheckConnectivity();
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
    if (!status) {
      this.setState({
        noInternet: true,
      });
      showToast('No Internet ! Please check your connection', 'warning');
    } else {
      var ref = '';
      // global.istimerOn = true
      this.props.validTicketClear();
      let userLogedIn = await AsyncStorage.getItem('isLoggedIn');
      if (userLogedIn == 'true') {
        this.setState({userLogedIn: true}, () => {
          console.log('New User LogIn IFF: ' + this.state.userLogedIn);
          console.log('New User LogIn IFF: ' + typeof this.state.userLogedIn);
        });
      } else {
        this.setState({userLogedIn: false}, () => {
          console.log('New User LogIn ELSE: ' + this.state.userLogedIn);
        });
      }

      let userData = await getLoggedInUserDataObject();

      // this.setState({ userdata: userData });
      if (this.props.navigation.state.params !== undefined) {
        ref = this.props.navigation.state.params.endpoint;
        var endPoint = ref.substring(4);
        console.log('EndPoint : ' + endPoint);
        console.log('User Data : ', userData);
        //console.log('User Data PROFILE IMAGE: ' + userData.user.picture.url);
        if (isLoggedIn === null) {
          isLoggedIn = false;
        }
        this.setState(
          {
            // isReady: false,
            error_msg: '',
            noInternet: false,
            uuid: endPoint,
            userdata: userData,
            isLoggedIn: isLoggedIn,
          },
          () => {
            var user_name = global.user_name;
            var userImage = global.user_image;
            console.log('User userImage =====> ' + JSON.stringify(userImage));
            if (user_name !== '') {
              this.setState({user_name});
            }
            if (userImage !== '' && userImage !== false) {
              if (userImage !== null) {
                this.setState({userImage});
              } else {
                this.setState({
                  userImage:
                    'https://dev.gigs.live/sites/all/themes/thegigs/img/avatar.png',
                });
              }
            } else {
              this.setState({
                userImage:
                  'https://dev.gigs.live/sites/all/themes/thegigs/img/avatar.png',
              });
            }
            console.log(
              'User LoginData =====> ' + JSON.stringify(this.state.userImage),
            );
            // // console.log(
            // //   'isLOggedIn ========> ' +
            // //     JSON.stringify(
            // //       this.state.userdata.user.field_username.und[0].value,
            // //     ),
            // // );
            // if (
            //   this.state.userdata != null &&
            //   this.state.userdata != undefined
            // ) {
            //   /* if (
            //     this.state.userdata.user.field_username.und[0].value.split(
            //       '_',
            //     )[1] === this.state.userdata.user.uid
            //   ) {
            //     this.setState({
            //       user_name: this.state.userdata.user.field_username.und[0].value,
            //     });
            //   } else { */
            //   //alert("here is new iuser name ==========> "+JSON.stringify(name))
            //   //console.log("isLOggedIn else _ ========> "+name)
            //   this.setState({
            //     // user_name: this.state.userdata.user.field_username.und[0].value,
            //     user_name: global.user_name,
            //   });
            //   //  }
            //   if (userData.user.picture != null) {
            //     // userImage = userData.user.picture.url;
            //     userImage = user_image;
            //   } else {
            //     userImage =
            //       'https://dev.gigs.live/sites/all/themes/thegigs/img/avatar.png';
            //   }
            // }
          },
        );
        // this.setState({
        //   userImage: userImage,
        // });
        // this.props.GetEventDetails(endPoint);
        var token;
        // const headers = (await this.getFlagIsUserLoggedIn())
        //   ? await getLoggedInUserDataObject().then((data) => {
        //       token = data.token;
        //       console.log("Token Data IF : " +token)
        //       return {
        //         'Content-Type': 'application/json',
        //         'X-CSRF-Token': token,
        //       };
        //     })
        //   : {
        //       'Content-Type': 'application/json',
        //     };
        var headers = '';
        if (userLogedIn == 'true') {
          let userdata = await AsyncStorage.getItem('loginData');
          let user_token = JSON.parse(userdata).token;
          console.log('Token Data IF Data : ' + JSON.parse(userdata));
          console.log('Token Data IF Token: ' + user_token);
          var encodedString = getBasicAuthForAPi();
          headers = {
            'Content-Type': 'application/json',
            'X-CSRF-Token': user_token,
            Authorization: `Basic ${encodedString}`,
          };
          console.log('Token Data IF : ' + headers);
        } else {
          headers = {
            'Content-Type': 'application/json',
            Authorization: `Basic ${encodedString}`,
          };
          console.log('Token Data Else  : ' + headers);
        }
        this.props.GetEventDetails({headers, endPoint});
        var uuid = endPoint.split('/');
        var Data = {
          headerData: {
            headers,
          },
          bodyData: {
            uuid: uuid[1],
          },
        };
        console.log('global.selectedRoom1 : ' + global.selectedRoom1);
        this.props.GetRoomList(Data);
        this.props.getChatList(uuid[1], global.selectedRoom1);
        var getParticepetsData = {
          body: {
            eventUUID: uuid[1],
            uuid: global.selectedRoom1,
          },
        };
        this.props.getRoomInfoDetail(getParticepetsData);
        this.getFlagIsUserLoggedIn();
      }
      // this.eventStartCountDown();
    }
    if (global.currentRoute != 'EventListing') {
      global.currentRoute = 'HomeScreen';
      console.log('RELOAD Callllllll ============' + global.currentRoute);
    }
    this.setState({isReady: true});
  }

  validateTicketCode = () => {
    // alert('hello')
    var input = this.props.navigation.state.params.endpoint;
    var fields = input.split('/');

    //var name = fields[0];
    var eventID = fields[2];
    console.log('event Endpoint', eventID);
    if (this.state.ticketCode) {
      var data = {
        ticket: {
          code: `${this.state.ticketCode.replace('-', '')}`,
          eventId: `${eventID}`,
        },
        headerData: {
          token: this.state.token,
        },
      };
      if (this.state.isUserLoggedIn === false) {
        AsyncStorage.setItem('validTicketData', JSON.stringify(data));
      } else {
        AsyncStorage.setItem('validTicketData', JSON.stringify(data));
      }
      //alert("Code : "+data.ticket.code)
      this.props.validTicket(data);
      //this.setState({isVidePlayerOff: false});
      //this.fullScreen();
    } else {
      showToast('Please enter ticket code');
    }
  };

  sendNewMessage = async (messageData, messageType) => {
    var params = {};
    console.log('here is send message', this.state.clap_uid);
    console.log('here is send token : ', this.state.token);
    if (this.state.isLoggedIn == false) {
      this.setState({tag: 'Chat'}, () => {
        this.RBSheet.open();
      });
    } else if (this.props.eventDetails.purchased_tickets > 0) {
      if (messageData !== '') {
        // await getAccessToken().then(() => {
        switch (messageType) {
          case 0:
            params = {
              bodyData: {
                message: messageData,
                action: 'message',
                room: global.selectedRoom1,
                event: splitEndPoint(
                  this.props.navigation.state.params.endpoint,
                ),
                amount: this.state.tipAmount,
              },
              headerData: this.state.token,
            };
            break;
          case 2:
            params = {
              bodyData: {
                message: '',
                action: this.state.wh_uid,
                room: global.selectedRoom1,
                event: splitEndPoint(
                  this.props.navigation.state.params.endpoint,
                ),
                amount: this.state.tipAmount,
              },
              headerData: this.state.token,
            };
            break;
          case 1:
            params = {
              bodyData: {
                message: '',
                action: this.state.clap_uid,
                room: global.selectedRoom1,
                event: splitEndPoint(
                  this.props.navigation.state.params.endpoint,
                ),
                amount: this.state.tipAmount,
              },
              headerData: this.state.token,
            };
            break;
          case 4:
            params = {
              bodyData: {
                message: '',
                action: this.state.peace_uid,
                room: global.selectedRoom1,
                event: splitEndPoint(
                  this.props.navigation.state.params.endpoint,
                ),
                amount: this.state.tipAmount,
              },
              headerData: this.state.token,
            };
            break;
          case 5:
            params = {
              bodyData: {
                message: '',
                action: this.state.rock_uid,
                room: global.selectedRoom1,
                event: splitEndPoint(
                  this.props.navigation.state.params.endpoint,
                ),
                amount: this.state.tipAmount,
              },
              headerData: this.state.token,
            };
            break;
          case 6:
            params = {
              bodyData: {
                message: '',
                action: this.state.love_uid,
                room: global.selectedRoom1,
                event: splitEndPoint(
                  this.props.navigation.state.params.endpoint,
                ),
                amount: this.state.tipAmount,
              },
              headerData: this.state.token,
            };
            break;
          case 7:
            params = {
              bodyData: {
                message: '',
                action: this.state.lit_uid,
                room: global.selectedRoom1,
                event: splitEndPoint(
                  this.props.navigation.state.params.endpoint,
                ),
                amount: this.state.tipAmount,
              },
              headerData: this.state.token,
            };
            break;
          case 8:
            params = {
              bodyData: {
                message: '',
                action: this.state.nostalgic_uid,
                room: global.selectedRoom1,
                event: splitEndPoint(
                  this.props.navigation.state.params.endpoint,
                ),
                amount: this.state.tipAmount,
              },
              headerData: this.state.token,
            };
            break;
          default: {
            break;
          }
        }
        console.log('PARMSDSSSS : ', params);
        this.props.SendNewMessage(params);
        // });
      } else {
        console.log('please write message here !!!!');
      }
    } else {
      this.setState({tag: 'Buy Tickets'}, () => {
        this.RBSheet.open();
      });
    }
  };

  validateCardDetails = (
    cardNUmberField1,
    cardNUmberField2,
    cardNUmberField3,
    cardNUmberField4,
    cardHolderName,
    cvv,
    expiryMonth,
    expiryYear,
    SelectedAmount,
    tipMessage,
  ) => {
    let hasError = false;
    if (this.state.tipsStep === 1 && SelectedAmount !== 0) {
      this.setState({
        tipsStep: 2,
      });
    } else if (this.state.tipsStep === 2) {
      if (
        cardNUmberField1.length < 3 ||
        cardNUmberField4.length > 4 ||
        cardNUmberField2.length < 3 ||
        cardNUmberField4.length > 4 ||
        cardNUmberField3.length < 3 ||
        cardNUmberField4.length > 4 ||
        cardNUmberField4.length < 3 ||
        cardNUmberField4.length > 4
      ) {
        /* this.setState({ cardNumberError: 'Please add a valid card number' }); */
        showToast('Please fill up valid card details', 'error');
        hasError = true;
      }
      if (cardHolderName === '') {
        /* this.setState({
          cardNameError: 'Please add a valid card holder name',
        }); */
        showToast('Please fill up valid card details', 'error');
        hasError = true;
      }
      if (cvv !== '') {
        /* this.setState({ cardCVVError: 'Please add a valid CVV number' }); */
        console.log('cvv length = ', cvv.length);
        if (cvv.length < 3 || cvv.length > 4) {
          this.setState({cardCVVError: 'Please add a valid CVV number'}, () => {
            console.log('hello ', this.state.cardCVVError);
          });
          hasError = true;
        }
      }
      var monthCurrent = new Date().getMonth();
      var yearCurrent = new Date().getFullYear().toString();
      let cardNumber_validation =
        cardNUmberField1 +
        '' +
        cardNUmberField2 +
        '' +
        cardNUmberField3 +
        '' +
        cardNUmberField4;
      console.log('Year : ' + yearCurrent);
      console.log('yeear : ' + typeof yearCurrent);
      console.log('monthCurrent ::: : ' + typeof monthCurrent);
      var currentYear = parseInt(yearCurrent.substring(2, 4));
      console.log('currentYear : ' + currentYear);
      console.log('card numberr : ' + cardNumber_validation.length);
      if (
        (cardNumber_validation.length == 15 && cvv.length < 4) ||
        (cardNumber_validation.length == 14 && cvv.length < 4)
      ) {
        this.setState({cardCVVError: 'Please add a valid CVV number'}, () => {
          console.log('hello ', this.state.cardCVVError);
        });
        hasError = true;
      }
      if (parseInt(expiryMonth) > 12) {
        console.log('here in month =============');
        if (currentYear > parseInt(expiryYear)) {
          console.log('here in years ==========');
          this.setState(
            {
              cardMonthYearError: 'Please add a valid expiry month',
            },
            () => {
              showToast('Please enter valid expiry month and year', 'success');
              return;
            },
          );
          hasError = true;
        } else if (parseInt(expiryMonth) > 12) {
          console.log('here is dat got expiry month');
          this.setState(
            {
              cardMonthYearError: 'Please add a valid expiry month',
            },
            () => {
              showToast('Please add valid expiry month', 'success');
            },
          );
          hasError = true;
        }
      } else if (expiryMonth === '') {
        this.setState(
          {
            cardMonthYearError: 'Please add a valid expiry month',
          },
          () => {
            showToast('Please add valid expiry month', 'success');
          },
        );
        hasError = true;
      } else if (expiryYear === '') {
        this.setState(
          {
            cardMonthYearError: 'Please add a valid expiry year',
          },
          () => {
            showToast('Please add valid expiry year', 'success');
          },
        );
        hasError = true;
      } else if (currentYear > parseInt(expiryYear)) {
        console.log('here data years');
        this.setState(
          {
            cardMonthYearError: 'Please add a valid expiry year',
          },
          () => {
            showToast('Please add valid expiry year', 'success');
          },
        );
        hasError = true;
      } else if (currentYear == parseInt(expiryYear)) {
        if (parseInt(expiryMonth) < monthCurrent + 1) {
          this.setState(
            {
              cardMonthYearError: 'Please add a valid expiry month',
            },
            () => {
              showToast('Please add valid expiry month', 'success');
            },
          );
          hasError = true;
        }
      }
      if (!hasError) {
        let cardNumber =
          cardNUmberField1 +
          '' +
          cardNUmberField2 +
          '' +
          cardNUmberField3 +
          '' +
          cardNUmberField4;
        console.log(
          'Amount message ==== ' +
            JSON.stringify(SelectedAmount) +
            ' ' +
            JSON.stringify(tipMessage),
        );
        console.log(
          'card  umber holder name ==== ' +
            JSON.stringify(cardNumber) +
            ' ' +
            JSON.stringify(cardHolderName),
        );
        console.log(
          'cvv expri ' +
            JSON.stringify(cvv) +
            ' ' +
            JSON.stringify(expiryMonth),
        );
        console.log(' year ==== ' + JSON.stringify(expiryYear));
        this.stepHandel(
          cardNumber,
          cardHolderName,
          cvv,
          expiryMonth,
          expiryYear,
          SelectedAmount,
          tipMessage,
        );
      }
    }
  };
  componentWillUnmount = () => {
    // this.onWillblur()
    //console.log("componentWillUnmount : "+ this.state.istimerOn)
    //this.setState({istimerOn: false})
    global.istimerOn = false;
    global.currentTime = 0;
    console.log('componentWillUnmount : 2222' + global.istimerOn);
  };

  render() {
    let {fetchingEventDetail} = this.props;
    let {upperTab, lowerTab, confirmPopupModel} = this.state;
    // console.log('modal =====>' + this.state.modalisVisibleDelete);
    // console.log('event no data =====>' + JSON.stringify(this.state.latestMessage));
    return (
      <NetworkProvider>
        <NetworkConsumer>
          {({isConnected}) =>
            !isConnected ? (
              <NoInternetView onLoad_method={() => this.onLoad_method()} />
            ) : fetchingEventDetail == true || this.state.isLoading == true ? (
              <GettingReady />
            ) : !this.state.isReady ? (
              <GettingReady />
            ) : (
              <SafeAreaView style={styles.safe_area_view}>
                <NavigationEvents
                  onWillFocus={() => this.ScreenLoadEvent()}
                  onWillBlur={() => this.setState({PlayEventVideo: false})}
                />
                <Header />
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : null}
                  style={styles.main_container}>
                  {this.state.isVidePlayerOff ? (
                    <View>
                      {this.props.eventDetails && (
                        <ScrollView
                          // ref={(ref) => {
                          //   this.scrollview_Ref = ref;
                          // }}
                          contentContainerStyle={styles.scrlView_container}>
                          {this.state.fullScreenClick === false
                            ? this.returnATFView()
                            : this.state.PlayEventVideo === true && (
                                <VideoPlayer
                                  //source={{uri: videoList.video}}
                                  //source={{uri:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}}
                                  source={{uri: this.props.eventDetails.stream}}
                                  /*  ref={(ref) => {
                                                                           this.player_3 = ref;
                                                                         }} */
                                  resizeMode="cover"
                                  seekColor="#e70047"
                                  style={styles.top_image}
                                  fullScreen={() => {
                                    this.fullScreen('full');
                                  }}
                                  close={this.onClose}
                                  backButton={this.backToScreen}
                                  expand={this.state.expand}
                                  miniplay={this.state.miniplay}
                                  miniplayer={() => this.clickToMiniplayer()}
                                />
                              )}
                          <View>
                            {this.returnGlobalChatView()}
                            {this.returnTipSelectionView()}
                          </View>
                          {/* Event Schedule has been disabled due to api dependency */}
                          {/*  {this.props.eventDetails.schedule.length !== 0 &&
                      this.returnEventScheduleView()} */}
                          {this.returnArtistDisplayView(upperTab, lowerTab)}
                          <View>
                            {this.returnEventsForYouView()}
                            {this.returnSimilarArtistView()}
                          </View>
                          <Footer />
                          {this.returnBottomRBSheet()}
                          {this.returnBottomRBSheetReport()}
                          {this.returnBottomRBSheetStartWatching()}
                        </ScrollView>
                      )}
                      {this.returnImageViewer()}
                      {this.returnInviteModalView()}
                      <Spinner
                        size={'large'}
                        overlayColor={'rgba(0, 0, 0, 0.5)'}
                        visible={this.state.GettingReadyLightSmall}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                      />

                      {/* {this.deleteModalView()} */}
                      {/* <Modal
                        transparent={false}
                        animationType="fade"
                        visible={this.state.modalisVisibleDelete}
                        style={{backgroundColor:'red'}}
                        supportedOrientations={['landscape', 'portrait']}
                        onRequestClose={() => {
                          this.setState({
                            modalisVisibleDelete: false,
                          });
                        }}
                      >
                      <View style={{backgroundColor:'#000',flex:1}}>
                        <Text style={{color:'#fff'}}>Mohammad</Text>
                      </View>
                      </Modal> */}
                      {/* <ConfirmPopUp
            confirmPopupModel={this.state.confirmPopupModel}
            CancelPress={() => this.setState({confirmPopupModel: false})}
            OKPress={() => this.confirmPopupModelOKPress()}
            messageText={this.state.confirmPopupMessage}
            // OKPress = {null}
          /> */}
                    </View>
                  ) : (
                    this.returnVideoPlayerView()
                  )}
                  {this.state.PlayEventVideo === true &&
                  this.state.miniplay === false ? (
                    <View style={styles.overlay}>
                      <VideoPlayer
                        //source={{uri: videoList.video}}
                        //source={{uri:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}}
                        source={{uri: this.props.eventDetails.stream}}
                        /*  ref={(ref) => {
                                                                this.player_3 = ref;
                                                              }} */
                        resizeMode="cover"
                        seekColor="#e70047"
                        style={styles.top_image}
                        fullScreen={() => {
                          this.fullScreen();
                        }}
                        close={this.onClose}
                        backButton={this.backToScreen}
                        expand={this.state.expand}
                        miniplay={this.state.miniplay}
                        miniplayer={() => this.clickToMiniplayer()}
                      />
                    </View>
                  ) : null}
                </KeyboardAvoidingView>
              </SafeAreaView>
            )
          }
        </NetworkConsumer>
      </NetworkProvider>
    );
  }

  // deleteModalView(){
  //   console.log("call deleteModalView : "+this.state.confirmPopupModel )
  //   console.log("call deleteModalView : "+typeof(this.state.confirmPopupModel) )
  //   return(
  //     <Modal
  //     // transparent={true}
  //         animationType="fade"
  //         visible={this.state.confirmPopupModel}
  //         onRequestClose={() => {
  //           this.setState({
  //             confirmPopupModel: false,
  //           });
  //         }}
  //         >
  //     <TouchableOpacity
  //           style={{
  //             backgroundColor: 'transparent',
  //             flex: 1,
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //           }}
  //           onPress={() => {
  //             this.setState({
  //               confirmPopupModel: false,
  //             });
  //           }}>
  //           <BlurView
  //             style={styles.absolute}
  //             // viewRef={this.state.viewRef}
  //             blurType="dark"
  //             blurAmount={10}
  //           />
  //           <View style={styles.viewContainer_second}>
  //             <View style={styles.modal_txt_view}>
  //               <Text style={styles.modal_txt_style}>
  //                 {/* Are you sure you want to delete this address ? */}
  //                 {this.props.messageText}
  //               </Text>
  //             </View>
  //             <View style={styles.modal_btn_view}>
  //               <TouchableOpacity
  //                 onPress={() =>{
  //                     //  this.setState({confirmPopupModel: false})
  //                     this.props.CancelPress()
  //                     }
  //                 }
  //                 style={[styles.modal_btn_style, {borderWidth: 0}]}>
  //                 <ImageBackground
  //                   style={[
  //                     styles.modal_btn_style,
  //                     {width: '100%', height: '100%', borderWidth: 0},
  //                   ]}
  //                   source={Images.btn_gradint}
  //                   imageStyle={{borderRadius: 10}}>
  //                   <Text style={styles.modal_btn_text_style}>Cancel</Text>
  //                 </ImageBackground>
  //               </TouchableOpacity>
  //               <TouchableOpacity
  //                 onPress={() => this.props.OKPress()}
  //                 style={styles.modal_btn_style}>
  //                 <Text style={styles.modal_btn_text_style}>Yes</Text>
  //               </TouchableOpacity>
  //             </View>
  //           </View>
  //           </TouchableOpacity>
  //     </Modal>
  //   )
  // }

  returnInviteModalView() {
    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={this.state.inviteModalVisibility}
        onRequestClose={() => {
          this.setState({
            inviteModalVisibility: false,
          });
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <BlurView style={styles.absolute} blurType="dark" blurAmount={10} />
          <View
            style={{
              justifyContent: 'center',
              width: '90%',
              backgroundColor: colors.commonBGColor,
              borderRadius: 10,
              alignSelf: 'center',
              padding: 16,
            }}>
            <View>
              <ImageBackground
                style={{resizeMode: 'contain', height: 250, width: '100%'}}
                source={{
                  uri:
                    'https://gigs.live/sites/all/themes/thegigs/img/invite-bg.png',
                }}>
                <LinearGradient
                  style={{
                    flex: 1,
                    width: '100%',
                  }}
                  colors={[
                    colors.transparentColor,
                    colors.transparentColor,
                    colors.transparentColor,
                    colors.transparentColor,
                    colors.transparentColor,
                    colors.commonBGColor,
                  ]}>
                  <TouchableOpacity
                    style={{alignSelf: 'flex-end'}}
                    onPress={this.handleInviteModalVisibility}>
                    <Icon
                      name="close-outline"
                      size={30}
                      color={colors.commonLabelAlpha90Color}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: Fonts.OpenSans_regular,
                      fontSize: normalize(24),
                      color: colors.commonLabelAlpha70Color,
                    }}>
                    {'With Great Referrals\nCome Great Rewards'}
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </View>
            <View>
              <Text
                style={{
                  marginTop: 30,
                  marginBottom: 8,
                  fontFamily: Fonts.OpenSans_regular,
                  fontSize: normalize(24),
                  color: colors.commonLabelColor,
                }}>
                {'Invite a Friend'}
              </Text>
              <Text
                style={{
                  marginBottom: 30,
                  fontFamily: Fonts.OpenSans_regular,
                  fontSize: normalize(14),
                  color: colors.commonLabelAlpha70Color,
                }}>
                {'Refer to your friends & earn rewards'}
              </Text>
              <Text
                style={{
                  marginBottom: 4,
                  fontFamily: Fonts.OpenSans_regular,
                  fontSize: normalize(12),
                  color: colors.commonLabelAlpha70Color,
                }}>
                {'Enter Email ID'}
              </Text>
              <TextInput
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  backgroundColor: colors.commonImageBGColor,
                  borderColor:
                    this.state.emptyEmail === true ? 'red' : 'transparent',
                  borderWidth: 1,
                  color: colors.pureWhiteColor,
                  borderRadius: 10,
                  height: Platform.OS == 'ios' ? 40 : null,
                }}
                keyboardType="email-address"
                value={this.state.inviteeEmail}
                onChangeText={(text) => {
                  this.setState({inviteeEmail: text}, () => {
                    if (this.state.inviteeEmail === '') {
                      this.setState({
                        error: false,
                      });
                    }
                  });
                }}
              />
              {this.state.error === true && (
                <Text style={{color: 'red'}}>
                  Invalid email address, please use valid email address to
                  invite
                </Text>
              )}
              <ImageBackground
                imageStyle={{borderRadius: 10}}
                source={Images.btn_gradint}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30,
                  borderRadius: 5,
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 5,
                    //backgroundColor: colors.roundedButtonBGColor,
                  }}
                  onPress={this.sendInvitation}
                  disabled={this.props.isInviteSent}>
                  <Text
                    style={[
                      styles.buy_ticket_concert_artist_text_style,
                      {
                        fontFamily: Fonts.OpenSans_semibold,
                        fontSize: normalize(16),
                        color: '#fff',
                      },
                    ]}>
                    {this.props.isInviteSent
                      ? 'Invitation Sent'
                      : 'Send Invite'}
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  onPressEnterTicketCode = () => {
    this.setState({enterTicketCodeClick: true}, () => {
      console.log('enterTicketCodeClick : ' + this.state.enterTicketCodeClick);
    });
  };

  handleInviteModalVisibility = () => {
    // this.sendInvitation();
    console.log('IS LOGIN : ' + this.state.isLoggedIn);
    console.log('IS LOGIN : ' + typeof this.state.isLoggedIn);
    if (this.state.isLoggedIn == true) {
      this.props.InviteUser({isInviteSent: true});
      this.setState({
        //modalisVisibleDelete:true,
        inviteeEmail: '',
        inviteModalVisibility: !this.state.inviteModalVisibility,
      });
    } else {
      this.RBSheet.open();
    }
  };

  returnATFView() {
    // return (
    //   <FastImage
    //     style={styles.img_bg_style}
    //     source={{
    //       uri: this.props.eventDetails.image,
    //       priority: FastImage.priority.high,
    //     }}
    //     resizeMode={FastImage.resizeMode.contain}
    //   />
    // );
    return (
      <ImageBackground
        // source={{uri: this.props.eventDetails.image}}
        style={styles.img_bg_style}>
        <FastImage
          style={{
            position: 'absolute',
            width: '100%',
            backgroundColor: colors.commonImageBGColor,
            height: height - height / 4,
          }}
          // source={{
          //   uri: this.props.eventDetails.image,
          //   priority: FastImage.priority.high,
          // }}
          source={getResponsiveImage(this.props.eventDetails, true)}
          resizeMode={FastImage.resizeMode.cover}
          onProgress={(e) =>
            console.log(
              'Loading Progress ' + e.nativeEvent.loaded / e.nativeEvent.total,
            )
          }
          onLoad={(e) =>
            console.log(
              'Loading Loaded ' + e.nativeEvent.width,
              e.nativeEvent.height,
            )
          }
          onLoadEnd={(e) => console.log('Loading Ended')}
        />
        <LinearGradient
          style={{
            flex: 1,
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          colors={['rgba(0,0, 0, 0)', colors.pureBlackColor]}>
          <View style={styles.timerMainContainer}>
            {!this.state.isEventCompleted && (
              <View style={{alignItems: 'center'}}>
                {/* <View
                  style={{
                    backgroundColor: '#e70047',
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: Fonts.OpenSans_semibold,
                      fontSize: normalize(12),
                    }}>
                    {/* {strings.streaming_now} LIVE NOW
                  </Text>
                </View> */}
                {/* {this.state.eventStarted ? (
                   <View
                    style={{ backgroundColor:'#e70047',paddingHorizontal:20,paddingVertical:5,borderRadius:20}}>
                    <Text style={{color:'#fff',fontFamily:Fonts.OpenSans_semibold,fontSize:normalize(12)}}>
                     {/* {strings.streaming_now} *LIVE NOW
                    </Text>
                 </View>
                ) : (
                  this.state.waitOf30MinsStarted !== undefined &&
                  this.state.waitOf30MinsStarted && (
                    <View
                      style={[
                        styles.timerView,
                        {
                          marginTop: 50,
                          marginBottom: 20,
                        },
                      ]}>
                      <Text style={styles.top_event_Begins_in_text_style}>
                        {strings.event_begins_in}
                      </Text>
                      {/* <Text style={styles.timing_count_text_style}> */}
                {/* {this.state.time_left_to_event_start} *
                      <View
                        style={{
                          flexDirection: 'row',
                          width: SLIDER_WIDTH / 2,
                          justifyContent: 'center',
                        }}>
                        {this.state.time_left_to_event_start[0] != undefined &&
                          this.state.time_left_to_event_start[0] != null &&
                          this.state.time_left_to_event_start[0] != '' && (
                            <View style={styles.remaining_view_text_style}>
                              <Text style={styles.remaining_time_text_style}>
                                {this.state.time_left_to_event_start[0]}
                              </Text>
                              <Text style={styles.remaining_text_style}>
                                Days
                              </Text>
                              {/* <Text style={styles.remaining_text_style}> : </Text> *
                            </View>
                          )}
                        {this.state.time_left_to_event_start[0] != undefined &&
                          this.state.time_left_to_event_start[0] != null &&
                          this.state.time_left_to_event_start[0] != '' && (
                            <View style={styles.remaining_text_colan_style}>
                              <Text style={styles.remaining_text_style}>
                                {' '}
                                :{' '}
                              </Text>
                            </View>
                          )}
                        <View style={styles.remaining_view_text_style}>
                          <Text style={styles.remaining_time_text_style}>
                            {this.state.time_left_to_event_start[1]}
                          </Text>
                          <Text style={styles.remaining_text_style}>Hrs</Text>
                        </View>
                        {this.state.time_left_to_event_start[1] != undefined &&
                          this.state.time_left_to_event_start[1] != null &&
                          this.state.time_left_to_event_start[1] != '' && (
                            <View style={styles.remaining_text_colan_style}>
                              <Text style={styles.remaining_text_style}>
                                {' '}
                                :{' '}
                              </Text>
                            </View>
                          )}
                        <View style={styles.remaining_view_text_style}>
                          <Text style={styles.remaining_time_text_style}>
                            {this.state.time_left_to_event_start[2]}
                          </Text>
                          <Text style={styles.remaining_text_style}>Min</Text>
                        </View>
                      </View>
                      {/* </Text> *
                    </View>
                  )
                )} */}
                {/* {this.state.isEventCompleted !== undefined &&
                  !this.state.isEventCompleted &&
                  (this.props.eventDetails.purchased_tickets < 1 ? (
                    <View style={styles.enter_ticket_start_watching_container}>
                      <View style={styles.enter_ticket_code_view}>
                        <TextInput
                          style={styles.enter_ticket_code_textinput}
                          placeholder={strings.enter_ticket_code}
                          maxLength={9}
                          placeholderTextColor={'#000'}
                          value={this.state.ticketCode}
                          autoCapitalize="characters"
                          autoCorrect={false}
                          onChangeText={(text) => {
                            var desired = text.replace(/[^-0-9A-Za-z ]/gi, '');
                            let splitText = desired.split('');
                            text = '';
                            splitText.map((it) => {
                              if (it !== ' ') {
                                text = text + it;
                              }
                            });
                            if (text.length > 4 && !text.includes('-')) {
                              let text1 = text.substr(0, 4) + '-';
                              let text2 = text.substr(4, 4);
                              console.log(
                                'text: ' + text,
                                'text1: ' + text1,
                                'text2: ' + text2,
                              );
                              text = text1 + text2;
                              console.log(
                                'text: ' + text,
                                'text1: ' + text1,
                                'text2: ' + text2,
                              );
                            }
                            for (let i = 0; i < text.length; i++) {
                              if (i !== 4 && text[i] === '-') {
                                console.log(
                                  `if (i === 4 && text[${i}] === '-'){${text[i]}}`,
                                  '..........in...............',
                                );
                                text = text.replace('-', '');
                              } else {
                                console.log(
                                  `if (i === 4 && text[${i}] === '-'){${text[i]}}`,
                                  '..........out...............',
                                );
                              }
                            }
                            this.setState({ticketCode: text});
                          }}
                          onKeyPress={({nativeEvent}) => {
                            let {ticketCode} = this.state;
                            if (ticketCode.length === 5) {
                              if (nativeEvent.key === 'Backspace') {
                                ticketCode = ticketCode.substr(0, 4);
                              }
                              this.setState({
                                ticketCode: ticketCode,
                              });
                            }
                          }}
                          allowFontScaling={true}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.start_watching_btn_style}
                        onPress={this.validateTicketCode}>
                        <Text style={[styles.start_watching_text_style,{color:'#1017ff'}]}>
                          {/* {strings.start_watching}
                          Reedem
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.start_watching_btn_style,
                        {marginBottom: 16},
                      ]}
                      onPress={async () => await this.startWatchingVideo()}>
                      <ImageBackground
                        imageStyle={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 4,
                        }}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 122,
                          height: 40,
                          borderRadius: 4,
                        }}
                        source={Images.btn_gradint}>
                        <Text style={styles.start_watching_text_style}>
                          {strings.start_watching}
                        </Text>
                      </ImageBackground>
                    </TouchableOpacity>
                  ))} */}
              </View>
            )}
          </View>
          {/*  <TouchableOpacity
                      style={[
                        styles.start_watching_btn_style,
                        {marginBottom: 16},
                      ]}
                      onPress={async () => await this.startWatchingVideo()}>
                      <ImageBackground
                        imageStyle={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 4,
                        }}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 122,
                          height: 40,
                          borderRadius: 4,
                        }}
                        source={Images.btn_gradint}>
                        <Text style={styles.start_watching_text_style}>
                          {strings.start_watching}
                        </Text>
                      </ImageBackground>
                    </TouchableOpacity> */}
          {this.props.eventDetails.date !== undefined && (
            <Text style={styles.timing_text_style}>
              {getFormattedDate(this.props.eventDetails.date)}
            </Text>
          )}

          <Text numberOfLines={3} style={styles.singer_name_text_style}>
            {this.props.eventDetails.title}
          </Text>
          {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
          <View style={{flexDirection: 'row', marginBottom: 16}}>
            {this.props.eventDetails.genres !== null &&
              (this.props.eventDetails.genres.length > 0
                ? this.props.eventDetails.genres.map((item, index) => {
                    return (
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.category_text_style}>
                          {item.title}
                        </Text>
                        {this.props.eventDetails.genres.length - 1 !==
                          index && (
                          <Text style={styles.category_text_style}>
                            {'  •  '}
                          </Text>
                        )}
                      </View>
                    );
                  })
                : null)}
          </View>
          {/* LIVE NOW STATUS VIEW START */}
          <View style={styles.event_status_view}>
            {this.props.eventDetails.labels != undefined &&
              this.props.eventDetails.labels != null &&
              this.props.eventDetails.labels != 0 &&
              this.props.eventDetails.labels.map((item, index) => {
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
                        this.props.eventDetails.labels[index].type == 'live'
                          ? Images.live_stream_icon
                          : this.props.eventDetails.labels[index].type ==
                            'demand'
                          ? Images.ondemand
                          : Images.event_expired
                      }
                      style={styles.status_img_style}></Image>
                    <Text style={styles.live_stream_text_style}>
                      {this.props.eventDetails.labels[index].label}
                    </Text>

                    {index + 1 ===
                      this.props.eventDetails.labels.length - 1 && (
                      <Text
                        style={[styles.live_stream_text_style, {fontSize: 16}]}>
                        +{' '}
                      </Text>
                    )}
                  </View>
                );
              })}
          </View>
          {/* LIVE NOW STATUS VIEW END */}
          {/* </ScrollView> */}
          {/* LiveNow UI code is disabled due to api unavailability */}
          {/* {this.state.eventStarted && (
            <View style={styles.live_now_btn_container}>
              <TouchableOpacity style={styles.live_btn_style}>
                <Text style={styles.LIVE_NOW_text_style}>
                  {strings.live_now}
                </Text>
              </TouchableOpacity>
              <Text style={styles.how_much_watching_count_text_style}>
                {strings.live_watching(1.9)}
              </Text>
            </View>
          )} */}
          {this.state.eventStarted !== undefined ? (
            !this.state.eventStarted && !this.state.waitOf30MinsStarted ? (
              <View>
                <Text style={styles.event_Begins_in_text_style}>
                  {strings.event_begins_in}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: SLIDER_WIDTH / 2,
                    justifyContent: 'center',
                  }}>
                  {this.state.time_left_to_event_start[0] != undefined &&
                    this.state.time_left_to_event_start[0] != null &&
                    this.state.time_left_to_event_start[0] != '' && (
                      <View style={styles.remaining_view_text_style}>
                        <Text style={styles.remaining_time_text_style}>
                          {this.state.time_left_to_event_start[0] < 10 &&
                          this.state.time_left_to_event_start[0] > 0
                            ? 0
                            : null}
                          {this.state.time_left_to_event_start[0]}
                        </Text>
                        <Text style={styles.remaining_text_style}>Days</Text>
                        {/* <Text style={styles.remaining_text_style}> : </Text> */}
                      </View>
                    )}
                  {this.state.time_left_to_event_start[0] != undefined &&
                    this.state.time_left_to_event_start[0] != null &&
                    this.state.time_left_to_event_start[0] != '' && (
                      <View style={styles.remaining_text_colan_style}>
                        <Text style={styles.remaining_text_style}> : </Text>
                      </View>
                    )}
                  <View style={styles.remaining_view_text_style}>
                    <Text style={styles.remaining_time_text_style}>
                      {this.state.time_left_to_event_start[1] < 10 &&
                      this.state.time_left_to_event_start[1] > 0
                        ? 0
                        : null}
                      {this.state.time_left_to_event_start[1]}
                    </Text>
                    <Text style={styles.remaining_text_style}>Hrs</Text>
                  </View>
                  {this.state.time_left_to_event_start[1] != undefined &&
                    this.state.time_left_to_event_start[1] != null &&
                    this.state.time_left_to_event_start[1] != '' && (
                      <View style={styles.remaining_text_colan_style}>
                        <Text style={styles.remaining_text_style}> : </Text>
                      </View>
                    )}
                  <View style={styles.remaining_view_text_style}>
                    <Text style={styles.remaining_time_text_style}>
                      {this.state.time_left_to_event_start[2] < 10 &&
                      this.state.time_left_to_event_start[2] > 0
                        ? 0
                        : null}
                      {this.state.time_left_to_event_start[2]}
                    </Text>
                    <Text style={styles.remaining_text_style}>Min</Text>
                  </View>
                </View>
              </View>
            ) : this.state.eventStarted &&
              this.state.liveEventCompleted == 1 ? (
              <View style={{alignSelf: 'center'}}>
                {this.state.time_left_to_event_start[2] < 0 && (
                  <View
                    style={{
                      backgroundColor: '#e70047',
                      paddingHorizontal:
                        this.state.time_left_to_event_start[2] > 0 ? 0 : 20,
                      paddingVertical: 5,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: Fonts.OpenSans_semibold,
                        justifyContent: 'center',
                        fontSize: normalize(12),
                        paddingHorizontal: 20,
                      }}>
                      {/* {strings.streaming_now} */}LIVE NOW
                    </Text>
                  </View>
                )}
                {this.state.waitOf30MinsStarted &&
                  this.state.time_left_to_event_start[2] > 0 && (
                    <View
                      style={[
                        styles.timerView,
                        {
                          flexDirection: 'row',
                          alignSelf: 'center',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                        },
                      ]}>
                      <Text style={styles.top_event_Begins_in_text_style}>
                        Gig Begins in &nbsp;
                      </Text>
                      <Text
                        style={[
                          styles.remaining_time_text_style,
                          {
                            fontSize: normalize(26),
                            marginTop: 10,
                          },
                        ]}>
                        {this.state.time_left_to_event_start[2]}
                      </Text>
                      <Text style={[styles.remaining_text_style]}>
                        &nbsp; Min
                      </Text>
                    </View>
                  )}
                {this.state.liveEventCompleted == 1 &&
                this.props.eventDetails.purchased_tickets > 0 &&
                this.state.firsttimeCall == true ? (
                  <TouchableOpacity
                    style={[
                      styles.start_watching_btn_style,
                      {marginVertical: 10, marginRight: 0, alignSelf: 'center'},
                    ]}
                    onPress={async () => await this.startWatchingVideo()}>
                    {/* <ImageBackground
                        imageStyle={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 4,
                        }}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 122,
                          height: 40,
                          borderRadius: 4,
                        }}
                        source={Images.btn_gradint}>
                        <Text style={styles.start_watching_text_style}>
                          {strings.start_watching}
                        </Text>
                      </ImageBackground> */}
                    <Image
                      source={Images.play_btn_white}
                      style={{
                        width: 50,
                        height: 50,
                        resizeMode: 'contain',
                      }}></Image>
                  </TouchableOpacity>
                ) : (
                  <View></View>
                )}
                {this.props.eventDetails.already_redeemed == false &&
                  (this.state.enterTicketCodeClick === false ? (
                    <View
                      style={[
                        styles.enter_ticket_start_watching_container,
                        {
                          marginTop: 10,
                          marginBottom: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'tranparent',
                          borderWidth: 0,
                        },
                      ]}>
                      <Text
                        style={{
                          color: '#fff',
                          textAlign: 'center',
                          width: '100%',
                        }}
                        onPress={() => {
                          this.onPressEnterTicketCode();
                        }}>
                        I already have a ticket code
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.enter_ticket_start_watching_container,
                        {marginTop: 10, marginBottom: 5},
                      ]}>
                      <View style={styles.enter_ticket_code_view}>
                        <TextInput
                          style={styles.enter_ticket_code_textinput}
                          placeholder={strings.enter_ticket_code}
                          maxLength={9}
                          placeholderTextColor={'#000'}
                          value={this.state.ticketCode}
                          autoCapitalize="characters"
                          autoCorrect={false}
                          onChangeText={(text) => {
                            var desired = text.replace(/[^-0-9A-Za-z ]/gi, '');
                            let splitText = desired.split('');
                            text = '';
                            splitText.map((it) => {
                              if (it !== ' ') {
                                text = text + it;
                              }
                            });
                            if (text.length > 4 && !text.includes('-')) {
                              let text1 = text.substr(0, 4) + '-';
                              let text2 = text.substr(4, 4);
                              console.log(
                                'text: ' + text,
                                'text1: ' + text1,
                                'text2: ' + text2,
                              );
                              text = text1 + text2;
                              console.log(
                                'text: ' + text,
                                'text1: ' + text1,
                                'text2: ' + text2,
                              );
                            }
                            for (let i = 0; i < text.length; i++) {
                              if (i !== 4 && text[i] === '-') {
                                console.log(
                                  `if (i === 4 && text[${i}] === '-'){${text[i]}}`,
                                  '..........in...............',
                                );
                                text = text.replace('-', '');
                              } else {
                                console.log(
                                  `if (i === 4 && text[${i}] === '-'){${text[i]}}`,
                                  '..........out...............',
                                );
                              }
                            }
                            this.setState({ticketCode: text});
                          }}
                          onKeyPress={({nativeEvent}) => {
                            let {ticketCode} = this.state;
                            if (ticketCode.length === 5) {
                              if (nativeEvent.key === 'Backspace') {
                                ticketCode = ticketCode.substr(0, 4);
                              }
                              this.setState({
                                ticketCode: ticketCode,
                              });
                            }
                          }}
                          allowFontScaling={true}
                        />
                      </View>
                      <TouchableOpacity
                        style={styles.start_watching_btn_style}
                        onPress={this.validateTicketCode}>
                        <Text
                          style={[
                            styles.start_watching_text_style,
                            {color: '#1017ff'},
                          ]}>
                          {/* {strings.start_watching} */}
                          Redeem
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            ) : this.state.waitOf30MinsStarted !== undefined &&
              this.state.waitOf30MinsStarted &&
              this.props.eventDetails.purchased_tickets > 0 &&
              this.state.liveEventCompleted === 2 &&
              this.state.autostartTimer === false ? (
              <View
                style={[
                  styles.timerView,
                  {
                    marginTop: 0,
                    marginBottom: 0,
                    //flexDirection: 'row',
                  },
                ]}>
                {/* <View
                  style={{
                    backgroundColor: '#e70047',
                    paddingHorizontal:
                      this.state.time_left_to_event_start[2] > 0 ? 0 : 20,
                    paddingVertical: 5,
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: Fonts.OpenSans_semibold,
                      justifyContent: 'center',
                      fontSize: normalize(12),
                      paddingHorizontal: 20,
                    }}>
                    {/* {strings.streaming_now}
                    LIVE NOW 2 {this.state.liveEventCompleted}
                  </Text>
                </View> */}
                <TouchableOpacity
                  // onPress={() => this.goToVOD(this.props.eventDetails.stream)}
                  onPress={() => this.fullScreen('start')}
                  // style={}
                >
                  {/* <ImageBackground
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 10,
                              backgroundColor: colors.commonBGColor,
                            }}
                            imageStyle={styles.imageBG_video}
                            // source={{ uri: item.image }}
                            source={getResponsiveImage(item, false)}> */}
                  <Image
                    style={{height: 40, width: 40}}
                    source={Images.play_btn_white}
                  />
                  {/* </ImageBackground> */}
                </TouchableOpacity>

                {/* <Text style={styles.top_event_Begins_in_text_style}>
                  We’re sorry the gig has ended, gig replay will be available
                  shortly.
                </Text> */}
              </View>
            ) : (
              this.state.liveEventCompleted == 1 &&
              this.props.eventDetails.purchased_tickets > 0 &&
              this.state.second !== 0 && (
                <View
                  style={[
                    styles.timerView,
                    {
                      alignItems: 'flex-end',
                      flexDirection: 'row',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.top_event_Begins_in_text_style,
                      {color: '#e70047', fontSize: normalize(20)},
                    ]}>
                    Playing in{' '}
                    <Text
                      style={[
                        styles.remaining_time_text_style,
                        {
                          marginTop: 0,
                          paddingHorizontal: 5,
                          color: '#e70047',
                          fontSize: normalize(28),
                        },
                      ]}>
                      {this.state.second}
                    </Text>{' '}
                    ...
                  </Text>

                  {/* <Text style={[styles.remaining_text_style, { marginTop: 0 }]}>Min</Text> */}
                  {/* <Text style={styles.timing_count_text_style}> */}
                  {/* {this.state.time_left_to_event_start} */}
                  {/* <View
                style={{
                  flexDirection: 'row',
                  width: SLIDER_WIDTH / 2,
                  justifyContent: 'center',
                }}> */}
                  {/* {this.state.time_left_to_event_start[0] != undefined &&
                this.state.time_left_to_event_start[0] != null &&
                this.state.time_left_to_event_start[0] != '' && (
                  <View style={styles.remaining_view_text_style}>
                    <Text style={styles.remaining_time_text_style}>
                      {this.state.time_left_to_event_start[0]}
                    </Text>
                    <Text style={styles.remaining_text_style}>Days</Text>
                    {/* <Text style={styles.remaining_text_style}> : </Text> *
                  </View>
                )}
              {this.state.time_left_to_event_start[0] != undefined &&
                this.state.time_left_to_event_start[0] != null &&
                this.state.time_left_to_event_start[0] != '' && (
                  <View style={styles.remaining_text_colan_style}>
                    <Text style={styles.remaining_text_style}> : </Text>
                  </View>
                )}
              <View style={styles.remaining_view_text_style}>
                <Text style={styles.remaining_time_text_style}>
                  {this.state.time_left_to_event_start[1]}
                </Text>
                <Text style={styles.remaining_text_style}>Hrs</Text>
              </View>
              {this.state.time_left_to_event_start[1] != undefined &&
                this.state.time_left_to_event_start[1] != null &&
                this.state.time_left_to_event_start[1] != '' && (
                  <View style={styles.remaining_text_colan_style}>
                    <Text style={styles.remaining_text_style}> : </Text>
                  </View>
                )} */}
                  {/* <View style={styles.remaining_view_text_style}>
                  <Text style={styles.remaining_time_text_style}>
                    {this.state.time_left_to_event_start[2]}
                  </Text>
                  <Text style={styles.remaining_text_style}>Min</Text>
                </View>
              </View> */}
                  {/* </Text> */}
                  {/* </View> */}
                </View>
              )
            )
          ) : null}
          {
            this.props.eventDetails.purchased_tickets !== undefined &&
              this.state.isUserLoggedIn &&
              this.props.eventDetails.purchased_tickets > 0 && (
                <View>
                  <Text style={styles.bought_ticket_count_text_style}>
                    You have {this.props.eventDetails.purchased_tickets} tickets
                    of this show.
                    {/* What are you waiting for? Spread the love:invite
                  your friends, create private chat rooms and get ready for the
                  show! */}
                  </Text>
                </View>
              )

            // this.props.eventDetails.allready
          }

          {
            // this.state.isUserLoggedIn && this.props.eventDetails.tickets.length > 0 && (
            this.state.liveEventCompleted != 1 && (
              /* !this.state.eventStarted && */ <TouchableOpacity
                onPress={this.openSheet}
                style={styles.buy_tickets_btn_style}>
                <ImageBackground
                  imageStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                  }}
                  source={Images.btn_gradint}>
                  <Text
                    style={[
                      styles.buy_ticket_text_style,
                      {
                        paddingHorizontal:
                          this.state.isUserLoggedIn &&
                          this.props.eventDetails.purchased_tickets > 0
                            ? 0
                            : 10,
                      },
                    ]}>
                    {/* {
                        // this.state.isUserLoggedIn &&
                        strings.buy_tickets
                        // this.props.eventDetails.purchased_tickets > 0
                        // : strings.buy_tickets
                      } */}
                    Buy Tickets
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
              // <RBDailog
              //   lableText={strings.buy_tickets}
              //   btn_style={styles.buy_tickets_btn_style}
              //   lbl_style={styles.buy_ticket_text_style}
              //   ticketLeft={strings.findLowestTicketPriceAndLeftTickets(
              //     this.props.eventDetails.tickets,
              //   )}
              // />
            )
          }
          {this.state.liveEventCompleted == 2 &&
            this.props.eventDetails.tickets.length > 0 && (
              /* !this.state.eventStarted &&  */ <Text
                style={styles.price_info_text_style}>
                {strings.findLowestTicketPriceAndLeftTickets(
                  this.state.isUserLoggedIn &&
                    this.props.eventDetails.purchased_tickets > 0
                    ? ''
                    : // ? 'Spread the love, share with friends'
                      this.props.eventDetails.tickets,
                  this.state.isEventCompleted,
                )}
              </Text>
            )}
          {this.props.eventDetails.already_redeemed == true ? (
            <View>
              <Text style={styles.bought_ticket_count_text_style}>
                Ticket Redeemed for this event.
              </Text>
            </View>
          ) : (
            this.state.liveEventCompleted == 2 &&
            this.props.eventDetails.already_redeemed == false && (
              <View>
                {this.state.enterTicketCodeClick == false && (
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      width: '100%',
                    }}
                    onPress={() => {
                      this.onPressEnterTicketCode();
                    }}>
                    I already have a ticket code
                  </Text>
                )}
                {this.state.enterTicketCodeClick == true && (
                  <View
                    style={[
                      styles.enter_ticket_start_watching_container,
                      {marginTop: 5, marginBottom: 5},
                    ]}>
                    <View style={styles.enter_ticket_code_view}>
                      <TextInput
                        style={styles.enter_ticket_code_textinput}
                        placeholder={strings.enter_ticket_code}
                        maxLength={9}
                        placeholderTextColor={'#000'}
                        value={this.state.ticketCode}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        onChangeText={(text) => {
                          var desired = text.replace(/[^-0-9A-Za-z ]/gi, '');
                          let splitText = desired.split('');
                          text = '';
                          splitText.map((it) => {
                            if (it !== ' ') {
                              text = text + it;
                            }
                          });
                          if (text.length > 4 && !text.includes('-')) {
                            let text1 = text.substr(0, 4) + '-';
                            let text2 = text.substr(4, 4);
                            console.log(
                              'text: ' + text,
                              'text1: ' + text1,
                              'text2: ' + text2,
                            );
                            text = text1 + text2;
                            console.log(
                              'text: ' + text,
                              'text1: ' + text1,
                              'text2: ' + text2,
                            );
                          }
                          for (let i = 0; i < text.length; i++) {
                            if (i !== 4 && text[i] === '-') {
                              console.log(
                                `if (i === 4 && text[${i}] === '-'){${text[i]}}`,
                                '..........in...............',
                              );
                              text = text.replace('-', '');
                            } else {
                              console.log(
                                `if (i === 4 && text[${i}] === '-'){${text[i]}}`,
                                '..........out...............',
                              );
                            }
                          }
                          this.setState({ticketCode: text});
                        }}
                        onKeyPress={({nativeEvent}) => {
                          let {ticketCode} = this.state;
                          if (ticketCode.length === 5) {
                            if (nativeEvent.key === 'Backspace') {
                              ticketCode = ticketCode.substr(0, 4);
                            }
                            this.setState({
                              ticketCode: ticketCode,
                            });
                          }
                        }}
                        allowFontScaling={true}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.start_watching_btn_style}
                      onPress={this.validateTicketCode}>
                      <Text
                        style={[
                          styles.start_watching_text_style,
                          {color: '#1017ff'},
                        ]}>
                        {/* {strings.start_watching} */}
                        Redeem
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )
          )}
          {this.state.liveEventCompleted == 1 &&
            this.props.eventDetails.purchased_tickets == 0 && (
              <TouchableOpacity
                onPress={this.openSheet}
                style={styles.buy_tickets_btn_style}>
                <ImageBackground
                  imageStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                  }}
                  source={Images.btn_gradint}>
                  <Text
                    style={[
                      styles.buy_ticket_text_style,
                      {
                        paddingHorizontal:
                          this.state.isUserLoggedIn &&
                          this.props.eventDetails.purchased_tickets > 0
                            ? 0
                            : 10,
                      },
                    ]}>
                    {/* {
                        // this.state.isUserLoggedIn &&
                        strings.buy_tickets
                        // this.props.eventDetails.purchased_tickets > 0
                        // : strings.buy_tickets
                      } */}
                    Buy Tickets
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            )}
          {this.state.liveEventCompleted != 2 &&
            this.props.eventDetails.tickets.length > 0 && (
              /* !this.state.eventStarted &&  */ <Text
                style={styles.price_info_text_style}>
                {strings.findLowestTicketPriceAndLeftTickets(
                  this.state.isUserLoggedIn &&
                    this.props.eventDetails.purchased_tickets > 0
                    ? ''
                    : // ? 'Spread the love, share with friends'
                      this.props.eventDetails.tickets,
                  this.state.isEventCompleted,
                )}
              </Text>
            )}
          {
            // this.state.isEventCompleted !== undefined &&
            //   !this.state.isEventCompleted &&
            this.state.liveEventCompleted == 0 &&
              // (this.props.eventDetails.purchased_tickets ==  0 ? (
              (this.props.eventDetails.already_redeemed == false ? (
                this.state.enterTicketCodeClick === false ? (
                  <View
                    style={[
                      styles.enter_ticket_start_watching_container,
                      {
                        marginTop: 5,
                        marginBottom: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'tranparent',
                        borderWidth: 0,
                      },
                    ]}>
                    <Text
                      style={{color: '#fff'}}
                      onPress={() => {
                        this.onPressEnterTicketCode();
                      }}>
                      I already have a ticket code
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.enter_ticket_start_watching_container,
                      {marginTop: 5, marginBottom: 5},
                    ]}>
                    <View style={styles.enter_ticket_code_view}>
                      <TextInput
                        style={styles.enter_ticket_code_textinput}
                        placeholder={strings.enter_ticket_code}
                        maxLength={9}
                        placeholderTextColor={'#000'}
                        value={this.state.ticketCode}
                        autoCapitalize="characters"
                        autoCorrect={false}
                        onChangeText={(text) => {
                          var desired = text.replace(/[^-0-9A-Za-z ]/gi, '');
                          let splitText = desired.split('');
                          text = '';
                          splitText.map((it) => {
                            if (it !== ' ') {
                              text = text + it;
                            }
                          });
                          if (text.length > 4 && !text.includes('-')) {
                            let text1 = text.substr(0, 4) + '-';
                            let text2 = text.substr(4, 4);
                            console.log(
                              'text: ' + text,
                              'text1: ' + text1,
                              'text2: ' + text2,
                            );
                            text = text1 + text2;
                            console.log(
                              'text: ' + text,
                              'text1: ' + text1,
                              'text2: ' + text2,
                            );
                          }
                          for (let i = 0; i < text.length; i++) {
                            if (i !== 4 && text[i] === '-') {
                              console.log(
                                `if (i === 4 && text[${i}] === '-'){${text[i]}}`,
                                '..........in...............',
                              );
                              text = text.replace('-', '');
                            } else {
                              console.log(
                                `if (i === 4 && text[${i}] === '-'){${text[i]}}`,
                                '..........out...............',
                              );
                            }
                          }
                          this.setState({ticketCode: text});
                        }}
                        onKeyPress={({nativeEvent}) => {
                          let {ticketCode} = this.state;
                          if (ticketCode.length === 5) {
                            if (nativeEvent.key === 'Backspace') {
                              ticketCode = ticketCode.substr(0, 4);
                            }
                            this.setState({
                              ticketCode: ticketCode,
                            });
                          }
                        }}
                        allowFontScaling={true}
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.start_watching_btn_style}
                      onPress={this.validateTicketCode}>
                      <Text
                        style={[
                          styles.start_watching_text_style,
                          {color: '#1017ff'},
                        ]}>
                        {/* {strings.start_watching} */}
                        Redeem
                      </Text>
                    </TouchableOpacity>
                  </View>
                )
              ) : (
                this.state.liveEventCompleted == 1 && (
                  <TouchableOpacity
                    style={[
                      styles.start_watching_btn_style,
                      {marginBottom: 16},
                    ]}
                    onPress={async () => await this.startWatchingVideo()}>
                    <ImageBackground
                      imageStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4,
                      }}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 122,
                        height: 40,
                        borderRadius: 4,
                      }}
                      source={Images.btn_gradint}>
                      <Text style={styles.start_watching_text_style}>
                        {strings.start_watching}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )
              ))
          }
          {this.state.error_msg !== '' && (
            <Text style={{color: '#fe0000', textAlign: 'center'}}>
              {this.state.error_msg}
            </Text>
          )}
          <View
            style={[
              styles.wishlist_share_invite_container,
              {marginTop: 10, justifyContent: 'center'},
            ]}>
            <TouchableOpacity
              style={styles.dotIconView}
              onPress={() => {
                addToCalendar(
                  this.props.eventDetails.title,
                  this.props.eventDetails.date * 1000,
                );
              }}>
              <Image
                style={[styles.user_action_icon]}
                source={Images.icons_add_to_calendar}
              />
              <Text style={styles.dotTextStyle}>{'Calendar'}</Text>
            </TouchableOpacity>
            {this.state.isLoggedIn && (
              <TouchableOpacity
                style={styles.dotIconView}
                onPress={() => this.WatchlistUnwatchlistEvent()}>
                <Image
                  style={[styles.user_action_icon]}
                  source={
                    this.props.isAddedToWatchlist
                      ? VODIcons.fav_selected
                      : VODIcons.fav_normal
                  }
                />
                <Text style={styles.dotTextStyle}>{strings.watchlist}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.dotIconView}
              onPress={() => {
                ShareIt(this.props.eventDetails.url);
              }}>
              <Image
                style={styles.user_action_icon}
                source={VODIcons.send_normal}
              />
              <Text style={styles.dotTextStyle}>{strings.share}</Text>
            </TouchableOpacity>
            {/* {this.state.isLoggedIn && (
              <TouchableOpacity
                style={styles.dotIconView}
                onPress={() => {
                  this.handleInviteModalVisibility();
                }}>
                <Image
                  style={styles.user_action_icon}
                  source={VODIcons.invite_normal}
                />
                <Text style={styles.dotTextStyle}>{strings.invite}</Text>
              </TouchableOpacity>
            )} */}
            {/* <CommonActivityIndicator isVisible={this.props.requestingInvite} /> */}
          </View>
          {/* )} */}
        </LinearGradient>
      </ImageBackground>
    );
  }

  returnTipSelectionView() {
    return (
      // <RBSheet
      //   ref={(ref) => {
      //     this.RBSheet_Tips = ref;
      //   }}
      //   closeOnDragDown={false}
      //   closeOnPressMask={false}
      //   height={height}
      //   openDuration={10}
      //   animationType={'fade'}
      //   keyboardAvoidingViewEnabled={true}
      //   customStyles={{
      //     container: {
      //       borderTopLeftRadius: 10,
      //       borderTopRightRadius: 10,
      //       marginTop: 50,
      //       backgroundColor: '#69696a52',
      //     },
      //     wrapper: {
      //       backgroundColor: '#69696a52',
      //     },
      //     draggableIcon: {
      //       backgroundColor: 'transparent',
      //     },
      //   }}>
      //   <ScrollView>
      //   {Platform.OS == 'android' ?
      //     <BlurView
      //       style={styles.blurView_tip}
      //       blurType="dark"
      //       blurAmount={30}
      //       reducedTransparencyFallbackColor="blur"
      //     />
      //     :
      //     <VibrancyView
      //       style={styles.blurView_tip}
      //       blurType="ultraThinMaterialDark"
      //       blurAmount={10}
      //       reducedTransparencyFallbackColor="blur"
      //     />
      //     }
      //     <TipPayment
      //       closeTips={() => this.closeTips()}
      //       step={this.state.tipsStep}
      //       SelectedAmount={(val) => {
      //         this.SelectedAmount(val);
      //       }}
      //       validateCardDetails={(
      //         cardNUmberField1,
      //         cardNUmberField2,
      //         cardNUmberField3,
      //         cardNUmberField4,
      //         cardHolderName,
      //         cvv,
      //         expiryMonth,
      //         expiryYear,
      //         SelectedAmount,
      //         tipMessage,
      //       ) => {
      //         this.validateCardDetails(
      //           cardNUmberField1,
      //           cardNUmberField2,
      //           cardNUmberField3,
      //           cardNUmberField4,
      //           cardHolderName,
      //           cvv,
      //           expiryMonth,
      //           expiryYear,
      //           SelectedAmount,
      //           tipMessage,
      //         );
      //       }}
      //       //stepHandel={(val, message) => this.stepHandel(val, message)}
      //       tipMessage={(val) => this.setState({ tipMessage: val })}
      //       takeOneStepBack={this.takeOneStepBack}
      //     />
      //   </ScrollView>
      // </RBSheet>
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalTipVisible}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              marginTop: 80,
              backgroundColor: '#69696a52',
              //backgroundColor: 'green',
            }}>
            {Platform.OS == 'android' ? (
              <BlurView
                style={styles.blurView_tip}
                blurType="prominent"
                blurAmount={10}
                reducedTransparencyFallbackColor="blur"
              />
            ) : (
              <VibrancyView
                style={styles.blurView_tip}
                blurType="ultraThinMaterialDark"
                blurAmount={10}
                reducedTransparencyFallbackColor="blur"
              />
            )}
            <TipPayment
              closeTips={() => this.closeTips()}
              artistName={this.props.eventDetails.artist.title}
              step={this.state.tipsStep}
              InAppSuccessfullyDone={(amount, message) =>
                this.InAppSuccessfullyDone(amount, message)
              }
              SelectedAmount={(val) => {
                this.SelectedAmount(val);
              }}
              validateCardDetails={(
                cardNUmberField1,
                cardNUmberField2,
                cardNUmberField3,
                cardNUmberField4,
                cardHolderName,
                cvv,
                expiryMonth,
                expiryYear,
                SelectedAmount,
                tipMessage,
              ) => {
                this.validateCardDetails(
                  cardNUmberField1,
                  cardNUmberField2,
                  cardNUmberField3,
                  cardNUmberField4,
                  cardHolderName,
                  cvv,
                  expiryMonth,
                  expiryYear,
                  SelectedAmount,
                  tipMessage,
                );
              }}
              //stepHandel={(val, message) => this.stepHandel(val, message)}
              tipMessage={(val) => this.setState({tipMessage: val})}
              takeOneStepBack={this.takeOneStepBack}
            />
          </View>
        </ScrollView>
      </Modal>
    );
  }

  returnEventScheduleView() {
    return (
      <View style={styles.event_indicator_container}>
        <Text style={styles.event_schedule_text_style}>
          {strings.event_schedule}
        </Text>
        <FlatList
          style={{
            width: '100%',
          }}
          horizontal
          data={this.props.eventDetails.schedule}
          renderItem={({item}) => {
            return (
              <View style={styles.dot_view_container}>
                <View
                  style={{
                    height: 11,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: 65,
                      height: 1,
                      backgroundColor: colors.scheduleLineColor,
                    }}
                  />
                  <View style={styles.dot_view} />
                  <View
                    style={{
                      width: 65,
                      height: 1,
                      backgroundColor: colors.scheduleLineColor,
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 0.8,
                    width: 65 * 2 + 10,
                    marginTop: 13,
                  }}>
                  <View
                    style={{
                      marginLeft: 65,
                    }}>
                    <Text style={[styles.single_ladies_text_style]}>
                      {item.title}
                    </Text>
                    <Text style={styles.beyonce_text_style}>{item.title}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }

  returnArtistDisplayView(upperTab, lowerTab) {
    return (
      <ImageBackground
        // source={{ uri: this.props.eventDetails.artist.image }}
        source={getResponsiveImage(this.props.eventDetails.artist, true)}
        // source={
        //   Platform.isPad == true
        //     ? {
        //         uri: this.props.eventDetails.artist['image-responsive'].normal[
        //           '<767'
        //         ],
        //         priority: FastImage.priority.high,
        //       }
        //     : this.props.eventDetails.artist['image-responsive'] != undefined &&
        //       this.props.eventDetails.artist['image-responsive'] != null &&
        //       this.props.eventDetails.artist['image-responsive'].normal !=
        //         undefined &&
        //       this.props.eventDetails.artist['image-responsive'].normal != null
        //     ? {
        //         uri: this.props.eventDetails.artist['image-responsive'].normal[
        //           '>767'
        //         ],
        //         priority: FastImage.priority.high,
        //       }
        //     : {
        //         uri: this.props.eventDetails.artist.image,
        //         priority: FastImage.priority.high,
        //       }
        // }
        style={styles.white_img_bg_style}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0,0.91)', '#000']}
          style={styles.linearGradient}>
          <Text style={styles.img_title_beyonce_text_style}>
            {this.props.eventDetails.artist.title}
          </Text>
          <View style={styles.follower_n_rating_container}>
            <Text style={styles.white_img_follow_count_text_style}>
              {this.props.followersEDS} Followers{'   '}•{'   '}
            </Text>
            <Text style={styles.white_img_follow_count_text_style}>
              {this.props.eventDetails.rating} Rating
            </Text>
          </View>
          {!this.state.followArtist && (
            <TouchableOpacity
              disabled={this.state.followBtn}
              style={styles.white_follow_artist_btn_style}
              onPress={this.FollowUnfollowArtist}>
              <ImageBackground
                imageStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 40,
                }}
                source={Images.btn_gradint}>
                <Text style={styles.follow_the_Artist_text_style}>
                  {!this.props.isArtistFollowedEDS
                    ? strings.follow_the_artist
                    : strings.following}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          )}
          <View style={styles.tab_view_container}>
            {this.props.eventDetails.artist.past_events.length !== 0 && (
              <TouchableOpacity
                onPress={() => this.changeUpperTab(0)}
                style={[
                  styles.tab_btn_style,
                  {borderBottomWidth: upperTab === 0 ? 3 : null},
                ]}>
                <Text style={styles.tab_btn_text_style}>
                  {strings.past_events}
                </Text>
              </TouchableOpacity>
            )}
            {this.props.eventDetails.artist.videos.length !== 0 && (
              <TouchableOpacity
                onPress={() => this.changeUpperTab(1)}
                style={[
                  styles.tab_btn_style,
                  {borderBottomWidth: upperTab === 1 ? 3 : null},
                ]}>
                <Text style={styles.tab_btn_text_style}>Video</Text>
              </TouchableOpacity>
            )}
            {this.props.eventDetails.artist.gallery.length !== 0 && (
              <TouchableOpacity
                onPress={() => this.changeUpperTab(2)}
                style={[
                  styles.tab_btn_style,
                  {borderBottomWidth: upperTab === 2 ? 3 : null},
                ]}>
                <Text style={styles.tab_btn_text_style}>Gallery</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.tab_content_view}>
            {upperTab === 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{marginLeft: 16}}>
                {this.props.eventDetails.artist.past_events.length !== 0 ? (
                  this.props.eventDetails.artist.past_events.map((item) => {
                    return (
                      <View>
                        <TouchableOpacity
                          onPress={() => this.goToEventDetailScreen(item.ref)}
                          style={styles.video_view_style}>
                          <ImageBackground
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 10,
                              backgroundColor: colors.commonBGColor,
                            }}
                            imageStyle={styles.imageBG_video}
                            // source={{ uri: item.image }}
                            source={getResponsiveImage(item, false)}>
                            <Image source={Images.play_btn} />
                          </ImageBackground>
                        </TouchableOpacity>
                        <Text
                          numberOfLines={1}
                          style={styles.past_event_video_title_text}
                          ellipsizeMode="tail">
                          {item.title}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noDataTextStyleBlack}>
                    {strings.no_past_events}
                  </Text>
                )}
              </ScrollView>
            )}
            {upperTab === 1 && (
              <ScrollView
                horizontal={true}
                contentContainerStyle={{marginLeft: 16}}
                showsHorizontalScrollIndicator={false}>
                {this.props.eventDetails.artist.videos.length !== 0 ? (
                  this.props.eventDetails.artist.videos.map((item) => {
                    return (
                      <View>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.navigate(
                              navigationKeys.vod_screen,
                              {
                                videoId: splitEndPoint(item.ref),
                              },
                            )
                          }
                          style={styles.video_view_style}>
                          <ImageBackground
                            style={{
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 10,
                              backgroundColor: colors.commonBGColor,
                            }}
                            imageStyle={styles.imageBG_video}
                            // source={{ uri: item.image }}
                            source={getResponsiveImage(item, false)}>
                            <Image source={Images.play_btn} />
                          </ImageBackground>
                        </TouchableOpacity>
                        <Text
                          numberOfLines={1}
                          style={styles.past_event_video_title_text}>
                          {''}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noDataTextStyleBlack}>
                    {strings.no_content_available(strings.videos)}
                  </Text>
                )}
              </ScrollView>
            )}
            {upperTab === 2 && (
              <ScrollView
                horizontal={true}
                contentContainerStyle={{marginLeft: 16}}
                showsHorizontalScrollIndicator={false}>
                {this.props.eventDetails.artist.gallery.length !== 0 ? (
                  this.props.eventDetails.artist.gallery.map((item) => {
                    return (
                      <View>
                        <View
                          style={{
                            height: 114,
                            marginVertical: 8,
                          }}>
                          <TouchableOpacity
                            style={styles.image_small_size_style}
                            onPress={() => {
                              this.setModalVisible(true, 0);
                            }}>
                            <Image
                              style={styles.image_container}
                              // source={{ uri: item.image }}
                              source={getResponsiveImage(item, false)}
                            />
                          </TouchableOpacity>
                        </View>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: Fonts.OpenSans_semibold,
                            fontSize: normalize(12),
                          }}>
                          {''}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.noDataTextStyleBlack}>
                    {strings.no_content_available(strings.photos)}
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
          <View style={[styles.tab_view_container, {marginTop: 20}]}>
            {this.props.eventDetails.artist.merchandise.length !== 0 && (
              <TouchableOpacity
                onPress={() => this.changeLowerTab(0)}
                style={[
                  styles.tab_btn_style,
                  {borderBottomWidth: lowerTab === 0 ? 3 : null},
                ]}>
                <Text style={styles.tab_btn_text_style}>
                  {strings.buy_albums}
                </Text>
              </TouchableOpacity>
            )}
            {this.props.eventDetails.artist.merchandise.length !== 0 && (
              <TouchableOpacity
                onPress={() => this.changeLowerTab(1)}
                style={[
                  styles.tab_btn_style,
                  {borderBottomWidth: lowerTab === 1 ? 3 : null},
                ]}>
                <Text style={styles.tab_btn_text_style}>
                  {strings.merchandise}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.tab_btn_style} />
          </View>
          <View style={styles.tab_content_view}>
            {lowerTab === 0 && (
              <ScrollView
                horizontal={true}
                contentContainerStyle={{marginLeft: 16}}
                showsHorizontalScrollIndicator={false}>
                {this.props.eventDetails.artist.merchandise.length !== 0 ? (
                  this.props.eventDetails.artist.merchandise.map((item) => {
                    return (
                      item.category === 'Albums' && (
                        <View style={styles.album_main_view_container}>
                          <TouchableOpacity>
                            <ImageBackground
                              // source={{ uri: item.image }}
                              source={getResponsiveImage(item, false)}
                              imageStyle={
                                styles.album_main_view_Image_background
                              }
                              style={styles.album_view_style}>
                              <Text
                                style={styles.album_name_text_style_tab_view}>
                                {item.title}
                              </Text>
                            </ImageBackground>
                          </TouchableOpacity>
                          <ImageBackground
                            source={Images.btn_gradint}
                            imageStyle={{borderRadius: 10}}
                            style={styles.buy_btn_album_view_style}>
                            <TouchableOpacity
                              style={styles.buy_btn_album_view_style}
                              onPress={() => {
                                Linking.openURL(item.link);
                              }}>
                              <Text style={styles.buy_text_style}>BUY</Text>
                            </TouchableOpacity>
                          </ImageBackground>
                        </View>
                      )
                    );
                  })
                ) : (
                  <Text style={styles.noDataTextStyleBlack}>
                    No albums available
                  </Text>
                )}
              </ScrollView>
            )}
            {lowerTab === 1 && (
              <ScrollView
                horizontal={true}
                contentContainerStyle={{marginLeft: 16}}
                showsHorizontalScrollIndicator={false}>
                {this.props.eventDetails.artist.merchandise.length !== 0 ? (
                  this.props.eventDetails.artist.merchandise.map((item) => {
                    return (
                      item.category === 'Merchandise' && (
                        <View style={styles.album_main_view_container}>
                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL(item.link);
                            }}>
                            <ImageBackground
                              // source={{ uri: item.image }}
                              source={getResponsiveImage(item, false)}
                              imageStyle={
                                styles.album_main_view_Image_background
                              }
                              style={styles.album_view_style}>
                              <Text
                                style={styles.album_name_text_style_tab_view}>
                                {item.title}
                              </Text>
                            </ImageBackground>
                          </TouchableOpacity>
                          <TouchableOpacity style={{height: 24}}>
                            <Text style={styles.buy_text_style}>{''}</Text>
                          </TouchableOpacity>
                        </View>
                      )
                    );
                  })
                ) : (
                  <Text style={styles.noDataTextStyleBlack}>
                    No Merchandise available
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  /*returnEventsForYouView() {
      return (
        <View style={styles.event_for_view_container}>
            <View style={styles.event_for_you_title_view}>
              <Text style={styles.events_for_you_text_title}>
                {strings.events_for_you}
              </Text>
            </View>
            {this.props.eventDetails.for_you.length !== 0 ? (
              this.props.eventDetails.for_you.map((item) => {
                return (
                  <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.lady_gaga_concert_img_bg_style}
                    imageStyle={{
                      width: '100%',
                      height: 185,
                      borderRadius: 5,
                    }}>
                    <LinearGradient
                      colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0,0.50)', '#000']}
                      style={styles.linearGradient2}>
                      <View style={styles.artist_name_n_concert_name_container}>
                        <Image
                          style={styles.lady_gaga_user_pic_style}
                          source={{ uri: item.band.image }}
                        />
                        <View
                          style={{
                            flex: 1,
                          }}>
                          <Text
                            style={
                              styles.artist_name_title_text_event_for_you_style
                            }>
                            {item.band.title}
                          </Text>
                          <Text
                            style={styles.concert_title_text_style}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {item.title}
                          </Text>
                          <Text style={styles.concert_timing_text_style}>
                            {formatDateFromMilliseconds(item.date, 1)}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'flex-end',
                            }}>
                            <View style={{ flex: 1 }}>
                              <RBDailog
                                lableText={strings.buy_tickets}
                                btn_style={
                                  styles.buy_tickets_concert_artist_btn_style
                                }
                                lbl_style={
                                  styles.buy_ticket_concert_artist_text_style
                                }
                                ticketLeft={strings.findLowestTicketPriceAndLeftTickets(
                                  this.props.eventDetails.tickets,
                                )}
                              />
                            </View>
                            <TouchableOpacity
                              style={styles.evertsForYouRightArrowView}
                              onPress={() => this.goToEventDetailScreen(item.ref)}>
                              <Image source={Images.right_arrow_padding} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                );
              })
            ) : (
                <Text style={styles.noDataTextStyleWhite}>
                  {strings.no_content_available(strings.data)}
                </Text>
              )}
          </View>
      );
    }*/
  returnEventsForYouView() {
    return (
      <View style={styles.event_for_view_container}>
        <View style={styles.event_for_you_title_view}>
          <Text style={styles.events_for_you_text_title}>Explore Gigs</Text>
        </View>
        {this.props.eventDetails.for_you.length !== 0 ? (
          this.props.eventDetails.for_you.map((item) => {
            return (
              <ImageBackground
                // source={{ uri: item.image }}
                source={getResponsiveImage(item, true)}
                style={styles.lady_gaga_concert_img_bg_style}
                imageStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 5,
                }}>
                <TouchableOpacity
                  onPress={() => this.goToEventDetailScreen(item.ref)}>
                  <LinearGradient
                    colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0,0.50)', '#000']}
                    style={styles.linearGradient2}>
                    <View style={styles.artist_name_n_concert_name_container}>
                      <TouchableOpacity
                        style={{alignSelf: 'flex-end'}}
                        onPress={() => {
                          this.props.navigation.push('ArtistScreen', {
                            id: splitEndPoint(item.band.ref),
                          });
                        }}>
                        <Image
                          style={styles.lady_gaga_user_pic_style}
                          source={
                            item.band !== null &&
                            getResponsiveImage(item.band, false)
                          }
                          // source={{uri: item.band.image}}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          flex: 1,
                        }}>
                        <Text
                          style={
                            styles.artist_name_title_text_event_for_you_style
                          }>
                          {item.band.title}
                        </Text>
                        <Text
                          style={styles.concert_title_text_style}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {item.title}
                        </Text>
                        <Text style={styles.concert_timing_text_style}>
                          {formatDateFromMilliseconds(item.date, 1)}
                        </Text>
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginBottom: 5,
                          }}>
                          {item.labels != undefined &&
                            item.labels != null &&
                            item.labels.length != 0 &&
                            item.labels.map((itm, idx) => {
                              return (
                                <View
                                  style={{
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    marginRight: 10,
                                  }}>
                                  <Image
                                    source={
                                      item.labels[idx].type == 'live'
                                        ? Images.live_stream_icon
                                        : item.labels[idx].type == 'demand'
                                        ? Images.ondemand
                                        : Images.event_expired
                                    }
                                    style={[
                                      styles.status_img_style,
                                      {
                                        height: SLIDER_HEIGHT / 30,
                                        width: SLIDER_WIDTH / 30,
                                      },
                                    ]}></Image>
                                  <Text style={styles.live_stream_text_style}>
                                    {item.labels[idx].label}
                                  </Text>

                                  {idx + 1 === item.labels.length - 1 && (
                                    <Text
                                      style={[
                                        styles.live_stream_text_style,
                                        {fontSize: 16},
                                      ]}>
                                      +{' '}
                                    </Text>
                                  )}
                                </View>
                              );
                            })}
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                          }}>
                          <View style={{}}>
                            <TouchableOpacity
                              style={
                                styles.buy_tickets_concert_artist_btn_style
                              }
                              onPress={() => this.BuyTicket(item.ref)}>
                              <ImageBackground
                                imageStyle={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: 5,
                                }}
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                                source={Images.btn_gradint}>
                                <Text
                                  style={[
                                    styles.buy_ticket_concert_artist_text_style,
                                  ]}>
                                  {strings.buy_tickets}
                                </Text>
                              </ImageBackground>
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            style={styles.evertsForYouRightArrowView}
                            onPress={() =>
                              this.goToEventDetailScreen(item.ref)
                            }>
                            <Image source={Images.right_arrow_padding} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </ImageBackground>
            );
          })
        ) : (
          <Text style={styles.noDataTextStyleWhite}>
            {strings.no_content_available(strings.data)}
          </Text>
        )}
      </View>
    );
  }

  returnSimilarArtistView() {
    return (
      <View style={{marginTop: 35}}>
        <View style={styles.event_for_you_title_view}>
          <View style={{flex: 1}}>
            <Text style={[styles.events_for_you_text_title, {marginLeft: 16}]}>
              {strings.similar_artists}
            </Text>
          </View>
        </View>
        <Similar_artist
          disabled={this.state.disabled}
          similarArtistData={this.props.eventDetails.similar_artists}
          goToArtistScreen={(ref) => {
            this.goToArtistScreen(ref);
          }}
        />
      </View>
    );
  }
  goToArtistScreen = (id) => {
    this.setState({
      disabled: true,
    });
    console.log('Call goToArtistScreen');
    // if (this.props.homeScreen == true) {
    //this.clearRunningInterval()
    // }
    const split_id = id.split('/');
    this.props.navigation.push('ArtistScreen', {id: split_id[2]});
  };
  returnBottomRBSheet() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheet = ref;
        }}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={height / 4}
        openDuration={100}
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
          {this.state.tag === 'Buy Tickets' ? (
            <TouchableOpacity
              style={styles.modal_buy_btn_style}
              onPress={() => {
                this.RBSheet.close();
                this.openSheet();
              }}>
              <Text style={styles.buy_ticket_text_style}>
                {/* {this.state.tag === 'follow'
                ? 'Login to Follow'
                : this.state.tag === 'login' && this.state.isLoggedIn == false
                ? 'Login to Chat'
                : 'Login to Buy Tickets'} */}
                {/* {this.state.tag} to Chat */}
                {this.state.tag}
              </Text>
            </TouchableOpacity>
          ) : this.state.tag === 'Login to Buy Tickets' ? (
            <TouchableOpacity
              style={styles.modal_buy_btn_style}
              onPress={this.check_login}>
              <Text style={styles.buy_ticket_text_style}>
                {/* {this.state.tag === 'follow'
                ? 'Login to Follow'
                : this.state.tag === 'login' && this.state.isLoggedIn == false
                ? 'Login to Chat'
                : 'Login to Buy Tickets'} */}
                Login to Buy Tickets
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.modal_buy_btn_style}
              onPress={this.check_login}>
              <Text style={styles.buy_ticket_text_style}>
                {/* Login to {this.state.tag} */}
                LogIn
              </Text>
            </TouchableOpacity>
          )}
          {this.state.isLoggedIn == false && (
            <View>
              <Text style={styles.already_have_login_text_style}>
                Get the tickets to Unlock the Chat
              </Text>
              {/* <Text style={styles.login_text_modal_style}>
                  To enjoy features such as Tipping, Chatting, Following artists, and much more.
                </Text> */}

              <View style={styles.login_line_modal_style}>
                <Text style={styles.already_have_login_text_style}>
                  {!(
                    this.props.eventDetails.purchased_tickets &&
                    this.state.isUserLoggedIn
                  ) && `Don't have an account ?`}
                </Text>
                {!(
                  this.props.eventDetails.purchased_tickets &&
                  this.state.isUserLoggedIn
                ) && (
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.already_have_login_text_style}>
                      {strings.or}
                    </Text>
                    <TouchableOpacity onPress={this.gotoLogin}>
                      <Text style={styles.login_text_modal_style}>
                        Register
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {this.state.isUserLoggedIn === false && (
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.already_have_login_text_style}>
                      {strings.or}
                    </Text>
                    <TouchableOpacity onPress={this.gotoLogin}>
                      <Text style={styles.login_text_modal_style}>
                        {strings.login}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
          {this.state.tag === 'Buy Tickets' && (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.already_have_login_text_style}>
                {/* {strings.or} */}
                To enjoy features such as Tipping, Chatting, and much more.
              </Text>
              {/* <Text style={styles.login_text_modal_style}>
                  To enjoy features such as Tipping, Chatting, Following artists, and much more.
                </Text> */}
            </View>
          )}
        </View>
      </RBSheet>
    );
  }

  returnBottomRBSheetReport() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetReport = ref;
        }}
        closeOnDragDown={true}
        closeOnPressMask={false}
        // height={height / 4.3}
        openDuration={100}
        customStyles={{
          container: {
            backgroundColor: '#1b1c20',
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
        <View style={styles.BlockMsgMainView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.MsgViewRB, {flex: 1}]}>
              <Text style={styles.usernameTextStyle} numberOfLines={1}>
                {this.state.reportUserName} : {this.state.reportMsg}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.close_view_container,
                {marginRight: 10, backgroundColor: 'gray'},
              ]}
              onPress={() => {
                this.RBSheetReport.close();
              }}>
              <Icon name="close" size={30} color="#fff"></Icon>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.ReportUserView}
            onPress={() => {
              this.reportMessage(2);
            }}>
            <Text style={styles.usernameTextStyle}>Report Message</Text>
            <Octicons name="report" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.reportMessage(1);
            }}
            style={styles.BlockUserView}>
            <Text style={styles.usernameTextStyle}>Block User</Text>
            <Entypo name="block" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  }

  returnBottomRBSheetStartWatching() {
    return (
      <RBSheet
        ref={(ref) => {
          this.RBSheetStartWatching = ref;
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
          <TouchableOpacity onPress={() => this.RBSheetStartWatching.close()}>
            <Icon name="close" size={30} color="#1b1c20"></Icon>
          </TouchableOpacity>
        </View>
        <View style={styles.btn_n_details_container}>
          <View style={styles.login_line_modal_style}>
            <Text style={styles.already_have_login_text_style}>
              {'You have a valid ticket, please '}
            </Text>
            <TouchableOpacity onPress={this.gotoRegister}>
              <Text style={styles.login_text_modal_style}>{`Register`}</Text>
            </TouchableOpacity>
            <Text style={styles.already_have_login_text_style}>{` or `}</Text>
            <TouchableOpacity onPress={this.gotoLogin}>
              <Text style={styles.login_text_modal_style}>{strings.login}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  }

  returnImageViewer() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}>
        <View style={styles.modal_main_view}>
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}
            style={styles.modal_close_view}>
            <EvilIcons
              style={{marginRight: 10}}
              name="close"
              size={40}
              color={colors.pureWhiteColor}
            />
          </TouchableOpacity>
          <View style={styles.modal_imag_view}>
            <Carousel
              sliderWidth={SLIDER_WIDTH}
              sliderHeight={ITEM_HEIGHT}
              itemWidth={ITEM_WIDTH - 30}
              data={this.props.eventDetails.artist.gallery}
              renderItem={this._renderItem}
              hasParallaxImages={true}
              firstItem={this.state.galleryIndex}
            />
          </View>
        </View>
      </Modal>
    );
  }

  // #region -> Global Chat View
  updateChatData = () => {
    if (this.props.availableRooms !== undefined) {
      // global.selectedRoom1 = this.props.availableRooms[
      //   this.state.selectedGroup
      // ].id;
      global.selectedRoom1 = this.props.availableRooms[
        this.state.selectedGroup
      ].id;
      //console.log('this.props.availableRooms', this.props.availableRooms);
    }
  };
  seeAllParticipants = () => {
    console.log('Data : ', this.state.participants);
    this.props.navigation.navigate(
      'ParticipantsScreen',
      {
        participants: this.state.participants,
      },
      () => {
        console.log('Data : ' + this.state.participants);
      },
    );
  };

  SetLeavePopup = (val) => {
    console.log('datttttttttttttttaaa' + val);
    /*
    this.setState({
      modalisVisibleDelete:true
    }) */
    if (Platform.OS == 'ios') {
      if (val === 1) {
        this.leaveRoom();
      } else if (val === 2) {
        this.deleteRoom();
      }
    } else {
      if (val === 1) {
        this.setState({
          confirmPopupModel: true,
          confirmPopupMessage: 'Are you sure you want to leave this room ?',
          confirmPopupAction: val,
        });
      } else if (val === 2) {
        this.setState(
          {
            confirmPopupModel: true,
            confirmPopupMessage: 'Are you sure you want to delete this room ?',
            confirmPopupAction: val,
          },
          () => {
            console.log('confirmPopupModel 2: ' + this.state.confirmPopupModel);
            console.log(
              'confirmPopupMessage : ' + this.state.confirmPopupMessage,
            );
            console.log(
              'confirmPopupAction : ' + this.state.confirmPopupAction,
            );
          },
        );
      }
    }
  };
  confirmPopupModelOKPress = () => {
    if (this.state.confirmPopupAction === 1) {
      this.leaveRoom();
    } else if (this.state.confirmPopupAction === 2) {
      this.deleteRoom();
    }
    this.setState({
      confirmPopupModel: false,
      confirmPopupMessage: '',
      confirmPopupAction: 0,
    });
  };

  leaveRoom = async () => {
    let userdata = await AsyncStorage.getItem('loginData');
    let user_token = JSON.parse(userdata).token;

    let deleteApiData = {
      roomUuid: global.selectedRoom1,
      bodyData: {
        leave: true,
      },
      headerData: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': user_token,
      },
    };
    this.props.leaveRoom(deleteApiData);
  };

  deleteRoom = async () => {
    let userdata = await AsyncStorage.getItem('loginData');
    let user_token = JSON.parse(userdata).token;

    let deleteApiData = {
      roomUuid: global.selectedRoom1,
      headerData: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': user_token,
      },
    };

    this.props.deleteRoom(deleteApiData);
  };

  reportMessage = (val) => {
      this.setState({GettingReadyLightSmall: false}, async () => {
        let userdata = await AsyncStorage.getItem('loginData');
        let user_token = JSON.parse(userdata).token;
        var sentdata = {};
        if (val == 1) {
          this.setState({repoertMessageVal: val}, () => {
            sentdata = {
              headerData: {
                token: user_token,
              },
              bodyData: {
                type: 'user',
                uuid: this.state.reportUserUid,
                action: 'flag',
              },
              origin:"EventDetailRoom"
            };
          });
        } else {
          this.setState({repoertMessageVal: val}, () => {
            sentdata = {
              headerData: {
                token: user_token,
              },
              bodyData: {
                type: 'message',
                uuid: this.state.reportMsgUuid,
                action: 'flag',
              },
              origin:"EventDetailRoom"
            };
          });
        }
        console.log('SentData : ' + JSON.stringify(sentdata));
        this.props.modrateUser(sentdata)
      });
  };

  setReportVal = (data) => {
    if (this.state.isLoggedIn) {
      this.setState(
        {
          reportMsgUuid: data.uuid,
          reportUserUid: data['uid:uuid'],
          reportUserName: data.field_username_value,
          reportMsg: data.message,
        },
        () => {
          if (this.state.reportUserUid != global.user_name_UUID_New) {
            this.RBSheetReport.open();
          } else {
            console.log('Elssseeee :::: ');
          }
        },
      );
    } else {
      console.log('isLoggedIn : ' + isLoggedIn);
      this.setState({tag: 'Report or Block User'}, () => {
        console.log('Tag : ' + this.state.tag);
        this.RBSheet.open();
      });
    }
  };

  returnGlobalChatView() {
    // const {title, id, admin, ref} =
    //   this.props.availableRooms.length > 0 &&
    //   this.props.availableRooms[0];
    //alert("src == "+ this.state.picture)
    // console.log('hellloo' + this.state.isLoggedIn);
    return (
      <LinearGradient
        style={{flex: 1}}
        colors={['rgba(10, 10, 10, 0.5)', 'rgba(0, 0, 0,1)']}>
        <View style={styles.global_chat_container}>
          {this.props.getRoomListResponse == undefined ||
          this.props.getRoomListResponse == null ||
          // this.props.getRoomListResponse.length == 0 &&
          // this.props.getRoomListResponse.rooms == undefined &&
          // this.props.getRoomListResponse.rooms == null &&
          this.props.getRoomListResponse == 'User is not logged in' ||
          this.state.isLoggedIn == false ? (
            <Text style={styles.popupTextStyle}>Global Chat </Text>
          ) : (
            this.props.getRoomListResponse != undefined &&
            this.props.getRoomListResponse != null &&
            this.props.getRoomListResponse.rooms != undefined &&
            this.props.getRoomListResponse.rooms != null &&
            this.props.getRoomListResponse.rooms != 'User is not logged in' && (
              <ChatRoomSelectionView
                roomList={this.props.getRoomListResponse}
                changeRoom={(item) => this.changeRoom(item)}
                addRoomCreate={this.addRoom}
                // leaveRoom={this.leaveRoom}
                leaveRoom={() => this.SetLeavePopup(1)}
                // deleteRoom={this.deleteRoom}
                deleteRoom={() => this.SetLeavePopup(2)}
                eventUUID={this.state.eventUUID}
                eventDetail={true}
                isLogin={this.state.userLogedIn}
                // isPurcahse = {this.props.getRoomListResponse.rooms.length>1}
                isPurcahse={this.props.eventDetails.purchased_tickets > 0}
                // closeData={this.onCloseChat}
              />
            )
          )}

          <ConfirmPopUp
            confirmPopupModel={this.state.confirmPopupModel}
            CancelPress={() => this.setState({confirmPopupModel: false})}
            OKPress={() => this.confirmPopupModelOKPress()}
            messageText={this.state.confirmPopupMessage}
            // OKPress = {null}
          />
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {/* <TouchableOpacity
              style={styles.toggleChatRoomSelection}
              onPress={() => {
                if (this.state.bought_ticket) {
                  alert('Show Room selection dialog');
                }
              }}>
              <Text
                style={{
                  fontFamily: Fonts.OpenSans_semibold,
                  fontSize: normalize(16),
                  color: colors.pureWhiteColor,
                }}>
                {title}
              </Text>
              {this.state.bought_ticket && (
                <Icon
                  style={{marginLeft: 8, marginTop: 3}}
                  name="caret-down-sharp"
                  size={30}
                  color={colors.pureWhiteColor}
                />
              )}"User is not logged in"
            </TouchableOpacity> *
            {this.props.getRoomListResponse == 'User is not logged in' ? (
              <Text style={styles.popupTextStyle}>Global Chat</Text>
            ) : (
              this.props.availableRooms !== null &&
              this.props.getRoomListResponse != null &&
              this.props.getRoomListResponse != 'User is not logged in' && (
                <PopupComponent
                  handelValue={(item) => this.handelValue(item)}
                  // menuList={this.props.availableRooms}
                  menuList={this.props.getRoomListResponse.rooms}
                  // menuList={this.state.isUserLoggedIn != false ? this.props.getRoomListResponse.rooms:this.props.availableRooms}
                  // SelectedValue={
                  //   this.props.availableRooms[this.state.selectedGroup] !==
                  //   undefined
                  //     ? this.props.availableRooms[this.state.selectedGroup].title
                  //     : 'Global Chat'
                  // }
                  SelectedValue={
                    this.props.getRoomListResponse.rooms[
                      global.selectedRoom1
                    ] === undefined
                      ? 'Global chat'
                      : this.props.getRoomListResponse.rooms[
                          global.selectedRoom1
                        ].title
                  }
                  selectedRoom={global.selectedRoom1}
                  roomSelection={true}
                  parentView="EDS"
                />
              )
            )}
            {this.props.eventDetails.purchased_tickets > 0 &&
              global.selectedRoom1 == 'global' && (
                <TouchableOpacity
                  onPress={() => {
                    this.addRoom();
                  }}>
                  <Icon
                    style={{marginTop: 3}}
                    name="md-add"
                    size={30}
                    color={colors.pureWhiteColor}
                  />
                </TouchableOpacity>
              )}
          </View> */}
          {/* <TouchableOpacity
            style={styles.participants_view_container}
            onPress={() => this.seeAllParticipants()}>
            <View style={styles.participants_profile_pic}>
              <Image style={styles.user_budge_pic_small_style} />
              <Image
                style={[
                  styles.user_budge_pic_small_style,
                  { backgroundColor: '#696969', right: 2 },
                ]}
              />
              <Image
                style={[
                  styles.user_budge_pic_small_style,
                  { backgroundColor: '#9d9d9d', right: 4 },
                ]}
              />
            </View>
            <Text style={styles.participants_count_text_style}>
              {strings.participants(this.state.total_participant)}
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.latest_comment_view_style}>
          <Text style={styles.latest_comment_style}>
            {strings.latest_comment}
          </Text>
          {this.state.latestMessage !== undefined &&
            this.state.latestMessage !== null &&
            this.state.latestMessage.length !== 0 &&
            this.state.latestMessage.map((item) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (item.message_type !== 3) {
                      this.setReportVal(item);
                    }
                  }}
                  style={styles.profile_comment_time_view_container}>
                  <TouchableOpacity>
                    {item.message_type !== '3' ? (
                      <Image
                        style={styles.dpStyle}
                        source={
                          item.picture !== ''
                            ? {uri: item.picture}
                            : {
                                uri:
                                  'https://dev.gigs.live/sites/all/themes/thegigs/img/avatar.png',
                              }
                        }
                      />
                    ) : null}
                  </TouchableOpacity>
                  <View style={{marginRight: 15}}>
                    {item.message_type === '1' ? (
                      <Image
                        style={{height: 50, width: 155, resizeMode: 'contain'}}
                        source={Images.chatclap}
                      />
                    ) : item.message_type === '2' ? (
                      <Image
                        style={{height: 50, width: 155, resizeMode: 'contain'}}
                        source={Images.chatwhistle}
                      />
                    ) : item.message_type === '3' ? (
                      <View style={styles.messageRowTip}>
                        <View style={styles.tipAmountView}>
                          <ImageBackground
                            imageStyle={{borderRadius: 12}}
                            source={Images.btn_gradint}
                            style={styles.tipAmountButton}>
                            <Text style={styles.tipAmountText}>
                              $ {Math.round(item.tip_amount)}
                            </Text>
                          </ImageBackground>
                        </View>
                        <View style={styles.tipmessageDetailView}>
                          <View style={{marginTop: 8}}>
                            <Text
                              style={styles.commenterNameTipStyle}
                              numberOfLines={1}>
                              {item.field_username_value} sent love
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.tipMsgNameStyle}>
                              {item.message}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.tipUserNameNtime]}></View>
                      </View>
                    ) : item.message_type == '4' ? (
                      <Image
                        style={{height: 50, width: 155, resizeMode: 'contain'}}
                        source={Images.chatpeace}
                      />
                    ) : item.message_type == '5' ? (
                      <Image
                        style={{height: 50, width: 155, resizeMode: 'contain'}}
                        source={Images.chatrock}
                      />
                    ) : item.message_type == '6' ? (
                      <Image
                        style={{height: 50, width: 155, resizeMode: 'contain'}}
                        source={Images.chatlove}
                      />
                    ) : item.message_type == '7' ? (
                      <Image
                        style={{height: 50, width: 155, resizeMode: 'contain'}}
                        source={Images.chatlit}
                      />
                    ) : item.message_type == '8' ? (
                      <Image
                        style={{height: 50, width: 155, resizeMode: 'contain'}}
                        source={Images.chatnostalgia}
                      />
                    ) : (
                      <View
                        style={{
                          width: Dimensions.get('window').width - 40,
                          marginRight: 15,
                        }}>
                        <Text
                          numberOfLines={2}
                          style={styles.user_comment_text_style}>
                          {item.message}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
        {/* {this.props.eventDetails.purchased_tickets > 0 && ( */}
        <View style={{backgroundColor: '#0c0d0f'}}>
          {global.selectedRoom1 == 'global' && (
            <UserChatActionButtons
              tips={true}
              sendClap={(val) => this.sendNewMessage(val, val)}
              SendTip={() => this.HandelSendTip()}
            />
          )}
          {this.state.userImage !== '' && (
            <AddCommentBox
              clickAddComment={false}
              placeholder={
                this.state.userdata !== null ? this.state.user_name : ''
              }
              addComment={(comment) => {
                console.log('comment--->', comment);
                this.sendNewMessage(comment, 0);
              }}
              userImage={
                this.state.userImage !== ''
                  ? this.state.userImage
                  : {
                      uri:
                        'https://dev.gigs.live/sites/all/themes/thegigs/img/avatar.png',
                    }
              }
            />
          )}
          <OpenCloseChatRow
            openClose={'Open'}
            onCloseChat={() => this.openChat()}
          />
        </View>
        {/* )} */}
      </LinearGradient>
    );
  }
  //#endregion

  returnVideoPlayerView() {
    return (
      <Modal
        animationType={'fade'}
        supportedOrientations={['landscape', 'portrait']}
        transparent={false}
        visible={this.state.showModal}
        onRequestClose={() => {
          this.setState({showModal: !this.state.showModal});
          this.setState({fullScreen: !this.state.fullScreen});
          this.setState(
            {
              expand: !this.state.expand,
              isVidePlayerOff: !this.state.isVidePlayerOff,
              showModal: !this.state.showModal,
            },
            () => {
              Orientation.lockToPortrait();
            },
          );
          //StatusBar.setHidden(false, 'slide');
          //StatusBar.setHidden(true, 'none');
          //Orientation.lockToPortrait();
        }}>
        {this.state.PlayEventVideo === true && (
          <VideoPlayer
            source={{
              // uri: this.state.videoUrl,
              uri: this.props.eventDetails.stream,
            }}
            ref={(ref) => {
              this.player = ref;
            }}
            seekColor="#e70047"
            resizeMode="cover"
            style={
              this.state.fullScreen == true
                ? styles.fullScreen
                : styles.top_image
            }
            isFullscreen={this.state.fullScreen}
            fullScreenModeON={this.state.showModal}
            fullScreen={() => this.fullScreen('full')}
            backButton={this.backToScreen}
            expand={this.state.expand}
            miniplay={this.state.miniplay}
            miniplayer={() => this.clickToMiniplayer()}
            // liveStream= {true}
          />
        )}
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    eventType: state.EventDetatilStore.type,
    type: state.ChatRoomStore.type,
    senduserModrate: state.ChatRoomStore.senduserModrate,
    fetchingEventDetail: state.EventDetatilStore.fetchingEventDetail,
    userData: state.EventDetatilStore.userData,
    data: state.EventDetatilStore.data,
    eventDetails: state.EventDetatilStore.eventDetails,
    commentList: state.EventDetatilStore.commentList,
    EventsForYou: state.EventDetatilStore.EventsForYou,
    getUserByAlbum: state.EventDetatilStore.getUserByAlbum,
    getArtistPastEventList: state.EventDetatilStore.getArtistPastEventList,
    getSimilerArtistList: state.EventDetatilStore.getSimilerArtistList,
    getEventSchedule: state.EventDetatilStore.getEventSchedule,
    followArtist: state.EventDetatilStore.followArtist,
    buyTicket: state.EventDetatilStore.buyTicket,
    getTicket: state.EventDetatilStore.getTicket,
    sendComment: state.EventDetatilStore.sendComment,
    invitedUserData: state.EventDetatilStore.invitedUserData,
    requestingInvite: state.EventDetatilStore.requestingInvite,
    isInviteSent: state.EventDetatilStore.isInviteSent,
    requestingAction: state.EventDetatilStore.requestingAction,
    isArtistFollowedEDS: state.EventDetatilStore.isArtistFollowedEDS,
    isAddedToWatchlist: state.EventDetatilStore.isAddedToWatchlist,
    validTicketData: state.EventDetatilStore.validTicketData,
    followersEDS: state.EventDetatilStore.followersEDS,
    availableRooms: state.EventDetatilStore.availableRooms,
    getRoomListResponse: state.EventDetatilStore.getRoomListResponse,
    // Chat -> Send New Message response fields
    requestingSendNewMessageAction:
      state.EventDetatilStore.requestingSendNewMessageAction,
    sendNewMessageResponse: state.EventDetatilStore.sendNewMessageResponse,
    getRoomInfoDetailResponse: state.ChatRoomStore.getRoomInfoDetailResponse,
    roomComments: state.ChatRoomStore.roomComments,
    getChatListData: state.ChatRoomStore.getChatListData,
    deleteroom: state.ChatRoomStore.deleteRoom,
    deleteroomAction: state.ChatRoomStore.deleteroomAction,
    modrateOrigin: state.ChatRoomStore.modrateOrigin,
    EventDetailsScreenLoaded: state.EventDetatilStore.EventDetailsScreenLoaded,
  };
}

function matchDispatchToProps(dispatch) {
  return {
    GetEventDetails: (endpoint) => dispatch(GetEventDetails(endpoint)),
    EventDetailsFollow: () => dispatch(EventDetailsFollow()),
    EventDetailsBuyTicket: () => dispatch(EventDetailsBuyTicket()),
    EventDetailsSendComment: () => dispatch(EventDetailsSendComment()),
    InviteUser: (params) => dispatch(InviteUser(params)),
    FollowUnfollowArtist: (params) => dispatch(FollowUnfollowArtist(params)),
    WatchlistUnwatchlistEvent: (params) =>
      dispatch(WatchlistUnwatchlistEvent(params)),
    // Enqueue empty Event Detail data block
    RemoveCachedEventData: () => dispatch(RemoveCachedEventData()),
    validTicket: (data) => dispatch(validTicket(data)),
    validTicketClear: () => dispatch(validTicketClear()),
    GetRoomList: (comment) => dispatch(GetRoomList(comment)),
    //Chat -> Send New Message request Actions
    SendNewMessage: (params) => dispatch(SendNewMessage(params)),
    getRoomInfoDetail: (data) => dispatch(getRoomInfoDetail(data)),
    addCommentToChat: (data) => dispatch(addCommentToChat(data)),
    getChatList: (chatInfo, chatRoomId) =>
      dispatch(getChatList(chatInfo, chatRoomId)),
    appendRecievedMessage: (message) =>
      dispatch(appendRecievedMessage(message)),
    leaveRoom: (data) => dispatch(leaveRoom(data)),
    deleteRoom: (deleteApiData) => dispatch(deleteRoom(deleteApiData)),
    deleteApiBlank: () => dispatch(deleteApiBlank()),
    modrateUser: (sentdata) => dispatch(modrateUser(sentdata)),
    modrateUserClear: () => dispatch(modrateUserClear()),
  };
}

export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(EventDetailScreen);

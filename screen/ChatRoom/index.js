import React, {Component} from 'react';
import {
  Dimensions,
  ScrollView,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {styles} from './styles';
import {
  Header,
  PendingRequestRow,
  ChatRow,
  UserChatActionButtons,
  AddCommentBox,
  OpenCloseChatRow,
  GettingReady,
  ChatRoomSelectionView,
  TipPayment,
  ConfirmPopUp,
} from '../../components';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import AsyncStorage from '@react-native-community/async-storage';
//import { GetEventVipSupporters } from '../../store/EventDetatilStore/actions';
import {NavigationEvents} from 'react-navigation';
import {
  leaveRoom,
  deleteRoom,
  appendRecievedMessage,
  // === live api's
  getChatList,
  addCommentToChat,
  acceptRejectInvitation,
  getInvitationList,
  getRoomInfoDetail,
  modrateUser,
  modrateUserClear
} from '../../store/ChatRoomStore/actions';
import {GetRoomList} from '../../store/EventDetatilStore/actions';
import {BlurView, VibrancyView} from '@react-native-community/blur';
import Stripe from 'react-native-stripe-api';
import {Constaint} from '../../common/Const';
import {showToast} from '../../common/Toaster';
import {getBasicAuthForAPi} from '../../common/functions';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';
import io from 'socket.io-client';
import md5 from 'md5';
// const apiKey = Constaint.SECRET_KEY;
// const apiKey = global.ApiURL == true ? Constaint.PROD_SECRET_KEY : Constaint.SECRET_KEY;
var apiKey = '';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRoom: 'Global Chat',
      userName: 'fam3456',
      isComment: false,
      sendTip: false,
      tipsStep: 1,
      userComment: '',
      tipAmount: [],
      eventUUID: '',
      isReady: false,
      chatMassages: [],
      data: null,
      status: 'Not connected',
      defaultRoom: 'global',
      roomsList: null,
      total_participant: 0,
      participants: null,
      token: '',
      uid: '',
      userNameChat: '',
      roomName: '',
      actions_data: null,
      tip_uid: '',
      wh_uid: '',
      peace_uid: '',
      rock_uid: '',
      love_uid: '',
      lit_uid: '',
      nostalgic_uid: '',
      clap_uid: '',
      chatMessage: '',
      email: '',
      modalTipVisible: false,
      user_name: '',
      userImage: '',
      pendingRequestRoomUUid: '',
      approveRequest: false,
      accept: false,
      confirmPopupModel: false,
      deleteroomMSG: false,
      leaveroomMSG: false,
      confirmPopupMessage: '',
      confirmPopupAction: 0,
      repoertMessageVal: 0,
    };
    global.myNavigation = this.props.navigation;
    // global.selectedRoom1 = 'global';

    //this._sendPing = this._sendPing.bind(this);
    //this._getReply = this._getReply.bind(this);
    //Sthis.socket.on('dong', this._getReply);
  }

  _sendPing() {
    //emit a dong message to socket server
    // this.socket.emit('ding');
  }

  _getReply(data) {
    //get reply from socket server, log it to console
    console.log('Reply from server:' + data);
  }
  componentDidMount = async () => {
    Orientation.lockToPortrait();
    // InteractionManager.runAfterInteractions(async () => {
    var ref = this.props.navigation.state.params.uuid;
    var eventUUID = ref.split('/');
    let userdata = await AsyncStorage.getItem('loginData');
    let user_token = JSON.parse(userdata).token;
    let user_session_id = JSON.parse(userdata).sessid;
    let current_uid = JSON.parse(userdata).user.uid;
    let name = JSON.parse(userdata).user.name;
    let user_email = JSON.parse(userdata).user.mail;
    let userImage = null;
    apiKey =
      global.ApiURL == true ? Constaint.PROD_SECRET_KEY : Constaint.SECRET_KEY;
    console.log('Srtripe API KEY Chat : ' + apiKey);
    if (JSON.parse(userdata).user.picture != null) {
      userImage = JSON.parse(userdata).user.picture.url;
    } else {
      userImage =
        'https://dev.gigs.live/sites/all/themes/thegigs/img/avatar.png';
    }
    //global.selectedRoom = this.state.defaultRoom;
    console.log('Event UUID : ' + eventUUID[1]);
    console.log('Gloabal ROOM :===> ' + global.selectedRoom1);
    this.setState({
      defaultRoom: global.selectedRoom1,
    });
    // global.selectedRoom1 = this.state.defaultRoom;

    let sessionId = md5(user_session_id);
    let eventMD5Id = md5(eventUUID[1]);
    let selectedRoomMD5 = md5(global.selectedRoom1);
    //alert('session id in chat room :- ' + groupId);
    /* this.socket = io("http://dev-api.thegigs.live:8888")
        this.socket.open()
        this.socket.connect()
        //this.socket.send('hello')
        this.socket.on('connected',(data)=>{
          console.log('message from server socket :- ')
        })
        this.socket.on("message", msg => {
          //console.log('message from server socket :- '+JSON.stringify(msg))
          massageArray.push(msg)
          this.setState({ chatMessages:massageArray },()=>{
            console.log('message from server socket :- '+JSON.stringify(this.state.chatMessages))
            console.log('message from server socket sample array:- '+JSON.stringify(massageArray))
          });
        });
        this.socket.on('error', function onSocketError(e) {
          console.log('WebSocket Error ' + e);
        }); */
    // this.socket = io('https://dev.gigs.live:3000', {
    //   transports: ['websocket'],
    //   rejectUnauthorized: false,
    //   jsonp: false,
    // });
    // this.socket.connect();
    // this.socket.on('connect', () => {
    //   console.log('connected' + user_session_id);
    //   var authMessage = {
    //     authToken: sessionId,
    //   };
    //   this.socket.emit('authenticate', authMessage);
    //   this.socket.connect(`gigs_rest_event_${eventMD5Id}_${selectedRoomMD5}`);
    //   // console.log("just befor data===> ")
    // });
    // this.socket.on('ping', () => {
    //   // console.log("in ping ===> ",data)
    // });
    // this.socket.on('connect_error', (err) => {
    //   console.log(err);
    // });
    /* this.socket.on('message',(msgObj)=>{
      if(msgObj.data !== undefined){
      console.log("recievd message from dserver ===> ",msgObj)
        this.props.appendRecievedMessage(msgObj)
      }
    }) */
    this.setState(
      {
        isReady: true,
        eventUUID: eventUUID[1],
        token: user_token,
        uid: current_uid,
        userNameChat: name,
        email: user_email,
        userImage: userImage,
      },
      () => {
        //message_arr.push()
        var message_arr = this.props.roomComments.slice(1).slice(-50);
        this.setState(
          {
            chatMassages: message_arr,
          },
          () => {
            // console.log('event iD USER DidMOunt' +JSON.stringify(this.state.chatMassages),);
          },
        );
        //console.log('event iD USER DidMOunt' + JSON.stringify(message_arr));
        console.log('event iD USER DidMOunt' + this.state.token);
        //this.socket = SocketIo("https://dev.gigs.live:3000")
        console.log(
          'JSON.parse(userdata).user' +
            JSON.stringify(JSON.parse(userdata).user),
        );
        if (
          JSON.parse(userdata).user.field_username.length > 0 &&
          JSON.parse(userdata).user.field_username != undefined
        ) {
          if (
            JSON.parse(userdata).user.field_username.und[0].value.split(
              '_',
            )[1] === JSON.parse(userdata).user.uid
          ) {
            this.setState({
              user_name: JSON.parse(
                userdata,
              ).user.field_username.und[0].value.split('_')[0],
            });
          } else {
            //alert("here is new iuser name ==========> "+JSON.stringify(name))
            //console.log("isLOggedIn else _ ========> "+name)
            this.setState({
              user_name: global.user_name,
            });
          }
        } else {
          this.setState({
            user_name: global.user_name,
          });
        }
      },
    );

    //global.selectedRoom = this.state.defaultRoom;
    //this.props.getChatList(eventUUID[1], this.state.defaultRoom);
    var getParticepetsData = {
      body: {
        eventUUID: eventUUID[1],
        uuid: global.selectedRoom1,
      },
    };
    this.props.getRoomInfoDetail(getParticepetsData);
    this.props.getInvitationList();
    // });
  };
  submitChatMessage() {
    // this.socket.emit('message', this.state.chatMessage);
    this.setState({chatMessage: ''});
  }
  GetRoomList = (pendingRequestRoomUUid) => {
    console.log('Room ISD SELECTED : ' + pendingRequestRoomUUid);
    var headers = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.state.token,
    };
    var Data = {
      headerData: {
        headers,
      },
      bodyData: {
        uuid: this.state.eventUUID,
      },
    };
    this.props.GetRoomList(Data);
    // this.changeRoom(pendingRequestRoomUUid);
  };
  reload = () => {
    this.props.getInvitationList();
    console.log('event iD USER ' + this.state.eventUUID);
    console.log('event iD USER ' + this.state.token);
    // global.selectedRoom1 = 'global'
    console.log('global.selectedRoom1 ' + global.selectedRoom1);
    var getParticepetsData = {
      body: {
        eventUUID: this.state.eventUUID,
        uuid: global.selectedRoom1,
      },
    };
    var headers = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.state.token,
    };
    var Data = {
      headerData: {
        headers,
      },
      bodyData: {
        uuid: this.state.eventUUID,
      },
    };
    global.istimerOn = false;
    this.props.getRoomInfoDetail(getParticepetsData);
    this.props.GetRoomList(Data);

    this.props.getChatList(this.state.eventUUID, global.selectedRoom1);
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.type === this.props.type) {
      // if (this.props.type === 'LEAVE_ROOM_SUCCESS') {
      //   if(this.state.leaveroomMSG == false){
      //     this.setState({leaveroomMSG:true},()=>{
      //   showToast('You successfully left this room');
      //   })
      //   }
      //   global.selectedRoom = 'global';
      //   global.selectedRoom1 = 'global';
      //   Platform.OS == 'android' ? this.onCloseChat() : null;
      // } else if (this.props.type === 'DELETE_ROOM_SUCCESS') {
      //   // global.selectedRoom = 'global'
      //   if(this.state.deleteroomMSG == false){
      //     this.setState({deleteroomMSG:true},()=>{
      //       showToast('You successfully remove this room');
      //     })
      //   }
      //   global.selectedRoom = 'global';
      //   global.selectedRoom1 = 'global';
      //   Platform.OS == 'android' ? this.onCloseChat() : null;
      // }
      // if (this.props.type === "GET_ROOM_INFO_DETAIL_SUCCESS") {
      //   if(prevProps.getRoomInfoDetailResponse !== null){
      //     console.log("Particites Data : "+prevProps.getRoomInfoDetailResponse)
      //     this.setState({
      //       total_participant: Object.keys(prevProps.getRoomInfoDetailResponse.participants,).length,
      //       participants: Object.values(prevProps.getRoomInfoDetailResponse.participants),
      //     });
      //   }
      // }
    }
  };

  componentWillReceiveProps(nextProps) {
    console.log('Particites Data : ' + nextProps.type);
    global.istimerOn = false;
    if (nextProps.type === 'GET_ROOM_INFO_DETAIL_SUCCESS') {
      // console.log('Particites Data : ' + nextProps.type);
      if (nextProps.getRoomInfoDetailResponse !== null) {
        console.log(
          'Get CHat Selected Room : L ::::: ::  : ' +
            JSON.stringify(nextProps.getRoomInfoDetailResponse),
        );
        for (
          let i = 0;
          i < nextProps.getRoomInfoDetailResponse.actions.length;
          i++
        ) {
          if (nextProps.getRoomInfoDetailResponse.actions[i].title === 'Tips') {
            this.setState(
              {
                tip_uid: nextProps.getRoomInfoDetailResponse.actions[i].uuid,
              },
              () => {
                //console.log('Particites Data : ' + this.state.wh_uid + " " + this.state.clap_uid + " " + this.state.tip_uid);
              },
            );
          } else if (
            nextProps.getRoomInfoDetailResponse.actions[i].title === 'Clap'
          ) {
            this.setState(
              {
                clap_uid: nextProps.getRoomInfoDetailResponse.actions[i].uuid,
              },
              () => {
                //console.log('Particites Data : ' + this.state.wh_uid + " " + this.state.clap_uid + " " + this.state.tip_uid);
              },
            );
          } else if (
            nextProps.getRoomInfoDetailResponse.actions[i].title === 'Whistle'
          ) {
            this.setState(
              {
                wh_uid: nextProps.getRoomInfoDetailResponse.actions[i].uuid,
              },
              () => {
                //console.log('Particites Data : ' + this.state.wh_uid + " " + this.state.clap_uid + " " + this.state.tip_uid);
              },
            );
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
        this.setState({
          total_participant: Object.keys(
            nextProps.getRoomInfoDetailResponse.participants,
          ).length,
          participants: Object.values(
            nextProps.getRoomInfoDetailResponse.participants,
          ),
          actions_data: nextProps.getRoomInfoDetailResponse.actions,
        });
      }
    }
    if (nextProps.type === 'ACCEPTREJECT_INVITATION_REQUEST_SUCCESS') {
      if (nextProps.getInvitationResponse !== null) {
        console.log(
          'ACCEPTREJECT_INVITATION_REQUEST_SUCCESS Data : ',
          nextProps.acceptRejectInvitationResponse,
        );
        console.log(
          'ACCEPTREJECT_INVITATION_REQUEST_SUCCESS Data : ',
          this.state.pendingRequestRoomUUid,
        );
        if (this.state.accept == true) {
          // global.selectedRoom1 = this.state.pendingRequestRoomUUid
          // this.changeRoom(this.state.pendingRequestRoomUUid);
          this.GetRoomList(this.state.pendingRequestRoomUUid);
        }
        this.reload();
      }
    }
    // if (this.props.type == nextProps.type) {
    if (nextProps.type === 'GET_CHAT_ROOM_LIST_SUCCESS') {
      if (nextProps.getRoomListResponse) {
        // this.setState(
        //   {roomsList: Object.keys(nextProps.getRoomListResponse.rooms)},
        //   () => {
        //     console.log(
        //       'GET_CHAT_ROOM_LIST_SUCCESS Rooms LIsttt ssss======== : nextProps',
        //       nextProps.getRoomListResponse,
        //     );
        //     console.log(
        //       'GET_CHAT_ROOM_LIST_SUCCESS Rooms LIsttt ssss======== this.props : ',
        //       this.props.getRoomListResponse,
        //     );
        //     //this.scrollTOLast()
        //   },
        // );
      }
    } else if (nextProps.type === 'ADD_COMMENT_TO_CHAT_SUCCESS') {
      console.log(
        'message send successfully ===: ' +
          JSON.stringify(nextProps.addComment),
      );
      console.log('APPEND_NEW_RECEIVED_MSG_SUCCESS ===: ');
      //this.scrollTOLast()
      if (this.scrollview_Ref !== null) {
        this.scrollview_Ref.scrollToEnd({animated: true});
      }
    } else if (nextProps.typeEvent === 'GET_ROOM_LIST_SUCCESS') {
      if (nextProps.getRoomListResponse) {
        console.log(
          'Rooms LIsttt sss CHATROOM details ++++++++++++ ========== : ' +
            JSON.stringify(this.props.getRoomListResponse),
        );
      }
      if (this.state.approveRequest == true) {
        this.setState({approveRequest: false}, () => {
          this.changeRoom(global.selectedRoom1);
        });
      }
    } else if (nextProps.type === 'SEND_MODRATE_SAGA_SUCCESS') {
      console.log('Chat Rooom Will nextProps.type : ' + nextProps.modrateOrigin);
      console.log('Chat Rooom Will this.props.type : ' + this.props.modrateOrigin);
      if (nextProps.modrateOrigin == "ChatRoom") {
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
    // }
    // if (this.props.type === 'LEAVE_ROOM_SUCCESS') {
    //   if(this.state.leaveroomMSG == false){
    //     this.setState({leaveroomMSG:true},()=>{
    //   showToast('You successfully left this room');
    //   })
    //   }
    //   global.selectedRoom = 'global';
    //   global.selectedRoom1 = 'global';
    //   Platform.OS == 'android' ? this.onCloseChat() : null;
    // } else if (this.props.type === 'DELETE_ROOM_SUCCESS') {
    //   // global.selectedRoom = 'global'
    //   console.log("DELETE_ROOM_SUCCESS : "+nextProps.deleteroom)
    //   console.log("DELETE_ROOM_SUCCESS : "+this.props.deleteroom)
    //   if(this.state.deleteroomMSG == false){
    //     this.setState({deleteroomMSG:true},()=>{
    //       showToast('You successfully remove this room');
    //     })
    //   }
    //   global.selectedRoom = 'global';
    //   global.selectedRoom1 = 'global';
    //   Platform.OS == 'android' ? this.onCloseChat() : null;
    // }
    // if (nextProps.typeEvent === 'GET_CHAT_ROOM_LIST_SUCCESS') {
    //   if (nextProps.getRoomListResponse) {
    //     this.setState(
    //       { roomsList: Object.keys(nextProps.getRoomListResponse.rooms) },
    //       () => {
    //         console.log('Rooms LIsttt ssss gfdfg : ', nextProps.getRoomListResponse.actions);
    //       },
    //     );
    //   }
    // }
    // this.scrollTOEnd()
    // if (this.props.getChatListData !== undefined) {
    //   this.setState({
    //     total_participant: Object.keys(this.props.getChatListData.participants,).length,
    //     participants: Object.values(this.props.getChatListData.participants),
    //   });
    // }
    // console.log("Particites Data : "+nextProps.type)
    // console.log("Particites Data : "+this.props.type)
    // if (this.props.type === actionType.GET_ROOM_INFO_DETAIL_SUCCESS) {
    //   console.log("Particites Data : "+nextProps.getRoomInfoDetailResponse)
    //   this.setState({
    //     total_participant: Object.keys(nextProps.getRoomInfoDetailResponse.participants,).length,
    //     participants: Object.values(nextProps.getRoomInfoDetailResponse.participants),
    //   });
    // }
  }

  bin2String = (array) => {
    var result = '';
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(parseInt(array[i], 2));
    }
    return result;
  };

  handelValue = (value) => {
    this.setState({selectedRoom: value});
  };

  onCloseChat = () => {
    this.props.navigation.goBack();
  };

  addRoom = () => {
    console.log('Test');
    this.props.navigation.navigate('AddRoomScreen', {
      eventId: this.state.eventUUID,
    });
    // this.props.navigation.navigate('AddRoomScreen');
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

  aproveRejectRequest = () => {};

  rejectRequest = (index) => {
    let pendingRequests = this.state.pendingRequests;
    pendingRequests.splice(index, 1);
    this.setState({pendingRequests});
  };

  changeRoom = (selectedRoom) => {
    console.log('Selected room ::::::::::   ' + selectedRoom);
    global.selectedRoom1 = selectedRoom;
    console.log('global.selectedRoom1 ::::::::::   ' + global.selectedRoom1);
    this.props.getChatList(this.state.eventUUID, selectedRoom);
    var getParticepetsData = {
      body: {
        eventUUID: this.state.eventUUID,
        uuid: global.selectedRoom1,
      },
    };
    this.props.getRoomInfoDetail(getParticepetsData);
  };

  closeTips = () => {
    this.setState({modalTipVisible: false});
    // this.RBSheet_Tips.close();
  };

  addComment = (comment, isEmoji = false) => {
    /*  this.socket.on('message', (message) => {
       console.log('BEFORE SEND a message', message);
     }); */

    //this.setState({ chatMessage: "" });
    // console.log('clap_uid : ' + this.state.clap_uid);
    // console.log('wh_uid : ' + this.state.wh_uid);
    // console.log('peace_uid : ' + this.state.peace_uid);
    // console.log('rock_uid : ' + this.state.rock_uid);
    // console.log('love_uid : ' + this.state.love_uid);
    // console.log('lit_uid : ' + this.state.lit_uid);
    // console.log('nostalgic_uid : ' + this.state.nostalgic_uid);
    if (comment !== '') {
      var data = {
        bodyData: {
          message: comment,
          action: 'message',
          room: global.selectedRoom1,
          event: this.state.eventUUID,
          amount: this.state.tipAmount,
        },
        headerData: {
          token: this.state.token,
        },
      };

      // var clap = JSON.stringify('😗')

      console.log('room : ' + this.state.selectedRoom);
      console.log('Event : ' + this.state.eventUUID);
      // this.socket.emit('message', data.bodyData);
      if (isEmoji) {
        if (comment == 1) {
          data = {
            bodyData: {
              message: '',
              action: this.state.clap_uid,
              room: global.selectedRoom1,
              event: this.state.eventUUID,
              amount: '',
            },
            headerData: {
              token: this.state.token,
            },
          };
        } else if (comment == 2) {
          data = {
            bodyData: {
              message: '',
              action: this.state.wh_uid,
              room: global.selectedRoom1,
              event: this.state.eventUUID,
              amount: '',
            },
            headerData: {
              token: this.state.token,
            },
          };
        } else if (comment == 4) {
          data = {
            bodyData: {
              message: '',
              action: this.state.peace_uid,
              room: global.selectedRoom1,
              event: this.state.eventUUID,
              amount: '',
            },
            headerData: {
              token: this.state.token,
            },
          };
        } else if (comment == 5) {
          data = {
            bodyData: {
              message: '',
              action: this.state.rock_uid,
              room: global.selectedRoom1,
              event: this.state.eventUUID,
              amount: '',
            },
            headerData: {
              token: this.state.token,
            },
          };
        } else if (comment == 6) {
          data = {
            bodyData: {
              message: '',
              action: this.state.love_uid,
              room: global.selectedRoom1,
              event: this.state.eventUUID,
              amount: '',
            },
            headerData: {
              token: this.state.token,
            },
          };
        } else if (comment == 7) {
          data = {
            bodyData: {
              message: '',
              action: this.state.lit_uid,
              room: global.selectedRoom1,
              event: this.state.eventUUID,
              amount: '',
            },
            headerData: {
              token: this.state.token,
            },
          };
        } else if (comment == 8) {
          data = {
            bodyData: {
              message: '',
              action: this.state.nostalgic_uid,
              room: global.selectedRoom1,
              event: this.state.eventUUID,
              amount: '',
            },
            headerData: {
              token: this.state.token,
            },
          };
        }
      }
      this.props.addCommentToChat(data);
    }
    /*
     this.socket.emit('message', data.bodyData);
     this.socket.on("message", msg => {
       console.log("MAssages => ", msg)
     }) */
    // setTimeout(() => {
    //   this.scrollview_Ref.scrollToEnd({animated: true});
    // }, 100);
    //this.scrollTOLast()
  };

  scrollTOLast = () => {
    if (this.scrollview_Ref !== null) {
      setTimeout(() => {
        this.scrollview_Ref.scrollToEnd({animated: true});
      }, 1000);
    }
  };

  SetLeavePopup = (val) => {
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
        this.setState({
          confirmPopupModel: true,
          confirmPopupMessage: 'Are you sure you want to delete this room ?',
          confirmPopupAction: val,
        });
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
    let encodedString = getBasicAuthForAPi();
    let deleteApiData = {
      roomUuid: global.selectedRoom1,
      bodyData: {
        leave: true,
      },
      headerData: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': user_token,
        Authorization: `Basic ${encodedString}`, //Z2lnczpkZXY=
      },
    };
    this.props.leaveRoom(deleteApiData);
  };

  deleteRoom = async () => {
    let userdata = await AsyncStorage.getItem('loginData');
    let user_token = JSON.parse(userdata).token;
    let encodedString = getBasicAuthForAPi();
    let deleteApiData = {
      roomUuid: global.selectedRoom1,
      headerData: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedString}`,
        'X-CSRF-Token': user_token,
      },
    };

    this.props.deleteRoom(deleteApiData);
  };

  HandelSendTip = () => {
    this.setState(
      {
        modalTipVisible: true,
        tipsStep: 1,
      },
      () => {
        console.log('Test : ' + this.state.modalTipVisible);
        // this.RBSheet_Tips.open();
      },
    );
  };

  SelectedAmount = (val) => {
    this.setState({SelectedAmount: val});
  };

  takeOneStepBack = () => {
    this.setState({tipsStep: this.state.tipsStep - 1});
  };

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
      // this.setState({ tipsStep: 3 });
      const client = new Stripe(apiKey);
      await client
        .createToken({
          number: cardNumber,
          exp_month: `${expiryMonth}`,
          exp_year: `${expiryYear}`,
          cvc: `${cvv}`,
        })
        .then((token) => {
          console.log('response token===> ' + JSON.stringify(token));
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
                        event: this.state.eventUUID,
                        amount: amount,
                      },
                      headerData: {
                        token: this.state.token,
                      },
                    };
                    this.props.addCommentToChat(data);
                    this.scrollTOEnd();
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
                  // this.setState({ tipsStep: 4 });
                  // console.log('error ===> ' + JSON.stringify(error));
                  this.AddTip(amount, message);
                });
            })
            .catch((error) => {
              // this.setState({ tipsStep: 4 });
              // console.log('error ===> ' + JSON.stringify(error));
              this.AddTip(amount, message);
            });
        })
        .catch((error) => {
          // this.setState({ tipsStep: 4 });
          console.log('error ===> ' + JSON.stringify(error));
          this.AddTip(amount, message);
        });
    }
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

  pendingRequestAction = (action, uuid, roomName, roomUuid) => {
    var data;
    // var token = await AsyncStorage.getItem('token');
    var token = this.state.token;
    // console.log('UUID ' + typeof uuid);
    // console.log('action ' + typeof action);
    console.log('UUID ' + uuid);
    console.log('action ' + action);
    console.log('roomNAme ' + roomName);
    console.log('roomUuid ' + roomUuid);

    if (action == 'accept') {
      data = {
        request: {
          uuid: uuid,
          action: 'accept',
        },
        headerData: {
          token: token,
        },
      };
      // global.selectedRoom = roomName
      this.setState({roomName});
    } else if (action == 'decline') {
      data = {
        request: {
          uuid: uuid,
          action: 'decline',
        },
        headerData: {
          token: token,
        },
      };
    } else {
      data = {
        request: {
          uuid: uuid,
          action: 'remove',
        },
        headerData: {
          token: token,
        },
      };
    }
    if (action == 'accept') {
      this.setState(
        {pendingRequestRoomUUid: roomUuid, accept: true, approveRequest: true},
        () => {
          global.selectedRoom1 = roomUuid;
          this.props.acceptRejectInvitation(data);
        },
      );
    } else {
      this.props.acceptRejectInvitation(data);
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
        this.setState(
          {
            modalTipVisible: false,
          },
          () => {
            this.stepHandel(
              cardNumber,
              cardHolderName,
              cvv,
              expiryMonth,
              expiryYear,
              SelectedAmount,
              tipMessage,
            );
          },
        );
      }
    }
  };

  createRoom = async () => {
    await this.getAsyncLoggedInFlag().then((flag) => {
      if (this.props.eventDetails.purchased_tickets === 0 && !flag) {
        this.RBSheet.open();
      } else {
        var input = this.props.navigation.state.params.endpoint;
        var fields = input.split('/');

        //var name = fields[0];
        var eventID = fields[2];
        console.log('event Endpoint', eventID);
        this.props.navigation.navigate('AddRoomScreen', {eventId: eventID});
      }
    });
  };

  scrollTOEnd = () => {
    setTimeout(() => {
      this.scrollview_Ref.scrollToEnd({animated: true});
    }, 100);
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
            origin:"ChatRoom"
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
            origin:"ChatRoom"
          };
        });
      }
      console.log('SentData : ' + JSON.stringify(sentdata));
      this.props.modrateUser(sentdata);
    });
  };

  setReportVal = (data) => {
    console.log('Data setReportVal 123 : ' + JSON.stringify(data));
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
  };

  InAppSuccessfullyDone = (amount, message) => {
    console.log('Event detail Screen : ');
    // var ref = this.props.navigation.state.params.endpoint;
    // var endPoint = ref.substring(4);
    // var uuid = endPoint.split('/');
    var data = {
      bodyData: {
        message: message,
        action: this.state.tip_uid,
        room: global.selectedRoom1,
        event: this.state.eventUUID,
        amount: `${amount}`,
      },
      headerData: {
        token: this.state.token,
      },
    };
    this.props.addCommentToChat(data);
  };

  render() {
    global.istimerOn = false;
    let {
      ChatRoomStore,
      getRoomListResponse,
      getInvitationResponse,
    } = this.props;
    // console.log('User Image : ' + this.state.userImage);
    if (!this.state.isReady || ChatRoomStore.fetchingChatRoomData) {
      return (
        <SafeAreaView style={{flex: 1}}>
          <GettingReady />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={styles.main_container}>
          <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: '#0c0d0f'}}
            keyboardVerticalOffset={Platform.OS == 'ios' ? 10 : null}
            behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
            <Header />
            {/* <ScrollView
            ref={(ref) => {
              this.scrollview_Ref = ref;
            }}
            contentContainerStyle={styles.scrlView_container}> */}
            <NavigationEvents onWillFocus={async () => this.reload()} />
            <View style={styles.chatDetailsContainer}>
              {getRoomListResponse !== null && (
                <ChatRoomSelectionView
                  roomList={getRoomListResponse}
                  changeRoom={(item) => this.changeRoom(item)}
                  addRoomCreate={this.addRoom}
                  // leaveRoom={this.leaveRoom}
                  leaveRoom={() => this.SetLeavePopup(1)}
                  // deleteRoom={this.deleteRoom}
                  deleteRoom={() => this.SetLeavePopup(2)}
                  eventUUID={this.state.eventUUID}
                  closeData={this.onCloseChat}
                  isLogin={true}
                  isPurcahse={true}
                />
              )}
              {/* <TouchableOpacity
                onPress={this.seeAllParticipants}
                style={styles.participarts_view_container}>
                <View style={styles.participarts_profile_pic}>
                  <TouchableOpacity
                    style={
                      styles.user_budge_pic_small_style
                    }></TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.user_budge_pic_small_style,
                      {backgroundColor: '#696969', right: 5},
                    ]}></TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.user_budge_pic_small_style,
                      {backgroundColor: '#9d9d9d', right: 10},
                    ]}></TouchableOpacity>
                </View>
                <Text style={styles.participants_count_text_style}>
                  {this.state.total_participant} Participants
                </Text>
              </TouchableOpacity> */}
            </View>
            {/* {vipSupporters && (
              <View style={styles.vipSupporterMainView}>
                <View style={styles.supporterListHeader}>
                  <Image
                    source={Images.icons_star_component}
                    style={styles.supporterIconStyle}
                  />
                  <Text style={styles.supporterListHeaderTitle}>
                    VIP Supporters:
                  </Text>
                </View>
                {
                  <View style={styles.supporterListContainer}>
                    <Image source={Images.leftSliderIcon} />
                    <ScrollView
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}>
                      {vipSupporters.map((item) => {
                        return (
                          <View>
                            <Image
                              source={{ uri: item.userImgae }}
                              style={styles.vipUserProfilePictureStyle}
                            />
                            {item.hasUpdate === 1 && (
                              <Image
                                source={Images.vipMarkIcon}
                                style={styles.vipMarkStyle}
                              />
                            )}
                          </View>
                        );
                      })}
                    </ScrollView>
                    <Image source={Images.rightSliderIcon} />
                  </View>
                }
              </View>
            )} */}
            {/* getInvitationResponse !== undefined &&
            getInvitationResponse !== null &&
            Object.keys(getInvitationResponse).map((item, index) => {
              return (
                <PendingRequestRow
                  item={item}
                  data={getInvitationResponse}
                  key={'chat' + index}
                  aproveRejectRequest={(val, uuid, roomName) =>
                    this.pendingRequestAction(val, uuid, roomName)
                  }
                />
              );
            }) */}
            {this.props.eventDetails.purchased_tickets !== 0 &&
              getInvitationResponse !== undefined &&
              getInvitationResponse !== null &&
              Object.keys(getInvitationResponse).map((item, index) => {
                // var id = getInvitationResponse[item].event
                return (
                  // id[2]==this.state.eventUUID &&
                  //index > 2 &&
                  <PendingRequestRow
                    item={item}
                    eventID={this.state.eventUUID}
                    data={getInvitationResponse}
                    // itemEventID={getInvitationResponse[item].event.uuid}
                    key={'chat' + index}
                    aproveRejectRequest={(val, uuid, roomName, roomUuid) =>
                      this.pendingRequestAction(val, uuid, roomName, roomUuid)
                    }
                  />
                );
              })}
            {/* <View style ={{alignItems:'flex-end',marginRight:20,backgroundColor:'transparent'}}>
                    <Text onPress={()=>console.log("Show More")} style={{color:'#fff'}}>Show More</Text>
                  </View> */}

            {/* {this.props.eventDetails.purchased_tickets !== 0 &&
                  getInvitationResponse !== undefined &&
                  getInvitationResponse !== null &&
                  Object.keys(getInvitationResponse).map((item, index) => {
                    // var id = getInvitationResponse[item].event
                    return (
                      // id[2]==this.state.eventUUID &&
                      <PendingRequestRow
                        item={item}
                        eventID={this.state.eventUUID}
                        data={getInvitationResponse}
                        // itemEventID={getInvitationResponse[item].event.uuid}
                        key={'chat' + index}
                        aproveRejectRequest={(val, uuid, roomName, roomUuid) =>
                          this.pendingRequestAction(
                            val,
                            uuid,
                            roomName,
                            roomUuid,
                          )
                        }
                      />
                    );
                  })} */}
            {/* {this.props.getChatListData &&
                      this.props.roomComments.length !== 0 &&
                      this.props.roomComments.map((item, index) => {
                        return (
                          <ChatRow
                            item={item}
                            index={index}
                            uid={this.state.uid}
                          />
                        );
                      })} */}
            <ScrollView
              style={{backgroundColor: '#0c0d0f'}}
              contentContainerStyle={{backgroundColor: '#0c0d0f'}}
              ref={(ref) => {
                this.scrollview_Ref = ref;
              }}
              // contentContainerStyle={styles.scrlView_container}
              onContentSizeChange={() => {
                this.scrollview_Ref.scrollToEnd({animated: true});
              }}>
              {/* {this.props.getChatListData &&
              this.props.roomComments.slice(0).slice(-50).length !== 0 &&
              this.props.roomComments
                .slice(0)
                .slice(-50)
                .map((item, index) => {
                  return (
                    <ChatRow item={item} index={index} uid={this.state.uid} />
                  );
                })} */}
              {this.props.getChatListData &&
                this.props.roomComments.slice(0).slice(-50).length !== 0 &&
                this.props.roomComments.length !== 0 && (
                  <FlatList
                    data={this.props.roomComments.slice(0).slice(-50)}
                    initialNumToRender={49}
                    renderItem={({item, index}) => (
                      <ChatRow
                        item={item}
                        index={index}
                        uid={this.state.uid}
                        setReportVal={(data) => {
                          this.setReportVal(data);
                        }}
                      />
                    )}
                  />
                )}
            </ScrollView>
            {/* </ScrollView> */}
            {global.selectedRoom1 == 'global' && (
              <UserChatActionButtons
                tips={true}
                sendClap={(val) => this.addComment(val, true)}
                SendTip={() => this.HandelSendTip()}
                //SendTipUpper={() => this.HandelSendTip()}
              />
            )}
            <AddCommentBox
              placeholder={this.state.user_name}
              clickAddComment={false}
              addComment={(comment) => this.addComment(comment)}
              // userImage={this.state.userImage}
              userImage={global.user_image}
            />
            {/* <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'height' : null}> */}
            {/* <RBSheet
                ref={(ref) => {
                  this.RBSheet_Tips = ref;
                }}
                closeOnDragDown={false}
                closeOnPressMask={false}
                height={height / 1}
                openDuration={10}
                animationType={'fade'}
                // keyboardAvoidingViewEnabled="padding"
                customStyles={{
                  container: {
                    zIndex: 2,
                    backgroundColor: '#69696a52',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    marginTop: 50,
                  },
                  wrapper: {
                    backgroundColor: 'transparent',
                  },
                  draggableIcon: {
                    backgroundColor: 'transparent',
                  },
                }}>
                {Platform.OS == 'android' ?
                <BlurView
                  style={styles.blurView_tip}
                  blurType="materialLight"
                  blurAmount={10}
                  reducedTransparencyFallbackColor="blur"
                />
                :
                <VibrancyView
                  style={styles.blurView_tip}
                  blurType="ultraThinMaterialDark"
                  blurAmount={10}
                  reducedTransparencyFallbackColor="blur"
                />
                }
                <TipPayment
                  closeTips={() => this.closeTips()}
                  step={this.state.tipsStep}
                  // step={1}
                  SelectedAmount={(val) => {
                    this.SelectedAmount(val);
                  }}
                  validateCardDetails={(cardNUmberField1,
                    cardNUmberField2,
                    cardNUmberField3,
                    cardNUmberField4,
                    cardHolderName,
                    cvv,
                    expiryMonth,
                    expiryYear,
                    SelectedAmount,
                    tipMessage) => {
                    this.validateCardDetails(cardNUmberField1,
                      cardNUmberField2,
                      cardNUmberField3,
                      cardNUmberField4,
                      cardHolderName,
                      cvv,
                      expiryMonth,
                      expiryYear,
                      SelectedAmount,
                      tipMessage)
                  }}
                  //stepHandel={(c1,c2,c3,c4,val,message) => this.stepHandel(c1,c2,c3,c4,val,message)}
                  tipMessage={(val) => this.setState({ tipMessage: val })}
                  takeOneStepBack={this.takeOneStepBack}
                />
              </RBSheet> */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalTipVisible}>
              {/* <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'height' : null}> */}
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
                    // backgroundColor: 'green',
                  }}>
                  {Platform.OS == 'android' ? (
                    <BlurView
                      style={styles.blurView_tip}
                      blurType="dark"
                      blurAmount={30}
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
                    // step={1}
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
                    //stepHandel={(c1,c2,c3,c4,val,message) => this.stepHandel(c1,c2,c3,c4,val,message)}
                    tipMessage={(val) => this.setState({tipMessage: val})}
                    takeOneStepBack={this.takeOneStepBack}
                  />
                </View>
              </ScrollView>
              {/* </KeyboardAvoidingView> */}
            </Modal>
            {/* </KeyboardAvoidingView> */}
            <ConfirmPopUp
              confirmPopupModel={this.state.confirmPopupModel}
              CancelPress={() => this.setState({confirmPopupModel: false})}
              OKPress={() => this.confirmPopupModelOKPress()}
              messageText={this.state.confirmPopupMessage}
              // OKPress = {null}
            />
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
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    type: state.ChatRoomStore.type,
    typeEvent: state.EventDetatilStore.type,
    ChatRoomStore: state.ChatRoomStore,
    roomList: state.ChatRoomStore.roomList,
    pendingRequests: state.ChatRoomStore.pendingRequests,
    roomComments: state.ChatRoomStore.roomComments,
    selectedRoom: state.ChatRoomStore.selectedRoom,
    EventDetatilStore: state.EventDetatilStore,
    vipSupporters: state.EventDetatilStore.vipSupporters,
    no_participants: state.EventDetatilStore.no_participants,
    // new
    getChatListData: state.ChatRoomStore.getChatListData,
    getRoomListResponse: state.EventDetatilStore.getRoomListResponse,
    getRoomInfoDetailResponse: state.ChatRoomStore.getRoomInfoDetailResponse,
    getInvitationResponse: state.ChatRoomStore.getInvitationResponse,
    acceptRejectInvitationResponse:
      state.ChatRoomStore.acceptRejectInvitationResponse,
    onAction: state.ChatRoomStore.onAction,
    deleteroom: state.ChatRoomStore.deleteRoom,
    addComment: state.ChatRoomStore.addComment,
    modrateOrigin: state.ChatRoomStore.modrateOrigin,
    eventDetails: state.EventDetatilStore.eventDetails,
  };
}
function matchDispatchToProps(dispatch) {
  return {
    // GetEventVipSupporters: () => dispatch(GetEventVipSupporters()),
    leaveRoom: (data) => dispatch(leaveRoom(data)),
    deleteRoom: (deleteApiData) => dispatch(deleteRoom(deleteApiData)),
    getChatList: (chatInfo, chatRoomId) =>
      dispatch(getChatList(chatInfo, chatRoomId)),
    addCommentToChat: (data) => dispatch(addCommentToChat(data)),
    appendRecievedMessage: (message) =>
      dispatch(appendRecievedMessage(message)),
    getInvitationList: () => dispatch(getInvitationList()),
    acceptRejectInvitation: (data) => dispatch(acceptRejectInvitation(data)),
    getRoomInfoDetail: (data) => dispatch(getRoomInfoDetail(data)),
    GetRoomList: (comment) => dispatch(GetRoomList(comment)),
    modrateUser: (sentdata) => dispatch(modrateUser(sentdata)),
    modrateUserClear: () => dispatch(modrateUserClear()),
  };
}
export default connect(mapStateToProps, matchDispatchToProps)(ChatRoom);

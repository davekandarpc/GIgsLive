import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import {
  GettingReady,
  UserProfile_vip_notVip_Withcancel,
  UserRow,
} from '../../components';
import {
  AddParticipants,
  CreateRoom,
  EditRoom,
  FollowUser,
  createRooms,
} from '../../store/AddRoomStore/actions';
import { getChatList } from '../../store/ChatRoomStore/actions';
import { actionType } from '../../store/ChatRoomStore/actionType';
import { styles } from './styles';
import AsyncStorage from '@react-native-community/async-storage';
import { Images } from '../../common';
import { NetworkConsumer, NetworkProvider } from 'react-native-offline';
import NoInternetView from '../../components/NoInternetView';
import SomethingWentWrongView from '../../components/SomethingWentWrongView';
import { CheckConnectivity } from '../../Utils/NetInfoUtils';
import { showToast } from '../../common';
export class AddRoomScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supporterList: [
        { name: '', hasUpdate: false },
        { name: '', hasUpdate: false },
        { name: '', hasUpdate: true },
        { name: '', hasUpdate: false },
        { name: '', hasUpdate: true },
        { name: '', hasUpdate: true },
        { name: '', hasUpdate: false },
        { name: '', hasUpdate: true },
        { name: '', hasUpdate: false },
      ],
      groupName: '',
      groupNameMaxLength: 24,
      invitedUsersList: [],
      maxInviteLimit: 0,
      searchValue: '',
      usersList: [],
      searchResult: [],
      isReady: false,
      filePath: '',
      defaultRoom: 'global',
      token: '',
      event_id: '',
      userData: null,
      room: '',
      currentUser_email: '',
      currentuser_name: '',
      currentuser_image: '',
      currentuser_uuid: '',
      first_time: true,
      isLoading: false,
    };
  }

  async componentDidMount() {
    Orientation.lockToPortrait();
    /*  */
    var eventId = this.props.navigation.state.params.eventId;
    console.log('here is from vent detail screen event id =', eventId);
    let userdata = await AsyncStorage.getItem('loginData');
   /*  console.log(
      'user data => ' + JSON.stringify(JSON.parse(userdata).user.uuid),
    ) */;
    let user_token = JSON.parse(userdata).token;
    let user_uuid = JSON.parse(userdata).user.uuid;
    this.setState(
      {
        token: user_token,
        event_id: eventId,
        currentuser_uuid: user_uuid,
        // isReady: true
      },
      () => {
        this.props.getChatList(this.state.event_id, this.state.defaultRoom);
      },
      this.onLoad_method(),
    );
    // InteractionManager.runAfterInteractions(() => {
    // this.setState({
    //   isReady: true,
    // });

    // this.props.getChatList(eventId, this.state.defaultRoom);

    /* var data ={
        "rooms": {
            "global": {
                "title": "Global chat",
                "admin": false,
                "ref": "/api/chat/a49ef4cd-a1ff-41ec-8329-8a770f8c6589/global"
            }
        }
    }

    Object.values(Object.values(data)).map((item)=>{
      Object.values(item).map((item_2)=>{
        console.log("here data ===", item_2.title)
      })

    }) */
    // });
  }

  // componentDidUpdate = async (prevProps) => {
  componentWillReceiveProps = async (prevProps) => {
    console.log('data from api =', this.props.type);
    console.log('data from api add chat =', this.props.type_addroom);
    // if (prevProps.type !== this.props.type) {
    //   console.log('data from api cha =', this.props.type);
    if (this.props.type_addroom !== prevProps.type_addroom) {
      if (prevProps.type_addroom === 'CREATE_ROOMS_BEGIN') {
        console.log('create rooms Begin =');
      } else if (prevProps.type_addroom === 'CREATE_ROOMS_SUCCESS') {
        //if (this.props.createRoomData !== null) {
        console.log('create rooms =', prevProps.createRoomData.room);
        global.selectedRoom = prevProps.createRoomData.room;
        global.selectedRoom1 = prevProps.createRoomData.room;
        console.log('global.selectedRoom1 create rooms =' + global.selectedRoom1);
        this.setState(
          {
            room: prevProps.createRoomData.room,
            isLoading: false,
          },
          () => {
            // var uuid = endPoint.split('/');
            if (this.state.first_time === false) {
              console.log('Token Event Detail: ' + this.state.event_id);
              console.log('first time 1: ' + this.state.first_time);
              this.props.navigation.pop(1);
            } else {
              console.log('first time 2: ' + this.state.first_time);
            }

            // this.props.GetRoomList(this.state.event_id);
            //this.props.navigation.goBack(null);
          },
        );
        //}
      }
    }
    if (this.state.first_time !== false) {
      if (prevProps.type === actionType.GET_CHAT_ROOM_LIST_SUCCESS) {
        console.log('data from api did update=' + prevProps.getChatListData);
        if (prevProps.getChatListData !== undefined) {
          // var participent = this.props.getChatListData.participants;
          var participent = prevProps.getChatListData.participants;
          //console.log("chat list", Object.values(participent))
          var partic = Object.values(participent);
          var arraySize = partic.length;
          var array_data = [];
          let userdata = await AsyncStorage.getItem('loginData');
          let user_token = JSON.parse(userdata).token;
          let user_uuid = JSON.parse(userdata).user.uuid;
          for (let i = 0; i < arraySize; i++) {
            if (partic[i].field_username_value != undefined) {
              var data = {
                userName: partic[i].field_username_value,
                badges: 31,
                address: partic[i].field_location_value,
                isVip: 0,
                image: partic[i].picture,
                uuid: partic[i].uuid,
              };
            } else {
              var data = {
                userName: partic[i].name,
                badges: 31,
                address: partic[i].field_location_value,
                isVip: 0,
                image: partic[i].picture,
                uuid: partic[i].uuid,
              };
            }
            if (user_uuid !== data.uuid) {
              array_data.push(data);
            }
          }

          this.setState(
            {
              usersList: array_data,
              maxInviteLimit: 25,
              isReady: true,
            },
            () => {
              console.log('here in diupdate : ', array_data);
            },
          );
        }
        // }
      }
    }

    // if (prevProps.type !== "CREATE_ROOMS_SUCCESS") {
    //   if (prevProps.createRoomData != null) {
    //     this.setState({
    //       room: prevProps.createRoomData.room
    //     }, () => {
    //       this.props.navigation.goBack(null);
    //     })
    // }}

    // if (prevProps.type !== this.props.type_addroom) {
    //   if (prevProps.type === "CREATE_ROOMS_SUCCESS") {
    //     console.log("create rooms =", this.props.createRoomData.room)
    //     this.setState({
    //       room: this.props.createRoomData.room
    //     }, () => {
    //       this.props.navigation.goBack(null);
    //     })
    //   }
    // }
  };

  /* async componentWillReceiveProps(nextProps) {


      if (this.props.type === actionType.LOAD_CHATROOM_LIST_SUCCESS) {
        console.log("data from api =",this.props.type)
        console.log("data from api did update=",this.props.getChatListData)
      }

    if (this.props.getChatListData !== undefined) {


        var participent = this.props.getChatListData.participants
        //console.log("chat list", Object.values(participent))
        var partic = Object.values(participent)
        var arraySize = partic.length
        var array_data = []

        for(let i = 0; i < arraySize ; i++){
          var data = {
              userName: partic[i].name,
              badges: 31,
              address: partic[i].field_location_value,
              isVip: 0,
              image: partic[i].picture,
              uuid:partic[i].uuid
          }
          array_data.push(data)
        }

        this.setState({
          usersList:array_data,
          maxInviteLimit:arraySize
        })
    }
  } */
  changeGroupName = (groupName) => {
    if (groupName.length < 25) {
      this.setState({ groupName });
    }
  };

  searchUser = (searchValue) => {
    let usersList = this.state.usersList;
    let searchResult = [];

    for (let i = 0; i < usersList.length; i++) {
      console.log("User Name : " + (usersList[i].userName).toLowerCase())
      console.log("searchValue : " + (searchValue).toLowerCase())
      console.log("i : " + i)
      // // if (usersList[i].userName !== undefined && usersList[i].userName !== null) {
      //   if ((usersList[i].userName).toLowerCase() == (searchValue).toLowerCase()) {
      //     searchResult.push(usersList[i]);
      //   }
      // // }
      // if (usersList[i].userName.indexOf(searchValue) !== -1) {
      //   searchResult.push(usersList[i]);
      // }
      if ((usersList[i].userName).toLowerCase().indexOf((searchValue).toLowerCase()) !== -1) {
        searchResult.push(usersList[i]);
      }
    }

    this.setState({ searchResult, searchValue });
  };

  sendInvite = (user, index) => {
    if (this.state.invitedUsersList.length < 25) {
      console.log('search data ==  ' + JSON.stringify(this.state.searchResult));
      let invitedUsersList = this.state.invitedUsersList;
      let usersList = this.state.usersList;
      invitedUsersList.push(user);
      if (this.state.searchResult.length === 0) {
        this.setState({ invitedUsersList }, () => {
          //console.log('send invite Data ', this.state.invitedUsersList);
          console.log('send invite Data index  ' + index);
          //console.log('send invite Data '+ JSON.stringify(usersList.splice(index, 1)));

          const filteredItems = usersList.filter(item => item !== user)
          //usersList.splice(index, 1);
          this.setState({
            usersList: filteredItems,
          }, () => {
            //console.log('send invite Data '+ JSON.stringify(filteredItems));
          });
        });
      } else {
        this.setState({ invitedUsersList }, () => {
          //console.log('send invite Data ', this.state.invitedUsersList);
          console.log('send invite Data index  ' + index);
          //console.log('send invite Data '+ JSON.stringify(usersList.splice(index, 1)));

          const filteredItems = this.state.searchResult.filter(item => item !== user)
          //usersList.splice(index, 1);
          this.setState({
            searchResult: filteredItems,
          }, () => {
            console.log('send invite Data ' + JSON.stringify(filteredItems));
          });
        });
      }

    } else {
      showToast("You can not add more then 25 participants")
    }
  };

  removeUserFromInvitedList = (user, index) => {
    let invitedUsersList = this.state.invitedUsersList;
    let usersList = this.state.usersList;
    invitedUsersList.splice(index, 1);
    this.setState({ invitedUsersList }, () => {
      console.log('Here selected used ===> ' + JSON.stringify(user));
      //usersList.unshift(user);
      this.setState({
        usersList: usersList,
      });
    });
  };

  _creatingRoom = () => {
    /*  this.props.CreateRoom({
       logged_in_user_id: 123,
       roomName: 'Fire Files',
       roomProfile_picture: '',
       participants: ['user_id1', 'user_id2', 'user_id3'],
     }); */
    console.log('Create Room Call ================== ');
    if (this.state.isLoading == false) {
      this.setState({ isLoading: true }, () => {
        var initedData = this.state.invitedUsersList;
        var data_array = [];
        for (let i = 0; i < initedData.length; i++) {
          data_array.push(initedData[i].uuid);
        }
        console.log('data ', data_array);
        // data_array.unshift(this.state.currentuser_uuid);
        this.setState(
          {
            userData: data_array,
          },
          () => {
            console.log('JSON PAre', JSON.stringify(this.state.userData));
            var data = {
              bodyData: {
                title: this.state.groupName,
                event: this.state.event_id,
                users: this.state.userData,
              },
              headerData: {
                token: this.state.token,
              },
            };
            console.log('user create room data = ', data.bodyData.users[0]);
            this.setState({ first_time: false }, () => {
              this.props.createRooms(data);
            });
          },
        );

        /*  this.props.EditRoom();
       this.props.AddParticipants();
       this.props.FollowUser(); */
      });
    }
  };

  goBack = () => {
    global.selectedRoom1 = 'global'
    global.selectedRoom = 'global'
    this.props.navigation.goBack();
  };

  chooseFile = () => {
    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        // alert(response.customButton);
      } else {
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({ filePath: source });
      }
    });
  };
  onLoad_method = async () => {
    var status = await CheckConnectivity();
    if (!status) {
      this.setState({
        noInternet: true,
      });
      showToast('No Internet', 'warning');
    } else {
      this.setState(
        {
          noInternet: false,
        },
        () => {
          this.props.getChatList(this.state.event_id, this.state.defaultRoom);
        },
      );
    }
  };
  render() {
    const {
      usersList,
      groupName,
      groupNameMaxLength,
      invitedUsersList,
      maxInviteLimit,
      searchValue,
      searchResult,
      featchingAddRoomData,
    } = this.state;
    return (
      <NetworkProvider>
        <NetworkConsumer>
          {({ isConnected }) =>
            !isConnected ? (
              <NoInternetView onLoad_method={() => this.onLoad_method()} />
            ) : this.props.featchingAddRoomData == true ||
              this.state.isLoading == true ? (
              <GettingReady />
            ) :
              // : this.props.AddRoomDataLoaded == true ? (
              //   <SomethingWentWrongView
              //     onLoad_method={() => this.onLoad_method()}
              //   />
              // )  :
              (
                <SafeAreaView style={{ flex: 1 }}>
                  <View style={styles.main_container}>
                    <View style={styles.screenHeadingView}>
                      <Text style={styles.headingTextStyle}>Create Room</Text>
                      <TouchableOpacity
                        style={styles.closeIconStyle}
                        onPress={this.goBack}>
                        <EvilIcons name="close" color="#ddd" size={24} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.addNamePhotoView}>
                      <TouchableOpacity
                        style={styles.cameraIconViewStyle}
                        onPress={() => this.chooseFile()}>
                        {this.state.filePath == '' ? (
                          <Image
                            source={Images.camera_icon}
                            style={{
                              width: 24,
                              height: 24,
                              resizeMode: 'contain',
                            }}></Image>
                        ) : (
                          <Image
                            source={this.state.filePath}
                            style={styles.roomImage}
                          />
                        )}
                      </TouchableOpacity>
                      <View style={styles.textBoxView}>
                        <TextInput
                          placeholder={'Room Name'}
                          placeholderTextColor="#ddd"
                          maxLength={24}
                          style={styles.textInputStyle}
                          value={groupName}
                          onChangeText={(group_Name) =>
                            this.changeGroupName(group_Name)
                          }
                        />
                        <Text style={styles.groupNameLengthStyle}>
                          {groupName.length} / {groupNameMaxLength}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.invitePartiipantsCountChip}>
                      <Text style={styles.invitePartiipantsCountTextChip}>
                        INVITE PARTICIPANTS: {invitedUsersList.length} OF{' '}
                        {maxInviteLimit}
                      </Text>
                    </View>
                    <View style={styles.participantListHeader}>
                      <View style={styles.searchBox}>
                        <Octicons
                          name="search"
                          size={24}
                          color={'#6d6e6f'}
                          style={styles.searchIconStyle}
                        />
                        <TextInput
                          placeholder={'Search'}
                          placeholderTextColor="#ddd"
                          style={styles.searchTextBoxStyle}
                          value={searchValue}
                          onChangeText={(search_Value) =>
                            this.searchUser(search_Value)
                          }
                        />
                      </View>
                      {invitedUsersList.length !== 0 && (
                        <ScrollView
                          contentContainerStyle={{
                            flexDirection: 'column',
                          }}
                          horizontal={true}>
                          <View style={styles.added_participantsVeiw}>
                            {invitedUsersList.map((addedUser, index) => {
                              return (
                                <View style={styles.addedUserItemStyle}>
                                  <UserProfile_vip_notVip_Withcancel
                                    ImgScr={addedUser.image}
                                    isVip={addedUser.isVip}
                                    showCancelButton={true}
                                    onRemove={() =>
                                      this.removeUserFromInvitedList(
                                        addedUser,
                                        index,
                                      )
                                    }
                                  />
                                  <Text style={styles.addedUserTextStyle}>
                                    {addedUser.userName}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        </ScrollView>
                      )}
                    </View>
                    <ScrollView contentContainerStyle={styles.scrlView_container}>
                      <View style={styles.participantListContainer}>
                        <Text style={styles.globalPartiipantsCountTextChip}>
                          GLOBAL PARTICIPANTS ({usersList.length})
                    </Text>
                        {searchValue === '' &&
                          searchResult.length === 0 &&
                          usersList.length !== 0 &&
                          usersList.map((user, index) => {
                            return (
                              user.userName !== global.user_name_UUID &&
                              <UserRow
                                creatingRoom={true}
                                user={user}
                                onInvite={() => this.sendInvite(user, index)}
                              />
                            );
                          })}
                        {searchResult.length !== 0
                          ? searchResult.map((user, index) => {
                            return (
                              user.userName !== global.user_name_UUID &&
                              <UserRow
                                creatingRoom={true}
                                user={user}
                                onInvite={() => this.sendInvite(user, index)}
                              />
                            );
                          })
                          : searchValue !== '' && (
                            <Text style={styles.globalPartiipantsCountTextChip}>
                              No user found
                            </Text>
                          )}
                      </View>
                    </ScrollView>
                    {/* <FullButton
            disabled={this.state.invitedUsersList.length !== 0 && this.state.groupName !== '' ? false : true}
            buttonTextStyle={{
              color: this.state.invitedUsersList.length !== 0 && this.state.groupName !== '' ? '#000' : '#ddd',
            }}
            buttonText={'Create Room'}
            onPress={() => this.creatingRoom()}
          /> */}
                    {this.state.invitedUsersList.length !== 0 &&
                      this.state.groupName !== '' && this.state.groupName.length > 2 && this.state.isLoading == false ? (
                      <ImageBackground
                        imageStyle={{ borderRadius: 10 }}
                        style={[styles.buttonStyle]}
                        source={Images.btn_gradint}>
                        <TouchableOpacity
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={this._creatingRoom}
                          // disabled={this.props.disabled}
                          disabled={this.state.isLoading}
                        >
                          <Text style={[styles.buttonTextStyle, { opacity: 1, color: '#fff' }]}>Create Room</Text>
                        </TouchableOpacity>
                      </ImageBackground>
                    ) : (
                      <View style={{ paddingVertical: 12 }}>
                        <View
                          style={{
                            width: '80%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#afafaf',
                            paddingVertical: 12,
                            borderRadius: 10,
                            alignSelf: 'center',
                          }}
                          disabled={this.props.disabled}>
                          <Text style={styles.buttonTextStyle}>Create Room</Text>
                        </View>
                      </View>
                    )}
                  </View>
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
    createRoom: state.AddRoomStore.createdRoomData,
    editRoom: state.AddRoomStore.editedRoomData,
    addParticipants: state.AddRoomStore.addedParticipantsData,
    followUser: state.AddRoomStore.followedUserData,
    getChatListData: state.ChatRoomStore.getChatListData,
    fetchingChatRoomData: state.ChatRoomStore.fetchingChatRoomData,
    createRoomData: state.AddRoomStore.createRoomData,
    type: state.ChatRoomStore.type,
    type_addroom: state.AddRoomStore.type,
    featchingAddRoomData: state.AddRoomStore.featchingAddRoomData,
    AddRoomDataLoaded: state.AddRoomStore.AddRoomDataLoaded,
  };
}

function matchDispatchToProps(dispatch) {
  return {
    CreateRoom: (payload) => dispatch(CreateRoom(payload)),
    EditRoom: () => dispatch(EditRoom()),
    AddParticipants: () => dispatch(AddParticipants()),
    FollowUser: () => dispatch(FollowUser()),
    getChatList: (chatInfo, chatRoomId) =>
      dispatch(getChatList(chatInfo, chatRoomId)),
    createRooms: (createroomData) => dispatch(createRooms(createroomData)),
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(AddRoomScreen);

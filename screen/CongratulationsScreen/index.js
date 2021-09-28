import React, {Component} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ImageBackground,
  Image,
  Linking,
  SafeAreaView,
} from 'react-native';
import {showToast} from '../../common/Toaster';
import Carousel from 'react-native-snap-carousel';
import {styles} from './styles';
import {Fonts} from '../../common/fonts';
import {Images} from '../../common/Images';
import {Header} from '../../components';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation-locker';
import {
  scrollInterpolatorCongo,
  animatedStylesCongo,
} from '../../Utils/congregationAnimation';
import {APICALL_v1} from '../../common/ApiConfig';
import {updateTicketCoupon} from '../../store/TicketStore/actions';
import Clipboard from '@react-native-community/clipboard';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import {getFormattedDate} from '../../common/functions';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {BlurView} from '@react-native-community/blur';
import {normalize} from '../../common/normalize';
import {isDoStatement} from 'typescript';

const utcDateToString = (momentInUTC) => {
  let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  return s;
};

const addToCalendar = (title, startDateUTC) => {
  const eventConfig = {
    title,
    // title:'',
    url: 'https://gigs.live/',
    startDate: utcDateToString(startDateUTC),
    endDate: utcDateToString(moment.utc(startDateUTC).add(1, 'hours')),
    notes: 'https://gigs.live/',
    address: '',
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
      //showToast('Event Added successfully', 'success');
    })
    .catch((error) => {
      // handle error such as when user rejected permissions
      // alert('Error -> ' + error);
      console.log('Error -> ' + error);
      showToast('Event cancelled', 'success');
    });
};

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
var addTicketId = [];
var addGiftedID = [];
export class CongratulationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      activeIndex: 0,
      ShowCardList: [],
      title_event: '',
      modalVisible: false,
      contectMessage: '',
      email: '',
      eventId: '',
      token: '',
      redeemModel: false,
      redeemDone: false,
      selctedredeem: false,
      liveEvent: false,
      selectedTicket: '',
      giftedMail: '',
      selctedIndex: 0,
      description: [],
      allready_redeem: false,
      selectedAddress: 0,
    };
  }

  componentDidMount = async () => {
    Orientation.lockToPortrait();
    let cupone_array = this.props.navigation.state.params.cupone_array;
    let title = this.props.navigation.state.params.title;
    let ticket_data = this.props.navigation.state.params.ticket_data;
    let eventId = this.props.navigation.state.params.eventId;
    let allready_redeem = this.props.navigation.state.params.redeem;
    let address = this.props.navigation.state.params.address;
    var selectedAddress = this.props.navigation.state.params.selectedAddress;
    console.log('selectedAddress  =====> : ' + selectedAddress);

    if (selectedAddress !== 0) {
      this.setState(
        {
          selectedAddress,
        },
        () => {
          console.log(
            'selectedAddress  =====> :  Test : ' + this.state.selectedAddress,
          );
        },
      );
    }
    let arrcupon = [];
    console.log('Ticket Data : ', ticket_data);
    console.log('Cupone Array : ', cupone_array);
    console.log(
      'Addticket =====> : ' + JSON.stringify(this.props.eventDetails),
    );
    console.log('ADDRESSSSSSS  =====> : ' + address);
    console.log('selectedAddress  =====> : ' + this.state.selectedAddress);
    let separatedTicketData = [];
    for (let i = 0; i < ticket_data.length; i++) {
      for (let j = 0; j < parseInt(ticket_data[i].clicks); j++) {
        separatedTicketData.push(ticket_data[i]);
      }
    }
    console.log('Description length Main : ' + ticket_data[0].description);
    if (ticket_data[0].description !== null) {
      var des = ticket_data[0].description.split('\r\n');
      console.log('Description length : ' + des.length);
      console.log('Description length : ' + des);
      var descriptionArray = [];

      for (var j = 0; j < des.length; j++) {
        console.log('des [j] : ' + des[j]);
        descriptionArray.push('• ' + des[j]);
      }
    }

    for (let i = 0; i < cupone_array.length; i++) {
      console.log('Cupone Array :::::::::: ', cupone_array[i].code.code);
      var data = {
        concertName: separatedTicketData[i].concertName,
        TicketType: separatedTicketData[i].tickettype,
        ConcertPoint: [
          {Points: 'Live Concert Pass'},
          {Points: 'Zoom Chat with the Artist after the show'},
        ],

        clicks: 0,
        isAvailable: 10,
        code: cupone_array[i].code.code,
        uuid: cupone_array[i].code.uuid,
        merchandise_image: separatedTicketData[i].merchandise_image,
      };
      arrcupon.push(data);
    }
    /*  for (let i = 0; i < 1; i++) {
       var data = {
         concertName: 'title',
         TicketType: 'ticket_data.tickettype',
         ConcertPoint: [
           { Points: 'Live Concert Pass' },
           { Points: 'Zoom Chat with the Artist after the show' },
         ],

         clicks: 0,
         isAvailable: 10,
         code: 'YMGZ-9PVH'
       }
       arrcupon.push(data)
     } */
    if (address == undefined) {
      address = false;
    }

    this.setState(
      {
        title_event: title,
        ShowCardList: arrcupon,
        ticket_data,
        eventId: 'api/events/' + eventId,
        description: descriptionArray,
        allready_redeem: allready_redeem,
        address: address,
      },
      () => {
        this.handelEventLive(this.state.ticket_data);
        console.log('here is data from ticket ', this.state.ShowCardList);
        console.log('All ready redeem === >  ', this.state.allready_redeem);
        console.log('eventId ', this.state.eventId);
        console.log('Address  : ====== >  ', this.state.address);
        console.log(
          'DATE TIME EVENT   : ====== >  ',
          this.state.ticket_data[0].dateTime,
        );
      },
    );
    var data = {
      endpoint: 'events/' + eventId,
      baseUrlNew: 'new',
      debug: true,
    };
    //console.log('event data ===== > '+JSON.stringify(eventDetail))
    this.GetToken();
    /* this.setState({
      title_event: 'title',
      ShowCardList: arrcupon
    }, () => {
      console.log("here is data from ticket ", this.state.ShowCardList)
    }) */
  };

  handelEventLive = (data) => {
    var currentTime = new Date().getTime();
    var eventTime = parseInt(data[0].dateTime) * 1000;
    if (eventTime < currentTime) {
      this.setState({liveEvent: true});
      console.log('current time 1 : ' + currentTime);
    }
    console.log('current time 2 : ' + currentTime);
    console.log('current time 3 : ' + eventTime);
  };

  componentWillReceiveProps = (nextProps) => {
    console.log('action type nextProps.type ==== > ' + nextProps.type);
    console.log('action type this.props.type ==== > ' + this.props.type);
    if (nextProps.type !== this.props.type) {
      if (nextProps.type === 'UPDATE_TICKET_SUCCESS') {
        if (nextProps.updateTicketData === true) {
          console.log(
            'action type ==== > ' + JSON.stringify(this.state.selectedTicket),
          );
          if (nextProps.actionticket == 'gift') {
            addGiftedID.push(this.state.selectedTicket);
            if (nextProps.updateTicketResponse) {
              this.setState(
                {
                  giftedMail: this.state.email,
                },
                () => {
                  this.state.ShowCardList[
                    this.state.selctedIndex
                  ].email = `${this.state.email}`;
                  console.log(
                    'here is updated gift data ==== >' +
                      JSON.stringify(this.state.ShowCardList),
                  );
                  if (this.state.selectedTicket !== '') {
                    showToast(`Ticket gifted to ${this.state.email}.`);
                  }
                  this.setState(
                    {email: '', contectMessage: '', selectedTicket: ''},
                    () => {},
                  );
                },
              );
              /* this.props.navigation.navigate('EventDetailScreen', {
            endpoint: this.state.eventId,
          }); */
            }
          } else {
            addTicketId.push(this.state.selectedTicket);
            var data = addTicketId.includes(this.state.selectedTicket);
            console.log('redeem ticket ====> ' + JSON.stringify(data));
            this.setState(
              {
                redeemDone: true,
              },
              () => {
                console.log(
                  'redeem ticket = = = => ' +
                    JSON.stringify(this.state.selectedTicket),
                );
              },
            );
            if (this.state.selectedTicket !== '') {
              showToast('Ticket Redeem  Successfully.');
            }
            this.setState({selectedTicket: ''}, () => {});
            /* this.props.navigation.navigate('EventDetailScreen', {
            endpoint: this.state.eventId,
          }); */
          }
        }
      }
    }
  };

  GetToken = async () => {
    let userdata = await AsyncStorage.getItem('loginData');
    let user_token = JSON.parse(userdata).token;
    console.log('Token : ' + user_token);
    this.setState({token: user_token});
  };

  onGift = () => {
    this.setState({
      modalVisible: true,
      selectedTicket: this.state.ShowCardList[this.state.activeIndex].uuid,
    });
  };

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  sendGift = () => {
    if (this.state.email != '' && this.state.contectMessage != '') {
      if (this.validateEmail(this.state.email)) {
        this.setState(
          {
            modalVisible: false,
          },
          () => {
            // console.log('Selected Code : ' + this.state.selectedTicket);
            this.callGift();
          },
        );
        // console.log("DONE _____ ")
      } else {
        showToast('Please add valid email address.', 'warning');
      }
    } else {
      showToast('Please fill up all detail.', 'warning');
      // console.log("Error _____ ")
    }
  };

  callGift = () => {
    var Data = {
      bodyData: {
        action: 'gift',
        email: this.state.email,
        message: this.state.contectMessage,
      },
      headerData: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
      uuid: {
        uuid: this.state.selectedTicket,
      },
    };
    this.props.updateTicketCoupon(Data);
  };

  sendToRedeem = () => {
    this.setState(
      {
        redeemModel: false,
      },
      () => {
        console.log('Selected Code  redeem: ' + this.state.selectedTicket);
        this.redeem(this.state.selectedTicket);
      },
    );
  };

  redeem = (code) => {
    var Data = {
      bodyData: {
        action: 'redeem',
      },
      headerData: {
        'Content-Type': 'application/json',
        token: this.state.token,
      },
      uuid: {
        uuid: code,
      },
    };
    this.props.updateTicketCoupon(Data);
    console.log('Code : ' + code);
  };

  setClipbord = async (code) => {
    console.log('Code : ' + code);
    await Clipboard.setString(code);
    showToast('Copied to Clipboard', 'success');
    //let clipboardContent = await Clipboard.getString();
    //alert('Text from Clipboard: ' + clipboardContent);
  };

  _renderItem = ({item, index}) => {
    return (
      <View style={styles.pop_up_main_view}>
        {/* <Text style={styles.itemLabel}>{` ${item}`}</Text> */}
        <View style={styles.card_main_view_container}>
          <ImageBackground
            imageStyle={{borderRadius: 10}}
            source={{uri: this.state.ticket_data[0].image}}
            style={styles.head_view_container}>
            <LinearGradient
              colors={[
                'rgba(0, 0, 0,0.4)',
                'rgba(0, 0, 0,0.4)',
                'rgba(0, 0, 0,0.4)',
              ]}
              style={[styles.linearGradient2]}>
              <View style={styles.compnay_title_view_container}>
                <Text style={styles.TGL_Presents_style}>TGL PRESENTS</Text>
                <View style={styles.line_view_style}></View>
              </View>
              <Text style={styles.tour_name_title_style}>
                {item.concertName}
              </Text>
              <View style={{flex: 1}}>
                <View style={styles._regular_n_price_container}>
                  <View style={styles.regular_n_live_concert_text_style_view}>
                    <Text
                      numberOfLines={2}
                      style={styles.event_ticket_type_text_style}>
                      {item.TicketType}
                    </Text>
                    <View style={styles.live_concert_view}>
                      {/* {item.ConcertPoint.map((itm) => ( */}
                      <View style={styles.point_view}>
                        {this.state.description !== undefined &&
                          this.state.description.map((item) => {
                            return (
                              <Text
                                numberOfLines={4}
                                style={styles.live_concert_pass_text_style}>
                                {item}
                              </Text>
                            );
                          })}
                      </View>
                      {/* } */}
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0.6,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {item.merchandise_image != '' && (
                      <Image
                        resizeMode="contain"
                        source={{uri: item.merchandise_image}}
                        style={{height: 100, width: 100}}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.time_view}>
                  <Text style={styles.time_text_style}>
                    {getFormattedDate(this.state.ticket_data[0].dateTime)}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
          <View
            style={{
              width: '95%',
              borderRadius: 1,
              borderWidth: 1,
              borderColor: 'white',
              borderStyle: 'dashed',
              zIndex: 5,
              alignSelf: 'center',
            }}></View>
          <View style={styles.body_view_container}>
            <Text style={styles.select_Quantity_text_style}>
              {addGiftedID.includes(item.uuid) === true
                ? `TICKET CODE : ${item.code}`
                : addTicketId.includes(item.uuid) === true
                ? `TICKET CODE : ${item.code}`
                : `TICKET CODE`}
            </Text>
            {addTicketId.includes(item.uuid) === false &&
              addGiftedID.includes(item.uuid) === false && (
                <TouchableOpacity
                  onPress={() => this.setClipbord(item.code)}
                  style={styles.select_quality_container}>
                  <Text style={styles.ticket_code_text_style}>{item.code}</Text>
                  <Image
                    source={Images.icon_clipboard}
                    style={styles.cpy_icon_img}></Image>
                </TouchableOpacity>
              )}
            {this.state.allready_redeem === false &&
              addGiftedID.includes(item.uuid) === false &&
              addTicketId.includes(item.uuid) === false && (
                <View
                  style={[
                    styles.readem_giftNow_view,
                    {
                      justifyContent:
                        this.state.redeemDone === true
                          ? 'center'
                          : 'space-between',
                    },
                  ]}>
                  {this.state.redeemDone === false && (
                    <TouchableOpacity
                      onPress={() => {
                        //this.redeem(item.uuid);
                        this.setState(
                          {
                            redeemModel: true,
                            selectedTicket: item.uuid,
                          },
                          () => {
                            console.log(
                              'Selected Code : ' + this.state.selectedTicket,
                            );
                          },
                        );
                      }}
                      disabled={this.state.redeemDone}>
                      <Text style={styles.readem_text_style}>REDEEM</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      this.setState(
                        {
                          modalVisible: true,
                          selectedTicket: item.uuid,
                          selctedIndex: index,
                        },
                        () => {
                          console.log(
                            'Selected index : ' + this.state.selctedIndex,
                          );
                        },
                      );
                    }}>
                    <Text style={styles.readem_text_style}>GIFT</Text>
                  </TouchableOpacity>
                </View>
              )}
            {this.state.allready_redeem === true &&
              addGiftedID.includes(item.uuid) === false && (
                <View
                  style={[
                    styles.readem_giftNow_view,
                    {
                      justifyContent: 'center',
                    },
                  ]}>
                  <TouchableOpacity
                    style={{paddingHorizontal: 10}}
                    onPress={() => {
                      this.setState(
                        {
                          modalVisible: true,
                          selectedTicket: item.uuid,
                          selctedIndex: index,
                        },
                        () => {
                          console.log(
                            'Selected index : ' + this.state.selctedIndex,
                          );
                        },
                      );
                    }}>
                    <Text style={styles.readem_text_style}>GIFT</Text>
                  </TouchableOpacity>
                </View>
              )}
            {addTicketId.includes(item.uuid) === true && (
              <View
                style={[
                  styles.readem_giftNow_view,
                  {
                    justifyContent:
                      this.state.redeemDone === true
                        ? 'center'
                        : 'space-between',
                  },
                ]}>
                <Text style={styles.readem_text_style}>Ticket redeemed</Text>
              </View>
            )}
            {addGiftedID.includes(item.uuid) === true && (
              <View
                style={[
                  styles.readem_giftNow_view,
                  {
                    justifyContent:
                      this.state.redeemDone === true
                        ? 'center'
                        : 'space-between',
                  },
                ]}>
                <Text
                  style={
                    styles.readem_text_style
                  }>{`Ticket gifted to ${item.email}`}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  goBackHomeScreen = () => {
    /* if (this.state.address == false) {
      console.log("GO Back Home IFFF : ")
      this.props.navigation.pop(2);
    } else {
      console.log("GO Back Home Else : ")
      this.props.navigation.pop(4);
    } */
    console.log('this.state.selectedAddress : ' + this.state.selectedAddress);
    console.log(
      'this.state.selectedAddress : ' + typeof this.state.selectedAddress,
    );
    // if (this.state.selectedAddress === true) {
    //   console.log("If ")
    //   this.props.navigation.pop(4);
    // } else if (this.state.selectedAddress === false) {
    //   console.log("Else If ")
    //   this.props.navigation.pop(3);
    // } else {
    //   console.log("Else ")
    //   this.props.navigation.pop(2);
    // }
    this.props.navigation.navigate('EventDetailScreen', {
      endpoint: this.state.eventId,
    });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          style={styles.main_container}>
          <Header />
          <ScrollView contentContainerStyle={styles.scrlView_container}>
            <TouchableOpacity
              onPress={() => this.goBackHomeScreen()}
              style={styles.close_btn_style}>
              <EvilIcons name="close" size={40} color="#fff" />
            </TouchableOpacity>
            <View style={styles.Congratulations_title_view}>
              <Text style={styles.congratulations_text_style}>
                Congratulations!
              </Text>
              <Text style={styles.decription_text_style}>
                You have just purchased {this.state.ShowCardList.length}{' '}
                Tickets. You can access the tickets from ‘My Tickets’.
              </Text>
            </View>
            <View style={{marginTop: 23}}>
              <Carousel
                ref={(c) => (this.carousel = c)}
                data={this.state.ShowCardList}
                renderItem={this._renderItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH - 50}
                inactiveSlideShift={0}
                onSnapToItem={(index) => this.setState({activeIndex: index})}
                useScrollView={true}
                scrollInterpolator={scrollInterpolatorCongo}
                slideInterpolatedStyle={animatedStylesCongo}
              />
            </View>

            <View style={styles.afterS_swipe_view}>
              {this.state.liveEvent == false ? (
                <ImageBackground
                  source={Images.btn_gradint}
                  imageStyle={{borderRadius: 7}}
                  style={styles.add_to_cal_btn_img_style}>
                  <TouchableOpacity
                    onPress={() => {
                      addToCalendar(
                        this.state.ShowCardList[0].concertName,
                        this.state.ticket_data[0].dateTime * 1000,
                      );
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      width: '100%',
                    }}>
                    <Image
                      source={Images.icons_add_to_calendar}
                      style={{width: 24, height: 24}}></Image>
                    <Text style={styles.add_to_cal_text}>Add to Calendar</Text>
                  </TouchableOpacity>
                </ImageBackground>
              ) : (
                <TouchableOpacity
                  onPress={() => this.goBackHomeScreen()}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    // flexDirection: 'row',
                    // width: '100%',
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 5,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}>
                  <Text style={[styles.add_to_cal_text, {marginLeft: 0}]}>
                    Go to Gig
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.social_media_icon_view}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL('https://twitter.com/thegigs_live');
                  }}
                  style={styles.social_media_icon_style}>
                  {/* <Fontisto name="twitter" size={24} color="#3b3e42"></Fontisto> */}
                  <Image
                    source={Images.icons_twitter_normal}
                    style={styles.social_media_icon}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      'https://www.facebook.com/GigsLiveExperience',
                    );
                  }}
                  style={styles.social_media_icon_style}>
                  {/* <Fontisto name="facebook" size={24} color="#3b3e42"></Fontisto> */}
                  <Image
                    source={Images.icons_facebook_normal}
                    style={styles.social_media_icon}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL('https://www.instagram.com/thegigslive/');
                  }}
                  style={styles.social_media_icon_style}>
                  {/* <Fontisto name="instagram" size={24} color="#3b3e42"></Fontisto> */}
                  <Image
                    source={Images.icons_insta_normal}
                    style={styles.social_media_icon}></Image>
                </TouchableOpacity>
              </View>
              <Text style={styles.share_on_media_title_text}>
                Share on Social Media
              </Text>
              <View style={styles.text_view_container}>
                <Text style={styles.share_love_test_style}>
                  Share the Love! Gift the tickets to your friends
                </Text>
                <View style={styles.text_view}>
                  <Text style={styles.you_can_test_style}>
                    You can do this anytime from{' '}
                  </Text>
                  <TouchableOpacity style={styles.my_ticket_click_view}>
                    <Text style={styles.my_Tickets_text_style}>My Tickets</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={styles.gift_now_btn}
                onPress={this.onGift}>
                <Text style={styles.gift_now_text_style}>Gift Now!</Text>
              </TouchableOpacity>
              <View style={styles.sign_in_from_test_style_view}>
                <Text style={styles.sign_in_from_test_style}>
                  Sign up from our app or web to see your upcoming events
                </Text>
              </View>
              <View style={styles.we_r_ava_text_style}>
                <Text style={styles.we_r_ava_test_style}>
                  We’re available on
                </Text>
              </View>
              <View style={styles.app_store_view}>
                <TouchableOpacity style={styles.app_store_btn_style}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: normalize(14),
                      marginHorizontal: 40,
                      marginVertical: 15,
                    }}>
                    Android
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.app_store_btn_style}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: normalize(14),
                      marginHorizontal: 40,
                      marginVertical: 15,
                    }}>
                    Apple
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <Modal
            animationType={'slide'}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({
                modalVisible: false,
              });
            }}
            style={{}}>
            <View
              style={{
                backgroundColor: 'transparent',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <BlurView
                style={styles.absolute}
                // viewRef={this.state.viewRef}
                blurType="dark"
                blurAmount={10}
              />
              <ScrollView
                contentContainerStyle={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'padding' : null}>
                  <View style={styles.viewContainer}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flex: 2}}>
                        <Text style={styles.gift_now_text}>
                          SPREAD THE LOVE: GIFT YOUR TICKET
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.closebtncontainer}
                        onPress={() => {
                          this.setState({
                            modalVisible: false,
                          });
                        }}>
                        <EvilIcons name="close" size={30} color="#c4c4c4" />
                      </TouchableOpacity>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      <Text style={styles.email_Add_text_style}>
                        Email Address *
                      </Text>
                      <View style={styles.Email_text_input_style}>
                        <TextInput
                          placeholder="Enter Email Address"
                          keyboardType="email-address"
                          returnKeyType="next"
                          placeholderTextColor="#ddd"
                          ref="email"
                          onSubmitEditing={() => {
                            this.messageTextInput.focus();
                          }}
                          style={styles.email_text_input}
                          onChangeText={(email) => this.setState({email})}
                          value={this.state.email}
                        />
                      </View>
                      <Text style={styles.email_Add_text_style}>Message *</Text>
                      <View style={styles.message_text_input_style}>
                        <TextInput
                          numberOfLines={20}
                          multiline={true}
                          placeholder="Please write a message to the gift recipient."
                          ref={(input) => {
                            this.messageTextInput = input;
                          }}
                          returnKeyType={'next'}
                          textAlignVertical="top"
                          placeholderTextColor="#ddd"
                          style={{
                            height: '100%',
                            marginVertical: 0,
                            color: '#fff',
                            flex: 1,
                            fontFamily: Fonts.OpenSans_regular,
                            opacity: 0.5,
                            fontSize: 12,
                            paddingLeft: 8,
                            justifyContent: 'flex-start',
                          }}
                          onChangeText={(val) =>
                            this.setState({contectMessage: val})
                          }
                          value={this.state.contectMessage}
                          maxLength={100}
                        />
                        <View
                          style={{
                            backgroundColor: 'tranparent',
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                          }}>
                          <Text style={{color: '#ddd', fontSize: 10}}>
                            {this.state.contectMessage.length}/100
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.bottomView}>
                      <ImageBackground
                        source={Images.btn_gradint}
                        imageStyle={{borderRadius: 7}}
                        style={styles.giftClick}>
                        <TouchableOpacity
                          onPress={() => this.sendGift()}
                          style={styles.giftClick_2}>
                          <Text style={styles.gift_now_text_style}>
                            GIFT NOW
                          </Text>
                        </TouchableOpacity>
                      </ImageBackground>
                      <View
                        style={{
                          marginTop: 15,
                          paddingHorizontal: 16,
                        }}>
                        <Text
                          style={{
                            fontFamily: Fonts.OpenSans_regular,
                            fontSize: normalize(12),
                            // lineHeight: 10,
                            color: '#ddd',
                            opacity: 0.5,
                          }}>
                          By gifting this ticket, the gift recipient can
                          experience the gig. Once gifted, you can not use this
                          ticket.
                        </Text>
                      </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </ScrollView>
            </View>
          </Modal>

          <Modal
            animationType={'slide'}
            transparent={true}
            visible={this.state.redeemModel}
            onRequestClose={() => {
              this.setState({
                modalVisible: false,
              });
            }}
            style={{}}>
            <View
              style={{
                backgroundColor: 'transparent',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <BlurView
                style={styles.absolute}
                // viewRef={this.state.viewRef}
                blurType="dark"
                blurAmount={10}
              />
              <View style={styles.viewContainer_second}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 2}}>
                    <Text
                      style={[
                        styles.gift_now_text_style,
                        {marginHorizontal: 0},
                      ]}>
                      REDEEM TICKET
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closebtncontainer}
                    onPress={() => {
                      this.setState({
                        redeemModel: false,
                      });
                    }}>
                    <EvilIcons name="close" size={30} color="#c4c4c4" />
                  </TouchableOpacity>
                </View>
                <View style={{width: '100%', marginTop: 15, paddingRight: 7}}>
                  <Text
                    style={{
                      fontFamily: Fonts.OpenSans_regular,
                      fontSize: 14,
                      // lineHeight: 21,
                      color: '#fff',
                    }}>
                    You can access this event & its chat on this device only.
                    Other terms & conditions about redeem to be put here.
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 15,
                  }}>
                  <ImageBackground
                    source={Images.btn_gradint}
                    imageStyle={{borderRadius: 7}}
                    style={styles.add_to_cal_btn_img_style}>
                    <TouchableOpacity
                      onPress={() => {
                        this.sendToRedeem();
                      }}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.add_to_cal_text}>REDEEM NOW</Text>
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    ticketData: state.TicketStore.ticketData,
    eventDetails: state.EventDetatilStore.eventDetails,
    type: state.TicketStore.type,
    updateTicketResponse: state.TicketStore.updateTicketResponse,
    updateTicketData: state.TicketStore.updateTicketData,
    actionticket: state.TicketStore.actionticket,
  };
}
function matchDispatchToProps(dispatch) {
  return {
    updateTicketCoupon: (updateTicketData) =>
      dispatch(updateTicketCoupon(updateTicketData)),
  };
}
export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(CongratulationsScreen);

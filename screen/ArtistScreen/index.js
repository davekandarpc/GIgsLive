import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform,
  InteractionManager,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { connect } from 'react-redux';
import { Images } from '../../common/Images';
import { CheckConnectivity } from '../../Utils/NetInfoUtils';
import Orientation from 'react-native-orientation-locker';
import { showToast } from '../../common/Toaster';
import {
  Artist_TabEvents,
  GettingReady,
  SimilarEvent,
  Similar_artist,
  Header,
} from '../../components';
import { RBDailog } from '../../components/RBDailog';
import {
  GetArtistDetails,
  FollowUnfollowArtist,
} from '../../store/ArtistScreenStore/actions';
import { styles } from './styles';
import { getFormattedDate, getResponsiveImage } from '../../common/functions';
import Footer from '../../components/Footer';
import { NavigationEvents } from 'react-navigation';
import { keyConstants, strings } from '../../common';
import { getAccessToken, splitEndPoint, ShareIt } from '../../Utils';
import AsyncStorage from '@react-native-community/async-storage';
import { APICALL_v1 } from '../../common/ApiConfig';
import { NetworkConsumer, NetworkProvider } from 'react-native-offline';
import NoInternetView from '../../components/NoInternetView';
import SomethingWentWrongView from '../../components/SomethingWentWrongView';
import { normalize } from '../../common/normalize';
import { TrackingApp } from "../../common/TrackingApp";
import { getBasicAuthForAPi } from "../../common/functions";

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Dimensions.get('window').height;
const SLIDER_HEIGHT = Dimensions.get('window').height;
var encodedString = getBasicAuthForAPi()

export class ArtistScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      modalVisible: false,
      followingClick: [],
      num: 0,
      selected: [],
      galleryIndex: 0,
      artistID: '',
      user_uid: '',
      floatOptionArray: [
        { name: 'Home', isSelected: false },
        { name: 'Live Now', isSelected: false },
        { name: 'Events', isSelected: false },
        { name: 'Artists', isSelected: false },
        { name: 'Login', isSelected: false },
      ],
      selectedFloatingOption: 0,
      noInternet: false,
      followBtn: false,
      selectedTicket: null,
    };
    this.getSelectedImages = this.getSelectedImages.bind(this);
  }
  onLoad_method = async () => {
    global.currentRoute = 'HomeScreen';
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
          this.props.GetArtistDetails(this.props.navigation.state.params.id);
        },
      );
    }
  };
  getSelectedImages(images, current) {
    var num = images.length;

    this.setState({
      num: num,
      selected: images,
    });
    console.log(current);
    console.log(this.state.selected);
  }
  async componentDidMount() {
    Orientation.lockToPortrait();
    // var status = await CheckConnectivity();
    // if (!status) {
    //   showToast('No Internet ! Please check your connection', 'warning');
    // } else {
    //   let artistId = '5a3da7ce-fb74-4070-a215-d87c56fc111c';
    //   if (this.props.navigation.state.params !== undefined) {
    //     artistId = this.props.navigation.state.params.id;
    //   }
    //   this.props.GetArtistDetails(artistId);
    //   this.setState({artistID: artistId}, () => {
    //     console.log('Artist ID : ' + this.state.artistID);
    //   });
    // }
    console.log('Artist Screen is beign');
    this.reload();
  }

  componentWillReceiveProps(nextProps) {
    // /this.props.artistData.title
    if (nextProps.type == 'FOLLOW_UNFOLLOW_ARTIST_SUCCESS_AS') {
      this.setState({ followBtn: false })
      console.log("FOLLOW_UNFOLLOW_ARTIST_SUCCESS_AS :::::::: ::::: ")
    }

    if(nextProps.type == 'ARTISTDETAIL_ON_LOAD_SUCCESS'){
      //console.log("here is artist success =====> "+JSON.stringify(nextProps.artistData))
      var data ={
        'pageid':'ArtistDetail',
        'pagetypeid':'artist',
        'metric':'visits',//visits /select
        'value':'click',
        'title':`${nextProps.artistData.title}`,
        'ticket':'',//{ticket-type}
        'customparam':''//{play:1,stop:0,pause:0}
      }
      TrackingApp(data)
    }

  }

  onSelectFloatingOption = (selectedFloatingOption) => {
    this.setState({ selectedFloatingOption });
  };

  goToProfileScreen = () => {
    this.props.navigation.navigate('ProfileScreen');
  };
  goToVideoScreen = (url) => {
    console.log('Hello' + url);
    this.props.navigation.navigate('VODScreen', { videoId: splitEndPoint(url) });

    // this.props.navigation.navigate('HomeScreen')
  };
  followButton = (following) => {
    // var followingClick = following;
    // this.setState({followingClick: true});
    alert('Coming Soon, \n we are waiting for API');
  };
  openSheet = () => {
    if (!global.isLoggedIn) {
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
    this.props.navigation.navigate('CreateAccountScreen');
  };
  setModalVisible(visible, indexImage) {
    // console.log('hhey : '+indexImage)
    this.setState({ modalVisible: visible, galleryIndex: indexImage }, () => {
      // alert(value)
    });
  }

  goToEventDetailsScreen = (ref) => {
    this.setState({
      disabled: true,
    });
    this.props.navigation.push('EventDetailScreen', { endpoint: ref });
  };
  _renderItem = ({ item, index }, parallaxProps) => {
    return (
      <ParallaxImage
        source={{ uri: item.image }}
        containerStyle={styles.imageContainer}
        style={styles.image}
        parallaxFactor={0.4}
        {...parallaxProps}>
        {/* <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <Image
              source={{
                uri: item.image,
              }}
              style={styles.modal_image_style}></Image>
          </View> */}
      </ParallaxImage>
    );
  };
  componentWillUnmount = () => {
    this.setState({
      disabled: false,
    });
  };
  goToArtistScreen = (id) => {
    this.setState({
      disabled: true,
    });
    const split_id = id.split('/');
    this.props.navigation.push('ArtistScreen', { id: split_id[2] });
  };
  goToArtistScreenPOP = () => {
    this.setState({
      disabled: true,
    });
    this.props.navigation.push('ArtistScreen');
  };
  reload = async () => {
    global.currentRoute = '';
    this.setState({
      disabled: false,
    },()=>{

    });
    var status = await CheckConnectivity();
    if (!status) {
      this.setState({
        noInternet: true,
      });
      showToast('No Internet ! Please check your connection', 'warning');
    } else {
      let userdata = await AsyncStorage.getItem('loginData');
      if (JSON.parse(userdata) !== null) {
        let us_uid = JSON.parse(userdata).user.uid;
        let artistId = '5a3da7ce-fb74-4070-a215-d87c56fc111c';
        if (this.props.navigation.state.params !== undefined) {
          artistId = this.props.navigation.state.params.id;
        }
        this.props.GetArtistDetails(artistId);
        this.setState(
          { artistID: artistId, noInternet: false, user_uid: us_uid },
          () => {
            console.log('Artist ID : ' + this.state.artistID);
          },
        );
      } else {
        this.props.GetArtistDetails(this.props.navigation.state.params.id);
      }
    }
  };

  FollowUnfollowArtist = () => {
    if (this.state.followBtn == false) {
      this.setState({ followBtn: true }, async () => {
        await this.getAsyncLoggedInFlag().then(async (flag) => {
          if (!flag || isLoggedIn === false) {
            this.RBSheet.open();
          } else {
            const userData = await AsyncStorage.getItem('loginData');
            const token = JSON.parse(userData).token;
            const data = {
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': token,
                'Authorization': `Basic ${encodedString}`, //Z2lnczpkZXY=
              },
              body: {
                flag_name: 'follow',
                entity_uuid: this.props.navigation.state.params.id,
                action: this.props.isArtistFollowedAS ? 'unflag' : 'flag',
                uid: this.state.user_uid,
                skip_permission_check: false,
              },
            };
            this.props.FollowUnfollowArtist(data);
          }
        });
      })
    }
  };
  async getAsyncLoggedInFlag() {
    try {
      let value = await AsyncStorage.getItem(keyConstants.IS_LOGGED_IN);
      return value;
    } catch (err) {
      console.log('err: ' + err);
    }
  }

  goToArtistListingScreen = () => {
    this.props.navigation.navigate('ArtistListingScreen');
  };
  goToEventListingScreen = () => {
    this.props.navigation.navigate('EventListingScreen');
  };

  selctedEvent = async (ref) => {
    var endPointNew = ref.substring(4);
    // alert("Buy Ticket"+refVal[2])
    var data = {
      endpoint: endPointNew,
      baseUrlNew: 'new',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedString}`, //Z2lnczpkZXY=
      },
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
    var endPointNew = ref.substring(4);
    // alert("Buy Ticket"+refVal[2])
    var data = {
      endpoint: endPointNew,
      baseUrlNew: 'new',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedString}`, //Z2lnczpkZXY=
      },
      method:"GET",
      debug: true,
    };
    var eventDetail = await APICALL_v1(data);
    console.log('EVENTDETAIL_USERDATA_SUCCESS : ',endPointNew);
    // console.log('EVENTDETAIL_USERDATA_SUCCESS : ',eventDetail);
    this.buyTicketScreen(eventDetail, endPointNew);
    // this.props.GetEventDetails(endPoint);
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
    this.props.navigation.navigate('TicketFlowScreen', {
      ticketData: ticketData_array,
      event_id: event[1],
    });
  };
  check_login = () => {
    this.props.navigation.navigate('LoginScreen')
  }
  render() {
    let { fetchingArtistDetail } = this.props;
    return (
      <NetworkProvider>
        <NetworkConsumer>
          {({ isConnected }) =>
            !isConnected ? (
              <NoInternetView onLoad_method={() => this.onLoad_method()} />
            ) : fetchingArtistDetail == true ? (
              <GettingReady />
            ) : this.props.ArtistScreenDataLoaded == false ? (
              <SomethingWentWrongView
                onLoad_method={() => this.onLoad_method()}
              />
            ) : (
                    this.props.artistData != undefined &&
                    this.props.artistData != null && (
                      <SafeAreaView style={{ flex: 1 }}>
                        <NavigationEvents onWillFocus={(payload) => this.reload()} />
                        <KeyboardAvoidingView
                          behavior={Platform.OS == 'ios' ? 'padding' : null}
                          style={styles.main_container}>
                          <View style={styles.header_container_style}>
                            <Header twoIcon={true} />
                          </View>
                          <ScrollView
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps="always"
                            contentContainerStyle={styles.scrlView_container}>
                            <ImageBackground
                              loadingIndicatorSource={{
                                uri:
                                  'https://static.wixstatic.com/media/7bddf5_3126b12e05c340daaaac1950336a6ad6~mv2.gif',
                              }}
                              //source={{uri: 'https://files.dev.gigs.live/s3fs-public/uploads/events/responsive/eventtrayverticalthumbnail.png'}}
                              source={getResponsiveImage(this.props.artistData, false)}
                              style={styles.img_bg_style}>
                              <LinearGradient
                                colors={[
                                  'rgba(0, 0, 0,0.1)',
                                  'rgba(0, 0, 0,0.5)',
                                  'rgba(0, 0, 0,0.8)',
                                  'rgba(0, 0, 0,1)',
                                ]}
                                style={[styles.linearGradient2, { borderRadius: 0 }]}>
                                {this.props.artistData.title !== undefined &&
                                  this.props.artistData.title !== null && (
                                    <Text
                                      numberOfLines={1}
                                      style={styles.alpha_text_style}>
                                      {this.props.artistData.title.substring(0, 3)}
                                    </Text>
                                  )}
                                <Text style={styles.singer_name_text_style}>
                                  {this.props.artistData.title}
                                </Text>
                                <View style={styles.genres_text_view_style}>
                                  {this.props.artistData.genres &&
                                    this.props.artistData.genres.length !== 0 &&
                                    this.props.artistData.genres.map(
                                      (genere, generIndex) => {
                                        return (
                                          <Text
                                            style={styles.genres_type_text_style}
                                            key={'genere' + generIndex}>
                                            {genere.title}{' '}
                                            {this.props.artistData.genres.length - 1 >
                                              generIndex && (
                                                <Text
                                                  style={styles.genres_type_text_style}>
                                                  &nbsp;•
                                                </Text>
                                              )}
                                          </Text>
                                        );
                                      },
                                    )}
                                </View>
                                <View style={styles.about_view}>
                                  <Text
                                    numberOfLines={3}
                                    style={styles.about_text_style}>
                                    {this.props.artistData.about}
                                  </Text>
                                </View>
                                <View style={styles.following_N_rating_container}>
                                  <View style={styles.follower_view}>
                                    <Image
                                      source={Images.followers_icon}
                                      style={styles.follower_icon_style}></Image>
                                    <Text style={styles.followers_text_style}>
                                      {this.props.followersAS} Followers{' '}
                                    </Text>
                                    {/* <Text
                                style={[
                                  styles.followers_text_style,
                                  {fontSize: normalize(25), marginVertical: 0},
                                ]}>
                                <Text style={styles.genres_type_text_style}>
                                  •
                                </Text>
                              </Text> */}
                                  </View>
                                  {/* <View style={styles.follower_view}>
                              <Image
                                source={Images.ratings_icon}
                                style={[styles.social_icon_style,{marginHorizontal:0}]}></Image>
                              <Text style={styles.followers_text_style}>
                                {this.props.artistData.rating} Rating
                              </Text>
                            </View> */}
                                </View>
                                <View style={styles.social_icon_view}>
                                  {this.props.artistData.social_links.twitter != null && this.props.artistData.social_links.twitter != '' && this.props.artistData.social_links.twitter != undefined &&
                                    <TouchableOpacity onPress={() => Linking.openURL(this.props.artistData.social_links.twitter)}>
                                      <Image
                                        style={styles.social_icon_style}
                                        source={Images.twitter}></Image>
                                    </TouchableOpacity>
                                  }
                                  {
                                    this.props.artistData.social_links.instagram != undefined && this.props.artistData.social_links.instagram != null && this.props.artistData.social_links.instagram != '' &&
                                    <TouchableOpacity onPress={() => Linking.openURL(this.props.artistData.social_links.instagram)}>
                                      <Image
                                        style={styles.social_icon_style}
                                        source={Images.instagram}></Image>
                                    </TouchableOpacity>
                                  }
                                  {this.props.artistData.social_links.facebook != undefined && this.props.artistData.social_links.facebook != null && this.props.artistData.social_links.facebook != '' &&
                                    <TouchableOpacity onPress={() => Linking.openURL(this.props.artistData.social_links.facebook)}>
                                      <Image
                                        style={styles.social_icon_style}
                                        source={Images.facebook}></Image>
                                    </TouchableOpacity>
                                  }
                                  <TouchableOpacity
                                    onPress={() => {
                                      ShareIt(this.props.artistData.url);
                                    }}>
                                    <Image
                                      style={styles.social_icon_style}
                                      source={Images.share_icon}></Image>
                                  </TouchableOpacity>

                                </View>
                                <ImageBackground
                                  source={Images.btn_gradint}
                                  imageStyle={{ borderRadius: 5 }}
                                  style={styles.follow_artist_btn_style}>
                                  <TouchableOpacity
                                    // onPress={(following) =>
                                    //   this.followButton(this.props.artistData.following)
                                    disabled={this.state.followBtn}
                                    onPress={this.FollowUnfollowArtist}>
                                    <Text style={styles.follow_artist_text_style}>
                                      {!this.props.isArtistFollowedAS
                                        ? strings.follow_the_artist
                                        : strings.following}
                                    </Text>
                                  </TouchableOpacity>
                                </ImageBackground>
                              </LinearGradient>
                            </ImageBackground>
                            <View style={styles.upcoming_event_for_view_container}>
                              <View style={styles.event_for_you_title_view}>
                                <Text style={styles.upcoming_event_text_title}>
                                   Explore Gigs
                          </Text>
                                {/* <TouchableOpacity onPress={this.goToEventListingScreen}>
                          <Text style={styles.see_all_text_title}>See All</Text>
                        </TouchableOpacity> */}
                              </View>
                            </View>
                            <View style={styles.event_for_view_container}>
                              {this.props.artistData.upcoming_events.length === 0 ? (
                                <Text style={styles.noDataTextStyleWhite}>
                                  No Gigs For You Data
                                </Text>
                              ) : null}
                              <ScrollView
                                keyboardShouldPersistTaps="always"
                                nestedScrollEnabled={true}>
                                {this.props.artistData.upcoming_events.length > 0 &&
                                  this.props.artistData.upcoming_events.map(
                                    (item) => {
                                      return (
                                        <ImageBackground
                                          imageStyle={{
                                            borderRadius: 5,
                                            width: '100%',
                                          }}
                                          // source={{
                                          //   uri: item.image,
                                          // }}
                                          source={getResponsiveImage(item, true)}
                                          style={
                                            styles.lady_gaga_concert_img_bg_style
                                          }>
                                          <LinearGradient
                                            colors={[
                                              'rgba(0, 0, 0,0.0)',
                                              'rgba(0, 0, 0,0.0)',
                                              'rgba(0, 0, 0,0.8)',
                                              'rgba(0, 0, 0,1)',
                                            ]}
                                            style={[
                                              styles.linearGradient2,
                                              {
                                                width: SLIDER_WIDTH - 35,
                                                borderRadius: 5,
                                                height: Platform.isPad
                                                  ? SLIDER_HEIGHT / 4
                                                  : 185,
                                              },
                                            ]}>
                                            <TouchableOpacity
                                              disabled={this.state.disabled}
                                              style={{
                                                paddingLeft: 25,
                                                width: SLIDER_WIDTH - 35,
                                                borderRadius: 5,
                                              }}
                                              // onPress={() => this.props.navigation.push('EventDetailScreen',{endpoint: item.ref,},)
                                              onPress={(ref) =>
                                                this.goToEventDetailsScreen(item.ref)
                                              }>
                                              <View
                                                style={
                                                  styles.artist_name_n_concert_name_container
                                                }>
                                                <View>
                                                  <TouchableOpacity
                                                    disabled={this.state.disabled}
                                                    onPress={() =>
                                                      this.goToArtistScreenPOP()
                                                    }>
                                                    <Image
                                                      style={
                                                        styles.lady_gaga_user_pic_style
                                                      }
                                                      // source={{
                                                      //   uri: item.artist.image,
                                                      // }}
                                                      source={getResponsiveImage(
                                                        item.artist,
                                                        false,
                                                      )}></Image>
                                                  </TouchableOpacity>
                                                </View>
                                                <View
                                                  style={{
                                                    alignItems: 'flex-start',
                                                    width: '60%',
                                                  }}>
                                                  <Text
                                                    style={
                                                      styles.artist_name_title_text_event_for_you_style
                                                    }>
                                                    {item.artist.title}
                                                  </Text>

                                                  <Text
                                                    numberOfLines={1}
                                                    style={
                                                      styles.concert_title_text_style
                                                    }>
                                                    {item.title}
                                                  </Text>

                                                  <Text
                                                    style={
                                                      styles.concert_timing_text_style
                                                    }>
                                                    {getFormattedDate(item.date)}
                                                  </Text>

                                                  {/* <View style={styles.event_status_view}>
                                    {item.labels != undefined &&
                                      item.labels != null &&
                                      item.labels.length != 0 &&
                                      item.labels.map(
                                        (item, index) => {
                                          return (
                                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 10 }}>
                                              <Image
                                                source={
                                                  item.labels[0]
                                                    .type == 'live'
                                                    ? Images.live_stream_icon
                                                    : item.labels[index].type == 'demand'
                                                      ? Images.ondemand
                                                      : Images.event_expired
                                                }
                                                style={styles.status_img_style}></Image>
                                              <Text style={styles.live_stream_text_style}>
                                                {
                                                  item.label
                                                }
                                              </Text>

                                              {
                                                index + 1 === item.labels.length - 1 &&
                                                <Text style={[styles.live_stream_text_style, { fontSize: 16 }]}>+ </Text>
                                              }
                                            </View>
                                          );
                                        },
                                      )}

                                  </View>  */}
                                                  <View style={styles.event_status_view}>
                                                    {item.labels != undefined &&
                                                      item.labels != null &&
                                                      item.labels.length != 0 &&
                                                      item.labels.map((itm, idx) => {
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
                                                                item.labels[idx].type == 'live'
                                                                  ? Images.live_stream_icon
                                                                  : item.labels[idx].type == 'demand'
                                                                    ? Images.ondemand
                                                                    : Images.event_expired
                                                              }
                                                              style={styles.status_img_style}></Image>
                                                            <Text style={styles.live_stream_text_style}>
                                                              {item.labels[idx].label}
                                                            </Text>

                                                            {idx + 1 === item.labels.length - 1 && (
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
                                                      })}
                                                  </View>


                                                  <View style={{ top: 4 }}>
                                                    <RBDailog
                                                      btn_style_second={
                                                        styles.similar_artist_event_buy_ticket_btn__style
                                                      }
                                                      lbl_style_second={
                                                        styles.similar_artist_event_buy_ticket_text_btn__style
                                                      }
                                                      lableText={'Buy Tickets'}
                                                      buyTicket={() => {
                                                        this.BuyTicket(item.ref);
                                                      }}
                                                      selctedEvent={async () =>
                                                        await this.selctedEvent(
                                                          item.ref,
                                                        )
                                                      }
                                                      ticket={
                                                        this.state.selectedTicket
                                                      }
                                                    />
                                                  </View>
                                                </View>
                                              </View>
                                              <View
                                                style={{
                                                  position: 'absolute',
                                                  right: 25,
                                                  bottom: 25,
                                                }}>
                                                <Image
                                                  source={
                                                    Images.right_arrow_padding
                                                  }></Image>
                                              </View>
                                            </TouchableOpacity>
                                          </LinearGradient>
                                        </ImageBackground>
                                      );
                                    },
                                  )}
                              </ScrollView>
                              <View
                                style={{
                                  marginTop: 24,
                                  backgroundColor: 'transparent',
                                  height: SLIDER_HEIGHT / 2.5,
                                  alignSelf: 'center',
                                  borderRadius: 10,
                                }}>
                                <Image
                                  source={Images.wave}
                                  style={styles.wave_style}></Image>
                                <Artist_TabEvents
                                  VideoData={this.props.artistData.videos}
                                  onVideoPress={(url) => this.goToVideoScreen(url)}
                                  GelleryData={this.props.artistData.gallery}
                                  MerchandiseData={this.props.artistData.merchandise}
                                  onMerchandiseClick={(val) => Linking.openURL(val)}
                                  aboutData={this.props.artistData}
                                  artistDetail={this.props.artistData.about}
                                  artistDetailImage={
                                    this.props.artistData.about_image
                                  }
                                  imageClick={(indexImage) => {
                                    this.setModalVisible(true, indexImage);
                                  }}
                                />
                              </View>
                            </View>
                            <View>
                              <View style={styles.event_for_you_title_view}>
                                <View
                                  style={{
                                    marginHorizontal: 16,
                                    flexDirection: 'row',
                                  }}>
                                  <Text style={styles.events_for_you_text_title}>
                                    Similar Artists
                            </Text>
                                  <View style={styles.see_all_container}>
                                    <TouchableOpacity
                                      // onPress={this.goToArtistListingScreen}
                                      onPress={this.goToArtistListingScreen}>
                                      <Text style={[styles.see_all_text_title]}>
                                        See All
                                </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                              <View>
                                <Similar_artist
                                  disabled={this.state.disabled}
                                  artistScreen={true}
                                  goToArtistScreen={(split_id) => {
                                    this.goToArtistScreen(split_id);
                                  }}
                                  artistID={this.state.artistID}
                                  similarArtistData={
                                    this.props.artistData.similar_artists
                                  }
                                />
                              </View>
                            </View>
                            <View style={styles.event_for_you_title_view}>
                              <View
                                style={{ marginHorizontal: 16, flexDirection: 'row' }}>
                                <Text style={styles.events_for_you_text_title}>
                                  Similar Gigs
                          </Text>
                                <View
                                  style={{
                                    flex: 1,
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                  }}>
                                  <TouchableOpacity
                                    onPress={this.goToEventListingScreen}>
                                    <Text
                                      style={[
                                        styles.see_all_text_title,
                                        { marginTop: 24 },
                                      ]}>
                                      See All
                              </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                            <View style={styles.similar_artist_suggestion_view}>
                              <ScrollView
                                contentContainerStyle={{ marginLeft: 16 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                {this.props.artistData.similar_events.length !== 0 ? (
                                  <SimilarEvent
                                    artistData={this.props.artistData.similar_events}
                                    artistScreen={true}
                                    btn_style={{
                                      backgroundColor: 'tranparent',
                                      borderWidth: 1,
                                      borderColor: '#fff',
                                    }}
                                    lbl_style={{ color: '#fff' }}
                                    buyTicket={(ref) => this.BuyTicket(ref)}
                                    selctedEvent={(ref) => this.selctedEvent(ref)}
                                    // loginClick={() => this.openSheet()}
                                    goToEventDetailsScreen={(ref) =>
                                      this.goToEventDetailsScreen(ref)
                                    }
                                  />
                                ) : (
                                    <Text style={styles.noDataTextStyleWhite}>
                                      No Similar Events Data
                                    </Text>
                                  )}
                              </ScrollView>
                            </View>
                            <Footer />
                          </ScrollView>
                          {/* {this.state.Scrolling === 'll' && (
                    <View style={styles.floating_menu_container}>
                      {this.state.floatOptionArray.map((item) => {
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              this.onSelectFloatingOption(item.name)
                            }
                            style={[
                              styles.float_menu_box,
                              {
                                backgroundColor:
                                  this.state.selectedFloatingOption ===
                                  item.name
                                    ? '#333336eb'
                                    : '#202023e3',
                              },
                            ]}>
                            <BlurView
                              style={styles.blurView_tip}
                              blurType="dark"
                              blurAmount={10}
                              reducedTransparencyFallbackColor="blur"
                            />
                            <View style={styles.float_menu_box}>
                              <Text
                                style={[
                                  styles.float_dot_text_style,
                                  {
                                    color:
                                      this.state.selectedFloatingOption ===
                                      item.name
                                        ? '#fff'
                                        : '#777',
                                  },
                                ]}>
                                •
                              </Text>
                              <Text
                                style={[
                                  styles.float_options_text_style,
                                  {
                                    color:
                                      this.state.selectedFloatingOption ===
                                      item.name
                                        ? '#fff'
                                        : '#777',
                                  },
                                ]}>
                                {item.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )} */}
                        </KeyboardAvoidingView>
                        <RBSheet
                          ref={(ref) => {
                            this.RBSheet = ref;
                          }}
                          closeOnDragDown={true}
                          closeOnPressMask={true}
                          height={SLIDER_HEIGHT / 4.3}
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
                            <TouchableOpacity
                              style={styles.modal_buy_btn_style}
                              onPress={() => this.check_login()}>
                              <Text style={styles.buy_ticket_text_style}>
                                Login to Follow
                        </Text>
                            </TouchableOpacity>
                            {!global.isLoggedIn ? (
                              <View style={styles.login_line_modal_style}>
                                <Text style={styles.already_have_login_text_style}>
                                  Don't have an account ?
                          </Text>
                                <TouchableOpacity onPress={this.onLogin}>
                                  <Text style={styles.login_text_modal_style}>
                                    {' '}
                              Register
                            </Text>
                                </TouchableOpacity>
                              </View>
                            ) : null}
                          </View>
                        </RBSheet>

                        <Modal
                          animationType="fade"
                          transparent={true}
                          onRequestClose={() => {
                            this.setModalVisible(!this.state.modalVisible);
                          }}
                          visible={this.state.modalVisible}>
                          <View style={styles.modal_main_view}>
                            <TouchableOpacity
                              onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                              }}
                              style={styles.modal_close_view}>
                              <EvilIcons
                                style={{ marginRight: 10 }}
                                name="close"
                                size={40}
                                color="#fff"
                              />
                            </TouchableOpacity>
                            <View style={styles.modal_imag_view}>
                              <Carousel
                                sliderWidth={SLIDER_WIDTH}
                                sliderHeight={ITEM_HEIGHT}
                                itemWidth={ITEM_WIDTH - 30}
                                data={this.props.artistData.gallery}
                                renderItem={this._renderItem}
                                hasParallaxImages={true}
                                firstItem={this.state.galleryIndex}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                              }}
                              style={styles.modal_close_view_2}></TouchableOpacity>
                          </View>
                        </Modal>
                      </SafeAreaView>
                    )
                  )
          }
        </NetworkConsumer>
      </NetworkProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    type: state.ArtistScreenStore.type,
    fetchingArtistDetail: state.ArtistScreenStore.fetchingArtistDetail,
    artistData: state.ArtistScreenStore.artistData,
    artistNewData: state.ArtistScreenStore.artistNewData,
    artistGallery: state.ArtistScreenStore.artistGallery,
    artistMerchandiseGalery: state.ArtistScreenStore.artistMerchandiseGalery,
    artistAboutUs: state.ArtistScreenStore.artistAboutUs,
    artistArtistSimilarEvents:
      state.ArtistScreenStore.artistArtistSimilarEvents,
    requestingAction: state.ArtistScreenStore.requestingAction,
    isArtistFollowedAS: state.ArtistScreenStore.isArtistFollowedAS,
    followersAS: state.ArtistScreenStore.followersAS,
    ArtistScreenDataLoaded: state.ArtistScreenStore.ArtistScreenDataLoaded,
  };
}

function matchDispatchToProps(dispatch) {
  return {
    GetArtistDetails: (id) => dispatch(GetArtistDetails(id)),
    FollowUnfollowArtist: (params) => dispatch(FollowUnfollowArtist(params)),
  };
}

export default connect(mapStateToProps, matchDispatchToProps)(ArtistScreen);

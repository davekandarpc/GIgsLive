import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {NavigationEvents} from 'react-navigation';
import {connect} from 'react-redux';
import {Fonts} from '../../common/fonts';
import {getFormattedDate} from '../../common/functions';
import {Images} from '../../common/Images';
import {showToast} from '../../common/Toaster';
import {GettingReady, SimilarEvent, Similar_artist} from '../../components';
import {ArtistTabVideo} from '../../components/ArtistTabVideo';
import {RBDailog} from '../../components/RBDailog';
import {GetArtistDetails} from '../../store/ArtistScreenStore/actions';
import {CheckConnectivity} from '../../Utils/NetInfoUtils';
import {styles} from './styles';
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const ITEM_HEIGHT = Dimensions.get('window').height;
export class GenreListingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      modalVisible: false,
      followingClick: [],
      num: 0,
      selected: [],
      Scrolling: false,
      galleryIndex: 0,
      artistID: '',
      floatOptionArray: [
        {name: 'Home', isSelected: false},
        {name: 'Live Now', isSelected: false},
        {name: 'Events', isSelected: false},
        {name: 'Artists', isSelected: false},
        {name: 'Login', isSelected: false},
      ],
      selectedFloatingOption: 0,
      noInternet: false,
    };
    this.getSelectedImages = this.getSelectedImages.bind(this);
  }
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
    Orientation.lockToPortrait();
    this.reload();
  }

  onSelectFloatingOption = (selectedFloatingOption) => {
    this.setState({selectedFloatingOption});
  };

  goToArtistListingScreen = () => {
    // this.props.navigation.navigate('ArtistListingScreen')
  };

  goToProfileScreen = () => {
    this.props.navigation.navigate('ProfileScreen');
  };
  goToVideoScreen = (url) => {
    console.log('Hello' + url);
    this.props.navigation.navigate('VODScreen', {videoId: url});
    // this.props.navigation.navigate('HomeScreen')
  };
  followButton = (following) => {
    // var followingClick = following;
    // this.setState({followingClick: true});
    // alert('Coming Soon, \n we are waiting for API');
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
    this.props.navigation.navigate('LoginScreen');
  };
  setModalVisible(visible, indexImage) {
    // console.log('hhey : '+indexImage)
    this.setState({modalVisible: visible, galleryIndex: indexImage}, () => {
      // alert(value)
    });
  }

  goToEventDetailsScreen = (ref) => {
    this.props.navigation.navigate('EventDetailScreen', {endpoint: ref});
  };
  _renderItem = ({item, index}, parallaxProps) => {
    return (
      <ParallaxImage
        source={{uri: item.image}}
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
  goToArtistScreen = (id) => {
    const split_id = id.split('/');
    this.props.navigation.push('ArtistScreen', {id: split_id[2]});
  };
  reload = async () => {
    var status = await CheckConnectivity();
    if (!status) {
      this.setState({
        noInternet: true,
      });
      showToast('No Internet ! Please check your connection', 'warning');
    } else {
      let artistId = '5a3da7ce-fb74-4070-a215-d87c56fc111c';
      if (this.props.navigation.state.params !== undefined) {
        artistId = this.props.navigation.state.params.id;
      }
      this.props.GetArtistDetails(artistId);
      this.setState({artistID: artistId, noInternet: false}, () => {
        console.log('Artist ID : ' + this.state.artistID);
      });
    }
  };
  changeTab = (selectedTab) => {
    this.setState({selectedTab});
  };
  render() {
    let {selectedTab} = this.state;
    let {fetchingArtistDetail} = this.props;
    if (this.state.noInternet == true) {
      return (
        <View style={styles.no_internet_view}>
          <Text style={styles.no_internet_txt}>
            No Internet ! Please check your connection
          </Text>
          <TouchableOpacity
            style={styles.login_btn_style}
            onPress={() => this.reload()}>
            <Text style={styles.no_internet_retry_txt}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (
      fetchingArtistDetail == true ||
      this.props.artistData == undefined
    ) {
      return <GettingReady />;
    } else {
      return (
        <SafeAreaView style={{flex: 1}}>
          <NavigationEvents onWillFocus={(payload) => this.reload()} />
          <KeyboardAvoidingView
            behavior = {Platform.OS == 'ios' ? "padding":null}
            style={styles.main_container}>
            <ScrollView
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="always"
              contentContainerStyle={styles.scrlView_container}>
              <ImageBackground
                source={Images.mainBackground}
                style={styles.header_view}>
                <View>
                <Image source={Images.gigs_live_white} style={styles.logo_img}></Image>
                  <Text style={styles.Screen_title_text_style}>Genres</Text>
                  <View style={styles.tab_view_container}>
                    <TouchableHighlight
                      onPress={() => this.changeTab(0)}
                      style={[
                        styles.tab_btn_style,
                        {
                          borderBottomWidth: selectedTab === 0 ? 3 : null,
                        },
                      ]}>
                      <Text
                        style={styles.tab_btn_text_style}>
                        All
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => this.changeTab(1)}
                      style={[
                        styles.tab_btn_style,
                        {
                          borderBottomWidth: selectedTab === 1 ? 3 : null,
                        },
                      ]}>
                      <Text
                        style={styles.tab_btn_text_style}>
                        Pop
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      onPress={() => this.changeTab(2)}
                      style={[
                        styles.tab_btn_style,
                        {
                          borderBottomWidth: selectedTab === 2 ? 3 : null,
                        },
                      ]}>
                      <Text
                        style={styles.tab_btn_text_style}>
                        Electronic
                      </Text>
                    </TouchableHighlight>
                  </View>
                </View>
                <View style={styles.upcoming_event_for_view_container}>
                  <View style={styles.event_for_you_title_view}>
                    <Text style={styles.upcoming_event_text_title}>
                      Upcoming Pop Events
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        alert(
                          'Coming Soon,\n The Design is Ready,we are Waitng for API EndPoint',
                        )
                      }>
                      <Text style={styles.see_all_text_title}>See All</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.event_for_view_container}>
                  {this.props.artistData.upcoming_events.length === 0 ? (
                    <Text style={styles.noDataTextStyleWhite}>
                      No upcoming Data
                    </Text>
                  ) : null}
                  <ScrollView
                    keyboardShouldPersistTaps="always"
                    nestedScrollEnabled={true}>
                    {this.props.artistData.upcoming_events.length > 0 &&
                      this.props.artistData.upcoming_events.map((item) => {
                        return (
                          <ImageBackground
                            imageStyle={{
                              borderRadius: 5,
                              width: SLIDER_WIDTH - 35,
                            }}
                            source={{
                              uri: item.image,
                            }}
                            style={styles.lady_gaga_concert_img_bg_style}>
                            <LinearGradient
                              colors={[
                                'rgba(0, 0, 0,0.5)',
                                'rgba(0, 0, 0,0.5)',
                                'rgba(0, 0, 0,0.5)',
                              ]}
                              style={[
                                styles.linearGradient2,
                                {width: SLIDER_WIDTH - 35, borderRadius: 5},
                              ]}>
                              <TouchableOpacity
                                style={{
                                  marginLeft: 25,
                                  paddingLeft: 25,
                                  width: SLIDER_WIDTH,
                                  borderRadius: 5,
                                }}
                                onPress={() =>
                                  this.props.navigation.push(
                                    'EventDetailScreen',
                                    {
                                      endpoint: item.ref,
                                    },
                                  )
                                }>
                                <View
                                  style={
                                    styles.artist_name_n_concert_name_container
                                  }>
                                  <View>
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.props.navigation.push(
                                          'ArtistScreen',
                                        );
                                      }}>
                                      <Image
                                        style={styles.lady_gaga_user_pic_style}
                                        source={{
                                          uri: item.artist.image,
                                        }}></Image>
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
                                      style={styles.concert_title_text_style}>
                                      {item.title}
                                    </Text>

                                    <Text
                                      style={styles.concert_timing_text_style}>
                                      {getFormattedDate(item.date)}
                                    </Text>
                                    <View style={{top: 4}}>
                                      <RBDailog
                                        btn_style={
                                          styles.similar_artist_event_buy_ticket_btn__style
                                        }
                                        lbl_style={
                                          styles.similar_artist_event_buy_ticket_text_btn__style
                                        }
                                        lableText={'Buy Tickets'}
                                      />
                                    </View>
                                    <View
                                      style={{
                                        position: 'absolute',
                                        right: 0,
                                        bottom: 0,
                                      }}>
                                      <Image
                                        source={
                                          Images.right_arrow_padding
                                        }></Image>
                                    </View>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </LinearGradient>
                          </ImageBackground>
                        );
                      })}
                  </ScrollView>
                </View>
              </ImageBackground>
              <View style={styles.event_for_you_title_view}>
                <View style={{marginHorizontal: 16, flexDirection: 'row'}}>
                  <Text style={styles.events_for_you_text_title}>
                    Trending Pop Events
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}>
                    {/* <TouchableOpacity
                      onPress={() => }>
                      <Text
                        style={[styles.see_all_text_title, {marginTop: 24}]}>
                        See All
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              </View>
              <View style={styles.similar_artist_suggestion_view}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {this.props.artistData.similar_events.length !== 0 ? (
                    <SimilarEvent
                      artistData={this.props.artistData.similar_events}
                      artistScreen={true}
                      // loginClick={() => this.openSheet()}
                      goToEventDetailsScreen={(ref) =>
                        this.goToEventDetailsScreen(ref)
                      }
                    />
                  ) : (
                    <Text style={styles.noDataTextStyleWhite}>
                      No Trending Pop Events Data found
                    </Text>
                  )}
                </ScrollView>
              </View>
              <View>
                <View style={styles.event_for_you_title_view}>
                  <View style={{marginHorizontal: 16, flexDirection: 'row'}}>
                    <Text style={styles.events_for_you_text_title}>
                      Pop Artist
                    </Text>
                    <View style={styles.see_all_container}></View>
                  </View>
                </View>
                <View style={{}}>
                  <Similar_artist
                    artistScreen={true}
                    goToArtistScreen={(split_id) => {
                      this.goToArtistScreen(split_id);
                    }}
                    artistID={this.state.artistID}
                    similarArtistData={this.props.artistData.similar_artists}
                  />
                </View>
              </View>

              <View style={styles.event_for_you_text_view}>
                <Text style={styles.event_for_you_text_style}>
                  Videos you may like
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{marginTop: 16, marginLeft: 16}}>
                  <ArtistTabVideo
                    ShowTitleData={this.props.artistData.videos}
                    // homeForYou={true}
                    goToEventDetailsScreen={(ref) =>
                      this.goToEventDetailsScreen(ref)
                    }
                  />
                </ScrollView>
              </View>
            </ScrollView>
            {this.state.Scrolling === 'll' && (
              <View style={styles.floating_menu_container}>
                {this.state.floatOptionArray.map((item) => {
                  return (
                    <TouchableOpacity
                      onPress={() => this.onSelectFloatingOption(item.name)}
                      style={[
                        styles.float_menu_box,
                        {
                          backgroundColor:
                            this.state.selectedFloatingOption === item.name
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
                                this.state.selectedFloatingOption === item.name
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
                                this.state.selectedFloatingOption === item.name
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
            )}
          </KeyboardAvoidingView>
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
              <TouchableOpacity
                style={styles.modal_buy_btn_style}
                onPress={this.check_login}>
                <Text style={styles.buy_ticket_text_style}>Buy Tickets</Text>
              </TouchableOpacity>
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
                    <Text style={styles.login_text_modal_style}> Login</Text>
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
                  style={{marginRight: 10}}
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
                style={[
                  styles.modal_close_view,
                  {top: 550, height: 200},
                ]}></TouchableOpacity>
            </View>
          </Modal>
        </SafeAreaView>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    fetchingArtistDetail: state.ArtistScreenStore.fetchingArtistDetail,
    artistData: state.ArtistScreenStore.artistData,
    artistNewData: state.ArtistScreenStore.artistNewData,
    artistGallery: state.ArtistScreenStore.artistGallery,
    artistMerchandiseGalery: state.ArtistScreenStore.artistMerchandiseGalery,
    artistAboutUs: state.ArtistScreenStore.artistAboutUs,
    artistArtistSimilarEvents:
      state.ArtistScreenStore.artistArtistSimilarEvents,
  };
}

function matchDispatchToProps(dispatch) {
  return {
    GetArtistDetails: (id) => dispatch(GetArtistDetails(id)),
  };
}

export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(GenreListingScreen);

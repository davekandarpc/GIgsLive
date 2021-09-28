import React, { Component } from 'react';
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
  InteractionManager,
  Platform,
} from 'react-native';
import { normalize } from '../../common/normalize';
import { getFormattedDate, getResponsiveImage } from '../../common/functions';
import { RBDailog } from '../../components/RBDailog';
import LinearGradient from 'react-native-linear-gradient';
import { Popover, PopoverController } from 'react-native-modal-popover';
import RBSheet from 'react-native-raw-bottom-sheet';
import Orientation from 'react-native-orientation-locker';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import { Images } from '../../common/Images';
import { EventListingTwoSearch } from '../../components/EventListingTwoSearch';
import { Header, Footer } from '../../components';
import { SimilarEvent } from '../../components/SimilarEvent';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import { animatedStyles, scrollInterpolator } from '../../Utils/animations';
import {
  animatedStylesEventListing,
  scrollInterpolatorEventListing,
} from '../../Utils/EventListingSliderAnimation';
import { styles } from './styles';
import { GetEventListingDetails } from '../../store/EventListingStore/actions';
import { connect } from 'react-redux';
import { CheckConnectivity } from '../../Utils/NetInfoUtils';
import { GettingReady } from '../../components';
import { FilterBtn } from '../../components/FilterBtn';
import { Fonts } from '../../common/fonts';
import { NavigationEvents } from 'react-navigation';
import { APICALL_v1 } from '../../common/ApiConfig';
import { NetworkConsumer, NetworkProvider } from 'react-native-offline';
import NoInternetView from '../../components/NoInternetView';
import SomethingWentWrongView from '../../components/SomethingWentWrongView';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import { TrackingApp } from "../../common/TrackingApp";
const SLIDER_HEIGHT = Dimensions.get('window').height;
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = SLIDER_WIDTH / 1.1;
const sliderWidth = Dimensions.get('window').width;
const itemWidth = Platform.isPad ? 550 : sliderWidth;
const height = Dimensions.get('window').height;
const itemHeight = height / 3.7;

export class EventListingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      activeSlide: 0,
      noInternet: false,
      NoresultFound: false,
      activeTab: 0,
      cardList: [],
      eventListingTwoSearchData: [],
      eventBannerTypeData: [],
      selectedTicket: null,
      filterList: [],
      SelectedFilter: [],
      renderSelectedFilter: [],
      renderNewSelectedFilter: [],

      genreSortingResultList: [
        [
          {
            name: 'Anime',
            selectedListEntity: false,
          },
          {
            name: 'Blues',
            selectedListEntity: false,
          },
          {
            name: 'Children',
            selectedListEntity: false,
          },
          {
            name: 'Classical',
            selectedListEntity: false,
          },
          {
            name: 'Comedy',
            selectedListEntity: false,
          },
          {
            name: 'Country',
            selectedListEntity: false,
          },
          {
            name: 'Dance',
            selectedListEntity: false,
          },
          {
            name: 'Electronic',
            selectedListEntity: false,
          },
          {
            name: 'Enka',
            selectedListEntity: false,
          },
          {
            name: 'French Pop',
            selectedListEntity: false,
          },
          {
            name: 'French Pop',
            selectedListEntity: false,
          },
        ],
        [
          {
            name: 'Anime',
            selectedListEntity: false,
          },
          {
            name: 'Blues',
            selectedListEntity: false,
          },
          {
            name: 'Children',
            selectedListEntity: false,
          },
          {
            name: 'Classical',
            selectedListEntity: false,
          },
        ],
        [
          {
            name: 'Anime',
            selectedListEntity: false,
          },
          {
            name: 'Blues',
            selectedListEntity: false,
          },
          {
            name: 'Children',
            selectedListEntity: false,
          },
        ],
        [
          {
            name: 'Anime',
            selectedListEntity: false,
          },
          {
            name: 'Children',
            selectedListEntity: false,
          },
          {
            name: 'Classical',
            selectedListEntity: false,
          },
        ],
      ],
      sortingcategoryList: [
        { name: 'Genre' },
        { name: 'Location' },
        { name: 'Date' },
        { name: 'Show Type' },
      ],
      selectedIndex: 0,
      applyBtn: [{ name: 'Reset' }, { name: 'Apply' }],
      sortBtnList: [{ name: 'A - Z' }, { name: 'Z - A' }, { name: 'Newest First' }],
    };
  }
  goToEventDetailsScreen = (ref) => {
    // this.animatedValue.stopAnimation();
    this.props.navigation.navigate('EventDetailScreen', { endpoint: ref });
  };
  goToArtistScreen = (id) => {
    if (this.props.homeScreen == true) {
      this.props.clearInterval();
    }
    const split_id = id.split('/');
    global.myNavigation.navigate('ArtistScreen', { id: split_id[2] });
  };
  componentDidMount = () => {
    // InteractionManager.runAfterInteractions(() => {
    this.setState({
      isReady: true,
    }, () => {
      var data = {
        'pageid': 'EventList',
        'pagetypeid': 'event',
        'metric': 'visits',//visits /select
        'value': 'click',
        'title': ``,
        'ticket': '',//{ticket-type}
        'customparam': ''//{play:1,stop:0,pause:0}
      }
      TrackingApp(data)
    });

    Orientation.lockToPortrait();
    global.currentRoute = 'EventListing';
    global.activeRoute = 'EventListing';
    this.reload();
    this.onLoad_method();
    // })
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.type === 'EVENTLISTING_ON_LOAD_SUCCESS') {
      if (nextProps.events !== null) {
        // console.log("ARTISTLISTING_ON_LOAD_SUCCESS _ data : "+JSON.stringify(nextProps.artists))
        this.renderHandleFilterData(nextProps.events.list);
      }
    }
  }
  componentWillUnmount() {
    this.setState({
      isReady: false,
    });
  }
  renderHandleFilterData = (data) => {
    var filterList = [];
    var tempList = [];

    console.log('New Filter : ' + JSON.stringify(data));
    for (var i = 0; i < data.length; i++) {
      for (var k = 0; k < data[i].filter.genre.length; k++) {
        // console.log(data[i].filters.genre[k])
        if (filterList.length != 0) {
          // for(var j=0;j<filterList.length;j++){
          //   if(filterList[j]!== data[i].filters.genre[k]){
          //     var oneFilter ={title:data[i].filters.genre[k]}
          //     filterList.push(oneFilter)
          //     break
          //   }
          // }
          if (tempList.includes(data[i].filter.genre[k]) == false) {
            var oneFilter = { title: data[i].filter.genre[k] };
            filterList.push(oneFilter);
            tempList.push(data[i].filter.genre[k]);
          }
        } else {
          var oneFilter = { title: data[i].filter.genre[k] };
          filterList.push(oneFilter);
          tempList.push(data[i].filter.genre[k]);
        }
      }
    }
    console.log('New Filter : ' + JSON.stringify(filterList));
    this.setState({
      filterList,
      renderSelectedFilter: data,
      renderNewSelectedFilter: data,
    });
  };
  handleSelectedFilter = (val) => {
    console.log('Selected : ' + val);
    var temp = [];
    temp.push(val);
    this.setState({ selectedFilter: val }, () => {
      this.RenderFilterList();
    });
  };
  RenderFilterList = () => {
    var sel = this.state.selectedFilter;
    var newItem = this.state.renderSelectedFilter;
    var filterList = [];
    for (var i = 0; i < newItem.length; i++) {
      for (var k = 0; k < newItem[i].filter.genre.length + 1; k++) {
        if (sel.includes(newItem[i].filter.genre[k])) {
          var oneFilter = newItem[i];
          filterList.push(oneFilter);
        }
      }
    }

    function getUniqueListBy(arr, key) {
      return [...new Map(arr.map((item) => [item[key], item])).values()];
    }
    let finalArray = getUniqueListBy(filterList, 'title');

    console.log('filterList : ', JSON.stringify(filterList));
    this.setState({ renderNewSelectedFilter: finalArray });
    // if(sel.inc)
  };

  removeFilter = (val) => {
    var temp = this.state.selectedFilter;
    var newItem = this.state.renderNewSelectedFilter;
    var filterList = [];
    console.log('Data : : ' + temp);
    console.log('Data : : ' + val);
    console.log('newItem : : ' + JSON.stringify(newItem));
    console.log('filter LIST : : ' + JSON.stringify(temp));
    var sel = temp.indexOf(val);
    var removeData = false;
    var removeFilterList = [];
    // if (temp.length >1) {
    // old
    // for(var i=0;i<newItem.length;i++){
    //   console.log('newItem DATA: : ' + JSON.stringify(newItem[i]));
    //   console.log('newItem DATA: : ' + JSON.stringify(newItem[i].filter));
    //   console.log('newItem : : ' + i);
    //   if(newItem[i].filter.genre.includes(val)){
    //     var selData = newItem.indexOf(newItem[i]);
    //     newItem.splice(selData, 1)
    //     // i=0
    //   }
    // }
    // console.log('III : ' + i);
    for (var i = 0; i < newItem.length; i++) {
      if (newItem[i].filter.genre.includes(val)) {
        for (var k = 0; k < temp.length; k++) {
          if (temp[k] !== val) {
            if (newItem[i].filter.genre.includes(temp[k])) {
              removeData = false;
              break;
            }
          } else {
            removeData = true;
          }
        }
      } else {
        removeData = false;
      }
      if (removeData == true) {
        // var selData = newItem.indexOf(newItem[i]);
        var selDataref = newItem[i].ref.split('/');
        var selData = selDataref[2];
        // console.log("selData index OF === : "+selData)
        // console.log("selData index OF Data === "+ JSON.stringify(newItem[selData]));
        // newItem.splice(selData, 1);
        removeFilterList.push(selData);
        // console.log("removeFilterList === : "+removeFilterList)
      }
    }
    for (var l = 0; l < removeFilterList.length; l++) {
      for (var j = 0; j < newItem.length; j++) {
        var delSelDataref = newItem[j].ref.split('/');
        var delSelData = delSelDataref[2];
        if (delSelData == removeFilterList[l]) {
          newItem.splice(j, 1);
        }
      }
    }

    // }
    temp.splice(sel, 1);
    console.log('Delete : : ' + temp.length);
    if (temp.length == 0) {
      this.setState({
        selectedFilter: temp,
        renderNewSelectedFilter: this.state.renderSelectedFilter,
      });
    } else {
      this.setState({ selectedFilter: temp, renderNewSelectedFilter: newItem });
    }
  };
  removeAllFilter = () => {
    if (this.state.selectedFilter != undefined) {

      var temp = this.state.selectedFilter;
      while (temp.length > 0) {
        temp.pop();
      }
      // console.log("this.props.artists.list : "+this.props.artists.list)

      this.setState({
        selectedFilter: temp,
        renderNewSelectedFilter: this.state.renderSelectedFilter,
      });
    }
  };
  onLoad_method = async () => {
    Orientation.lockToPortrait();
    global.currentRoute = 'EventListing';
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
          this.props.GetEventListingDetails();
        },
      );
    }
  };
  Noresult = () => {
    this.setState({ NoresultFound: !this.state.NoresultFound });
  };

  openFilter = () => {
    this.RBSheet_filter.open();
  };

  closeFilter = () => {
    this.RBSheet_filter.close();
  };

  isSelectedcategorybtn = (index) => {
    this.setState({ selectedIndex: index });
  };

  isSelectedListbtn = () => {
    // this.setState({selectedListEntity: index});
    // let arrayOfGenreSortingResultList = this.state.genreSortingResultList;
    // arrayOfGenreSortingResultList[index].selectedListEntity = !arrayOfGenreSortingResultList[index].selectedListEntity;
    // this.setState({arrayOfGenreSortingResultList});
  };

  isSelectedApplyResetbtn = (index) => {
    if (index === 0) {
      this.setState({ selectedApplyReset: index });
      var arr = this.state.genreSortingResultList;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].selectedListEntity == true) {
          arr[i].selectedListEntity = false;
        }
      }
      this.setState({ genreSortingResultList: arr });
    } else {
      this.setState({ selectedApplyReset: index });
      this.RBSheet_filter.close();
    }
  };

  isSelectedSortOption = (index) => {
    this.setState({ selectedSortOption: index });
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

  goToEventDetailScreen = (endpointEventDetailApi) => {
    this.props.navigation.push('EventDetailScreen', {
      endpoint: endpointEventDetailApi,
    });
  };
  // buyTicketScreen = (data, eventID) => {
  //   // alert('EVENTDETAIL_USERDATA_SUCCESS : ');
  //   // console.log('EVENTDETAIL_USERDATA_SUCCESS : ',data);
  //   console.log('EVENTDETAIL_USERDATA_SUCCESS : ' + JSON.stringify(data.tickets));
  //   // alert("EVENTDETAIL_USERDATA_SUCCESS", this.props.eventDetails.tickets)
  //   var ticketData_array = [];
  //   for (let i = 0; i < Object.values(data.tickets).length; i++) {
  //     var ticketData = {
  //       concertName: data.title,
  //       id: data.tickets[i].id,
  //       tickettype: data.tickets[i].ticket_type,
  //       description: data.tickets[i].description,
  //       image: data.tickets[i].image,
  //       price: data.tickets[i].price,
  //       left: data.tickets[i].left,
  //       merchandise_title: data.tickets[i]
  //         .merchandise_title,
  //       merchandise_options: data.tickets[i]
  //         .merchandise_options,
  //       merchandise_image: data.tickets[i]
  //         .merchandise_image,
  //       clicks: 0,
  //       dateTime: data.date
  //     };
  //     ticketData_array.push(ticketData);
  //   }
  //   console.log('ticket Object data = ', ticketData);
  //   var event = eventID.split('/')
  //   console.log('ticket Object data = ', event[1]);
  //   // var input = this.props.navigation.state.params.endpoint;
  //   // var fields = input.split('/');
  //   // //var name = fields[0];
  //   // var eventID = fields[2];
  //   // console.log('event Endpoint', eventID);
  //   this.props.navigation.navigate('TicketFlowScreen', {
  //     ticketData: ticketData_array,
  //     event_id: event[1],
  //   });
  // };
  _renderItem = ({ item }) => {
    return (
      <View style={styles.event_for_view_container}>
        <ImageBackground
          source={getResponsiveImage(item, true)}
          imageStyle={{ borderRadius: 10 }}
          style={styles.lady_gaga_concert_img_bg_style}>
          <TouchableOpacity
            onPress={() => this.goToEventDetailScreen(item.ref)}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0,0.35)', '#000']}
              style={styles.linearGradient2}>
              <View style={styles.artist_name_n_concert_name_container}>
                <View style={{ marginLeft: 25 }}>
                  <TouchableOpacity
                    onPress={() => this.goToArtistScreen(item.band.ref)}>
                    <Image
                      style={styles.lady_gaga_user_pic_style}
                      source={getResponsiveImage(item.band, false)}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.artist_container}>
                  <Text
                    style={styles.artist_name_title_text_event_for_you_style}>
                    {item.band.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={styles.concert_title_text_style}>
                    {item.title}
                  </Text>
                  <Text style={styles.concert_timing_text_style}>
                    {getFormattedDate(item.date)}
                  </Text>
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 5 }}>
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
                              style={[styles.status_img_style, { height: SLIDER_HEIGHT / 30, width: SLIDER_WIDTH / 30, }]}></Image>
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

                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                      <RBDailog
                        BtnTypePrimary={true}
                        buyTicket={() => this.BuyTicket(item.ref)}
                        selctedEvent={() => this.selctedEvent(item.ref)}
                        ticket={this.state.selectedTicket}
                        btn_style={
                          styles.buy_tickets_concert_artist_btn_style
                        }
                        lbl_style={
                          styles.buy_ticket_concert_artist_text_style
                        }
                        lableText={'Buy Tickets'}
                      />
                    </View>
                    <View style={{ marginRight: 0 }}>
                      <TouchableOpacity
                        onPress={() => this.goToEventDetailsScreen(item.ref)}>
                        <Image source={Images.right_arrow_padding} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  };

  get pagination() {
    const { activeSlide } = this.state;
    const { events } = this.props;
    return (
      <Pagination
        dotsLength={events.upcoming.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: 'tranparent',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: -15,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: -15,
          backgroundColor: '#fff',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.9}
      />
    );
  }

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

  _renderItem2 = ({ item }) => {
    return (
      <ImageBackground
        source={getResponsiveImage(item, true)}
        // source={{uri: item.image}}
        // source={
        //   Platform.isPad == true ?
        //   {
        //     uri: item['image-responsive'].normal['>767'],
        //   }
        //   :   item['image-responsive'] != undefined&&
        //       item['image-responsive'] != null &&
        //       item['image-responsive'].normal != undefined &&
        //       item['image-responsive'].normal != null ?
        //       {
        //         uri: item['image-responsive'].normal['<767'],
        //       }
        //     :  {
        //       uri: item['image-responsive'].original,
        //       }
        // }
        imageStyle={{
          borderRadius: 5,
          resizeMode: 'cover',
        }}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        <TouchableOpacity
          onPress={() => this.goToEventDetailsScreen(item.ref)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: itemHeight,
          }}>
          {/* <View style={styles.singer_name_event_name_view}>
            <Image
              source={Images.play_btn_video}
              style={styles.play_btn_top_evnet_style}></Image>
          </View> */}
          <View style={[styles.event_status_view, { position: "absolute", bottom: 2, flexDirection: 'column', width: '100%' }]}>
            <Text style={styles.singer_name_event_name_text_style}>
              {item.title} • {item.band.title}
            </Text>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
                        style={[styles.status_img_style, { height: SLIDER_HEIGHT / 30, width: SLIDER_WIDTH / 30, }]}></Image>
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
          </View>

        </TouchableOpacity>
      </ImageBackground>
    );
  };
  reload = () => {
    console.log("RELOADDDDDDD ")
    Orientation.lockToPortrait();
    this.setState({
      filterList: [],
      SelectedFilter: [],
      renderSelectedFilter: [],
      renderNewSelectedFilter: []
    }, () => {

      global.activeRoute = 'EventListing';
      global.currentRoute = 'EventListing';
      this.onLoad_method();
      this.removeAllFilter()
    })
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
  render() {
    Orientation.lockToPortrait();
    global.currentRoute = 'EventListing';
    let { fetchingEventListing } = this.props;
    return (
      <NetworkProvider>
        <NetworkConsumer>
          {({ isConnected }) =>
            !isConnected ? (
              <NoInternetView onLoad_method={() => this.onLoad_method()} />
            ) : fetchingEventListing == true ? (
              <GettingReady />
            ) : !this.props.EventListingDataLoaded ? (
              <SomethingWentWrongView
                onLoad_method={() => this.onLoad_method()}
              />
            ) : !this.state.isReady ? (
              <GettingReady />
            ) : (
              <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'padding' : null}
                  style={styles.main_container}>
                  <Header />
                  <ScrollView contentContainerStyle={styles.scrlView_container}>
                    <NavigationEvents
                      onWillFocus={() => this.reload()}
                    />
                    <View style={styles.img_bg_style}>
                      <Text
                        style={
                          styles.main_title_upcoming_event_for_u_text_style
                        }>
                        Upcoming Gigs
                      </Text>
                      <View style={styles.artist_dp_view}>
                        <Carousel
                          ref={(c) => (this.carousel = c)}
                          data={this.props.events.upcoming}
                          renderItem={this._renderItem}
                          sliderWidth={SLIDER_WIDTH}
                          itemWidth={ITEM_WIDTH}
                          sliderHeight={itemHeight}
                          itemHeight={itemHeight}
                          inactiveSlideScale={1}
                          activeSlideAlignment={'center'}
                          onSnapToItem={(index) =>
                            this.setState({ activeSlide: index })
                          }
                          scrollInterpolator={scrollInterpolator}
                          slideInterpolatedStyle={animatedStyles}
                        />
                        <View style={{ width: '20%' }}>{this.pagination}</View>
                      </View>
                    </View>
                    <View style={styles.main_view}>
                      {this.props.events.watchlist.length > 0 ? (
                        <View style={styles.watchlist_event_view}>
                          <View style={styles.watchlist_event_titil_view}>
                            <Text style={styles.View_title_text_style}>
                              Most Popular
                            </Text>
                            <Text style={styles.see_all_text_style}> </Text>
                          </View>
                          <View style={{ flexDirection: 'row' }}>
                            <ScrollView
                              contentContainerStyle={{ marginLeft: 20 }}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}>
                              <SimilarEvent
                                artistData={this.props.events.watchlist}
                                goToEventDetailsScreen={(ref) =>
                                  this.goToEventDetailsScreen(ref)
                                }
                                homescreen={true}
                                loginClick={this.openSheet}
                                buyTicket={(ref) => this.BuyTicket(ref)}
                                selctedEvent={(ref) => this.selctedEvent(ref)}
                                ticket={this.state.selectedTicket}
                                btn_style_second={{
                                  backgroundColor: 'transparent',
                                }}
                                lbl_style_second={{
                                  color: '#fff',
                                  fontFamily: Fonts.OpenSans_semibold,
                                  fontSize: normalize(16),
                                }}
                              // artistData={this.state.eventBannerTypeData}
                              />
                            </ScrollView>
                          </View>
                        </View>
                      ) : null}
                      <View
                        style={styles.slider_event_that_broke_internet_view}>
                        <Text
                          style={[
                            styles.View_title_text_style,
                            { alignSelf: 'flex-start', marginBottom: 15, marginLeft: 16, zIndex: 1 },
                          ]}>
                          Top Gigs
                        </Text>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                            width: '100%',
                          }}>
                          <Image
                            source={Images.wave}
                            resizeMethod={'scale'}
                            style={styles.wave_style}></Image>
                          <Carousel
                            ref={(r) => (this.carousel = r)}
                            data={this.props.events.top}
                            renderItem={this._renderItem2}
                            sliderWidth={sliderWidth / 1}
                            itemWidth={itemWidth / 1.2}
                            inactiveSlideScale={0.9}
                            // itemHeight={itemHeight}
                            onSnapToItem={(index) =>
                              this.setState({ activeIndex: index })
                            }
                            inactiveSlideShift={0}
                            // scrollInterpolator={scrollInterpolatorEventListing}
                            // slideInterpolatedStyle={animatedStylesEventListing}
                            useScrollView={true}
                          />
                        </View>
                      </View>
                      <View style={{ marginTop: '3%' }}>
                        <Text style={styles.Event_text_style}>
                          All our Gigs
                        </Text>
                        <Text style={styles.Showing_Results_text_style}>
                          Showing {this.state.renderNewSelectedFilter.length}{' '}
                          Results
                        </Text>
                      </View>
                      <View style={styles.sorting_btn_view}>
                        {/* <TouchableOpacity
                    onPress={() => this.openFilter()}
                    style={styles.filter_btn_style}>
                    <MaterialIcons
                      name="filter-list"
                      style={styles.icon_btn_sorting_style}
                      size={24}
                      color="#fff"></MaterialIcons>
                    <Text style={styles.Filter_title_btn_text_style}>
                      Filter
                    </Text>
                  </TouchableOpacity>
                  <PopoverController>
                    {({
                      openPopover,
                      closePopover,
                      popoverVisible,
                      setPopoverAnchor,
                      popoverAnchorRect,
                    }) => (
                      <React.Fragment>
                        <TouchableOpacity
                          ref={setPopoverAnchor}
                          onPress={openPopover}
                          style={styles.filter_btn_style}>
                          <MaterialIcons
                            name="sort"
                            style={styles.icon_btn_sorting_style}
                            size={24}
                            color="#fff"></MaterialIcons>
                          <Text style={styles.Filter_title_btn_text_style}>
                            Sort
                          </Text>
                        </TouchableOpacity>
                        <Popover
                          contentStyle={{
                            backgroundColor: '#252628',
                            borderRadius: 10,
                          }}
                          arrowStyle={{borderTopColor: 'transparent'}}
                          backgroundStyle={{backgroundColor: '#252628a6'}}
                          visible={popoverVisible}
                          onClose={closePopover}
                          placement="auto"
                          fromRect={popoverAnchorRect}
                          supportedOrientations={['portrait', 'landscape']}>
                          <View style={styles.sort_box_view}>
                            {this.state.sortBtnList.map((item, index) => {
                              return (
                                <TouchableOpacity
                                  onPress={() =>
                                    this.isSelectedSortOption(index)
                                  }
                                  style={[
                                    styles.A_z_text_style_view,
                                    {
                                      backgroundColor:
                                        this.state.selectedSortOption === index
                                          ? '#373839'
                                          : null,
                                    },
                                  ]}>
                                  <Text
                                    style={[
                                      styles.A_z_text_style,
                                      {
                                        fontFamily:
                                          this.state.selectedApplyReset ===
                                          index
                                            ? Fonts.OpenSans_semibold
                                            : Fonts.OpenSans_regular,
                                      },
                                    ]}>
                                    {item.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </Popover>
                      </React.Fragment>
                    )}
                  </PopoverController> */}
                        {this.state.filterList.length != 0 && (
                          <View style={styles.genre_option_btn_view}>
                            <ScrollView
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{ flexGrow: 1 }}>
                              {this.state.filterList != undefined && (
                                <FilterBtn
                                  genreOption={this.state.filterList}
                                  selectedFilterAdd={(val) =>
                                    this.handleSelectedFilter(val)
                                  }
                                />
                              )}
                            </ScrollView>
                          </View>
                        )}
                      </View>
                      {this.state.selectedFilter != undefined &&
                        this.state.selectedFilter != null &&
                        this.state.selectedFilter.length > 0 && (
                          <TouchableOpacity
                            onPress={() => this.removeAllFilter()}>
                            <Text style={styles.clear_filter_text_style}>
                              Clear Filters
                            </Text>
                          </TouchableOpacity>
                        )}
                      <View style={styles.showing_filer_result_option_view}>
                        {this.state.selectedFilter != undefined &&
                          this.state.selectedFilter != null &&
                          this.state.selectedFilter.length > 0 &&
                          this.state.selectedFilter.map((item) => {
                            return (
                              <TouchableOpacity
                                onPress={() => this.removeFilter(item)}
                                style={styles.selected_filter_option}>
                                <EvilIcons
                                  name="close"
                                  style={styles.icon_btn_sorting_style}
                                  size={20}
                                  color="#fff"></EvilIcons>
                                <Text
                                  style={
                                    styles.selected_filter_option_text_style
                                  }>
                                  {item}
                                </Text>
                                {/* <TouchableOpacity
                                  onPress = {()=>this.removeFilter(item)}
                                  >
                                  </TouchableOpacity> */}
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                      <View style={styles.showing_filer_result_option_view}>
                        <ScrollView horizontal={true}>
                          {/* <View style={styles.selected_filter_option}>
                          <Text style={styles.selected_filter_option_text_style}>Blues</Text>
                          <TouchableOpacity >
                          <FontAwesome
                            name="close"
                            style={styles.icon_btn_sorting_style}
                            size={16}
                            color="#ddd">

                            </FontAwesome>
                          </TouchableOpacity>
                    </View> */}
                        </ScrollView>
                      </View>

                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          marginHorizontal: 20,
                          marginBottom: 48,
                        }}>
                        <View
                          style={{
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <EventListingTwoSearch
                            EventPosterClick={(ref) =>
                              this.goToEventDetailsScreen(ref)
                            }
                            // eventDataTwoSearchData={this.props.events.list}
                            eventDataTwoSearchData={
                              this.state.renderNewSelectedFilter
                            }
                            buyTicket={(item) => {
                              this.BuyTicket(item);
                            }}
                          />
                        </View>
                      </View>
                      <Footer />
                    </View>

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
                  </ScrollView>
                </KeyboardAvoidingView>
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
    type: state.EventListingStore.type,
    fetchingEventListing: state.EventListingStore.fetchingEventListing,
    events: state.EventListingStore.events,
    EventListingDataLoaded: state.EventListingStore.EventListingDataLoaded,
  };
}
function matchDispatchToProps(dispatch) {
  return {
    GetEventListingDetails: () => dispatch(GetEventListingDetails()),
  };
}

export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(EventListingScreen);

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
  Platform,
} from 'react-native';
import { getResponsiveImage, navigationKeys, Images } from '../../common';
import LinearGradient from 'react-native-linear-gradient';
import { NavigationEvents } from 'react-navigation';
import RBSheet from 'react-native-raw-bottom-sheet';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import { FilterBtn } from '../../components/FilterBtn';
import { ArtistTabVideo } from '../../components/ArtistTabVideo';
import { styles } from './styles';
import { GetArtistListingDetails } from '../../store/ArtistListingStore/actions';
import { connect } from 'react-redux';
import { CheckConnectivity, splitEndPoint } from '../../Utils';
import { GettingReady } from '../../components';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Header, Footer } from '../../components';
import Orientation from 'react-native-orientation-locker';
import {
  animatedStylesArtistSlide,
  scrollInterpolatorArtistSlide,
} from '../../Utils/ArtistSlideAnimation';
import { NetworkConsumer, NetworkProvider } from 'react-native-offline';
import NoInternetView from '../../components/NoInternetView';
import SomethingWentWrongView from '../../components/SomethingWentWrongView';
import { TrackingApp } from "../../common/TrackingApp";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export class ArtistListingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      disabled: false,
      isReady: false,
      activeArtistIndex: '',
      ArtistSlideData: [],
      noInternet: false,
      noResultFound: false,
      isSelected: false,
      filterList: [],
      TopArtistList: [
        //
      ],
      SelectedFilter: [],
      renderSelectedFilter: [],
      renderNewSelectedFilter: [],
      genreSortingResultList: [
        { name: 'Anime', isSelected: false },
        { name: 'Blues', isSelected: false },
        { name: 'Children', isSelected: false },
        { name: 'Classical', isSelected: false },
        { name: 'Comedy', isSelected: false },
        { name: 'Country', isSelected: false },
        { name: 'Dance', isSelected: false },
        { name: 'Electronic', isSelected: false },
        { name: 'Enka', isSelected: false },
        { name: 'French Pop', isSelected: false },
        { name: 'French Pop', isSelected: false },
      ],
      sortingcategoryList: [
        { name: 'Genre' },
        { name: 'Location' },
        { name: 'Date' },
        { name: 'Show Type' },
      ],
      linearBoxData: [
        {
          name: 'Y&I',
          img_url:
            'https://schnncdnems02.cdnsrv.jio.com/c.saavncdn.com/artists/Demi_Lovato_002_20200312120805_500x500.jpg',
        },
        {
          name: 'Bonsai Trees',
          img_url:
            'https://sklktcdnems01.cdnsrv.jio.com/c.saavncdn.com/artists/Martin_Garrix_004_20200303120820_500x500.jpg',
        },
      ],
      sortBtnList: [{ name: 'A - Z' }, { name: 'Z - A' }, { name: 'Newest First' }],
      ShowTitleData: [
        { concertName: 'The Omar Show' },
        { concertName: 'The Omar Show' },
        { concertName: 'The Omar Show' },
        { concertName: 'The Omar Show' },
        { concertName: 'The Omar Show' },
        { concertName: 'The Omar Show' },
      ],
    };
  }

  componentDidMount = () => {
    Orientation.lockToPortrait();
    global.currentRoute = 'ArtistListing';
    this.reload();
    this.onLoad_method();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.type === 'ARTISTLISTING_ON_LOAD_SUCCESS') {
      if (nextProps.artists !== null) {
        // console.log("ARTISTLISTING_ON_LOAD_SUCCESS _ data : "+JSON.stringify(nextProps.artists))
        var data = {
          'pageid': 'ArtistLIst',
          'pagetypeid': 'artist',
          'metric': 'visits',//visits /select
          'value': 'click',
          'title': ``,
          'ticket': '',//{ticket-type}
          'customparam': ''//{play:1,stop:0,pause:0}
        }
        TrackingApp(data)
        this.renderHandleFilterData(nextProps.artists.list);
      }
    }
  }
  renderHandleFilterData = (data) => {
    var filterList = [];
    var tempList = [];

    for (var i = 0; i < data.length; i++) {
      for (var k = 0; k < data[i].filters.genre.length; k++) {
        // console.log(data[i].filters.genre[k])
        if (filterList.length != 0) {
          // for(var j=0;j<filterList.length;j++){
          //   if(filterList[j]!== data[i].filters.genre[k]){
          //     var oneFilter ={title:data[i].filters.genre[k]}
          //     filterList.push(oneFilter)
          //     break
          //   }
          // }
          if (tempList.includes(data[i].filters.genre[k]) == false) {
            var oneFilter = { title: data[i].filters.genre[k] };
            filterList.push(oneFilter);
            tempList.push(data[i].filters.genre[k]);
          }
        } else {
          var oneFilter = { title: data[i].filters.genre[k] };
          filterList.push(oneFilter);
          tempList.push(data[i].filters.genre[k]);
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
  onLoad_method = async () => {
    Orientation.lockToPortrait();
    global.currentRoute = 'ArtistListing';
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
          this.props.GetArtistListingDetails();
        },
      );
    }
  };

  goToArtistScreen = (id) => {
    this.setState({
      disabled: true,
    });
    if (this.props.homeScreen == true) {
      this.props.clearInterval();
    }
    const split_id = id.split('/');
    global.myNavigation.navigate('ArtistScreen', { id: split_id[2] });
  };

  noResult = () => {
    this.setState({ noResultFound: !this.state.noResultFound });
  };

  openFilter = () => {
    this.RBSheet_filter.open();
  };

  closeFilter = () => {
    this.RBSheet_filter.close();
  };

  onSelectCategory = (index) => {
    this.setState({ selectedIndex: index });
  };

  onSelectFilterItem = (index) => {
    let arrayOfGenreSortingResultList = this.state.genreSortingResultList;
    arrayOfGenreSortingResultList[
      index
    ].isSelected = !arrayOfGenreSortingResultList[index].isSelected;
    this.setState({ arrayOfGenreSortingResultList });
  };

  resetFilters = () => {
    var arr = this.state.genreSortingResultList;
    for (var i = 0; i < arr.length; i++) {
      arr[i].isSelected = false;
    }
    this.setState({ genreSortingResultList: arr });
  };

  applyFilters = () => {
    this.closeFilter();
  };

  isSelectedSortOption = (index) => {
    this.setState({ selectedSortOption: index });
  };
  _renderArtistImage = ({ item }) => {
    return (
      <TouchableOpacity
        disabled={this.state.disabled}
        onPress={() => this.goToArtistScreen(item.ref)}>
        <Image
          source={getResponsiveImage(item, true)}
          resizeMode="contain"
          style={styles.artist_img_style}></Image>
      </TouchableOpacity>
    );
  };
  reload = () => {
    global.currentRoute = 'ArtistListing';
    global.activeRoute = 'ArtistListing';
    this.setState({
      disabled: false,
    });
    this.removeAllFilter()
  };

  RenderFilterList = async () => {
    var sel = this.state.selectedFilter;
    var newItem = this.state.renderSelectedFilter;
    var filterList = [];
    console.log('newItem : ' + JSON.stringify(newItem));
    for (var i = 0; i < newItem.length; i++) {
      for (var k = 0; k < newItem[i].filters.genre.length; k++) {
        if (sel.includes(newItem[i].filters.genre[k])) {
          var oneFilter = newItem[i];
          filterList.push(oneFilter);
        }
      }
    }
    function getUniqueListBy(arr, key) {
      return [...new Map(arr.map((item) => [item[key], item])).values()];
    }

    let finalArray = getUniqueListBy(filterList, 'title');
    console.log('finalArray: ', finalArray);

    this.setState({ renderNewSelectedFilter: finalArray }, () => {
      console.log(
        'renderNewSelectedFilter ::::: ::: ::' +
        this.state.renderNewSelectedFilter,
      );
    });
    // if(sel.inc)
    // function getUniqueListBy(arr, key) {
    //   return [...new Map(arr.map((item) => [item[key], item])).values()];
    // }
  };
  handleSelectedFilter = (val) => {
    console.log('Selected : ' + val);
    var temp = [];
    temp.push(val);
    this.setState({ selectedFilter: val }, () => {
      this.RenderFilterList();
    });
  };

  removeFilter = (val) => {
    var temp = this.state.selectedFilter;
    var newItem = this.state.renderNewSelectedFilter;
    var filterList = [];
    var removeFilterList = [];
    var removeData = false;
    var sel = temp.indexOf(val);
    for (var i = 0; i < newItem.length; i++) {
      if (newItem[i].filters.genre.includes(val)) {
        for (var k = 0; k < temp.length; k++) {
          if (temp[k] !== val) {
            if (newItem[i].filters.genre.includes(temp[k])) {
              removeData = false;
              break;
            }
          } else {
            removeData = true;
          }
        }
      } else {
        removeData = false
      }
      if (removeData == true) {
        // var selData = newItem.indexOf(newItem[i]);
        var selDataref = newItem[i].ref.split('/');
        var selData = selDataref[2];
        console.log("Seldata : " + selData)
        removeFilterList.push(selData)

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
    temp.splice(sel, 1);
    const filteredItems = this.state.renderNewSelectedFilter.filter(item => item !== sel)
    console.log('filteredItems : : ', this.state.temp);
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
      console.log('this.props.artists.list : ' + this.props.artists.list);

      this.setState({
        selectedFilter: temp,
        renderNewSelectedFilter: this.state.renderSelectedFilter,
      });
    }
  };
  // removeFilter = (val) => {
  //   var selectedGenreList = this.state.selectedGenreList;
  //   console.log('selected Gen : ' + val);
  //   if (!selectedGenreList.includes(val)) {
  //     selectedGenreList.push(val);
  //     this.setState({selectedGenreList, allSelected: false});
  //   } else {
  //     var sel = selectedGenreList.indexOf(val);
  //     selectedGenreList.splice(sel, 1);
  //     if (selectedGenreList.length == 0) {
  //       this.setState({selectedGenreList, allSelected: true});
  //     } else {
  //       this.setState({selectedGenreList, allSelected: false});
  //     }
  //   }
  //   this.props.selectedFilterAdd(selectedGenreList)
  //   console.log('selectedGenreList : ' + selectedGenreList);
  // };

  get pagination() {
    const { activeSlide } = this.state;
    const { artists } = this.props;
    return (
      <Pagination
        dotsLength={artists.promo.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: 'transparent',
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
  goToEventDetailsScreen = (ref) => {
    this.setState({
      disabled: true,
    });
    console.log('Ref : ' + ref);
    global.currentRoute = '';
    this.props.navigation.navigate('EventDetailScreen', { endpoint: ref });
  };
  render() {
    global.currentRoute = 'ArtistListing';
    let { fetchingAristListing } = this.props;
    return (
      <NetworkProvider>
        <NetworkConsumer>
          {({ isConnected }) =>
            !isConnected ? (
              <NoInternetView onLoad_method={() => this.onLoad_method()} />
            ) : fetchingAristListing == true ? (
              <GettingReady />
            ) : !this.props.artistListingScreenDataLoaded ? (
              <SomethingWentWrongView
                onLoad_method={() => this.onLoad_method()}
              />
            ) : (
                    <SafeAreaView style={{ flex: 1}}>
                      <KeyboardAvoidingView
                        behavior={Platform.OS == 'ios' ? 'padding' : null}
                        style={styles.main_container}>
                        <NavigationEvents
                          onWillFocus={() => this.reload()}
                        />
                        <Header />
                        <ScrollView contentContainerStyle={styles.scrlView_container}>
                          {this.props.artists.promo.length > 0 && (
                            <View
                              // source={Images.artist_lisning}
                              // resizeMethod="auto"
                              // imageStyle={{ width: '100%' }}
                              style={styles.img_bg_style}>
                              <View style={styles.artist_dp_view}>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <ImageBackground
                                    source={Images.Dp_rings_img}
                                    resizeMode={'cover'}
                                    imageStyle={{
                                      resizeMode: 'contain',
                                      borderRadius: 300 / 2,
                                    }}
                                    style={styles.dp_ring_view}>
                                    {this.props.artists.promo != null ? (
                                      <View style={styles.inside_dp_ring_view}>
                                        <Carousel
                                          ref={(c) => (this.carousel = c)}
                                          data={this.props.artists.promo}
                                          renderItem={this._renderArtistImage}
                                          layout={'stack'}
                                          sliderWidth={290}
                                          itemWidth={290}
                                          itemHeight={291}
                                          onSnapToItem={(index) =>
                                            this.setState({ activeSlide: index })
                                          }
                                          inactiveSlideShift={0}
                                          scrollInterpolator={
                                            scrollInterpolatorArtistSlide
                                          }
                                          slideInterpolatedStyle={
                                            animatedStylesArtistSlide
                                          }
                                        />
                                      </View>
                                    ) : null}
                                  </ImageBackground>
                                  <View style={styles.three_dot_view}>
                                    {this.pagination}
                                  </View>
                                </View>
                              </View>
                              <View style={styles.artist_title_view}>
                                {/* <Text style={styles.artis_with_new_event_text_style}>
                                  ARTISTS WITH NEW GIGS
                          </Text> */}
                                {this.props.artists.promo[this.state.activeSlide]
                                  .length !== 0 && (
                                    <Text
                                      numberOfLines={1}
                                      style={styles.artis_name_text_style}>
                                      {
                                        this.props.artists.promo[this.state.activeSlide]
                                          .title
                                      }
                                    </Text>
                                  )}
                              </View>
                              <View style={styles.count_follow_view}>
                                <View style={styles.count_box_view}>
                                  <Text style={styles.count_box_title_text_style}>
                                    GIGS
                            </Text>
                                  <Text style={styles.count_box_count_text_style}>
                                    {this.props.artists.promo[this.state.activeSlide]
                                      .length !== 0 &&
                                      this.props.artists.promo[this.state.activeSlide]
                                        .gigs}
                                  </Text>
                                </View>
                                <View style={styles.count_box_view}>
                                  <Text style={styles.count_box_title_text_style}>
                                    FANS
                            </Text>
                                  <Text style={styles.count_box_count_text_style}>
                                    {this.props.artists.promo[this.state.activeSlide]
                                      .length !== 0 &&
                                      this.props.artists.promo[this.state.activeSlide]
                                        .fans}
                                  </Text>
                                </View>
                                {/* <View style={styles.count_box_view}>
                            <Text style={styles.count_box_title_text_style}>
                              RANK
                            </Text>
                            <Text style={styles.count_box_count_text_style}>
                              {this.props.artists.promo[this.state.activeSlide]
                                .length !== 0 &&
                                this.props.artists.promo[this.state.activeSlide]
                                  .rank}
                            </Text>
                          </View> */}
                              </View>
                              <View style={styles.know_more_view}>
                                <Text style={styles.know_more_text_style}>
                                  Know More
                          </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.goToArtistScreen(
                                      this.props.artists.promo[this.state.activeSlide]
                                        .ref,
                                    )
                                  }>
                                  <Image
                                    style={[
                                      styles.right_btn_view,
                                      { borderRadius: 32 / 2 },
                                    ]}
                                    source={Images.knowmore_normal}></Image>
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                          <View style={styles.main_view}>
                            {this.props.artists.promo[this.state.activeSlide].hits !=
                              null ? (
                                <View style={styles.tab_view_container}>
                                  <Text style={styles.tab_title_text_style}>
                                   GIGS FROM THE ARTIST{' '}
                                  </Text>
                                  <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}>
                                    <ArtistTabVideo
                                      homeGigs={true}
                                      notShowStatus={true}
                                      ExploreGigs={true}
                                      ShowTitleData={
                                        this.props.artists.promo[this.state.activeSlide]
                                          .hits
                                      }
                                      goToEventDetailsScreen={(ref) =>
                                        this.goToEventDetailsScreen(ref)
                                      }
                                    />
                                  </ScrollView>
                                </View>
                              ) : null}
                            <Text style={styles.View_title_text_style}>
                              Trending Artists
                      </Text>
                            <View style={styles.top_artist_view}>
                              <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                {this.props.artists.top.map((item) => {
                                  return (
                                    <TouchableOpacity
                                      style={styles.top_artist_entity_view}
                                      disabled={this.state.disabled}
                                      onPress={() => this.goToArtistScreen(item.ref)}>
                                      <ImageBackground
                                        resizeMode="contain"
                                        imageStyle={{}}
                                        source={Images.bright_ring_img}
                                        style={
                                          styles.top_artits_bright_ring_img_style
                                        }>
                                        <Image
                                          source={getResponsiveImage(item, false)}
                                          resizeMode="cover"
                                          style={styles.top_artist_img_style}></Image>
                                      </ImageBackground>
                                      <Text
                                        numberOfLines={1}
                                        style={styles.top_artist_name_text_style}>
                                        {item.title}
                                      </Text>
                                    </TouchableOpacity>
                                  );
                                })}
                              </ScrollView>
                            </View>
                            {this.props.artists.follow.length > 0 && (
                              <View>
                                <Text style={styles.View_title_text_style}>
                                  Artists You Follow
                          </Text>
                                <View style={styles.top_artist_view}>
                                  <ScrollView
                                    horizontal={true}
                                    contentContainerStyle={{paddingLeft:16}}
                                    showsHorizontalScrollIndicator={false}>
                                    {this.props.artists.follow.map((item) => {
                                      return (
                                        <TouchableOpacity
                                          disabled={this.state.disabled}
                                          onPress={() =>
                                            this.goToArtistScreen(item.ref)
                                          }
                                          style={
                                            [styles.artist_you_follow_entity_view,{marginRight:15}]
                                          }>
                                          <Image resizeMode='contain'
                                            source={getResponsiveImage(item, false)}
                                            style={
                                              [styles.top_artist_img_style,{height: height/5.2,
                                              width: width/2.7,}]
                                            }></Image>
                                          <Text
                                            numberOfLines={1}
                                            style={styles.top_artist_name_text_style}>
                                            {item.title}
                                          </Text>
                                        </TouchableOpacity>
                                      );
                                    })}
                                  </ScrollView>
                                </View>
                              </View>
                            )}
                            <Text style={styles.Artists_on_Gigs_text_style}>
                              Artists on Gigs
                      </Text>
                            <Text style={styles.Showing_Results_text_style}>
                              Showing {this.state.renderNewSelectedFilter.length}{' '}
                              Results
                      </Text>

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
                            {/* <View style={styles.sorting_btn_view}>
                            <TouchableOpacity
                              onPress={this.openFilter}
                              style={styles.filter_btn_style}>
                              <MaterialIcons
                                name="filter-list"
                                style={styles.icon_btn_sorting_style}
                                size={24}
                                color="#fff"
                              />
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
                                      color="#fff"
                                    />
                                    <Text style={styles.Filter_title_btn_text_style}>
                                      Sort
                          </Text>
                                  </TouchableOpacity>
                                  <Popover
                                    contentStyle={{
                                      backgroundColor: '#252628',
                                      borderRadius: 10,
                                    }}
                                    arrowStyle={{ borderTopColor: 'transparent' }}
                                    backgroundStyle={{ backgroundColor: '#252628a6' }}
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
                            </PopoverController>
                          </View> */}
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
                            {this.state.noResultFound === false ? (
                              <View>
                                <View
                                  style={{
                                    marginTop: 34,
                                    width: '100%',
                                    alignSelf: 'center',
                                  }}>
                                  <View
                                    style={{
                                      flexWrap: 'wrap',
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      marginHorizontal: 16,
                                    }}>
                                    {/* {this.props.artists.list.map((item) => { */}
                                    {this.state.renderNewSelectedFilter.map(
                                      (item) => {
                                        return (
                                          <TouchableOpacity
                                            disabled={this.state.disabled}
                                            onPress={() =>
                                              this.goToArtistScreen(item.ref)
                                            }
                                            style={[
                                              styles.artist_filter_result_round,
                                            ]}>
                                            <Image
                                              source={getResponsiveImage(item, false)}
                                              style={
                                                styles.artist_result_img_style
                                              }></Image>
                                            <Text
                                              numberOfLines={2}
                                              style={
                                                styles.top_artist_name_text_style
                                              }>
                                              {item.title}
                                            </Text>
                                          </TouchableOpacity>
                                        );
                                      },
                                    )}
                                  </View>
                                </View>
                                {/* {this.props.artists.list.map((item) => {
                            return (
                              <LinearGradient
                                colors={['#2d2d2d', 'rgba(33, 33, 33, 0.5)']}
                                style={styles.linearGradient}>
                                <View style={styles.inside_linear_view}>
                                  <View
                                    style={{
                                      flex: 1,
                                      marginTop: 10,
                                      marginLeft: 10,
                                    }}>
                                    <Text
                                      style={
                                        styles.artist_with_new_event_text_style_box
                                      }>
                                      Artists With new events
                                    </Text>
                                    <Text
                                      style={styles.artist_name_text_style_box}>
                                      {item.title}
                                    </Text>
                                    <View style={{flexDirection: 'row'}}>
                                      <Text style={styles.know_more_text_style}>
                                        Know More
                                      </Text>
                                      <TouchableOpacity
                                        disabled={this.state.disabled}
                                        onPress={() =>
                                          this.goToArtistScreen(item.ref)
                                        }
                                        style={styles.right_btn_view}>
                                        <Fontisto
                                          style={styles.social_icon_style}
                                          name="arrow-right"
                                          size={12}
                                          color="#919293"
                                        />
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                  <View style={styles.linear_img_data_view}>
                                    <Image
                                      source={getResponsiveImage(item, false)}
                                      style={styles.linear_img_data_style}
                                    />
                                  </View>
                                </View>
                              </LinearGradient>
                            );
                          })} */}
                                {/* <View style={styles.top_artist_main_container}>
                            <View style={styles.top_artist_container}>
                              {this.props.artists.top.map((item) => {
                                return (
                                  <TouchableOpacity
                                    disabled={this.state.disabled}
                                    onPress={() =>
                                      this.goToArtistScreen(item.ref)
                                    }
                                    style={[
                                      styles.artist_you_follow_entity_view,
                                      {
                                        width: width / 2 - 50,
                                        marginTop: 8,
                                        marginHorizontal: 20,
                                      },
                                    ]}>
                                    <Image
                                      source={getResponsiveImage(item, false)}
                                      style={
                                        styles.artist_result_img_style
                                      }></Image>
                                    <Text
                                      style={styles.top_artist_name_text_style}>
                                      {item.title}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          </View> */}
                              </View>
                            ) : (
                                <LinearGradient
                                  colors={['#2d2d2d', '#000', '#000', '#000']}
                                  style={styles.nothingFoundMainViewStyle}>
                                  <Image
                                    style={styles.nothingFoundViewImageStyle}
                                    source={{
                                      uri:
                                        'https://cdn.zeplin.io/5f0c51a79180598d5834f369/assets/E8EA2DDA-49FF-4116-A717-68B7914E1404.png',
                                    }}
                                  />
                                  <View style={styles.nothingFoundMainViewStyle}>
                                    <Text style={styles.uh_oh_text_style}>
                                      Uh Oh! Nothing found
                            </Text>
                                    <Text style={styles.odd_filter_text_style}>
                                      Those were some really odd filters{'\n'}Try a
                              different filter
                            </Text>
                                  </View>
                                </LinearGradient>
                              )}
                          </View>
                          <RBSheet
                            ref={(ref) => {
                              this.RBSheet_filter = ref;
                            }}
                            closeOnDragDown={true}
                            closeOnPressMask={true}
                            height={height}
                            openDuration={250}
                            customStyles={{
                              container: {
                                backgroundColor: '#212225',
                                opacity: 1,
                              },
                              wrapper: {
                                backgroundColor: 'transparent',
                              },
                              draggableIcon: {
                                backgroundColor: 'transparent',
                              },
                            }}>
                            <View style={styles.filter_main_view_RB}>
                              <View style={styles.title_view_filter_RB}>
                                <Text style={styles.Filters_text_title_RB}>
                                  Filters
                          </Text>

                              </View>
                              <View style={styles.category_n_list_view}>
                                <View style={styles.category_view}>
                                  {this.state.sortingcategoryList.map(
                                    (item, index) => {
                                      return (
                                        <TouchableOpacity
                                          onPress={() => this.onSelectCategory(index)}
                                          style={[
                                            styles.category_btn_view,
                                            {
                                              backgroundColor:
                                                this.state.selectedIndex === index
                                                  ? '#252628'
                                                  : null,
                                            },
                                          ]}>
                                          <Text
                                            style={[
                                              styles.category_btn_text_style,
                                              {
                                                color:
                                                  this.state.selectedIndex === index
                                                    ? '#fff'
                                                    : '#777',
                                              },
                                            ]}>
                                            {item.name}
                                          </Text>
                                        </TouchableOpacity>
                                      );
                                    },
                                  )}
                                </View>
                                <View style={styles.list_view}>
                                  <View
                                    style={{
                                      justifyContent: 'flex-start',
                                      alignItems: 'center',
                                    }}>
                                    {this.state.genreSortingResultList.map(
                                      (item, index) => {
                                        return (
                                          <TouchableOpacity
                                            onPress={() =>
                                              this.onSelectFilterItem(index)
                                            }
                                            style={[
                                              styles.list_btn_view,
                                              {
                                                backgroundColor:
                                                  item.isSelected === true
                                                    ? '#373839'
                                                    : null,
                                              },
                                            ]}>
                                            <Text
                                              style={[
                                                styles.category_btn_text_style,
                                                {
                                                  color:
                                                    item.isSelected === true
                                                      ? '#fff'
                                                      : '#777',
                                                },
                                              ]}>
                                              {item.name}
                                            </Text>
                                            {item.isSelected === true ? (
                                              <MaterialIcons
                                                name="close"
                                                style={[
                                                  styles.icon_btn_sorting_style,
                                                  { marginRight: 18 },
                                                ]}
                                                size={15}
                                                color="#fff"
                                              />
                                            ) : null}
                                          </TouchableOpacity>
                                        );
                                      },
                                    )}
                                  </View>
                                  <View style={styles.apply_n_reset_view}>
                                    <Text
                                      style={styles.Showing_Results_text_style_RB}>
                                      Showing 10 Results
                              </Text>
                                    <View style={styles.apply_reset_btn_RB_view}>
                                      <TouchableOpacity
                                        onPress={this.resetFilters}
                                        style={styles.resetButton}>
                                        <Text
                                          style={
                                            (styles.category_btn_text_style,
                                              { marginLeft: 0, color: '#777' })
                                          }>
                                          Reset
                                  </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={this.applyFilters}
                                        style={styles.applyButton}>
                                        <Text
                                          style={
                                            (styles.category_btn_text_style,
                                              { marginLeft: 0, color: '#000' })
                                          }>
                                          Apply
                                  </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </RBSheet>
                          <Footer />
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
    type: state.ArtistListingStore.type,
    fetchingAristListing: state.ArtistListingStore.fetchingAristListing,
    artists: state.ArtistListingStore.artists,
    artistListingScreenDataLoaded:
      state.ArtistListingStore.artistListingScreenDataLoaded,
  };
}
function matchDispatchToProps(dispatch) {
  return {
    GetArtistListingDetails: () => dispatch(GetArtistListingDetails()),
  };
}

export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(ArtistListingScreen);

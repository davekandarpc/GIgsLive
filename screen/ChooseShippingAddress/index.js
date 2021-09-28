import React, {Component} from 'react';
import {
  Dimensions,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  BackHandler,
  Alert,
  Modal,
} from 'react-native';
import {styles} from './styles';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {Fonts} from '../../common/fonts';
import {showToast} from '../../common/Toaster';
import {Images} from '../../common/Images';
import {Header, TicketingScreenStepIndicatorView} from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import {addressList, deleteAddress} from '../../store/TicketStore/actions';
import {actionType} from '../../store/TicketStore/actionType';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import {GettingReady} from '../../components';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import {BlurView,VibrancyView} from '@react-native-community/blur';
import Orientation from 'react-native-orientation-locker';
import Spinner from 'react-native-loading-spinner-overlay';

const SLIDER_WIDTH = Dimensions.get('window').width;

export class ChooseShippingAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosition: 1,
      right: false,
      paymentMethod: 'payPal',
      cardNUmberField1: '',
      cardNUmberField2: '',
      cardNUmberField3: '',
      cardNUmberField4: '',
      cardHolderName: '',
      cvv: '',
      expiryMonth: '',
      expiryYear: '',
      saveCardAllow: true,
      cardList: [],
      addNewCard: false,
      selectedAddress: null,
      btnClr: false,
      redeemModel: false,
      GettingReadyLightSmall: false,
      deleteID: null,
    };
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick = () => {
    Alert.alert(
      'TGL',
      'You are in the middle of purchasing a ticket. Are you sure you want to leave the page?',
      [
        {
          text: 'Stay on this page',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        // {text: 'leave this page', onPress: () => this.goBack()},
        {text: 'leave this page', onPress: () => this.goBackHomeScreen()},
      ],
      {cancelable: false},
    );
    return true;
  };

  componentWillReceiveProps = (nextProps) => {
    // if (nextProps.type !== this.props.type) {
    if (nextProps.type === actionType.ADDRESS_LIST_SUCCESS) {
      console.log(
        'this.props.addressListData nextProps : ' +
          typeof nextProps.addressListData,
      );
      console.log(
        'this.props.addressListData nextProps : ' + nextProps.addressListData,
      );
    }
    // }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.type !== this.props.type) {
      if (this.props.type === actionType.ADDRESS_LIST_BEGIN) {
        this.setState({GettingReadyLightSmall:true})
      }
      if (this.props.type === actionType.ADDRESS_LIST_FAIL) {
        this.setState({GettingReadyLightSmall:false})
      }
      if (this.props.type === actionType.ADDRESS_LIST_SUCCESS) {
        console.log('Address data => ', this.props.addressListData);
        var size = Object.keys(this.props.addressListData).length;
        var addlist = [];
        var dummyAdd = [];
        console.log('Size ' + size);
        // console.log(
        //   'this.props.addressListData ' + typeof this.props.addressListData,
        // );
        // console.log(
        //   'this.props.addressListData ' +
        //     Object.key(this.props.addressListData),
        // );
        for (let i = 0; i < size; i++) {
          //addlist.push()
          //console.log("Address ldata = ", /* this.props.addressListData[i]. */Object.keys(this.props.addressListData))
          addlist = Object.values(this.props.addressListData);
          if (addlist[i].address_address1 != undefined) {
            var dataList = {
              address_address1: `${addlist[i].address_address1}`,
              address_address2: `${addlist[i].address_address2}`,
              address_city: `${addlist[i].address_city}`,
              address_country: `${addlist[i].address_country}`,
              address_name: `${addlist[i].address_name}`,
              address_phone_number: `${addlist[i].address_phone_number}`,
              address_state: `${addlist[i].address_state}`,
              zip_code: `${addlist[i].zip_code}`,
              addId: `${Object.keys(this.props.addressListData)[i]}`,
            };
            dummyAdd.push(dataList);
          }
          // if (dataList.address_address1 != 'undefined') {
          // }
        }

        console.log('dataList.address_address1 : ' + dummyAdd.length);
        this.setState(
          {
            cardList: dummyAdd,
            GettingReadyLightSmall:false,
          },
          () => {
            console.log('Address ldata = ', this.state.cardList);
            if (this.state.cardList.length === 0) {
              this.setState({
                btnClr: false,
              });
            }
          },
        );
      }
      if (this.props.type === actionType.DELETE_ADDRESS_SUCCESS) {
        console.log(
          'Address Deleted componentDidUpdate : ' + prevProps.ticketDeleteData,
        );
        showToast('Address deleted successfully.');
        this.reload();
      }
    }
  };
  reload = async () => {
    if (this.props.navigation.state.params !== undefined) {
      console.log('Total amount = ', this.props.navigation.state.params.amount);
      console.log('event id ', this.props.navigation.state.params.event_id);
      var new_event_id = this.props.navigation.state.params.new_event_id;
      console.log('new_event_id id == ', new_event_id);
    }
    var token = await AsyncStorage.getItem('token');
    console.log('token = ', token);
    var data = {
      token: token,
    };
    this.props.addressList(data);
  };
  componentDidMount = async () => {
    Orientation.lockToPortrait();
    this.reload();
    // if (this.props.navigation.state.params !== undefined) {
    //   console.log('Total amount = ', this.props.navigation.state.params.amount);
    //   console.log('event id ', this.props.navigation.state.params.event_id);
    // }
    // var token = await AsyncStorage.getItem('token');
    // console.log('token = ', token);
    // var data = {
    //   token: token,
    // };
    // this.props.addressList(data);
  };

  selectAddress = (index) => {
    this.setState({selectedAddress: index});
    this.setState({btnClr: true});
  };

  setPaymentMethod = (paymentMethod) => {
    this.setState({paymentMethod});
  };

  makePayment = () => {};

  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  setCardNumber = (value, field) => {
    if (field === 1) {
      this.setState({cardNUmberField1: value}, () => {
        this.focusNextField(field + 1);
      });
    }
    if (field === 2) {
      this.setState({cardNUmberField2: value}, () => {
        this.focusNextField(field + 1);
      });
    }
    if (field === 3) {
      this.setState({cardNUmberField3: value}, () => {
        this.focusNextField(field + 1);
      });
    }
    if (field === 4) {
      this.setState({cardNUmberField4: value});
    }
  };

  setCardHodlerName = (cardHolderName) => {
    this.setState({cardHolderName});
  };

  setExpiryMonth = (expiryMonth) => {
    this.setState({expiryMonth}, () => {
      if (expiryMonth.length === 2) this.focusNextField('expiryYear');
    });
  };

  setExpiryYear = (expiryYear) => {
    this.setState({expiryYear});
  };

  setCVV = (cvv) => {
    this.setState({cvv});
  };

  setSaveCardValue = () => {
    this.setState({saveCardAllow: !this.state.saveCardAllow});
  };

  addNewCard = () => {
    var total_amount = this.props.navigation.state.params.amount;
    var eventID = this.props.navigation.state.params.event_id;
    var new_event_id = this.props.navigation.state.params.new_event_id;
    var ticketArrayqty = this.props.navigation.state.params.ticketArrayqty;
    var ticketData = this.props.navigation.state.params.ticketData;
    console.log('Total amount = ', this.props.navigation.state.params.amount);
    console.log('event id ', this.props.navigation.state.params.event_id);
    console.log('new_event_id ==== '+ new_event_id);
    this.props.navigation.navigate('TicketAddAddressFormScreen', {
      total_amount: total_amount,
      event_id: eventID,
      ticketArrayqty: ticketArrayqty,
      ticketData: ticketData,
      new_event_id:new_event_id
    });
  };

  submit = () => {
    let {cardList, selectedAddress} = this.state;
    var total_amount = this.props.navigation.state.params.amount;
    var eventID = this.props.navigation.state.params.event_id;
    var new_event_id = this.props.navigation.state.params.new_event_id;
    var ticketArrayqty = this.props.navigation.state.params.ticketArrayqty;
    var ticketData = this.props.navigation.state.params.ticketData;
    console.log('Total amount = ', this.props.navigation.state.params.amount);
    console.log('event id ', this.props.navigation.state.params.event_id);
    if (selectedAddress !== null) {
      let selectedAddressData = cardList[selectedAddress];
      var address = `Home: ${selectedAddressData.address_address1}\n ${selectedAddressData.address_country}`;
      this.props.navigation.navigate('TicketPaymnetScreen', {
        address,
        total_amount: total_amount,
        event_id: eventID,
        ticketArrayqty: ticketArrayqty,
        ticketData: ticketData,
        new_event_id:new_event_id,
        selectedAddress: false
      });
    } else {
      showToast('Please select an address', 'warning');
    }
  };

  goBack = () => {
    this.props.navigation.goBack();
  };
  goBackHomeScreen = () => {
    // this.props.navigation.navigate('HomeScreen');
    this.props.navigation.pop(2);
  };

  deleteAddress = async (id) => {
    this.setState({redeemModel: true, deleteID: id});
  };
  OKdeleteAddress = async (id) => {
    this.setState({redeemModel: false,GettingReadyLightSmall:true});
    let userdata = await AsyncStorage.getItem('loginData');
    let user_token = JSON.parse(userdata).token;
    var data = {
      addressData: {
        uuid: id,
      },
      headerData: {
        token: user_token,
      },
    };
    this.props.deleteAddress(data);
    console.log('Call deleteAddress');
  };

  onEditPress = (data) => {
    var total_amount = this.props.navigation.state.params.amount;
    var eventID = this.props.navigation.state.params.event_id;
    var new_event_id = this.props.navigation.state.params.new_event_id;
    var ticketArrayqty = this.props.navigation.state.params.ticketArrayqty;
    var ticketData = this.props.navigation.state.params.ticketData;
    //console.log("here here adduuid ==>",data)
    // this.props.navigation.replace('TicketAddAddressFormScreen', {
    this.props.navigation.navigate('TicketAddAddressFormScreen', {
      addressData: data,
      total_amount: total_amount,
      event_id: eventID,
      ticketArrayqty: ticketArrayqty,
      ticketData: ticketData,
      new_event_id: new_event_id,
    });
  };

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => this.selectAddress(index)}>
        {this.state.selectedAddress !== index ? (
          <View
            style={[
              styles.card_view_container,
              {
                borderWidth: this.state.selectedAddress === index ? 2 : 0,
                borderColor:
                  this.state.selectedAddress === index ? '#fff' : 'transparent',
                backgroundColor: '#27292e',
              },
            ]}>
            <View style={styles.inside_card_view_container}>
              <View style={styles.name_n_radio_btn}>
                <View style={styles.name_n_details_view}>
                  <Text style={[styles.user_card_name_text_style,{fontFamily:Fonts.OpenSans_regular,opacity:0.7}]}>
                    {item.address_name}
                  </Text>
                </View>
                <View style={styles.radio_btn_view}>
                  {this.state.selectedAddress === index ? (
                    <TouchableOpacity style={styles.right_sign_view}>
                      <Icon name="checkmark" size={16} color={'#232323'}></Icon>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.selectAddress(index)}
                      style={styles.round_radio_style}>
                      <View
                        style={[
                          styles.selected_btn_style,
                          {
                            backgroundColor:
                              this.state.selectedAddress === index
                                ? '#ddd'
                                : null,
                          },
                        ]}></View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.address_view}>
                <Text style={styles.addresss_text_style}>
                  {item.address_address1}
                </Text>
              </View>
              <View style={styles.country_view}>
                <Text style={styles.country_text_style}>
                  {item.address_country}
                </Text>
              </View>
              <View style={styles.edit_n_delete_view}>
                <View
                  style={{flex: 1, paddingVertical: 15, paddingHorizontal: 0}}>
                  <TouchableOpacity onPress={() => this.onEditPress(item)}>
                    <Text style={styles.edit_text}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    paddingVertical: 15,
                    paddingHorizontal: 0,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.deleteAddress(item.addId)}>
                    <Text style={styles.edit_text}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <ImageBackground
            source={Images.btn_gradint}
            imageStyle={{borderRadius: 9}}
            style={[
              styles.card_view_container,
              {
                borderWidth: this.state.selectedAddress === index ? 2 : 0,
                borderColor:
                  this.state.selectedAddress === index ? '#fff' : 'transparent',
              },
            ]}>
            <View style={styles.inside_card_view_container}>
              <View style={styles.name_n_radio_btn}>
                <View style={styles.name_n_details_view}>
                  <Text style={styles.user_card_name_text_style}>
                    {item.address_name}
                  </Text>
                </View>
                <View style={styles.radio_btn_view}>
                  {this.state.selectedAddress === index ? (
                    <TouchableOpacity style={styles.right_sign_view}>
                      <Icon name="checkmark" size={16} color={'#232323'}></Icon>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.selectAddress(index)}
                      style={styles.round_radio_style}>
                      <View
                        style={[
                          styles.selected_btn_style,
                          {
                            backgroundColor:
                              this.state.selectedAddress === index
                                ? '#ddd'
                                : null,
                          },
                        ]}></View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={styles.address_view}>
                <Text style={styles.addresss_text_style}>
                  {item.address_address1}
                </Text>
              </View>
              <View style={styles.country_view}>
                <Text style={styles.country_text_style}>
                  {item.address_country}
                </Text>
              </View>
              <View style={styles.edit_n_delete_view}>
                <View
                  style={{flex: 1, paddingVertical: 15, paddingHorizontal: 0}}>
                  <TouchableOpacity onPress={() => this.onEditPress(item)}>
                    <Text style={styles.edit_text}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    paddingVertical: 15,
                    paddingHorizontal: 0,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.deleteAddress(item.addId)}>
                    <Text style={styles.edit_text}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        )}
      </TouchableOpacity>
    );
  };

  render() {
    if (this.state.cardList === null) {
      console.log('console card list data is ', null);
      return <GettingReady />;
    } else {
      return (
        <SafeAreaView style={{flex: 1}}>
          <NavigationEvents onWillFocus={() => this.reload()} />
          <Header />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.ScrollView}>
            <TicketingScreenStepIndicatorView
              backEvent={() => this.goBackHomeScreen()}
              currentStep={this.state.currentPosition}
            />
            <View style={styles.main_container}>
              <View style={styles.title_section_view}>
                <TouchableOpacity
                  onPress={this.goBack}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <FontAwesome5 name="arrow-left" color={'#ddd'} size={18} />
                  <Text style={styles.select_tickets_text_style}>
                    Select Merch Size
                  </Text>
                </TouchableOpacity>
                <View style={styles.title_n_close_view}>
                  <View style={styles.title_view}>
                    <Text style={styles.title_text_title_view}>
                      Choose a Shipping Address
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                {/* <Carousel
                    ref={(c) => (this.carousel = c)}
                    data={this.state.cardList}
                    renderItem={this._renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH }
                    inactiveSlideScale={0.9}
                    inactiveSlideShift={1}
                    activeSlideAlignment={"center"}
                    onSnapToItem={(index) => this.setState({activeIndex: index})}
                  /> */}
                <ScrollView
                  horizontal={true}
                  contentContainerStyle={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {this.state.cardList != null &&
                    this.state.cardList.length > 0 &&
                    this.state.cardList.map((item, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => this.selectAddress(index)}>
                          {this.state.selectedAddress !== index ? (
                            <View
                              style={[
                                styles.card_view_container,
                                {
                                  borderWidth:
                                    this.state.selectedAddress === index
                                      ? 2
                                      : 0,
                                  borderColor:
                                    this.state.selectedAddress === index
                                      ? '#fff'
                                      : 'transparent',
                                  backgroundColor: '#27292e',
                                  marginLeft: index == 0 ? 16 : 0,
                                },
                              ]}>
                              <View style={styles.inside_card_view_container}>
                                <View style={styles.name_n_radio_btn}>
                                  <View style={styles.name_n_details_view}>
                                    <Text
                                      style={styles.address_type_text_style}>
                                      {item.type}
                                    </Text>
                                    <Text
                                      style={styles.user_card_name_text_style}>
                                      {item.address_name}
                                    </Text>
                                  </View>
                                  <View style={styles.radio_btn_view}>
                                    {this.state.selectedAddress === index ? (
                                      <TouchableOpacity
                                        style={styles.right_sign_view}>
                                        <Icon
                                          name="checkmark"
                                          size={16}
                                          color={'#232323'}></Icon>
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.selectAddress(index)
                                        }
                                        style={styles.round_radio_style}>
                                        <View
                                          style={[
                                            styles.selected_btn_style,
                                            {
                                              backgroundColor:
                                                this.state.selectedAddress ===
                                                index
                                                  ? '#ddd'
                                                  : null,
                                            },
                                          ]}></View>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                </View>
                                <View style={styles.address_view}>
                                  <Text style={styles.addresss_text_style}>
                                    {item.address_address1}
                                  </Text>
                                </View>
                                <View style={styles.country_view}>
                                  <Text style={styles.country_text_style}>
                                    {item.address_country}
                                  </Text>
                                </View>
                                <View style={styles.edit_n_delete_view}>
                                  <View
                                    style={{
                                      flex: 1,
                                      paddingVertical: 15,
                                      paddingHorizontal: 0,
                                    }}>
                                    <TouchableOpacity
                                      onPress={() => this.onEditPress(item)}>
                                      <Text style={styles.edit_text}>Edit</Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View
                                    style={{
                                      flex: 1,
                                      alignItems: 'flex-end',
                                      paddingVertical: 15,
                                      paddingHorizontal: 0,
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.deleteAddress(item.addId)
                                      }>
                                      <Text style={styles.edit_text}>
                                        Delete
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                          ) : (
                            <ImageBackground
                              source={Images.btn_gradint}
                              imageStyle={{borderRadius: 9}}
                              style={[
                                styles.card_view_container,
                                {
                                  borderWidth:
                                    this.state.selectedAddress === index
                                      ? 2
                                      : 0,
                                  borderColor:
                                    this.state.selectedAddress === index
                                      ? '#fff'
                                      : 'transparent',
                                  marginLeft: index == 0 ? 16 : 0,
                                },
                              ]}>
                              <View style={styles.inside_card_view_container}>
                                <View style={styles.name_n_radio_btn}>
                                  <View style={styles.name_n_details_view}>
                                  <Text
                                      style={styles.address_type_text_style}>
                                      {item.type}
                                    </Text>
                                    <Text
                                      style={styles.user_card_name_text_style}>
                                      {item.address_name}
                                    </Text>
                                  </View>
                                  <View style={styles.radio_btn_view}>
                                    {this.state.selectedAddress === index ? (
                                      <TouchableOpacity
                                        style={styles.right_sign_view}>
                                        <Icon
                                          name="checkmark"
                                          size={16}
                                          color={'#232323'}></Icon>
                                      </TouchableOpacity>
                                    ) : (
                                      <TouchableOpacity
                                        onPress={() =>
                                          this.selectAddress(index)
                                        }
                                        style={styles.round_radio_style}>
                                        <View
                                          style={[
                                            styles.selected_btn_style,
                                            {
                                              backgroundColor:
                                                this.state.selectedAddress ===
                                                index
                                                  ? '#ddd'
                                                  : null,
                                            },
                                          ]}></View>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                </View>
                                <View style={styles.address_view}>
                                  <Text style={styles.addresss_text_style}>
                                    {item.address_address1}
                                  </Text>
                                </View>
                                <View style={styles.country_view}>
                                  <Text style={styles.country_text_style}>
                                    {item.address_country}
                                  </Text>
                                </View>
                                <View style={styles.edit_n_delete_view}>
                                  <View
                                    style={{
                                      flex: 1,
                                      paddingVertical: 15,
                                      paddingHorizontal: 0,
                                    }}>
                                    <TouchableOpacity
                                      onPress={() => this.onEditPress(item)}>
                                      <Text style={styles.edit_text}>Edit</Text>
                                    </TouchableOpacity>
                                  </View>
                                  <View
                                    style={{
                                      flex: 1,
                                      alignItems: 'flex-end',
                                      paddingVertical: 15,
                                      paddingHorizontal: 0,
                                    }}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.deleteAddress(item.addId)
                                      }>
                                      <Text style={styles.edit_text}>
                                        Delete
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </ImageBackground>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                </ScrollView>
              </View>
              <View style={{marginHorizontal: 16}}>
                <TouchableOpacity
                  onPress={this.addNewCard}
                  style={styles.addNewCardButtonView}>
                  <View style={styles.round_plus_view}>
                    <MaterialCommunityIcons
                      name="plus"
                      color="#ddd"
                      size={24}
                    />
                  </View>
                  <Text style={styles.addNewCardButtonText}>
                    Add New Address
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.btnClr == false ? (
                <TouchableOpacity
                  //onPress={() => this.submit()}
                  style={styles.delivery_btn_style}>
                  <Text style={styles.btn_text_style}>
                    Deliver to this Address
                  </Text>
                </TouchableOpacity>
              ) : (
                <ImageBackground
                  source={Images.btn_gradint}
                  imageStyle={{borderRadius: 10}}
                  style={styles.delivery_btn_style}>
                  <TouchableOpacity onPress={() => this.submit()}>
                    <Text style={[styles.btn_text_style, {color: '#fff'}]}>
                      Deliver to this Address
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>
              )}
              <View style={styles.Disclaimer_text_view}>
                <Text style={styles.Disclaimer_title_text_style}>
                  Disclaimer:
                </Text>
                <Text style={styles.Disclaimer_details_text_style}>
                  Shipping to contiguous 48 states only. Please allow 3 to 4
                  weeks for delivery. Please note: Merch may not be available by
                  day of concert.
                </Text>
              </View>
            </View>
          </ScrollView>
          <Modal
            animationType={'slide'}
            transparent={true}
            visible={this.state.redeemModel}
            onRequestClose={() => {
              this.setState({
                redeemModel: false,
              });
            }}
            style={{}}>
            <TouchableOpacity
              style={{
                backgroundColor: 'transparent',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                this.setState({
                  redeemModel: false,
                });
              }}>
             {Platform.OS == 'android' ?
          <BlurView
            style={styles.absolute}
            blurType="dark"
            blurAmount={30}
            reducedTransparencyFallbackColor="blur"
          />
          :
          <VibrancyView
            style={styles.absolute}
            blurType="ultraThinMaterialDark"
            blurAmount={10}
            reducedTransparencyFallbackColor="blur"
          />
          }
              <View style={styles.viewContainer_second}>
                <View style={styles.modal_txt_view}>
                  <Text style={styles.modal_txt_style}>

                  Are you sure you want to delete this address ?
                  </Text>
                </View>
                <View style={styles.modal_btn_view}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({redeemModel: false, deleteID: null})
                    }
                    style={[styles.modal_btn_style,{borderWidth:0}]}>
                  <ImageBackground style={[styles.modal_btn_style,{width:'100%',height:'100%',borderWidth:0}]} source={Images.btn_gradint} imageStyle={{borderRadius:10}}>
                    <Text style={styles.modal_btn_text_style}>Cancel</Text>
                      </ImageBackground>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.OKdeleteAddress(this.state.deleteID)}
                    style={styles.modal_btn_style}>
                    <Text style={styles.modal_btn_text_style}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
          {this.state.GettingReadyLightSmall == true && (
            <View style={styles.blur_view_loader}>
              {Platform.OS == 'android' ? (
                <BlurView
                  style={styles.absoluteReady}
                  blurType="dark"
                  blurAmount={99}
                  reducedTransparencyFallbackColor="blur"
                />
              ) : (
                <VibrancyView
                  style={styles.absoluteReady}
                  blurType="ultraThinMaterialDark"
                  blurAmount={2}
                  reducedTransparencyFallbackColor="blur"
                />
              )}
              <Spinner
                size={'large'}
                overlayColor={'rgba(0, 0, 0, 0.5)'}
                visible={this.state.GettingReadyLightSmall}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
              />
            </View>
          )}
        </SafeAreaView>
      );
    }
  }
}
function mapStateToProps(state) {
  return {
    addressListData: state.TicketStore.addressListData,
    ticketDeleteData: state.TicketStore.ticketDeleteData,
    type: state.TicketStore.type,
  };
}
function matchDispatchToProps(dispatch) {
  return {
    addressList: (headerData) => dispatch(addressList(headerData)),
    deleteAddress: (data) => dispatch(deleteAddress(data)),
  };
}
export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(ChooseShippingAddress);

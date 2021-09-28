import React, { Component, Fragment } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  DatePickerAndroid,
  Platform,
  TouchableHighlight
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { connect } from 'react-redux';
import { Images } from '../../common/Images';
import { showToast } from '../../common/Toaster';
import { APICALL_v1 } from '../../common/ApiConfig';
import Orientation from 'react-native-orientation-locker';
import {
  createAccount,
  socialLogin,
  login,
  getToken,
  logout,
} from '../../store/AuthStore/actions';
import { actionType } from '../../store/AuthStore/actionType';
import { styles } from './styles';
import { Popover, PopoverController } from 'react-native-modal-popover';
import { CheckConnectivity } from '../../Utils/NetInfoUtils';
import AsyncStorage from '@react-native-community/async-storage';
import Auth0 from 'react-native-auth0';
import { TermsConditionModal } from '../../components';
import Fontisto from 'react-native-vector-icons/Fontisto';

var auth0 = null;
if (Platform.OS == 'android') {
  auth0 = new Auth0({
    domain: 'gigslive.us.auth0.com',
    clientId: 'FL8egieQcSnpxK8tRdkRyXsmVesEenVQ',
  });
} else {
  auth0 = new Auth0({
    domain: 'gigslive.us.auth0.com',
    clientId: '3I7gaHtPuxwI4PU62q8e8LwDzgyZnJNk',
  });
}
// import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

export class CreateAccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createAccountSuccess: 0,
      isLoading: false,
      token: '',
      eyeOff: true,
      email: '',
      password: '',
      name: '',
      location: '',
      gender: '',
      DOB: '',
      baseUrl: 'https://dev.thegigs.live/',
      accountCreated: false,
      genderName: 'Select Gender',
      dob: 'DD-MM-YY',
      userInfo: null,
      visibleTerms: false,
      visibleTermsCheck: false,
    };
  }

  componentDidMount = async () => {
    Orientation.lockToPortrait();
    await AsyncStorage.removeItem('token');
    console.log('Token Data : ' + (await AsyncStorage.getItem('token')));
    this.setState({ createAccountSuccess: 1, isLoading: true }, () => {
      this.props.getToken();
    });
  };

  eyeProcess = () => {
    this.setState({ eyeOff: !this.state.eyeOff });
  };

  selectGender = (genderName, gender) => {
    this.setState({ genderName, gender });
  };

  validateForm = async () => {
    var status = await CheckConnectivity();
    // var token = await AsyncStorage.getItem('token');
    let logoutResponse = await APICALL_v1({
      endpoint: 'user/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      baseUrlNew: 'url',
      body: null,
    });
    var token = logoutResponse.token
    console.log('Get Token : ' + token);
    if (!status) {
      showToast('No Internet ! Please check your connection', 'warning');
    }
    else {
      if (!this.state.visibleTermsCheck) {
        showToast('Please Accept Terms and Condition.', 'warning');
      } else {
        const { email, password, name, gender, location } = this.state;
        if (
          email === '' ||
          password === '' ||
          name === '' ||
          gender === '' ||
          location === ''
        ) {
          showToast('Please fill up all the required fields', 'warning');
        } else if (!this.validateEmail(this.state.email)) {
          showToast(
            'Invalid email address, please use valid email address to register',
            'warning',
          );
        } else {
          let createAccountData = {
            registrationdata: {
              name: name,
              mail: email,
              pass: password,
              field_location: {
                und: {
                  0: {
                    value: location,
                  },
                },
              },
              field_username: {
                und: {
                  0: {
                    value: name,
                  },
                },
              },
              // field_zip: {
              //   und: {
              //     0: {
              //       value: '12345',
              //     },
              //   },
              // },
              field_gender: {
                und: this.state.gender,
              },
            },
            headerData: {
              token: token,
            },
          };
          this.setState({ isLoading: true }, () => {
            this.props.createAccount(createAccountData);
          });
        }
      }
    }
  };

  login = async () => {
    // console.log('token in login = >', await AsyncStorage.getItem('token'));
    var status = await CheckConnectivity();
    var token = await AsyncStorage.getItem('token');
    if (!status) {
      showToast('No Internet ! Please check your connection', 'warning');
    } else {
      const { email, password } = this.state;
      let data = {
        bodyData: {
          username: email,
          password: password,
        },
        headerData: {
          token: token,
        },
      };
      this.props.login(data);
    }
  };

  onLogout = async () => {
    var token = await AsyncStorage.getItem('token');
    console.log('createAccountSuccess : ' + this.state.createAccountSuccess);
    if (this.state.createAccountSuccess == 2) {
      this.setState({ createAccountSuccess: 3 }, () => {
        let data = {
          token: token,
        };
        console.log('Call Logout onLogout IF');
        this.props.logout(data);
        global.isLoggedIn = false;
      });
    } else {
      let data = {
        token: token,
      };
      console.log('Call Logout onLogout Else');
      this.props.logout(data);
      global.isLoggedIn = false;
    }
  };

  setUserProfile = async (loginData) => {
    console.log(
      'User daTA 1 loginData:===========================> ' +
      JSON.stringify(loginData),
    );
    var userParse = loginData;
    if (userParse.user.picture !== null) {
      console.log(
        'User daTA image:===========================> ' +
        userParse.user.picture.url,
      );
    }
    console.log(
      'User daTA name:===========================> ' +
      userParse.user.field_username.und[0].value,
    );
    console.log(
      'User daTA name UUID:===========================> ' + userParse.user.name,
    );
    var userData = {
      name: userParse.user.field_username.und[0].value,
      userNameUuid: userParse.user.name,
      profilePic:
        userParse.user.picture !== null ? userParse.user.picture.url : null,
    };
    console.log(
      'User daTA 3:===========================> ' + JSON.stringify(userData),
    );
    await AsyncStorage.setItem('UserProfile', JSON.stringify(userData));
    var userProfile = await AsyncStorage.getItem('UserProfile');
    var newUserProfile = JSON.parse(userProfile);

    global.user_name = newUserProfile.name;
    global.user_name_UUID = newUserProfile.userNameUuid;
    global.user_image = newUserProfile.profilePic;
    console.log('global.user_name : ' + global.user_name);
    console.log('global.user_name_UUID : ' + global.user_name_UUID);
    console.log('global.user_image : ' + global.user_image);
    this.setState({ isLoading: false }, () => {
      showToast('You are successfully logged in');
      // this.props.navigation.goBack(null);
      this.props.navigation.navigate('HomeScreen');
    });
    // this.props.navigation.goBack(null);
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.type !== this.props.type) {
      if (this.props.type === actionType.CREATE_ACCOUNT_SUCCESS) {
        this.setState({ createAccountSuccess: 2 }, () => {
          this.props.getToken();
        });
        // this.toggleOff();
        // this.props.navigation.navigate('HomeScreen');
        // console.log("NEW : ",this.props.creatingAccount)
        // console.log("OLD : ",prevProps.creatingAccount)
        // global.isLoggedIn = true;
        // AsyncStorage.setItem('isLoggedIn', 'true');
        // AsyncStorage.setItem('loginData', JSON.stringify(this.props.creatingAccount));
        // showToast('You are successfully Create Account');
        // this.setState({isLoading: false}, () => {
        //   // this.props.navigation.navigate('HomeScreen');
        //   this.goBack();
        // });

        // let userddata = await AsyncStorage.getItem('loginData');
        // global.user_name = JSON.parse(userddata).user.name;
        // console.log('user data= 000', userddata);
        // showToast('Account created successfully');
      } else if (this.props.type === actionType.CREATE_ACCOUNT_FAIL) {
        //showToast(this.props.registrationError, 'error');
        showToast(
          'The e-mail address ' + this.state.email + ' is already registered.',
        );
        this.setState({ isLoading: false });
      } else if (this.props.type === actionType.SOCIAL_LOGIN_SAGA_SUCCESS) {
        // social login
        console.log(
          'Create Account Data === > ',
          this.props.socialLoginResponse,
        );
        global.isLoggedIn = true;
        var socialLogin = this.props.socialLoginResponse;
        socialLogin.IsSocial = true;
        AsyncStorage.setItem('isLoggedIn', 'true');
        AsyncStorage.setItem('loginData', JSON.stringify(socialLogin));
        this.setUserProfile(socialLogin);
        // showToast('You are successfully Create Account');
        // this.setState({isLoading: false}, () => {
        //   //this.props.navigation.navigate('HomeScreen');
        //   // this.props.navigation.pop(2);
        //   this.goBack();
        // });

        // let userddata = await AsyncStorage.getItem('loginData');
        // global.user_name = JSON.parse(userddata).user.name;
        // console.log('user data SOCIAL LOGIN = 000', userddata);
      } else if (this.props.type === actionType.TOKEN_SUCCESS) {
        // get token
        if (prevProps.type !== this.props.type) {
          console.log('token Data === > ', this.props.token.token);
          AsyncStorage.setItem('token', this.props.token.token);
          if (
            //this.state.createAccountSuccess == 1 ||
            this.state.createAccountSuccess == 2
          ) {
            console.log(
              'Create Account Get Token createAccountSuccess 1 or 2 === > ',
              this.props.token.token,
            );
            this.onLogout();
          } else if (this.state.createAccountSuccess == 3) {
            console.log(
              'Create Account Get Token createAccountSuccess 3 === > ',
              this.props.token.token,
            );
            this.login();
          } else {
            console.log(
              'Create Account Get Token createAccountSuccess else === > ',
              this.props.token.token,
            );
            this.setState({ isLoading: false, createAccountSuccess: 0 });
          }
        }
      } else if (this.props.type === actionType.LOGIN_SUCCESS) {
        // login success
        this.setState({ isLoading: false, createAccountSuccess: 0 }, async () => {
          console.log('Login CREATE ACCOUNT SUCCESSSSSSS === > ');
          console.log('Login CREATE ACCOUNT Data === > ', this.props.loginData);
          global.isLoggedIn = true;
          AsyncStorage.setItem('isLoggedIn', 'true');
          AsyncStorage.setItem(
            'loginData',
            JSON.stringify(this.props.loginData),
          );
          this.setUserProfile(this.props.loginData);
          // showToast('You are successfully logged in');
          // // this.props.navigation.goBack(null);
          // this.props.navigation.navigate('HomeScreen');

          // let userddata = await AsyncStorage.getItem('loginData');
          // global.user_name = JSON.parse(userddata).user.name;
          // console.log('user data Normal Login = 000', userddata);
        });

        // if(this.props.navigation.state.params.screenName ===  'SplashScreen') {
        //   this.props.navigation.navigate('HomeScreen');
        // } else {
        //   console.log("user data= goBack ::::  ")
        //   // this.props.navigation.navigate('HomeScreen');
        // }
        //this.props.navigation.goBack();
        // this.props.navigation.navigate('HomeScreen');
      } else if (this.props.type === actionType.LOGIN_FAIL) {
        this.setState({ isLoading: false }, () => {
          showToast(this.props.loginError, 'error');
        });
      } else if (this.props.type === actionType.LOGOUT_SUCCESS) {
        if (prevProps.type !== this.props.type) {
          console.log('LOG OUT CALL CREATE ACCOUNT');
          if (this.state.createAccountSuccess == 3) {
            this.props.getToken();
          } else if (this.state.createAccountSuccess == 1) {
            this.setState({ isLoading: false, createAccountSuccess: 0 });
          } else {
            this.setState({ isLoading: false, createAccountSuccess: 0 }, () => {
              global.isLoggedIn = false;
              console.log('Logout Data === > ', this.props.logoutData);
              AsyncStorage.removeItem('token');
              AsyncStorage.removeItem('loginData');
              AsyncStorage.setItem('isLoggedIn', 'false');
              this.props.getToken();
            });
          }
        }
      }
    }
  };

  toggleOff = () => {
    this.setState({ accountCreated: !this.state.accountCreated });
  };

  goToLogin = () => {
    this.props.navigation.navigate('LoginScreen');
  };

  selectDate = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate: new Date(),
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        let DAY = day;
        let MONTH = month;
        if (day < 9) {
          DAY = `0${day}`;
        }
        if (month < 9) {
          MONTH = `0${month + 1}`;
        }
        let dob = `${DAY}/${MONTH}/${year}`;
        this.setState({ dob: dob });
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    // var re = /^[a-z0-9._.]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    return re.test(email);
  };

  _onLogin = () => {
    if (!this.state.visibleTermsCheck) {
      showToast('Please Accept Terms and Condition.', 'warning');
    } else {
      console.log('ON login Call :');
      auth0.webAuth
        .authorize({
          scope: 'openid profile email',
        })
        .then((credentials) => {
          // alert('AccessToken: ' + credentials.accessToken);
          console.log('AccessToken: ' + credentials.accessToken);
          console.log('AccessToken: ', credentials);
          this.setState({ isLoading: true }, () => {
            console.log('ON login Call :' + this.state.isLoading);
            this.onSocialLogin(credentials);
          });
        })
        .catch((error) => console.log(error));
    }
  };

  onSocialLogin = async (credentials) => {
    console.log('onSocialLogin CALLLLL: ', credentials);
    // var token = await AsyncStorage.getItem('token');
    let logoutResponse = await APICALL_v1({
      endpoint: 'user/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      baseUrlNew: 'url',
      body: null,
    });
    var token = logoutResponse.token
    var data = {
      bodyData: { credentials },
      headerData: { token: token },
    };
    this.props.socialLogin(data);
  };

  // googlesignIn = async () => {
  //   var status = await CheckConnectivity();
  //   if (!status) {
  //     showToast('No Internet ! Please check your connection', 'warning');
  //   } else {
  //     GoogleSignin.configure({
  //       //It is mandatory to call this method before attempting to call signIn()
  //       scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  //       // Repleace with your webClientId generated from Firebase console
  //       webClientId:
  //         '111112275234-o6mnra8g110a5eoio4fhici6c5c2lmkr.apps.googleusercontent.com',
  //     });

  //     try {
  //       await GoogleSignin.hasPlayServices({
  //         //Check if device has Google Play Services installed.
  //         //Always resolves to true on iOS.
  //         showPlayServicesUpdateDialog: true,
  //       });
  //       const userInfo = await GoogleSignin.signIn();
  //       console.log('User Info --> ', userInfo);

  //       // alert("Google login success")
  //       this.setState({userInfo: userInfo});
  //       global.isLoggedIn = true;
  //       showToast('Account created successfully')
  //       this.props.navigation.goBack();

  //       //alert('Google login success');
  //       this.setState({userInfo: userInfo});
  //     } catch (error) {
  //       console.log('Message', error.message);
  //       alert('Error:-', error.message);
  //       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //         console.log('User Cancelled the Login Flow');
  //       } else if (error.code === statusCodes.IN_PROGRESS) {
  //         console.log('Signing In');
  //       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //         console.log('Play Services Not Available or Outdated');
  //       } else {
  //         console.log('Some Other Error Happened');
  //       }
  //     }
  //   }
  // };

  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  goBack = () => {
    console.log('POP');
    this.props.navigation.goBack(null);
    this.props.navigation.goBack(null);
  };

  setTermsModal = (val) => {
    if (val == 1) {
      this.setState({ visibleTerms: !this.state.visibleTerms })
    } else if (val == 2) {
      if (this.state.visibleTermsCheck == true) {
        this.setState({ visibleTermsCheck: false })
      } else {
        this.setState({ visibleTerms: !this.state.visibleTerms, visibleTermsCheck: true })
      }
    } else if (val == 4) {
      this.setState({ visibleTerms: false, visibleTermsCheck: false })
    }
    else {
      this.setState({ visibleTerms: !this.state.visibleTerms, visibleTermsCheck: true })
    }
  }

  render() {
    // if (this.state.isLoading == true) {
    //   // return <GettingReady />;
    //   null
    // } else {
    return (
      <Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#fff' }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#141518' }}>
          <View style={{ flex: 1, backgroundColor: '#141518' }}>
            <KeyboardAvoidingView
              behavior={Platform.OS == 'ios' ? 'padding' : null}
              style={{ flex: 1 }}>
              <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                {!this.state.accountCreated && (
                  <View style={styles.main_view_container}>
                    <Text style={styles.Login_title_text_style}>
                      Create an account
                </Text>
                    {/* <View style={styles.social_btn_container}>
                  <TouchableOpacity
                    onPress={this._onLogin}
                    style={styles.Social_btn_white_view}>
                    <View style={styles.social_icon_view}>
                      <EvilIcons
                        name="sc-facebook"
                        size={20}
                        color="#1976d2"></EvilIcons>
                    </View>
                    <View style={styles.social_title_text_view}>
                      <Text style={styles.facebook_title_text_style}>
                        Facebook
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.Social_btn_white_view}
                    onPress={this._onLogin}>
                    <View style={styles.social_icon_view}>
                      <Image
                        source={Images.google_icon}
                        style={styles.google_icon_style}
                      />
                    </View>
                    <View style={styles.social_title_text_view}>
                      <Text
                        numberOfLines={1}
                        style={styles.google_title_text_style}>
                        Google
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.OR_view_container}>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#777777',
                      width: 65,
                      height: 1,
                    }}
                  />
                  <Text style={styles.OR_text_style}>OR</Text>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#777777',
                      width: 65,
                      height: 1,
                    }}
                  />
                </View> */}
                    <View style={styles.login_form_container}>
                      <View style={{ marginBottom: 25 }}>
                        <Text style={styles.Email_address_text_inpput_title_style}>
                          Email address*
                    </Text>
                        <View style={styles.Email_text_input_style}>
                          <TextInput
                            ref="1"
                            placeholder="Enter your email address"
                            keyboardType="email-address"
                            returnKeyType="next"
                            placeholderTextColor="#ddd"
                            style={{
                              marginVertical: 0,
                              color: '#fff',
                              flex: 1,
                              opacity: 0.5,
                            }}
                            value={this.state.email}
                            onChangeText={(email) => this.setState({ email })}
                            onSubmitEditing={() => this.focusNextField('2')}
                          />
                        </View>
                      </View>
                      <View style={{ marginBottom: 25 }}>
                        <Text style={styles.password_text_inpput_title_style}>
                          Password*
                    </Text>
                        <View style={styles.Email_text_input_style}>
                          <TextInput
                            ref="2"
                            placeholder="Enter password"
                            placeholderTextColor="#ddd"
                            returnKeyType="next"
                            secureTextEntry={
                              this.state.eyeOff === true ? true : false
                            }
                            style={{
                              color: '#fff',
                              flex: 1,
                              opacity: 0.5,
                            }}
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })}
                            onSubmitEditing={() => this.focusNextField('3')}
                          />
                          <TouchableOpacity onPress={this.eyeProcess}>
                            <Entypo
                              name={
                                this.state.eyeOff === false
                                  ? 'eye-with-line'
                                  : 'eye'
                              }
                              size={20}
                              color="#ddd"
                              style={{ marginRight: 22 }}
                            />
                          </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity
                      style={{alignItems: 'flex-end'}}>
                      <Text style={styles.password_text_inpput_title_style}>
                           Forgot password?
                      </Text>
                    </TouchableOpacity> */}
                      </View>
                      <View style={{ marginBottom: 25 }}>
                        <Text style={styles.Email_address_text_inpput_title_style}>
                          What should we call you?*
                    </Text>
                        <View style={styles.Email_text_input_style}>
                          <TextInput
                            ref="3"
                            placeholder="Enter your name"
                            placeholderTextColor="#ddd"
                            returnKeyType="next"
                            style={{
                              marginVertical: 0,
                              color: '#fff',
                              flex: 1,
                              opacity: 0.5,
                            }}
                            value={this.state.name}
                            onChangeText={(name) => this.setState({ name })}
                            onSubmitEditing={() => this.focusNextField('4')}
                          />
                        </View>
                      </View>
                      <View style={{ marginBottom: 25 }}>
                        <Text style={styles.Email_address_text_inpput_title_style}>
                          Location* {this.props.creatingAccount}
                        </Text>
                        <View style={styles.Email_text_input_style}>
                          <TextInput
                            ref="4"
                            placeholder="Enter your location"
                            placeholderTextColor="#ddd"
                            returnKeyType="done"
                            style={{
                              marginVertical: 0,
                              color: '#fff',
                              flex: 1,
                              opacity: 0.5,
                            }}
                            value={this.state.location}
                            onChangeText={(location) => this.setState({ location })}
                          />
                        </View>
                      </View>
                      <View style={styles.gender_date_container}>
                        <View>
                          <View
                            style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                              style={styles.Email_address_text_inpput_title_style}>
                              Gender*
                        </Text>
                            <AntDesign
                              name="questioncircle"
                              size={10}
                              color="#fff"
                              style={{ marginLeft: 6 }}></AntDesign>
                          </View>
                          <View style={styles.gender_text_input_style}>
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
                                    style={styles.genderViewStyle}>
                                    <Text
                                      style={[
                                        styles.genderPlaceHolder,
                                        {
                                          color:
                                            this.state.genderName ===
                                              'Select Gender'
                                              ? '#ddd'
                                              : '#fff',
                                          opacity:
                                            this.state.genderName ===
                                              'Select Gender'
                                              ? 0.5
                                              : 1,
                                        },
                                      ]}>
                                      {this.state.genderName}
                                    </Text>
                                  </TouchableOpacity>
                                  <Popover
                                    contentStyle={{
                                      backgroundColor: '#3d3d3d',
                                      borderRadius: 5,
                                      paddingLeft: 16,
                                    }}
                                    arrowStyle={{ borderTopColor: 'transparent' }}
                                    backgroundStyle={{
                                      backgroundColor: '#252628a6',
                                    }}
                                    visible={popoverVisible}
                                    onClose={closePopover}
                                    placement="auto"
                                    fromRect={popoverAnchorRect}
                                    supportedOrientations={[
                                      'portrait',
                                      'landscape',
                                    ]}>
                                    <View>
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.selectGender('Male', 55);
                                          closePopover();
                                        }}
                                        style={styles.genderOptionStyle}>
                                        <Text style={styles.genderOptionTextStyle}>
                                          Male
                                    </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.selectGender('Female', 56);
                                          closePopover();
                                        }}
                                        style={styles.genderOptionStyle}>
                                        <Text style={styles.genderOptionTextStyle}>
                                          Female
                                    </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={() => {
                                          this.selectGender(
                                            'Prefer not to say',
                                            87,
                                          );
                                          closePopover();
                                        }}
                                        style={styles.genderOptionStyle}>
                                        <Text style={styles.genderOptionTextStyle}>
                                          Prefer not to say
                                    </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </Popover>
                                </React.Fragment>
                              )}
                            </PopoverController>
                          </View>
                        </View>
                        {/* <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.Email_address_text_inpput_title_style}>Date of Birth</Text>
                        <AntDesign
                          name="questioncircle"
                          size={10}
                          color="#fff"
                          style={{ marginLeft: 6 }}
                        />
                      </View>
                      <TouchableOpacity onPress={this.selectDate} style={styles.DOB_text_input_style}>
                        <Text style={styles.dobTextStyle}>{this.state.dob}</Text>
                      </TouchableOpacity>
                    </View> */}
                      </View>
                    </View>
                    {/* {this.props.creatingAccount == false ? ( */}
                    <View style={{ justifyContent: 'center', alignSelf: 'flex-start', marginTop: 10, marginLeft: 20, flexDirection: "row" }}>
                      <TouchableHighlight
                        onPress={() => { this.setTermsModal(2) }}
                        style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginRight: 10 }}>
                        {this.state.visibleTermsCheck == false ?
                          <Fontisto name="checkbox-passive" size={20} color="#fff" />
                          :
                          <Fontisto name="checkbox-active" size={20} color="#ff" />
                        }
                      </TouchableHighlight>
                      <Text onPress={() => { this.setTermsModal(1) }} style={{ color: '#fff' }}>I Accept Terms and Condition.</Text>
                    </View>
                    {this.state.isLoading == false ? (
                      <TouchableOpacity
                        style={styles.login_btn_style}
                        onPress={this.validateForm}>
                        <Text style={styles.Login_text_btn_style}>
                          Create an account
                    </Text>
                      </TouchableOpacity>
                    ) : (
                      <ActivityIndicator
                        color="#fff"
                        size={30}
                        style={styles.loader}
                      />
                    )}
                    <View style={styles.OR_view_container}>
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderColor: '#777777',
                          width: 65,
                          height: 1,
                        }}
                      />
                      <Text style={styles.OR_text_style}>OR</Text>
                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderColor: '#777777',
                          width: 65,
                          height: 1,
                        }}
                      />
                    </View>
                    <View style={styles.social_btn_container}>
                      <TouchableOpacity
                        onPress={this._onLogin}
                        style={styles.Social_btn_white_view}>
                        <View style={styles.social_icon_view}>
                          <EvilIcons
                            name="sc-facebook"
                            size={35}
                            color="#1976d2"></EvilIcons>
                        </View>
                        <View style={styles.social_title_text_view}>
                          <Text style={styles.facebook_title_text_style}>
                            Login with Facebook
                      </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.Social_btn_white_view}
                        onPress={this._onLogin}>
                        <View style={styles.social_icon_view}>
                          <Image
                            source={Images.google_icon}
                            style={styles.google_icon_style}
                          />
                        </View>
                        <View style={styles.social_title_text_view}>
                          <Text
                            numberOfLines={1}
                            style={styles.google_title_text_style}>
                            Login with Google
                      </Text>
                        </View>
                      </TouchableOpacity>
                      {Platform.OS == 'ios' &&
                        <TouchableOpacity
                          style={styles.Social_btn_white_view}
                          onPress={this._onLogin}>
                          <View style={styles.social_icon_view}>
                            {/* <Image
                              source={Images.apple_logo}
                              style={styles.google_icon_style}
                            /> */}
                            <AntDesign name={'apple1'} size={20} style={{ marginRight: 5 }} color='#fff' />
                          </View>
                          <View style={styles.social_title_text_view}>
                            <Text
                              numberOfLines={1}
                              style={styles.google_title_text_style}>
                              Login with Apple
                      </Text>
                          </View>
                        </TouchableOpacity>}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 15,
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 10
                      }}>
                      <Text style={styles.Not_registered_text_style}>
                        Have an account?{' '}
                      </Text>
                      <TouchableOpacity onPress={this.goToLogin}>
                        <Text style={styles.Create_account_text_style}>Login</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {this.state.accountCreated && (
                  <View style={styles.main_view_container}>
                    <TouchableOpacity
                      onPress={this.toggleOff}
                      style={{ position: 'absolute', top: 30, right: 15 }}>
                      <EvilIcons name="close" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.Login_title_text_style}>
                      Email Verification
                </Text>
                    <Text style={styles.we_will_wait_text_style}>
                      We will wait here for you
                </Text>
                    <View style={{ marginHorizontal: 17 }}>
                      <Text style={styles.verification_link_text_style}>
                        A verification link is sent to your email address please
                        verify and get started!
                  </Text>
                    </View>
                  </View>
                )}
                <TermsConditionModal
                  visibleTerms={this.state.visibleTerms}
                  onClickTerms={() => this.setTermsModal(3)}
                  onClickTermsClose={() => this.setTermsModal(4)}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>
      </Fragment>
    );
    // }
  }
}

function mapStateToProps(state) {
  return {
    type: state.AuthStore.type,
    creatingAccount: state.AuthStore.creatingAccount,
    socialLoginResponse: state.AuthStore.socialLoginResponse,
    registrationError: state.AuthStore.registrationError,
    loginData: state.AuthStore.loginData,
    logoutData: state.AuthStore.logoutData,
    logoutError: state.AuthStore.logoutError,
    token: state.AuthStore.token,
  };
}
function matchDispatchToProps(dispatch) {
  return {
    createAccount: (createAccountData) =>
      dispatch(createAccount(createAccountData)),
    socialLogin: (socialLoginData) => dispatch(socialLogin(socialLoginData)),
    login: (logindata) => dispatch(login(logindata)),
    logout: (logoutdata) => dispatch(logout(logoutdata)),
    getToken: () => dispatch(getToken()),
  };
}
export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(CreateAccountScreen);

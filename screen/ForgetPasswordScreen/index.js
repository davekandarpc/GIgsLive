import React, { Component, Fragment } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { styles } from './styles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { showToast } from '../../common/Toaster';
import { connect } from 'react-redux';
import { forgotPassword } from '../../store/AuthStore/actions';
import { actionType } from '../../store/AuthStore/actionType';
import { CheckConnectivity } from '../../Utils/NetInfoUtils';
import Orientation from 'react-native-orientation-locker';
import AsyncStorage from '@react-native-community/async-storage';
import { baseUrl, APICALL, APICALL_v1 } from '../../common/ApiConfig';
import { Images } from '../../common';
export class ForgetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eyeOff: true,
      email: '',
      sendEmail: false,
      submitCall: false,
    };
  }

  eyeProcess = () => {
    this.setState({ eyeOff: !this.state.eyeOff });
  };
  componentDidMount() {
    Orientation.lockToPortrait();
  }
  componentDidUpdate = (prevProps) => {
    if (prevProps.type !== this.props.type) {
      if (this.props.type === actionType.FORGOT_PASSWORD_SUCCESS) {
        this.setState({ sendEmail: this.props.forgotData[0], submitCall: false });
      } else if (this.props.type === actionType.FORGOT_PASSWORD_FAIL) {
        this.setState({ submitCall: false });
        showToast(this.props.forgotPasswordError, 'error');
      }
    }
  };

  callSubmit = async () => {
    if (this.state.submitCall == false) {
      this.setState({ submitCall: true }, async () => {
        let { email } = this.state;
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
        console.log("TOken : " + token)
        var status = await CheckConnectivity();
        if (!status) {
          showToast('No Internet ! Please check your connection', 'warning');
          this.setState({ submitCall: false })
        } else {
          let data = {
            forgotdata: {
              name: email,
            },
            headerData: {
              token: token,
            },
          };
          if (email === '') {
            showToast('Please enter valid email', 'warning');
            this.setState({ submitCall: false })
          } else if (!this.validateEmail(this.state.email)) {
            showToast(
              'Invalid email address, please use valid email id',
              'warning',
            );
            this.setState({ submitCall: false })
          } else {
            this.props.forgotPassword(data);
          }
        }
      })
    }
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    // var re = /^[a-z0-9._.]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    return re.test(email);
  };
  render() {
    let { sendEmail } = this.state;
    return (
      <Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#fff' }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#141518' }}>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : null}
            style={{ flex: 1, backgroundColor: '#101113' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#101113' }}>
              <View style={styles.main_view_container}>
                <TouchableOpacity
                  onPress={this.goBack}
                  style={styles.close_btn_style}>
                  <EvilIcons name="close" size={40} color="#fff" />
                </TouchableOpacity>
                {!sendEmail ? (
                  <View>
                    <Text style={styles.Login_title_text_style}>
                      Forgot password?
                  </Text>
                    <View style={{ marginHorizontal: 16 }}>
                      <Text style={styles.Email_address_text_inpput_title_style}>
                        Enter your email address to reset your password:
                    </Text>
                      <View style={styles.Email_text_input_style}>
                        <TextInput
                          placeholder="Enter your email address"
                          keyboardType="email-address"
                          placeholderTextColor="#ddd"
                          style={{
                            marginVertical: 0,
                            color: '#fff',
                            flex: 1,
                            opacity: 0.5,
                          }}
                          onChangeText={(email) => this.setState({ email })}
                          value={this.state.email}
                        />
                      </View>
                    </View>
                    <View style={styles.btn_text_view}>
                      <TouchableOpacity
                        onPress={this.goBack}
                        style={[
                          styles.btn_style,
                          {
                            borderWidth: 1,
                            borderColor: '#979797',
                            marginRight: 8,
                          },
                        ]}>
                        <Text style={styles.btn_text_style}>Back</Text>
                      </TouchableOpacity>
                      <ImageBackground
                        source={Images.btn_gradint}
                        style={[
                          styles.btn_style,
                          {
                            backgroundColor: 'transparent',
                            marginLeft: 8,
                          },
                        ]}
                        imageStyle={{ borderRadius: 10 }}
                      >
                        <TouchableOpacity onPress={this.callSubmit}>
                          {!this.props.loading ? (
                            <Text
                              style={[styles.btn_text_style, { color: '#fff' }]}>
                              Submit
                            </Text>
                          ) : (
                            <ActivityIndicator color="#000" size={30} />
                          )}
                        </TouchableOpacity>
                      </ImageBackground>
                    </View>
                  </View>
                ) : (
                  <View>
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
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    forgotData: state.AuthStore.forgotPasswordResponse,
    type: state.AuthStore.type,
    loading: state.AuthStore.loading,
    forgotPasswordError: state.AuthStore.forgotPasswordError,
  };
}
function matchDispatchToProps(dispatch) {
  return {
    forgotPassword: (forgotData) => dispatch(forgotPassword(forgotData)),
  };
}
export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(ForgetPasswordScreen);

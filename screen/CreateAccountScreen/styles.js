import { StyleSheet,Dimensions, Platform } from 'react-native';
import { Fonts } from '../../common/fonts';
import { normalize } from "../../common/normalize";
const sliderWidth = Dimensions.get('window').width;
export const styles = StyleSheet.create({
  main_view_container: {
    flex: 1,
    justifyContent: 'center',
    marginTop:"30%"
  },
  close_btn_style :{
    position:'absolute',
    right:16,
    top:50
  },
  Login_title_text_style: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    fontSize: normalize(20),
    color: '#ddd',
    textAlignVertical: 'center',
    alignSelf: 'center',
  },
  social_btn_container: {
    justifyContent: 'space-evenly',
    marginTop: 10,
    paddingBottom:50
  },
  Social_btn_white_view: {
    alignSelf:'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
    elevation: 9,
    width: Platform.isPad ? sliderWidth / 5 : '90%',
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    marginVertical:10,
    borderWidth:0.5,
    borderColor:'#fff'
  },
  social_icon_view: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  social_title_text_view: {
    flex: 3,
    marginLeft: 10,
    marginRight:10,
  },
  google_title_text_style: {
    marginVertical: 15,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#fff',
  },
  google_icon_style: {
    resizeMode: 'contain',
    width: 13,
    height: 13,
  },
  facebook_title_text_style: {
    marginVertical: 15,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#fff',
  },
  OR_view_container: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 23,
  },
  OR_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    color: '#fff',
    marginHorizontal: 5,
  },
  login_form_container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  Email_address_text_inpput_title_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    color: '#ddd',
  },
  Email_text_input_style: {
    height:40,
    marginTop: 10,
    width: '100%',
    marginRight: 18,
    borderRadius: 5,
    backgroundColor: '#3d3d3d',
    color: '#8c8c8c',
    paddingLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  password_text_inpput_title_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    color: '#ddd',
  },
  Login_text_btn_style: {
    marginVertical: 15,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#fff',
  },
  login_btn_style: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    width:'90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
    borderWidth:0.5,
    borderColor:'#fff'
  },
  Not_registered_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
    color: '#aaa',
  },
  Create_account_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
    color: '#fff',
  },
  gender_date_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom:25
  },
  gender_text_input_style: {
    marginTop: 10,
    width: '60%',
    color: '#8c8c8c',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  DOB_text_input_style: {
    marginTop: 10,
    width: '100%',
    marginRight: 18,
    borderRadius: 10,
    backgroundColor: '#3d3d3d',
    color: '#8c8c8c',
    paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15
  },
  dobTextStyle: {
    color: '#fff'
  },
  we_will_wait_text_style: {
    marginTop: 23,
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(16),
    color: '#a2a2a2',
    alignSelf: 'center',
  },
  verification_link_text_style: {
    marginTop: 23,
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
    color: '#5c5c5c',
    textAlign: 'center',
    alignSelf: 'center',
  },
  loader: {
    marginTop: 10,
  },
  genderPlaceHolder: {
    color: '#fff',
    textAlign:'left',
    paddingLeft:16
  },
  genderViewStyle: {
    borderRadius:5,
    paddingVertical: 10,
    width:'100%',
    backgroundColor: '#3d3d3d',
    alignSelf:'center'
  },
  genderOptionStyle: {
    width: 100,
    backgroundColor: '#3d3d3d',
    padding: 10
  },
  genderOptionTextStyle: {
    color: '#fff'
  },
});

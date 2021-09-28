import {Dimensions, StyleSheet, Platform} from 'react-native';
import {Fonts} from '../../common/fonts';
import { normalize } from "../../common/normalize";

const SLIDER_WIDTH = Dimensions.get('window').width;
const SLIDER_HEIGHT = Dimensions.get('window').height;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8 - 40);
// const ITEM_HEIGHT = Math.round(ITEM_WIDTH +20);
const ITEM_HEIGHT = SLIDER_HEIGHT / 2.5;
export const styles = StyleSheet.create({
  scrlView_container: {
    flexGrow: 1,
    paddingBottom: 100,
    backgroundColor: '#141518'
  },
  main_container: {
    flex: 1,
    backgroundColor: '#141518'
  },
  card_main_view_container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'transparent',
  },
  compnay_title_view_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TGL_Presents_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
    color: '#fff',
  },
  line_view_style: {
    borderBottomWidth: 1,
    borderColor: '#fff',
    flex: 1,
    marginLeft: 10,
  },
  tour_name_title_style: {
    fontFamily: Fonts.PlayfairDisplay_Regular,
    fontSize: normalize(16),
    color: '#fff',
    marginTop: 5,
  },
  _regular_n_price_container: {
    flexDirection: 'row',
    height:'100%',
  },
  regular_n_live_concert_text_style_view: {
    flex: 1,
    alignItems: 'flex-start',
  },
  live_concert_pass_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
    color: '#fff',
    marginTop: 5,
  },
  live_concert_view: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 0,
    marginLeft: 2,
  },

  time_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
    color: '#ddd',
    marginBottom: 10,
  },
  select_quality_container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    marginLeft: 50,
    // flex:1
  },
  select_Quantity_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
    color: '#fff',
    marginTop: 1,
    opacity: 0.5,
    marginBottom: 5,
  },
  head_view_container: {
    // margin:15,
    marginBottom: 0,
    // padding: 15,
    // flex:1,
    // backgroundColor: '#1c1c1f',
    borderRadius: 10,
    // flex:1
    height: SLIDER_HEIGHT / 2.8,
  },
  body_view_container: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#1c1c1f',
    borderRadius: 10,
    // margin:15,
    marginTop: 0,
    padding: 5,
    // shadowColor: '#000',
    // shadowOffset: {width: 3, height: 5},
    // shadowOpacity: 0.5,
    // shadowRadius: 4,
    // elevation: 2,
  },

  ////
  Congratulations_title_view: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 63,
    marginHorizontal: 38,
  },
  congratulations_text_style: {
    fontFamily:Fonts.BennetTextOne_Bold,
    fontSize: normalize(28),
    color: '#ddd',
  },
  decription_text_style: {
    marginTop: 17,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#ddd',
    textAlign: 'center',
    opacity: 0.5,
  },
  event_ticket_type_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(24),
    color: '#fff',
  },
  ticket_code_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(20),
    color: '#ddd',
    // marginBottom: 14,
  },
  afterS_swipe_view: {
    justifyContent: 'center',
    alignItems: 'center',
    },
  share_on_media_title_text: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#ddd',
    marginTop: 10,
  },
  social_media_icon_view: {
    flexDirection: 'row',
    marginTop: 14,
  },
  social_media_icon_style: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  social_media_icon: {
    height: 32,
    width: 32,
  },
  text_view_container: {
    marginTop: 26,
    marginHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  share_love_test_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#ddd',
  },
  you_can_test_style: {
    color: '#616263',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
  },
  my_Tickets_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#ddd',
  },
  gift_now_btn: {
    marginTop: 16,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    width: SLIDER_WIDTH / 2.2,
  },
  sign_in_from_test_style: {
    textAlign: 'center',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#ddd',
  },
  sign_in_from_test_style_view: {
    marginHorizontal: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 29,
  },
  app_store_view: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
  },
  app_store_btn_style: {
    borderRadius: 10,
    backgroundColor: 'grey',
    marginHorizontal: 16,
  },
  //
  pop_up_main_view: {
    width: ITEM_WIDTH,
    height: SLIDER_HEIGHT / 2,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  point_view: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  time_view: {
    justifyContent: 'center',
    position:'absolute',
    bottom:0
  },
  border_style: {
    // marginHorizontal: 15,
    width: '96%',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderRadius: 1,
    height: 1,
    alignSelf: 'center',
  },
  text_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 11,
  },
  my_ticket_click_view: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  Email_text_input_style: {
    height: 40,
    marginTop: 5,
    width: '100%',
    marginRight: 18,
    borderRadius: 5,
    backgroundColor:'#1b1c20',
    color: '#8c8c8c',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message_text_input_style: {
    height: 113,
    width: '100%',
    marginRight: 18,
    borderRadius: 10,
    backgroundColor:'#1b1c20', //#3d3d3d
    color: '#8c8c8c',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop:10,
    marginTop:5
  },
  viewContainer: {
    backgroundColor: '#141518',
    margin: 12,
    elevation: 5,
    width: '90%',
    borderRadius: 15,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  viewContainer_second: {
    backgroundColor: '#101012',
    elevation: 5,
    borderRadius: 15,
    width:'90%',
    alignSelf:'center',
    paddingVertical:24,
    paddingHorizontal:16
  },
  giftClick: {
    //backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 15,
  },
  giftClick_2: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomView: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginVertical:24
  },
  closebtncontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  linearGradient2: {
    opacity: 1,
    // flex: 1,
    width: '100%',
    padding: 15,
    height: SLIDER_HEIGHT / 2.8,
  },
  close_btn_style: {
    position: 'absolute',
    right: 16,
    top: 68,
  },
  we_r_ava_text_style: {
    marginHorizontal: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  we_r_ava_test_style: {
    textAlign: 'center',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
    color: '#ddd',
  },
  add_to_cal_btn_img_style: {
    width: SLIDER_WIDTH / 2.2,
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
    marginBottom:24
  },
  add_to_cal_text: {
    textAlign: 'center',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#ddd',
    marginLeft: 8,
  },
  cpy_icon_img: {
    width: 33,
    height: 33,
    resizeMode: 'contain',
    marginLeft: 15,
  },
  readem_giftNow_view: {
    flexDirection: 'row',
    marginTop: 13,
    marginBottom: 13,
    width: '50%',
    alignSelf:'center',
    justifyContent: 'space-between',
  },
  readem_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    color: '#fff',
    textAlign:'center'
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  gift_now_text: {
    fontSize: normalize(16),
    fontFamily: Fonts.OpenSans_Bold,
    color: '#ddd',
  },
  email_text_input: {
    color: '#fff',
    flex: 1,
    opacity: 0.5,
    fontFamily:Fonts.OpenSans_regular,
    fontSize:12,
    paddingLeft:8
  },
  gift_now_text_style:{
    fontSize: normalize(16),
    fontFamily: Fonts.OpenSans_Bold,
    color: '#fff',
    marginHorizontal:24,
    marginVertical:10
  },
  email_Add_text_style:{
    fontSize: normalize(12),
    fontFamily: Fonts.OpenSans_regular,
    color: '#fff',
    opacity:0.5,
    marginTop:10
  },
  // cpy_view:{
  //   borderRadius:7,
  //   justifyContent:'center',
  //   alignItems:'center',
  //   position:'absolute',
  //   top:0,
  //   left:0,
  //   right:0,
  //   bottom:0,
  //   borderWidth:1,
  //   borderColor:'#fff',
  // },
  // cpy_text_view:{
  //   fontFamily:Fonts.OpenSans_regular,
  //   fontSize:16,
  //   color:'#fff'
  // }
});

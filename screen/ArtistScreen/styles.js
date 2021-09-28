import {StyleSheet, Dimensions,Platform} from 'react-native';
import {Fonts} from '../../common/fonts';
import { normalize } from "../../common/normalize";

const width = Dimensions.get('window').width;
const SLIDER_HEIGHT = Dimensions.get('window').height;
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH );
export const styles = StyleSheet.create({
  scrlView_container: {
    flexGrow: 1,
  },
  main_container: {
    flex: 1,
    backgroundColor: '#101012',
  },
  img_bg_style: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode:'contain',
    width:'100%',
    height:Platform.isPad ? SLIDER_HEIGHT/2 + 100 : null
  },

  header_container_style: {
  },
  header_user_img_style: {
    width: 30,
    height: 30,
    marginLeft: 16,
    marginVertical: 12,
  },
  singer_name_text_style: {
    fontFamily: 'PlayfairDisplaySC-Bold',
    fontSize: normalize(24),
    color: '#dddddd',
    textAlign: 'center',
    width: '70%',
    marginTop: 274,
  },
  genres_text_view_style: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent:'center',
    alignItems:'center'
  },
  genres_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(13),
    color: '#fff',
    marginRight: 12,
    opacity:0.5
  },
  genres_type_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(13),
    color: '#fff',
    letterSpacing:0
  },
  following_N_rating_container: {
    flexDirection: 'row',
    marginTop: 12,
  },
  follower_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  follower_icon_style: {
    width: 24,
    height: 24,
  },
  followers_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(13),
    color: '#ddd',
    marginLeft: 4,
    letterSpacing:0
  },
  follow_artist_btn_style: {
    marginTop: 12,
    marginBottom:20,
    width:  null,
  },
  follow_artist_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#fff',
    textAlign: 'center',
    paddingVertical: Platform.isPad ? 16 : 11,
    paddingHorizontal: 12,
  },
  event_for_view_container: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: 16,
  },
  upcoming_event_text_title: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    color: '#dddddd',
    fontSize: normalize(18),
    marginTop: 10,
    flex: 1,
  },
  noDataTextStyleBlack: {
    fontSize: normalize(13),
    fontFamily: Fonts.OpenSans_Light,
    margin: 10
  },
  noDataTextStyleWhite: {
    fontSize: normalize(13),
    color: '#fff',
    fontFamily: Fonts.OpenSans_Light,
    margin: 10
  },
  lady_gaga_concert_img_bg_style: {
    backgroundColor: 'transparent',
    flex: 1,
    width: '100%',
    height: Platform.isPad ? SLIDER_HEIGHT/4 + 50 : 185,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    alignSelf: 'center',
    elevation:9
  },
  artist_name_title_text_event_for_you_style: {
    color: '#dddddd',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
  },
  linearGradient2: {
    opacity: 1,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:5
  },
  artist_name_n_concert_name_container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius:5,
    height:'100%',
    bottom:25
  },
  lady_gaga_user_pic_style: {
    height: Platform.isPad ? SLIDER_HEIGHT/ 8 : 80,
    width: Platform.isPad ? SLIDER_WIDTH/ 8+ 50 : 80,
    marginRight:10,
    borderRadius:5,
    resizeMode:'contain',
    top:5
  },
  concert_title_text_style: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    color: '#dddddd',
    fontSize: normalize(16),
  },
  concert_timing_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    color: '#dddddd',
    fontSize: normalize(8),
    marginTop:2,
    marginBottom:2,
    opacity:0.7,
  },
  buy_tickets_concert_artist_btn_style: {
    backgroundColor: '#d8d8d8',
    borderRadius: 5,
  },
  buy_ticket_concert_artist_text_style: {
    color: '#1b1c20',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
    marginVertical: 8,
    marginHorizontal: 30,
  },
  similar_artist_suggestion_view: {
    flexDirection: 'row',
    marginVertical: 20,
    alignSelf: 'flex-start',
    // marginLeft:16
  },
  similar_artist_img__style: {
    width: 118,
    height: 170,
    borderRadius: 10,
  },
  similar_artist_name_text__style: {
    color: '#dddddd',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
  },
  similar_artist_box_view__style: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  upcoming_event_for_view_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  event_for_you_title_view: {
    flexDirection: 'row',
    // marginHorizontal:16,
    justifyContent:'space-between',
    alignItems:'center',
  },
  events_for_you_text_title: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    color: '#dddddd',
    fontSize: normalize(18),
    marginTop: 24,
    flex: 1,
  },
  see_all_text_title: {
    color: '#dddddd',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    marginTop: 10,
  },
  similar_artist_event_name_text__style: {
    color: '#dddddd',
    fontFamily: Fonts.PlayfairDisplay_Black,
    fontSize: normalize(16),
    marginTop: 4,
  },
  similar_artist_event_time_name_text__style: {
    color: '#dddddd',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    marginTop: 4,
  },
  similar_artist_event_buy_ticket_btn__style: {
    width:Platform.isPad ? SLIDER_WIDTH/ 4 : null,
    height:Platform.isPad ? SLIDER_HEIGHT/ 22 : null,
  },
  similar_artist_event_buy_ticket_text_btn__style: {
    // color: '#dddddd',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
    marginVertical: 10,
    marginHorizontal: 28,
  },
  inside_contant: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floating_menu_container: {
    width: width - 27,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    backgroundColor: '#1f2022e8',
    borderRadius: 10,
    elevation: 3,
  },
  float_menu_box: {
    flex: 1,
    justifyContent: 'space-evenly',
    borderRadius: 10,
    alignItems: 'center',
  },
  float_dot_text_style: {
    fontSize: normalize(35),
  },
  float_options_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
    marginBottom: 10,
  },
  see_all_container:{
    flex: 1, alignItems: 'flex-end',justifyContent:'center',
    marginTop: 24,
  },
  close_view_container: {
    alignSelf: 'flex-end',
    marginTop: -10,
    marginRight: 16,
  },
  btn_n_details_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  modal_buy_btn_style: {
    backgroundColor: '#1017ff',
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.28)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    height:SLIDER_HEIGHT/15,
    width: width/2.5,
    justifyContent:'center',
    alignItems:'center'
  },
  buy_ticket_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(16),
    color: '#fff',
    textAlign: 'center',
  },
  lefting_ticket_text_style: {
    color: '#1b1c20',
    fontSize: normalize(12),
    fontFamily: Fonts.OpenSans_regular,
    marginTop: 8,
  },
  get_ticket_to_unlock_text_style: {
    color: '#1b1c20',
    fontSize: normalize(14),
    fontFamily: Fonts.OpenSans_regular,
    marginTop: 32,
  },
  login_line_modal_style: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop:8
  },
  already_have_login_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#101113',
  },
  login_text_modal_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#1017ff',
  },
  modal_close_view:{
    justifyContent: 'center',
    alignItems: 'flex-end',
    height:SLIDER_HEIGHT / 10,
    top:30,
  },
  modal_close_view_2:{
    justifyContent: 'center',
    alignItems: 'flex-end',
    height:SLIDER_HEIGHT / 50,
    position:'absolute',
    bottom:10
  },
  modal_main_view:{
    backgroundColor: 'rgba( 0,0,0,0.9 )',
    flex: 1
  },
  modal_imag_view:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    marginVertical:100,
    position:'absolute',
    top:0,
    bottom:0,
  },
  modal_image_style:{
    paddingRight:20,
    width:ITEM_WIDTH ,
    alignSelf:'center',
    height:'100%',
    resizeMode:'contain',
  },
  blurView_tip:{
    position:"absolute",
    top:0,
    bottom:0,
    left:0,
    right:0
  },
  item: {
    width: width - 60,
    height: width - 60,
  },
  imageContainer: {
    flex: 1,
    // marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    marginBottom:1, // Prevent a random Android rendering issue
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode:"contain",
  },
//
main_container_flow: {
  flex: 1,
  backgroundColor: 'transparent',
},
loadingView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
alpha_text_style:{
  fontFamily: Platform.OS == 'android' ? Fonts.BennetTextOne_Bold : Fonts.OpenSans_semibold,
  fontSize: normalize(80),
  color:'grey',
  position:'absolute',
  top:65
},
no_internet_view: {
  flex: 1,
  backgroundColor: 'black',
  justifyContent: 'center',
  alignItems: 'center'
},
no_internet_txt:
{
  color: '#fff',
  textAlign: 'center'
},
login_btn_style: {
  backgroundColor: '#fff',
  borderRadius: 10,
  width:50,
  height:25,
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  marginTop: 24,
},
no_internet_retry_txt:{
  textAlign:'center'
},
social_icon_view:{
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center',
  marginTop:8
},
social_icon_style:{
  width:Platform.isPad ? 34: SLIDER_WIDTH/12,
  height: Platform.isPad ? 34 : SLIDER_HEIGHT/20,
  resizeMode:'contain',
  marginHorizontal:8
},
about_view:{
  marginTop:9,
  justifyContent:'center',
  alignItems:'center',
  paddingHorizontal:14
},
about_text_style:{
  fontFamily:Fonts.OpenSans_regular,
  fontSize: normalize(13),
  color:'#fff',
  opacity:0.5,
  textAlign:'center',
  letterSpacing:0
},
wave_style:{
  position:'absolute',
  resizeMode:'contain',
  width:'100%',
  height:'80%',
  marginTop:50
},
event_status_view:{
  justifyContent:'center',
  alignItems:'center',
  flexDirection:'row',
  // bottom: SLIDER_HEIGHT/7-7,
  // position:'absolute',
},
live_stream_text_style:{
  fontFamily: Fonts.OpenSans_regular,
  fontSize: normalize(10),
  color: '#fff',
  opacity:0.8,
  marginLeft:8
},
status_img_style:{
  height:SLIDER_HEIGHT/25,
  width:SLIDER_WIDTH/25,
  resizeMode:'contain'
},
event_type_status_broke_internet:{
  flexDirection:'row',
  position:'absolute',
  bottom: Platform.OS =='ios' && Platform.isPad == false ? -2 : -4,
  alignItems:'center'
},
});

import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../common/fonts';
import { normalize } from "../../common/normalize";

const width = Dimensions.get('window').width;
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
    height: 185,
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
    bottom:25,
  },
  lady_gaga_user_pic_style: {
    height:80,
    width:80,
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
    marginLeft:8
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
    marginTop:50
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
    marginTop: 48,
  },
  modal_buy_btn_style: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buy_ticket_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#1b1c20',
    textAlign: 'center',
    paddingVertical: 11,
    paddingHorizontal: 41,
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
  },
  already_have_login_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#101113',
    marginTop: 8,
    marginBottom: 62,
  },
  login_text_modal_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#101113',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  modal_close_view:{
    justifyContent: 'center',
    alignItems: 'flex-end',
    height:100,
    top:30
  },
  modal_main_view:{
    backgroundColor: 'rgba( 0,0,0,0.5 )',
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
event_for_you_text_view: {
  marginTop: 24,
  // paddingLeft: 16
},
event_for_you_text_style: {
  fontFamily: Fonts.PlayfairDisplay_Bold,
  fontSize: normalize(18),
  color: '#dddddd',
  marginLeft: 16
},
/// new added 12 oct
Screen_title_text_style:{
  fontFamily: Fonts.PlayfairDisplay_Bold,
  fontSize: normalize(24),
  color: '#ddd',
  marginVertical:22,
  marginLeft:16
},
header_view:{
  flex:1,
  resizeMode:'contain',
},
tab_view_container: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom:5,
  alignSelf:'center',
  marginHorizontal:16
},
tab_btn_text_style: {
  color: '#fff',
  fontFamily: Fonts.OpenSans_Bold,
  fontSize: normalize(14),
  marginTop: 10,
  marginBottom:3
},
tab_btn_style: {
  borderColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center',
  flex:1
  // /backgroundColor:'yellow'
},
tab_containt_view: {
  flexDirection: 'row',
  // marginLeft: 16,
},
logo_img:{
  width:24,height:24,marginLeft:16,marginTop:12
}
});

import {Dimensions, Platform, StyleSheet} from 'react-native';
import {colors, Fonts} from '../../common/index';
import { normalize } from "../../common/normalize";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);

export const styles = StyleSheet.create({
  safe_area_view: {
    flex: 1,
    // backgroundColor: colors.commonBGColor,
  },
  overlay: {
    height: 150,
    position: 'absolute',
    bottom: 10,
    right: 5,
    zIndex: 1,
    resizeMode: 'cover',
    backgroundColor: 'white',
    width: 200,
  },
  top_image: {
    height: Platform.isPad ? 402 : 202,
    width: '100%',
    resizeMode: 'cover',
  },
  messageRowTip: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    borderRadius: 10,
    //marginHorizontal: 20,
    marginVertical: 5,
    //width:'85%',
    width: width - 40,
    //flex:1
  },
  tipAmountView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  tipAmountButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#b1b1b1',
    marginVertical: 8,
    marginLeft: 16,
    width: width/5.2,
  },
  tipAmountText: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#fff',
    marginVertical: 11,
    marginHorizontal: 14,
  },
  tipmessageDetailView: {
    flex: 3,
    marginLeft: 15,
  },
  tipUserNameNtime: {
    flex: 1,
  },
  tipMsgNameStyle: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
    color: '#1b1c20',
    marginBottom: 4,
  },
  commenterNameTipStyle: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    color: '#1b1c20',
  },
  commentTextStyle: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
    color: '#b2b2b2',
    marginTop: 2,
  },
  commentTextTipStyle: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
    color: '#1b1c20',
    marginTop: 2,
    opacity: 0.5,
  },
  scrlView_container: {
    flexGrow: 1,
    backgroundColor: colors.commonBGColor,
  },
  main_container: {
    flex: 1,
    backgroundColor: colors.commonBGColor,
  },
  img_bg_style: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height - height / 4,
  },
  timing_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    color: colors.commonLabelColor,
    alignSelf: 'center',
  },
  singer_name_text_style: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    fontSize: normalize(18),
    color: colors.commonLabelColor,
    marginTop: 8,
    textAlign: 'center',
    width: '70%',
  },
  category_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    color: colors.commonLabelColor,
    alignSelf: 'center',
    textAlign: 'center',
  },
  event_Begins_in_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
    color: '#fff',
    textAlign: 'center',
    opacity:0.8
  },
  remaining_time_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(20),
    color: '#fff',
    textAlign: 'center',
  },
  remaining_text_style: {
    fontFamily: Fonts.OpenSans,
    fontSize: normalize(12),
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
    opacity:0.8
  },
  remaining_view_text_style: {
    // fontFamily: Fonts.OpenSans_semibold,
    // fontSize: normalize(12),
    // color: colors.commonLabelColor,
    // marginTop: 4,
    // textAlign: 'center',
    width:width/6,
    justifyContent:'space-between',
  },
  remaining_text_colan_style: {
    marginTop:5,
    alignItems:'center'
  },
  buy_tickets_btn_style: {
    // backgroundColor: colors.roundedButtonBGColor,
    color: colors.buyButtonLabelColor,
    borderRadius: 10,
    marginTop: 8,
    height:'6%',
    width:'41%'
  },
  buy_ticket_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(16),
    color: colors.pureWhiteColor,
    textAlign: 'center',
    marginHorizontal:10
  },
  price_info_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
    color: colors.commonLabelAlpha70Color,
    marginVertical:8,
    textAlign: 'center',
  },
  wishlist_share_invite_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 21,
    width:'80%'
  },
  global__title_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(16),
    color: colors.commonLabelColor,
    marginTop: 16,
    marginLeft: 15,
  },
  participants_view_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  participants_profile_pic: {
    flexDirection: 'row',
  },
  participants_count_text_style: {
    textDecorationLine: 'underline',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    color: colors.commonLabelAlpha70Color,
  },
  user_budge_pic_small_style: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: '#363636',
  },
  dotIconStyle: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    resizeMode: 'contain',
  },
  latest_comment_view_style: {
    // backgroundColor: "#101113",
    borderBottomWidth: 1,
    borderBottomColor: '#27282a',
    paddingHorizontal: 16,
  },
  latest_comment_style: {
    color: colors.commonLabelAlpha70Color,
    fontSize: normalize(12),
    fontFamily: Fonts.OpenSans_regular,
  },
  profile_comment_time_view_container: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'flex-start',
    paddingVertical:10,
    borderColor:'#fff',
  },
  dpStyle: {
    height: 30,
    width: 30,
    //backgroundColor: colors.pureWhiteColor,
    borderRadius: 15,
    marginTop: 1,
  },
  user_comment_text_style: {
    color: '#b2b2b2',
    fontSize: normalize(13),
    fontFamily: Fonts.OpenSans_regular,
    marginLeft: 5,
    marginRight: 10,
    paddingRight: 5,
    textAlign: 'left',
    lineHeight: 15,
  },
  comment_time_text_style: {
    color: colors.pureWhiteAlpha50Color,
    fontSize: normalize(11),
    fontFamily: Fonts.OpenSans_regular,
    marginLeft: 5,
    marginBottom: 9,
  },

  top_event_Begins_in_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
    color: colors.commonLabelColor,
    textAlign: 'center',
  },
  timing_count_text_style: {
    color: colors.commonLabelAlpha90Color,
    // fontSize: normalize(59,
    fontSize: normalize(20),
    fontFamily: Fonts.OpenSans_semibold,
    textAlign: 'center',
  },
  seconds_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    color: colors.commonLabelColor,
    textAlign: 'center',
  },
  enter_ticket_start_watching_container: {
    flexDirection: 'row',
    marginTop:10,
    marginBottom: 16,
    borderRadius:5,
    width:'60%',
    backgroundColor:'#fff',
    borderWidth:1,
    borderColor:'#1017ff',

  },
  enter_ticket_code_view: {
    flex:1,
    alignItems:'flex-start',
    justifyContent:'center'
  },
  enter_ticket_code_textinput: {
    fontSize: normalize(12),
    fontFamily: Fonts.OpenSans_regular,
    letterSpacing:0,
    opacity:0.5,
    color:'#000',
    paddingLeft:12,
    height: Platform.OS == 'ios' ? 40 : null,
    width:'100%'
  },
  start_watching_btn_style: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:12
  },
  start_watching_text_style: {
    fontFamily: Fonts.OpenSans_Bold,
    fontSize: normalize(12),
    color: "#fff",
    textAlign: 'center',
  },
  bought_ticket_count_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    color: colors.commonLabelColor,
    marginTop: 16,
    textAlign: 'center',
  },
  plus_icon_container: {
    flex: 1,
    alignItems: 'flex-end',
  },
  plus_icon_img_style: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginTop: 16,
    marginRight: 16,
  },
  close_view_container: {
    alignSelf: 'flex-end',
    // marginTop: -10,
    marginRight: 16,
  },
  btn_n_details_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
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
    height:height/15,
    // width: width/2.5,
    justifyContent:'center',
    alignItems:'center'
  },
  left_ticket_text_style: {
    color: '#1b1c20',
    fontSize: normalize(12),
    fontFamily: Fonts.OpenSans_regular,
    marginTop: 8,
  },
  get_ticket_to_unlock_text_style: {
    color: '#1b1c20',
    fontSize: normalize(14),
    fontFamily: Fonts.OpenSans_regular,
    marginTop:8
  },
  login_line_modal_style: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',

  },
  already_have_login_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
    color: colors.pureBlackColor,
    marginTop:20,
    textAlign:'center'
  },
  login_text_modal_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#1017ff',
    marginTop:20
  },
  global_chat_container: {
    padding: 16,
  },
  global_chat_title_n_plus_icon_container: {
    flexDirection: 'row',
  },
  global_title_container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  dotIconView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#1f1d30',
    height:height/15,
    width:width/6,
    padding:5,
    borderRadius:5,
    marginHorizontal:10
  },
  user_action_icon: {height: 15, width: 15},
  dotTextStyle: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
    color: colors.pureWhiteColor,
    textAlign: 'center',
    marginTop: 5,
  },
  live_now_btn_container: {
    flexDirection: 'row',
    marginTop: 8,
  },
  live_btn_style: {
    backgroundColor: colors.roundedButtonBGColor,
    borderRadius: 12,
  },
  LIVE_NOW_text_style: {
    fontFamily: Fonts.OpenSans_Bold,
    fontSize: normalize(12),
    marginHorizontal: 13,
    marginVertical: 4,
  },
  how_much_watching_count_text_style: {
    color: colors.commonLabelColor,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
    alignSelf: 'center',
    marginLeft: 8,
  },
  event_indicator_container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.eventIndicatorContainerBGColor,
    paddingTop: 24,
    paddingBottom: 24,
  },
  event_schedule_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: colors.commonLabelColor,
  },
  indicator_view_container: {
    marginVertical: 28,
    flexDirection: 'row',
  },
  single_ladies_text_style: {
    color: colors.commonLabelColor,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
  },
  beyonce_text_style: {
    color: colors.commonLabelColor,
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    marginTop: 5,
  },
  dot_view_container: {
    marginTop: 23,
  },
  dot_view: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: '#2a2b2d',
  },
  white_img_bg_style: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img_title_beyonce_text_style: {
    color: '#FFF',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(16),
    marginTop: 283,
  },
  follower_n_rating_container: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  white_img_follow_count_text_style: {
    color: '#FFF',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
  },
  white_follow_artist_btn_style: {
    borderRadius: 10,
    minHeight:70
  },
  follow_the_Artist_text_style: {
    color: colors.pureWhiteColor,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    marginVertical: 11,
    marginHorizontal:20
  },
  linearGradient: {
    opacity: 0.98,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab_view_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  tab_btn_text_style: {
    color: '#FFF',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    marginVertical: 10,
  },
  tab_btn_style: {
    borderColor: '#FFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab_content_view: {
    flexDirection: 'row',
    // marginLeft: 16,
  },
  video_view_style: {
    width: 202,
    height: 114,
    borderRadius: 10,
    marginVertical: 8,
    marginRight: 8,
  },
  past_event_video_title_text: {
    width: 202,
    color: '#1b1c20',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
  },
  album_view_style: {
    width: 118,
    height: 118,
    borderRadius: 6,
    marginVertical: 8,
    marginRight: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  album_name_text_style_tab_view: {
    color: colors.commonLabelColor,
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(8),
    marginBottom: 9,
    marginLeft: 10,
  },
  buy_btn_album_view_style: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 24,
    borderRadius: 10,
  },
  buy_text_style: {
    color: colors.pureWhiteColor,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
  },
  album_main_view_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  album_main_view_Image_background: {
    borderRadius: 5,
    backgroundColor: colors.commonBGColor,
  },
  event_for_view_container: {
    backgroundColor: '#101113',
    marginTop: 24,
    marginHorizontal: 16,
  },
  event_for_you_title_view: {
    flexDirection: 'row',
  },
  events_for_you_text_title: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    color: colors.commonLabelColor,
    fontSize: normalize(18),
    flex: 1,
  },
  see_all_text_title: {
    color: colors.commonLabelColor,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    marginTop: 31,
  },
  lady_gaga_concert_img_bg_style: {
    width: '100%',
    // height: Platform.isPad ? 285 : 185,
    height: height/3.7,
    marginTop: 16,
    borderRadius: 5,
  },
  artist_name_title_text_event_for_you_style: {
    color: colors.commonLabelColor,
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
  },
  linearGradient2: {
    opacity: 1,
    height: height/3.7,
    borderRadius: 5,
  },
  artist_name_n_concert_name_container: {
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 25,
    paddingLeft: 20,
    alignSelf: 'flex-end',
  },
  lady_gaga_user_pic_style: {
    marginHorizontal: 10,
    height: 82,
    width: 82,
    borderRadius: 5,
    alignSelf: 'flex-end',
    // backgroundColor: '#1b1c20',
  },
  concert_title_text_style: {
    width: '75%',
    fontFamily: Fonts.PlayfairDisplay_Bold,
    color: colors.commonLabelColor,
    fontSize: normalize(16),
  },
  concert_timing_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    color: colors.commonLabelAlpha70Color,
    fontSize: normalize(10),
    marginTop: 3,
    marginBottom: 8,
  },
  buy_tickets_concert_artist_btn_style: {
    borderRadius:5
  },
  buy_ticket_concert_artist_text_style: {
    color: colors.pureWhiteColor,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    marginVertical: 8,
    marginHorizontal:20,
    textAlign: 'center',
  },
  evertsForYouRightArrowView: {
    marginHorizontal: 20,
  },
  similar_artist_suggestion_view: {
    flexDirection: 'row',
    marginVertical: 20,
    alignSelf: 'flex-start',
  },
  similar_artist_img__style: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
  },
  similar_artist_name_text__style: {
    color: colors.commonLabelColor,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
    marginTop: 10,
  },
  similar_artist_box_view__style: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  blurView_tip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  timerMainContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timerView: {
    // flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imageBG_video: {
    flex: 1,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  past_event_video_title_text_view: {
    width: '70%',
  },
  image_small_size_style: {
    height: 100,
    width: 85,
    marginRight: 10,
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: '#1b1c20',
    borderRadius: 3,
  },
  image_container: {
    height: undefined,
    width: undefined,
    flex: 1,
    borderRadius: 3,
  },
  noDataTextStyleBlack: {
    fontSize: normalize(13),
    fontFamily: Fonts.OpenSans_Light,
    margin: 10,
    color:'#fff'
  },
  noDataTextStyleWhite: {
    fontSize: normalize(13),
    color: '#fff',
    fontFamily: Fonts.OpenSans_Light,
    margin: 10,
  },

  //#region -> Image Preview
  modal_main_view: {
    backgroundColor: 'rgba( 0,0,0,0.5 )',
    flex: 1,
  },
  modal_close_view: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    top: 30,
  },
  modal_imag_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 100,
  },
  modal_image_style: {
    paddingRight: 20,
    width: ITEM_WIDTH,
    alignSelf: 'center',
    height: '100%',
    resizeMode: 'contain',
  },
  item: {
    width: width - 60,
    height: width - 60,
  },
  imageContainer: {
    flex: 1,
    // marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    marginBottom: 1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  //#endregion
  //#region ->toggleChatRoomSelection
  toggleChatRoomSelection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  //#endregion
  no_internet_view: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  no_internet_txt: {
    color: '#fff',
    textAlign: 'center',
  },
  login_btn_style: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 50,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
  },
  no_internet_retry_txt: {
    textAlign: 'center',
  },
  popupTextStyle: {
    flex: 1,
    color: colors.pureWhiteColor,
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14)
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  messagesMainContainer: {
    marginTop: 12,
    height:270
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
    height:height/20,
    width:width/20,
    resizeMode:'contain'
  },
  event_type_status_broke_internet:{
    flexDirection:'row',
    position:'absolute',
    bottom: Platform.OS =='ios' && Platform.isPad == false ? -2 : -4,
    alignItems:'center'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  blur_view_loader:{
    justifyContent: 'center', alignItems: 'center'
  },
  // RB SHEEET FOR BLOCK USER OR REPORT MESSAGE
  BlockMsgMainView:{
    flex:1,
    paddingBottom:50,
    paddingHorizontal:20
  },
  MsgViewRB:{
    flex:1,
    justifyContent:'center',
    alignItems:'flex-start',
    padding:10
  },
  ReportUserView:{
    flex:1,
    justifyContent:'space-between',
    padding:10,
    flexDirection:'row',
    alignItems:'center'
  },
  BlockUserView:{
    flex:1,
    justifyContent:'space-between',
    padding:10,
    flexDirection:'row',
    alignItems:'center'
  },
  usernameTextStyle:{
    color:'white',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14)
  }
});

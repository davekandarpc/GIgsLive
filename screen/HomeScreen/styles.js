import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Fonts } from '../../common/fonts';
import { normalize } from "../../common/normalize";

const SLIDER_WIDTH = Dimensions.get('window').width;
const SLIDER_HEIGHT = Dimensions.get('window').height;
const itemHeight = SLIDER_HEIGHT/4 ;

export const styles = StyleSheet.create({
  safe_area_view: {
    flex: 1,
  },
  scrlView_container: {
    flexGrow: 1,
    backgroundColor: '#101113',
  },
  main_container: {
    flex: 1,
    backgroundColor: '#101113',
  },
  img_bg_style: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height : SLIDER_HEIGHT/1.4
  },
  Show_name_and_sound: {
    flexDirection: 'row',
    // position:'absolute',
    // bottom: Platform.isPad ? SLIDER_HEIGHT/4.7 : SLIDER_HEIGHT/4.9,
  },
  time_view:{
    justifyContent:'center',
    alignItems:'center',
    // bottom: Platform.isPad ? SLIDER_HEIGHT/3.3 : SLIDER_HEIGHT/3.4  ,
    // position:'absolute',
  },
  time_text_style:{
    color:'#fff',
    fontSize: normalize(14),
    fontFamily:Fonts.OpenSans_regular,
    letterSpacing:0
  },
  sound_icon_view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  sound_icon_style:{
    height:SLIDER_HEIGHT/ 27,
    width:SLIDER_WIDTH/18,
    resizeMode:'contain'
  },
  Show_title_view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 4,
  },
  go_btn_view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title_text_style: {
     fontFamily: Fonts.PlayfairDisplay_Bold,
    fontSize: normalize(24),
    color: '#dddddd',
    textAlign: 'center',
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
    fontSize: normalize(12),
    color: '#fff',
    opacity:0.8,
    marginLeft:8
  },
  status_img_style:{
    height:SLIDER_HEIGHT/20,
    width:SLIDER_WIDTH/20,
    resizeMode:'contain'
  },
  event_type_status_broke_internet:{
    flexDirection:'row',
    position:'absolute',
    bottom: Platform.OS =='ios' && Platform.isPad == false ? -2 : -4,
    alignItems:'center'
  },
  go_btn_round_style: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genre_type_text_view: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // position:'absolute',
    // bottom: Platform.isPad ? SLIDER_HEIGHT/5.4 : SLIDER_HEIGHT/5.5 - 3,
  },
  genre_type_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
    color: '#ddd',
  },
  Video_view_slide: {
    flexDirection: 'row',
    marginBottom:20,
    // position:'absolute',
    // bottom:-10
  },
  video_thumb_n_name_container: {
    marginRight: 15,
    justifyContent: 'center',
    // alignItems: 'center',
    width: SLIDER_WIDTH / 3 - 10,
    paddingVertical: 10,
    borderRadius: 10
  },
  thumb_img_style: {
    width: SLIDER_WIDTH / 3 - 10,
    height:Platform.isPad ?  SLIDER_HEIGHT/9 :  SLIDER_HEIGHT/13.9,
    // backgroundColor: '#aaa',
    borderRadius:10
  },
  sliderTextViewStyle: {
    width: SLIDER_WIDTH / 3 - 10,
  },
  thumb_title_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12) ,
    color: '#ffffff',
    marginTop: 10,
  },
  watched_video_line: {
    height: 2,
    width: '100%',
    borderColor: '#c4c4c4',
    borderRadius: 30,
    backgroundColor: 'gray',
    marginTop: 5,
  },
  watched_video_background_line :{
    height: 2,
    width: '0%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30
  },
  upcoming_event_title_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
    paddingHorizontal: 16
  },
  upcoming_event_text_style: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    fontSize: normalize(18) ,
    color: '#dddddd',
  },
  see_all_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#ddd',
    marginRight:16,
    letterSpacing:0
  },
  slider_event_that_broke_internet_view: {
    marginTop: 24,
    width:'100%',
  },
  event_that_broke_internet_text_style: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    fontSize: normalize(18),
    color: '#dddddd',
    alignSelf:'flex-start',
    marginLeft:22
  },
  singer_name_event_name_view: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  singer_name_event_name_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#ddd',
    alignSelf: 'center',
    textAlign:'center',
    position:'absolute',
    bottom: Platform.isPad == false ? 10 : 18
  },
  event_for_you_text_view: {
    marginTop: 24,
  },
  event_for_you_text_style: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    fontSize: normalize(18),
    color: '#dddddd',
    marginLeft:16
  },
  similat_atist_view: {
    // marginLeft: 16,
  },
  img_background_two_artist_text: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14) ,
    color: '#dddddd',
  },
  img_background_two_event_text: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    fontSize: normalize(22) ,
    color: '#dddddd',
    marginTop: 3,
    textAlign:'center'
  },
  img_background_two_event_time_text: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12) ,
    color: '#ddd',
    marginTop: 8,
    opacity: 0.7
  },
  img_background_two_buy_ticket_style: {
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 48,
  },
  img_background_two_buy_ticket__text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(18) ,
    color: '#1b1c20',
    marginHorizontal: 42,
    marginVertical: 10,
  },
  explor_the_genre_view: {
    height: Platform.isPad ? 270 : null,
  },
  explor_gigs_view: {
    marginTop: 10,
  },
  genre_option_btn_view: {
    width: '100%',
    marginVertical: 18
  },
  featured_Fans_view: {
    paddingLeft: 16
  },
  featureFanView: {
    marginRight: 65,
  },
  featureFanUserImg: {
    width: 96,
    height: 96,
    borderRadius: 96 / 2,
  },
  feature_Fan_name_text_style: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    fontSize: normalize(12) ,
    color: '#fff',
    marginTop: 3,
    textAlign: 'center',
  },
  feature_Fan_address_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(11) ,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
  },
  progress_bar_continue_watching: {
    height: 2,
    marginHorizontal: 0,
    marginTop: 5,
    borderRadius: 30
  },
  img_bg: {
    justifyContent:'center',
    alignItems:'center',
    height:itemHeight
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
    fontSize: normalize(14) ,
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
  imageContainer: {
    position: 'absolute',
    height: SLIDER_HEIGHT / 5,
    width: '100%',
    marginBottom: 1,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    position: 'absolute',
  },
  linearGradientFullEventSection: {
    opacity: 1,
    height : '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyTicketFullEventSectionStyle: {
    borderRadius: 5,
    backgroundColor:'transparent',
    borderWidth:1,
    borderColor:'#fff',
    justifyContent:'center',
    alignItems:'center'
  },
  img_background_two_buy_secend_ticket_style: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,
    borderColor:'#fff',
  },
  img_background_two_buy_ticket_second_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#fff',
    marginVertical:10
  },
  buyTicketFullEventSectionTextStyle: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#fff',
    marginVertical: Platform.isPad ? '2.6%' :'5.5%' 
  },
  progress: {
    marginTop: 5
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
  similar_artist_box_view__style: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  similar_artist_img__style: {
    width: 118,
    height: 170,
    borderRadius: 3,
  },
  linearGradient2: {
    opacity: 1,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height:'100%'
  },
  inside_contant: {
    flex: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 3,

  },
  similar_artist_name_text__style: {
    color: '#dddddd',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    textAlign: 'center'
  },
  similar_artist_event_name_text__style: {
    color: '#dddddd',
    fontFamily: Fonts.PlayfairDisplay_Black,
    fontSize: normalize(16),
    textAlign: 'center',
  },
  similar_artist_event_time_name_text__style: {
    color: '#dddddd',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    marginTop: 4,
    textAlign: 'center',
    opacity:0.7
  },
  similar_artist_event_buy_ticket_btn__style: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: 'transparent',

  },
  similar_artist_event_buy_ticket_text_btn__style: {
    color: '#dddddd',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
    marginVertical: 8
  },
  forword_icon_style:{
    width: 24,
    height:24
  },
  event_brock_slide_style:{
    height: Platform.isPad ? 300 : 170,
    width:Platform.isPad ? 300 : 170,
    borderWidth:1,
    borderColor:'#fff'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});

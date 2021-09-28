import { StyleSheet,Platform,Dimensions } from 'react-native';
import { Fonts } from '../../common/fonts';
import { normalize } from "../../common/normalize";
const SLIDER_HEIGHT = Dimensions.get('window').height;
const SLIDER_WIDTH = Dimensions.get('window').width;
const itemWidth = 330 ;
const itemheight = Dimensions.get('window').height;
export const styles = StyleSheet.create({
  scrlView_container: {
    flexGrow: 1,
  },
  main_container: {
    flex: 1,
  },
  body_contianer: {
    backgroundColor: '#101113',
  },

  img_bg_style: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101012',
  },
  main_title_upcoming_event_for_u_text_style: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: normalize(24),
    color: '#fff',
    marginVertical: 20,
  },
  artist_dp_view: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
  },
  dp_ring_view: {
    width: 274,
    height: 276,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dp_inside_ring_view: {
    width: 248,
    height: 248,
    borderRadius: 248 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7070708c',
  },
  artist_img_style: {
    resizeMode: 'contain',
    width: 248,
    height: 248,
    borderRadius: 248 / 2,
  },
  three_dot_view: {
    flexDirection: 'row',
    marginTop: 15,
  },
  slide_round_view: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    borderColor: '#c4c4c4',
    borderWidth: 0.5,
    marginRight: 10,
  },

  main_view: {
    flex: 1,
    backgroundColor: '#101012',
    paddingBottom: 0,

  },
  View_title_text_style: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: normalize(18),
    color: '#fff',
  },
  see_all_text_style: {
    fontFamily: 'OpenSans-semibold',
    fontSize: normalize(12),
    color: '#fff',
  },
  singer_name_event_name_view: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  singer_name_event_name_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#ddd',
    marginBottom:2
  },
  Event_text_style: {
    fontFamily: Fonts.PlayfairDisplay_Black,
    fontSize: normalize(18),
    color: '#d6d6d6',
    marginLeft: 16,
    marginBottom: 16,
  },
  Showing_Results_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
    color: '#777',
    marginLeft: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  sorting_btn_view: {
    flexDirection: 'row',
    marginTop: 16,

  },
  filter_btn_style: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 8,
  },
  Filter_title_btn_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(16),
    color: '#ddd',
    marginRight: 16,
  },
  icon_btn_sorting_style: {
    marginVertical: 8,
    marginRight: 8,
    marginLeft: 16,
  },

  /// rbsheet Filter
  filter_main_view_RB: {
    flex: 1,
  },
  title_view_filter_RB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  Filters_text_title_RB: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(24),
    color: '#ddd',
    marginLeft: 16,
    marginBottom: 16,
  },
  genre_n_anime_view: {
    backgroundColor: '#252628',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  genre_text_view: {
    flex: 1,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: '#fff',
  },
  Genre_text_style: {
    marginLeft: 16,
    marginVertical: 9,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(16),
    color: '#ddd',
    alignSelf: 'flex-start',
  },
  Anime_text_view: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  Anime_text_style: {
    marginLeft: 24,
    marginVertical: 9,
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
    color: '#d4d5d5',
  },
  category_n_list_view: {
    flex: 1,
    flexDirection: 'row',
  },
  category_view: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#212225',
  },
  category_btn_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(16),
    color: '#777',
    marginVertical: 9,
    marginLeft: 16,
  },
  category_btn_view: {
    justifyContent: 'flex-start',
    width: '100%',
  },
  list_view: {
    flex: 3,
    justifyContent: 'space-between',
    backgroundColor: '#252628',
  },
  list_btn_view: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  apply_n_reset_view: {
    borderTopWidth: 1,
    borderColor: '#777',
  },
  Showing_Results_text_style_RB: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    color: '#777',
    margin: 8,
    alignSelf: 'flex-end',
  },
  apply_reset_btn_RB_view: {
    width: '100%',
    flexDirection: 'row',
  },
  //rb sheet done
  // pop_up_sorting
  sort_box_view: {
    borderRadius: 10,
    backgroundColor: '#252628',
    width: 214,
  },
  A_z_text_style_view: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
  },
  A_z_text_style: {
    alignSelf: 'flex-start',
    marginVertical: 9,
    marginLeft: 16,
    color: '#fff',
  },
  //
  uh_oh_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(24),
    color: '#ddd',
    textAlign: 'center',
  },
  odd_filter_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(18),
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 79,
  },
  // event silder first
  lady_gaga_concert_img_bg_style: {
    flex: 1,
    width: '100%',
    height:Platform.isPad ? 285 : itemheight/4 - 3,
  },
  artist_name_title_text_event_for_you_style: {
    color: '#dddddd',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    marginTop: -15,
  },
  linearGradient2: {
    opacity: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height:Platform.isPad ? 285 : itemheight/4 - 3,
  },
  artist_name_n_concert_name_container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    bottom: 0,
    position: 'absolute',
    borderRadius: 10,
  },
  lady_gaga_user_pic_style: {
    marginBottom: 24,
    height: 75,
    width: 75,
    borderRadius: 5,
  },
  concert_title_text_style: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    color: '#dddddd',
    fontSize: normalize(16),
  },
  concert_timing_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    color: '#dddddd',
    fontSize: normalize(10),
    marginTop: 3,
    marginBottom: 8,
  },
  buy_tickets_concert_artist_btn_style: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    width: '65%',
  },
  buy_ticket_concert_artist_text_style: {
    color: '#fff',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    marginVertical: 8,
    textAlign: 'center',
    // marginHorizontal:20
  },
  event_for_view_container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '95%',
    height:Platform.isPad ? 285 : itemheight/4,
    alignSelf:'center',
    elevation:6,
  },
  watchlist_event_view: {

  },
  slider_event_that_broke_internet_view:{
    marginTop:38
  },
  watchlist_event_titil_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal:16
  },
  artist_container: {
    marginLeft: 10,
    flex: 1,
    paddingRight:15,
    marginBottom:16,
  },
  showing_filer_result_option_view:{
    flexDirection:'row',
    marginLeft:7,
    marginTop:8,
    flexWrap:'wrap',
    justifyContent:'flex-start',
    alignItems:'flex-start',
  },
  selected_filter_option:{
    borderRadius:16,
    borderWidth:1,
    borderColor:'#ddd',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    margin:10
  },
  selected_filter_option_text_style:{
    fontFamily:Fonts.OpenSans_regular,
    fontSize: normalize(16),
    color:'#fff',
    marginVertical:9,
    marginRight:13,
    letterSpacing:0,
  },
  play_btn_top_evnet_style:{
    height:Platform.isPad ? 50 : 24,
    width:Platform.isPad ? 50 : 24,
  },
  no_internet_view: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
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
  wave_style:{
    position:'absolute',
    width:'110%',
    height:'110%',
  },
  clear_filter_text_style:{
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(16),
    color: '#fff',
    marginLeft:20,
    letterSpacing:0
  },
  genre_option_btn_view: {
    width: '100%',
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
});

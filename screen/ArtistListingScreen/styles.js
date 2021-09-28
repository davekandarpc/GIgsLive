import { Platform, StyleSheet,Dimensions } from 'react-native';
import { Fonts } from '../../common/fonts';
import { normalize } from "../../common/normalize";

const SLIDER_WIDTH = Dimensions.get('window').width;
const SLIDER_HEIGHT = Dimensions.get('window').height;
export const styles = StyleSheet.create({
  scrlView_container: {
    flexGrow: 1,
  },
  main_container: {
    flex: 1,
    backgroundColor: '#101113',
  },
  body_contianer: {
    backgroundColor: '#101113',
  },
  inside_dp_ring_view:{
    justifyContent:'center',
    alignItems:'center',
    paddingRight:10,
  },
  img_bg_style: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101012',
  },
  artist_dp_view: {
    marginTop: 55,
    marginBottom: 0,
  },
  dp_ring_view: {
    width: 300,
    height: 300,
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
    width: 300,
    height: 300,
    borderRadius: 300 / 2,
  },
  three_dot_view: {
    flexDirection: 'row',
    marginTop: 15,
  },
  artist_title_view: {
    marginTop: 29,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  artis_with_new_event_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
    color: '#ddd',
    opacity:0.5,
    letterSpacing:3
  },
  artis_name_text_style: {
    fontFamily: Fonts.BennetTextOne_Bold,
    fontSize: normalize(20),
    color: '#fff',
    marginTop:12,
    letterSpacing:0
  },
  main_view: {
    flex: 2,
    backgroundColor: '#101012',
    paddingBottom:20
  },
  count_follow_view: {
    flexDirection: 'row',
    marginTop: 24,
    marginHorizontal: 17,
  },
  count_box_view: {
    flex: 1,
  },
  count_box_title_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
    color: '#ddd',
    opacity:0.5,
    letterSpacing:3
  },
  count_box_count_text_style: {
    fontFamily:Fonts.BennetTextOne_Bold ,
    fontSize: normalize(22),
    color: '#fff',
    marginTop: 8,
  },
  know_more_view: {
    marginTop: 16,
    marginLeft: 16,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'flex-start'

  },
  know_more_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(18),
    color: '#ddd',
    marginRight: 16,
  },
  right_btn_view: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: '#242527',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab_view_container: {
    marginTop: 32,
  },
  tab_title_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
    color: '#ddd',
    marginBottom: 25,
    marginLeft: 16,
    letterSpacing:3,
    opacity:0.5
  },
  top_artist_view: {
    flexDirection: 'row',
  },
  View_title_text_style: {
    fontFamily: Fonts.BennetTextOne_Bold,
    fontSize: normalize(18),
    color: '#fff',
    marginLeft: 16,
    marginBottom: 16,
    marginTop: 24,
  },
  top_artist_name_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(16),
    color: '#ddd',
    letterSpacing:0,
    width: SLIDER_WIDTH/3,
    textAlign:'center'
  },
  top_artits_bright_ring_img_style: {
    height: SLIDER_HEIGHT/5,
    width: SLIDER_WIDTH/2.5,
    borderRadius:161/2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  top_artist_entity_view: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SLIDER_WIDTH/2.7,
    // marginRight:4,
  },
  top_artist_img_style: {
    height: SLIDER_HEIGHT/5.5,
    width: SLIDER_WIDTH/3.1,
    // borderRadius: 136 / 2,
    resizeMode:'contain',
  },
  artist_you_follow_entity_view: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SLIDER_WIDTH/3,
  },
  Artists_on_Gigs_text_style: {
    fontFamily: Fonts.BennetTextOne_Bold,
    fontSize: normalize(24),
    color: '#fff',
    marginLeft: 16,
    marginBottom: 16,
    marginTop: 24,
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
    marginLeft: 16,
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
    marginHorizontal: 8,
    marginLeft:10
    },
  linearGradient: {
    alignSelf:'center',
    borderRadius: 10,
    width: '96%',
    height:Platform.isPad ? SLIDER_HEIGHT /4 : SLIDER_HEIGHT/ 6.5,
    marginBottom:10
  },
  inside_linear_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  linear_text_data_view: {},
  artist_with_new_event_text_style_box: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    color: '#777',
    marginBottom: 5,
  },
  artist_name_text_style_box: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(24),
    color: '#ddd',
    marginBottom: 16,
  },
  linear_img_data_view: {
    justifyContent:'center',
    alignItems: 'center',
    margin:10
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
    width: '100%'
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
    flexDirection: 'row',
    marginBottom: 21,
  },
  resetButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    marginHorizontal: 7,
    paddingVertical: 10,
  },
  applyButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    marginHorizontal: 7,
    backgroundColor: '#fff',
    paddingVertical: 10,
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
  linear_img_data_style: {
    height:Platform.isPad ? SLIDER_HEIGHT /4 : SLIDER_HEIGHT/ 7,
    width: SLIDER_WIDTH/ 3.5,
  },
  top_artist_main_container: {
    marginTop: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  top_artist_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  nothingFoundMainViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  nothingFoundViewImageStyle: {
    width: 250,
    height: 185,
    alignSelf: 'center',
    marginTop: 77
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
  artist_result_img_style: {
    marginBottom: 3,
    width:SLIDER_WIDTH/ 2 - 22,
    height:Platform.isPad ? SLIDER_HEIGHT /3 :  SLIDER_WIDTH/ 2 -5,
  },
  artist_filter_result_round: {
    justifyContent: 'center',
    alignItems: 'center',
    // height:Platform.isPad ? SLIDER_HEIGHT /3 : SLIDER_HEIGHT/ 4,
    marginBottom: Platform.isPad ? 50 : Platform.OS == 'android' ? 50: 10,
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
  genre_option_btn_view: {
    width: '100%',
    marginVertical: 18
  },
  clear_filter_text_style:{
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(16),
    color: '#fff',
    marginLeft:20,
    letterSpacing:0
  }
});

import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../common/fonts';
import { normalize } from "../../common/normalize";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  ScrollView: {
    width: '100%',
    backgroundColor: '#141518',
  },
  main_container: {
    marginTop:27,
    backgroundColor: '#141518',
    borderRadius:10
  },
  title_section_view:{
    marginHorizontal:16,
    marginTop:10
  },
  title_n_close_view: {
    flexDirection: 'row',
    marginTop:20,
    justifyContent: 'space-between',
    borderTopWidth:1,
    borderColor:'#2b2c2f'
  },
  title_view: {
    marginVertical:15
  },
  title_text_title_view: {
    fontSize: normalize(16),
    color: '#fff',
    fontFamily: Fonts.OpenSans_semibold,
  },
  close_btn_view: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  decription_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
    color: '#6f6f70',
    marginBottom: 20,
  },
  card_view_container: {
    width:width/1.5,
    borderRadius: 10,
    marginVertical: 17,
    marginHorizontal:10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  inside_card_view_container: {
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius:10
  },
  name_n_radio_btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name_n_details_view: {
    width:'80%',
  },
  address_type_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    color: '#fff',
  },
  user_card_name_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#fff',
    marginTop: 8,
  },
  round_radio_style: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    borderWidth: 1,
    borderColor: '#48494a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected_btn_style: {
    width: 14,
    height: 14,
    borderRadius: 24 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  selectedCardStyle: {
    fontSize: normalize(14),
    color: '#ddd',
    marginVertical: 5,
  },
  radio_btn_view: {
    // marginTop:8
  },
  address_view: {
    marginTop: 11,
  },
  addresss_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
    color: '#fff',
opacity:0.7
  },
  country_view: {
    marginTop: 30,
  },
  country_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(12),
    color: '#fff',
opacity:0.7
  },
  edit_n_delete_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 11,
    // paddingVertical:15,
    // paddingHorizontal:20,
    // backgroundColor:"red"
  },
  edit_text: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#fff',
  },
  addNewCardButtonView: {
    borderColor: 'rgba(221, 221, 221, 0.5)',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf:'center',
  },
  addNewCardPlusButtonView: {
    height: 24,
    width: 24,
    borderRadius: 24,
    backgroundColor: '#2e2f31',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewCardButtonText: {
    color: '#fff',
    fontSize: normalize(14),
    fontFamily: Fonts.OpenSans_regular,
    marginTop: 10,
  },
  delivery_btn_style: {
    borderRadius: 10,
    backgroundColor: '#878889',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 53,
    marginTop: 48,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 5,
    shadowRadius: 10,
    elevation: 9,
  },
  btn_text_style: {
    marginVertical: 17,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#1b1c20',
  },
  Disclaimer_text_view: {
    marginTop: 40,
    justifyContent: 'flex-start',
    marginHorizontal:16,
    paddingBottom:30
  },
  Disclaimer_title_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    color: '#777778',
  },
  Disclaimer_details_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    color: '#777778',
    marginTop: 10,
    textAlign:'justify'
  },
  right_sign_view: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  round_plus_view:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#2e2f31',
    borderRadius:height/20/2,
    height:height/20,
    width:width/10
  },
  select_tickets_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    color: '#ffffff',
    marginLeft: 10,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  viewContainer_second: {
    backgroundColor: '#101012',
    elevation: 5,
    borderRadius: 15,
    width:'90%',
    alignSelf:'center',
    height:'20%',
    borderWidth:1,
    borderColor:'#777',
    justifyContent:'space-evenly'
  },
  modal_txt_view:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:10
  },
  modal_txt_style:{
    color:'#fff',
    fontSize: normalize(18),
    fontFamily:Fonts.PlayfairDisplay_Regular
  },
  modal_btn_view:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center',
    width:'100%',
    alignSelf:'center'
  },
  modal_btn_style:{
    borderRadius:10,
    height:'50%',
    width:'30%',
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    borderWidth:1,
    borderColor:'#777'
  },
  modal_btn_text_style:{
    color:'#fff',
    fontSize: normalize(14),
    fontFamily:Fonts.OpenSans_Bold
  },
  blur_view_loader:{
    justifyContent: 'center', alignItems: 'center',
    height:'100%'
    // flex:1
    ,backgroundColor:'transparent',
    position:'absolute',top:0,left:0,right:0,bottom:0
  },
  spinnerTextStyle:{
    color:'#fff'
  },
  absoluteReady: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

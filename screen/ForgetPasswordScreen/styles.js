import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../common/fonts';
import { normalize } from "../../common/normalize";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const padding_horizontal = 16;

export const styles = StyleSheet.create({
  main_view_container: {
    flex: 1,
    justifyContent: 'center',
  },
  Login_title_text_style: {
    fontFamily: Fonts.PlayfairDisplay_Bold,
    fontSize: normalize(20),
    color: '#ddd',
    textAlignVertical: 'center',
    alignSelf: 'center',
    marginBottom:26
  },
  Email_address_text_inpput_title_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    color: '#aaa',
    marginVertical: 6,
    marginHorizontal: 1
  },
  Email_text_input_style: {
    marginTop: 4,
    height:40,
    width: '100%',
    marginRight: 18,
    borderRadius: 10,
    backgroundColor: '#3d3d3d',
    color: '#8c8c8c',
    paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn_text_style: {
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(14),
    color: '#fff',
    marginVertical: 11,
  },
  btn_style: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '28%',
    borderRadius: 10,
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
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  close_btn_style:{
    position: 'absolute', top: 30, right: 15
  },
  btn_text_view:{
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'center',
  }
});

import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../common/fonts';
import { normalize } from "../../common/normalize";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const padding_horizontal = 16;

export const styles = StyleSheet.create({
  scrollContainer: {
    height: height - 225,
  },
  scrlView_container: {
    // flexGrow: 1,
    // height:height-100
  },
  main_container: {
    flex: 1,
  },
  vipSupporterMainView: {
    paddingVertical: 10,
  },
  supporterListHeader: {
    flexDirection: 'row',
    paddingHorizontal: padding_horizontal,
  },
  vipMarkStyle: {
    position: 'absolute',
    right: 10,
    top: 0,
  },
  supporterIconStyle: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  supporterListHeaderTitle: {
    color: '#fff',
    fontSize: normalize(14),
    fontFamily: Fonts.OpenSans_semibold,
    marginLeft: 10,
  },
  supporterListContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagesMainContainer: {
    marginTop: 12,
  },

  chatDetailsContainer: {
    //flex:1,
    backgroundColor: '#101113',
    //borderBottomColor: '#979797',
    //borderBottomWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  chatDetailsContainerLeftView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatRoomDetailRightIcons: {
    flexDirection: 'row',
  },
  global__title_text_style: {
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(16),
    color: '#dddddd',
    flex: 1,
  },
  participarts_view_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 9,
    paddingBottom: 18,
    width: '45%',
  },
  participarts_profile_pic: {
    flexDirection: 'row',
  },
  participants_count_text_style: {
    textDecorationLine: 'underline',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
    color: '#dddddd',
  },
  user_budge_pic_small_style: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: '#363636',
  },
  addIconStyle: {
    height: 24,
    width: 24,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212123',
  },
  RIconStyle: {
    height: 24,
    width: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191919',
    marginLeft: 20,
  },
  RIconTextStyle: {
    color: '#ddd',
    fontSize: normalize(15),
    fontFamily: Fonts.OpenSans_semibold,
  },
  vipUserProfilePictureStyle: {
    height: 30,
    width: 30,
    borderRadius: 30,
    marginRight: 10,
    backgroundColor: '#48494b',
    borderWidth: 1,
  },
  blurView_tip: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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

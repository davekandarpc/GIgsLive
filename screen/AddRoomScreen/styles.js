import { Dimensions, StyleSheet } from 'react-native';
import { Fonts } from '../../common/fonts';
import { normalize } from "../../common/normalize";

const height = Dimensions.get('window').height;
export const styles = StyleSheet.create({
  scrollContainer: {
    height: height - 75,
  },
  scrlView_container: {
    flexGrow: 1,
  },
  main_container: {
    flex: 1,
    backgroundColor: '#090a0c',
  },
  screenHeadingView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  headingTextStyle: {
    color: '#fff',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    marginLeft: 30,
  },
  closeIconStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addNamePhotoView: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  cameraIconViewStyle: {
    backgroundColor: '#3b3b3c',
    height: 48,
    width: 48,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    opacity:0.5
  },
  textBoxView: {
    marginLeft: 10,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#979797',
    paddingHorizontal: 10,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textInputStyle: {
    color: '#ddd',
    flex: 1,
    opacity:0.5,
    fontFamily:Fonts.OpenSans_regular,
    fontSize: normalize(14)
  },
  groupNameLengthStyle: {
    color: '#fff',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    opacity:0.5
  },
  invitePartiipantsCountChip: {
    backgroundColor: '#0f1012',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 20,
  },
  invitePartiipantsCountTextChip: {
    color: '#fff',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(12),
    opacity:0.5
  },
  participantListHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  added_participantsVeiw: {
    flexDirection: 'row',
    marginTop: 10,
  },
  addedUserItemStyle: {
    marginRight: 16,
    alignItems: 'center',
  },
  addedUserTextStyle: {
    color: '#fff',
    fontFamily: Fonts.OpenSans_regular,
    fontSize: normalize(10),
    marginTop: 8,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#3b3b3c',
    borderRadius: 35,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  searchIconStyle: {
    marginLeft:10
  },
  searchTextBoxStyle: {
    color: '#ddd',
    height: 40,
    width: '90%',
    borderRadius: 35,
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(14),
    opacity:0.5,
    marginLeft:12
  },
  participantListContainer: {
    backgroundColor: '#0c0d0e',
    paddingHorizontal: 16,
  },
  globalPartiipantsCountTextChip: {
    marginVertical: 10,
    color: '#fff',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(10),
  },
  roomImage: {
    height: 48,
    width: 48,
    borderRadius: 48 / 2,
  },
  buttonStyle: {
    flexDirection: 'row',
    // backgroundColor: '#afafaf',
    alignItems: 'center',
    paddingVertical: 12,
    width: '80%',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonTextStyle: {
    color: '#000',
    fontFamily: Fonts.OpenSans_semibold,
    fontSize: normalize(16),
    opacity:0.5
  },
});

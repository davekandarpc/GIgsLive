import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { styles } from './styles';
import { Similar_artist } from '../../components/Similar_artist';
import { Genres_round_view } from '../../components/Genres_round_view';
import { Images } from '../../common/Images';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
export default class FanPageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      empty_Tab_Selected_tab: true,
      mutualFriendTab_tab: false,
      eventsAttended_tab: false,
      artist_following_tab: false,
      genre_tab: false,
      openDropDown: false,
      follow: false,
      visible: false,
      roomList: [
        { name: 'Unfollow', isAdmin: 0, hasNotification: 0 },
        { name: 'Block', isAdmin: 0, hasNotification: 0 },
      ],
      text: '',
    };
  }

  toggleAnswer = (value) => {
    if (value === 'Mutual Friends') {
      this.setState({
        eventsAttended_tab: false,
        mutualFriendTab_tab: true,
        empty_Tab_Selected_tab: false,
      });
      this.setState({
        mutualFriendTab_tab: true,
        event_attended: false,
        empty_Tab_Selected_tab: false,
      });
    }
    if (value === 'Events Attended') {
      this.setState({
        mutualFriendTab_tab: false,
        event_attended: true,
        empty_Tab_Selected_tab: false,
      });
      this.setState({
        eventsAttended_tab: true,
        mutualFriendTab_tab: false,
        empty_Tab_Selected_tab: false,
      });
    }
  };

  followProcess = () => {
    this.setState({ follow: !this.state.follow });
    this.setState({ openDropDown: false });
  };

  dropdownProcess = () => {
    this.setState({ openDropDown: !this.state.openDropDown });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior = {Platform.OS == 'ios' ? "padding":null} style={styles.main_container}>
          <ScrollView contentContainerStyle={styles.scrlView_container}>
            <ImageBackground
              source={Images.fan_ImageBackground}
              style={styles.img_bg_style}>
              <View style={styles.header_container_style}>
                <TouchableOpacity
                  style={styles.header_user_img_style}></TouchableOpacity>
              </View>
              <View style={styles.artist_img_viewer}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <View style={{ flex: 1, borderRadius: 10 }}></View>
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 3,
                      borderColor: '#535353',
                      backgroundColor: '#535353',
                      borderRadius: 10,
                      marginRight: 15,
                    }}></View>
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 3,
                      borderColor: '#535353',
                      backgroundColor: '#535353',
                      borderRadius: 10,
                    }}></View>
                  <View style={{ flex: 1, borderRadius: 10 }}></View>
                </View>
                <ImageBackground
                  source={Images.fan_img}
                  imageStyle={{ borderRadius: 10, marginLeft: 0, marginTop: 8 }}
                  style={{
                    position: 'absolute',
                    height: '97%',
                    width: '95%',
                    justifyContent: 'flex-end',
                  }}>
                  <View style={{ alignItems: 'flex-end', flex: 1, marginTop: 5 }}>
                    <Image
                      style={styles.medal_img_style}
                      source={Images.Gold_Medal}></Image>
                  </View>
                  <View style={{ margin: 24 }}>
                    <Text style={styles.Artist_name_text}>Chris Daniels</Text>
                    <View
                      style={[
                        styles.follow_pop_up_btn,
                        {
                          backgroundColor:
                            this.state.follow === true ? '#6e6e6e' : '#fff',
                        },
                      ]}>
                      <TouchableOpacity
                        style={{
                          flex: 3,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() => this.followProcess()}>
                        <Text style={styles.follow_btn_text}>
                          {this.state.follow === true ? 'Following' : 'Follow'}
                        </Text>
                      </TouchableOpacity>
                      {this.state.follow === true ? (
                        <TouchableOpacity
                          onPress={() => this.dropdownProcess()}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            marginTop: 4,
                          }}>
                          <Fontisto
                            name="caret-down"
                            size={10}
                            color="#c4c4c4"></Fontisto>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    {this.state.openDropDown === true ? (
                      <View style={styles.follow_pop_option_btn}>
                        <TouchableOpacity
                          onPress={() => this.dropdownProcess()}
                          style={{
                            borderBottomWidth: 1,
                            borderColor: '#303133',
                            width: '100%',
                          }}>
                          <Text style={styles.follow_btn_option_text}>
                            Unfollow
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.dropdownProcess()}
                          style={{ width: '100%' }}>
                          <Text style={styles.follow_btn_option_text}>
                            Block
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.artist_following_details_container}>
                <View style={styles.gigs_enjoy_count_num_view}>
                  <View style={styles.box_title_view}>
                    <Text style={styles.following_details_title_text}>
                      Gigs Enjoyed
                    </Text>
                  </View>
                  <View style={styles.box_following_count_view}>
                    <Text style={styles.following_details_count_text}>32</Text>
                  </View>
                </View>
                <View style={styles.gigs_enjoy_count_num_view}>
                  <View style={styles.box_title_view}>
                    <Text style={styles.following_details_title_text}>
                      Gigs Enjoyed
                    </Text>
                  </View>
                  <View style={styles.box_following_count_view}>
                    <Text style={styles.following_details_count_text}>32</Text>
                  </View>
                </View>
                <View style={styles.gigs_enjoy_count_num_view}>
                  <View style={styles.box_title_view}>
                    <Text style={styles.following_details_title_text}>
                      Gigs Enjoyed
                    </Text>
                  </View>
                  <View style={styles.box_following_count_view}>
                    <Text style={styles.following_details_count_text}>32</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
            <View style={{ backgroundColor: '#101012' }}>
              <View style={styles.location_n_details_view}>
                <View style={styles.location_n_social_icon_view}>
                  <Entypo
                    name="location-pin"
                    size={30}
                    color="#c4c4c4"></Entypo>
                  <Text style={styles.location_text_style}>Nashville, USA</Text>
                  <TouchableOpacity
                    style={[styles.social_btn_view, { marginLeft: 16 }]}>
                    <Fontisto
                      style={styles.social_icon_style}
                      name="twitter"
                      size={18}
                      color="#c4c4c4"></Fontisto>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.social_btn_view}>
                    <Fontisto
                      name="instagram"
                      style={styles.social_icon_style}
                      size={18}
                      color="#c4c4c4"></Fontisto>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.social_btn_view}>
                    <Fontisto
                      name="facebook"
                      style={[styles.social_icon_style, { marginHorizontal: 15 }]}
                      size={18}
                      color="#c4c4c4"></Fontisto>
                  </TouchableOpacity>
                </View>
                <View style={styles.artist_bio_text_view}>
                  <Text style={styles.artist_bio_text_style}>
                    Chris Daniels, (born September 4, 1981, Houston, Texas,
                    U.S.), American singer-songwriter and actress who achieved
                    fame in the late 1990s as the lead singer of the R&B group
                    Destiny's Child and then launched a hugely.
                  </Text>
                </View>
              </View>
              <Text style={styles.Your_Mutuals_text_style}>Your Mutuals</Text>
              <View
                style={{
                  marginHorizontal: 16,
                  backgroundColor: '#0b0b0b',
                  borderRadius: 10,
                }}>
                {this.state.empty_Tab_Selected_tab === true ? (
                  <View style={styles.empty_tab_view}>
                    <TouchableOpacity
                      style={styles.blank_view_white_empty}></TouchableOpacity>
                    <Text style={styles.empty_view_text_style}>
                      Looks like You & Chris don’t have things in common yet.
                      Follow Chris & you guys can share your interests
                    </Text>
                  </View>
                ) : null}
                <View style={styles.mutual_friend_view}>
                  {this.state.mutualFriendTab_tab === false ? (
                    <TouchableOpacity
                      onPress={() => this.toggleAnswer('Mutual Friends')}>
                      <ImageBackground
                        source={Images.event_attended}
                        style={{
                          width: '100%',
                          borderRadius: 10,
                          flexDirection: 'row',
                          overflow: 'hidden',
                        }}
                        imageStyle={{ width: '100%' }}>
                        <View style={styles.tab_view_title}>
                          <Text style={styles.title_text_tab}>
                            Mutual Friends
                          </Text>
                        </View>
                        <View style={styles.tab_view_count}>
                          <Text style={styles.count_text_tab}>06</Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  ) : null}
                  {this.state.mutualFriendTab_tab === true ? (
                    <View>
                      <Text style={styles.mutual_friend_text_count}>
                        Mutual Friends (6){' '}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}>
                          <TouchableOpacity
                            style={styles.similar_artist_box_view__style}>
                            <Image
                              source={{
                                uri:
                                  'https://schnncdnems04.cdnsrv.jio.com/c.saavncdn.com/artists/Taylor_Swift_003_20200226074119_500x500.jpg',
                              }}
                              style={styles.similar_artist_img__style}></Image>
                            <Text
                              style={styles.similar_artist_name_text__style}>
                              Taylor Swift
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.similar_artist_box_view__style}>
                            <Image
                              source={{
                                uri:
                                  'https://sklktcdnems01.cdnsrv.jio.com/c.saavncdn.com/artists/Martin_Garrix_004_20200303120820_500x500.jpg',
                              }}
                              style={styles.similar_artist_img__style}></Image>
                            <Text
                              style={styles.similar_artist_name_text__style}>
                              Martin Garrix
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.similar_artist_box_view__style}>
                            <Image
                              source={{
                                uri:
                                  'https://sklktcdnems02.cdnsrv.jio.com/c.saavncdn.com/artists/David_Guetta_500x500.jpg',
                              }}
                              style={styles.similar_artist_img__style}></Image>
                            <Text
                              style={styles.similar_artist_name_text__style}>
                              David Guetta
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.similar_artist_box_view__style}>
                            <Image
                              source={{
                                uri:
                                  'https://sklktecdnems02.cdnsrv.jio.com/c.saavncdn.com/artists/Selena_Gomez_002_20200226073835_500x500.jpg',
                              }}
                              style={styles.similar_artist_img__style}></Image>
                            <Text
                              style={styles.similar_artist_name_text__style}>
                              Selena Gomez
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.similar_artist_box_view__style}>
                            <Image
                              source={{
                                uri:
                                  'https://schnncdnems02.cdnsrv.jio.com/c.saavncdn.com/artists/Demi_Lovato_002_20200312120805_500x500.jpg',
                              }}
                              style={styles.similar_artist_img__style}></Image>
                            <Text
                              style={styles.similar_artist_name_text__style}>
                              Demi Lovato
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.similar_artist_box_view__style}>
                            <Image
                              source={{
                                uri:
                                  'https://snoidcdnems01.cdnsrv.jio.com/c.saavncdn.com/607/You-re-A-Lie-English-2012-500x500.jpg',
                              }}
                              style={styles.similar_artist_img__style}></Image>
                            <Text
                              style={styles.similar_artist_name_text__style}>
                              Slash
                            </Text>
                          </TouchableOpacity>
                        </ScrollView>
                      </View>
                    </View>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={() => this.toggleAnswer('Events Attended')}>
                  {this.state.eventsAttended_tab === false ? (
                    <ImageBackground
                      source={Images.event_attended}
                      style={{
                        width: '100%',
                        borderRadius: 10,
                        flexDirection: 'row',
                        overflow: 'hidden',
                      }}
                      imageStyle={{ width: '100%' }}>
                      <View style={styles.tab_view_title}>
                        <Text style={styles.title_text_tab}>
                          Events Attended
                        </Text>
                      </View>
                      <View style={styles.tab_view_count}>
                        <Text style={styles.count_text_tab}>01</Text>
                      </View>
                    </ImageBackground>
                  ) : null}
                </TouchableOpacity>
                {this.state.eventsAttended_tab === true ? (
                  <View style={{ borderRadius: 10, backgroundColor: '#0c0c0c' }}>
                    <Text style={styles.mutual_friend_text_count}>
                      Events Attended (1){' '}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                          style={styles.similar_artist_box_view__style}>
                          <ImageBackground
                            imageStyle={{ borderRadius: 10 }}
                            source={Images.alen_walker}
                            style={styles.event_artist_img__style}>
                            <View style={styles.inside_img_event_attend}>
                              <Text
                                style={
                                  styles.artist_name_event_attend_text_screen
                                }>
                                Alan Walker
                              </Text>
                              <Text
                                style={
                                  styles.event_name_event_attend_text_screen
                                }>
                                Enigma
                              </Text>
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
                  </View>
                ) : null}

                <ImageBackground
                  source={Images.artist_following}
                  style={{
                    width: '100%',
                    borderRadius: 10,
                    flexDirection: 'row',
                    overflow: 'hidden',
                  }}
                  imageStyle={{ width: '100%' }}>
                  <View style={styles.tab_view_title}>
                    <Text style={styles.title_text_tab}>Artist following</Text>
                  </View>
                  <View style={styles.tab_view_count}>
                    <Text style={styles.count_text_tab}>12</Text>
                  </View>
                </ImageBackground>
                <ImageBackground
                  source={Images.genre_artist}
                  style={styles.genre_artist}
                  imageStyle={{ width: '100%' }}>
                  <View style={styles.tab_view_title}>
                    <Text style={styles.title_text_tab}>Genres liked</Text>
                  </View>
                  <View style={[styles.tab_view_count]}>
                    <Text
                      numberOfLines={3}
                      style={[
                        styles.genres_text_tab,
                        { marginRight: 5, marginLeft: 50, alignSelf: 'flex-end' },
                      ]}>
                      You & Chris don’t have any common genre
                    </Text>
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.Badges_earned_view}>
                <Text style={styles.Badges_Earned_text_style}>
                  Badges Earned
                </Text>
                <View style={styles.budge_icon_container}>
                  <View style={styles.unlimited_fan_badge_view}>
                    <Image
                      style={styles.badge_img_style}
                      source={Images.unlimited_badge}></Image>
                  </View>
                  <View
                    style={{
                      borderWidth: 0.4,
                      height: '90%',
                      borderColor: '#fff',
                      width: 0,
                      borderStyle: 'dashed',
                      borderRadius: 15,
                    }}></View>
                  <View style={styles.unlimited_fan_badge_view}>
                    <Image
                      style={styles.badge_img_style}
                      source={Images.super_fan}></Image>
                  </View>
                  <View
                    style={{
                      borderWidth: 0.4,
                      height: '90%',
                      borderColor: '#fff',
                      width: 0,
                      borderStyle: 'dashed',
                      borderRadius: 15,
                    }}></View>
                  <View style={styles.unlimited_fan_badge_view}>
                    <Image
                      style={styles.badge_img_style}
                      source={Images.regular_badge}></Image>
                  </View>
                </View>
              </View>
              <View style={{ backgroundColor: '#000', paddingLeft: 20 }}>
                <Similar_artist />
              </View>
              <View style={{ backgroundColor: '#000', paddingLeft: 20 }}>
                <Genres_round_view />
              </View>
              <View style={styles.rachel_view}>
                <View style={styles.rachel_title_view}>
                  <Text style={styles.rachel_text_style}>
                    Other Fans like Rachael
                  </Text>
                  <Text style={styles.see_all_text_style}>See all</Text>
                </View>
                <View style={styles.rachel_Row_view}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                      style={styles.rachel_view_btn}></TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rachel_view_btn}></TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rachel_view_btn}></TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rachel_view_btn}></TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

import React, {Component} from 'react';
import {
  Image,
  View,
  Text,
  ImageBackground,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Images} from '../../common/Images';
import {styles} from './styles';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import Footer from '../../components/Footer';

const screenHeight = Dimensions.get('window').height;

export class AboutUsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    global.myNavigation = this.props.navigation;
  }
  componentDidMount = () => {};
  render() {
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.main_container}>
          {/* Header View Start */}
          <View style={styles.header_view}>
            <View style={styles.user_img}></View>
          </View>
          {/* Header View Stop */}

          {/* top image background view start */}
          <ImageBackground
            source={Images.mainBackground}
            style={styles.top_Img_banner}>
            <Text style={styles.top_image_bg_text_style}>
              “Make Every concert a World Tour”
            </Text>
          </ImageBackground>
          {/* top image background view stop */}
          {/* Gigs by Numbers view start */}
          <View style={styles.gigs_by_Numbers_view}>
            <View style={styles.gigs_by_num_text_title}>
              <Text style={styles.gigs_by_umbers_title_text_style}>
                Gigs by Numbers
              </Text>
            </View>
            <View style={{flex: 1, margintop: 10}}>
              {/* first row view start */}
              <View style={styles.gigs_num_container}>
                <View style={{flex: 1}}>
                  <Text style={styles.fan_enjoyed_count_text}>322+</Text>
                  <Text style={styles.fan_enjoyed_text_style}>
                    Fans Enjoyed
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.fan_enjoyed_count_text}>322+</Text>
                  <Text style={styles.fan_enjoyed_text_style}>Live Events</Text>
                </View>
              </View>
              {/* first row view stop */}
              <View style={styles.gigs_num_container}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <View>
                    <Text style={styles.fan_enjoyed_count_text}>322+</Text>
                    <Text style={styles.fan_enjoyed_text_style}>
                      Artists Onboarded
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <View style={styles.ticket_bought_container}>
                    <Text style={styles.fan_enjoyed_count_text}>322+</Text>
                    <Text style={styles.fan_enjoyed_text_style}>
                      Tickets Bought
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* Gigs by Numbers view stop */}
          <View style={styles.black_text_n_img_container}>
            <View style={styles.data_box_container}>
              <Text style={styles.data_box_title_text_style}>
                We’re Different!
              </Text>
              <View style={styles.img_box_container}>
                <TouchableOpacity
                  style={styles.left_img_box_style}></TouchableOpacity>
                <TouchableOpacity
                  style={styles.right_img_box_style}></TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.black_text_n_img_container}>
            <View style={styles.data_box_container}>
              <Text style={styles.data_box_title_text_style}>Fans</Text>
              <Text style={styles.data_box_description_text_style}>
                Fans are first class citizens on our Platform, we help them
                enjoyfew more lines about them.
              </Text>
              <View style={styles.img_box_container}>
                <TouchableOpacity
                  style={styles.left_img_box_style}></TouchableOpacity>
                <TouchableOpacity
                  style={styles.right_img_box_style}></TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.black_text_n_img_container}>
            <View style={styles.data_box_container}>
              <Text style={styles.data_box_title_text_style}>Badges</Text>
              <Text style={styles.data_box_description_text_style}>
                We offer badges to fans ! At every level a fan earns a new badge
                which he can brag about. There are various badges .
              </Text>
              <View style={styles.img_box_container}>
                <TouchableOpacity
                  style={styles.left_img_box_style}></TouchableOpacity>
                <TouchableOpacity
                  style={styles.right_img_box_style}></TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.black_text_n_img_container}>
            <View style={styles.data_box_container}>
              <Text style={styles.data_box_title_text_style}>Tipping</Text>
              <Text style={styles.data_box_description_text_style}>
                Our fans love the artists and hence can show thier support by
                spreading thier love by tipping the Artists.
              </Text>
            </View>
          </View>
          {/* what we belive part  start */}
          <View style={{marginTop: 30}}>
            <Text style={styles.what_we_belive_title_text_style}>
              What we believe in!
            </Text>
            <Text style={styles.what_we_belive_description_text_style}>
              Connecting an Artist with a fan such that the fan can watch live
              performances on their own terms, on their own schedule, from
              anywhere.
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                resizeMode="contain"
                source={Images.Band_about_us}
                style={styles.band_about_us_img_style}></Image>
            </View>
          </View>
          {/* what we belive part  stop */}
          {/* The Leaders behind the Vision view start */}
          <View style={{marginTop: 30}}>
            <Text style={styles.leader_behind_vision_title_text_style}>
              The Leaders behind the Vision
            </Text>
            {/* vaibhav kharat box start */}
            <View style={styles.owner_box_container}>
              <View style={styles.owener_box_view}>
                <View style={styles.owener_box_Data_view}>
                  <View style={styles.name_n_green_tick_container}>
                    <Image
                      source={Images.green_tick_about_us}
                      style={styles.color_dot_style}></Image>
                    <Text style={styles.owner_name_text_style}>
                      Vaibhav Kharat, Co -Founder
                    </Text>
                  </View>
                  <View style={styles.about_owner_text_view}>
                    <Text style={styles.about_owner_text_style}>
                      Accomplished and dedicated Technology Leader with 19 years
                      of Amazon experience in leading large, agile, distributed
                      teams in the delivery of technology products and programs.
                      Demonstrated success in managing multiple teams
                      simultaneously while driving continual improvements to
                      increase productivity, efficiency, and customer
                      satisfaction. Experienced in establishing and executing
                      short and long-term architectural roadmaps, adept at
                    </Text>
                  </View>
                  <View style={styles.social_icon_container}>
                    <TouchableOpacity
                      style={[styles.social_btn_view_edit_page]}>
                      <Image
                        source={Images.linked_in_about_us}
                        style={[styles.social_btn_view_edit_page]}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.social_btn_view_edit_page,
                        {marginLeft: 20},
                      ]}>
                      <Image
                        source={Images.Gigs_icon_about_us}
                        style={[styles.social_btn_view_edit_page]}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.owener_box_img_view}></View>
              </View>
            </View>
            {/* vaibhav kharat box stop */}
            {/* Ashutosh nayak box start */}
            <View style={[styles.owner_box_container]}>
              <View style={styles.owener_box_view}>
                <View style={styles.owener_box_img_view}></View>
                <View style={styles.owener_box_Data_view}>
                  <View style={styles.name_n_green_tick_container}>
                    <Image
                      source={Images.blue_tick_about_us}
                      style={styles.color_dot_style}></Image>
                    <Text style={styles.owner_name_text_style}>
                      Ashutosh Nayak, Co -Founder
                    </Text>
                  </View>
                  <View style={styles.about_owner_text_view}>
                    <Text style={styles.about_owner_text_style}>
                      Accomplished and dedicated Technology Leader with 19 years
                      of Amazon experience in leading large, agile, distributed
                      teams in the delivery of technology products and programs.
                      Demonstrated success in managing multiple teams
                      simultaneously while driving continual improvements to
                      increase productivity, efficiency, and customer
                      satisfaction. Experienced in establishing and executing
                      short and long-term architectural roadmaps, adept at
                    </Text>
                  </View>
                  <View style={styles.social_icon_container}>
                    <TouchableOpacity
                      style={[styles.social_btn_view_edit_page]}>
                      <Image
                        source={Images.linked_in_about_us}
                        style={[styles.social_btn_view_edit_page]}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.social_btn_view_edit_page,
                        {marginLeft: 20},
                      ]}>
                      <Image
                        source={Images.Gigs_icon_about_us}
                        style={[styles.social_btn_view_edit_page]}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {/* Ashutosh nayak box stop */}
            {/* The Leaders behind the Vision view start */}
            {/* Our Team view start */}
            <View style={{marginTop: 50}}>
              <Text style={styles.our_team_title_text_style}>Our Team</Text>
              <View style={styles.our_team_box_view}>
                <ScrollView horizontal={true}>
                  <ImageBackground
                    imageStyle={{borderRadius: 5}}
                    source={{
                      uri:
                        'https://i.pinimg.com/236x/71/8d/7e/718d7e48aca7e7cdc0fcca58152d14bc--netflix-original-series-netflix-series.jpg',
                    }}
                    resizeMode="cover"
                    style={[
                      styles.Team_member_box_style,
                      {borderColor: '#00f27d'},
                    ]}>
                    <LinearGradient
                      colors={[
                        'rgba(0, 0, 0,0.1)',
                        'rgba(0, 0, 0,0.5)',
                        'rgba(0, 0, 0,0.9)',
                      ]}
                      style={[
                        styles.linearGradient2,
                        {width: '100%', borderRadius: 5},
                      ]}>
                      <View style={styles.name_post_social_view_container}>
                        <Text style={styles.team_member_name_text_style}>
                          Joe Natoli
                        </Text>
                        <Text style={styles.team_member_position_text_style}>
                          Designation
                        </Text>
                        <View style={styles.social_icon_view_team_member_view}>
                          <TouchableOpacity
                            style={[styles.social_btn_view_edit_page]}>
                            <Image
                              source={Images.linked_in_about_us}
                              style={[
                                styles.social_btn_view_edit_page,
                              ]}></Image>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.social_btn_view_edit_page,
                              {marginLeft: 8},
                            ]}>
                            <Image
                              source={Images.Gigs_icon_about_us}
                              style={[
                                styles.social_btn_view_edit_page,
                              ]}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                  <ImageBackground
                    imageStyle={{borderRadius: 5}}
                    source={{
                      uri:
                        'https://i.pinimg.com/236x/71/8d/7e/718d7e48aca7e7cdc0fcca58152d14bc--netflix-original-series-netflix-series.jpg',
                    }}
                    resizeMode="cover"
                    style={[
                      styles.Team_member_box_style,
                      {borderColor: '#a500f2'},
                    ]}>
                    <LinearGradient
                      colors={[
                        'rgba(0, 0, 0,0.1)',
                        'rgba(0, 0, 0,0.5)',
                        'rgba(0, 0, 0,0.9)',
                      ]}
                      style={[
                        styles.linearGradient2,
                        {width: '100%', borderRadius: 5},
                      ]}>
                      <View style={styles.name_post_social_view_container}>
                        <Text style={styles.team_member_name_text_style}>
                          Joe Natoli
                        </Text>
                        <Text style={styles.team_member_position_text_style}>
                          Designation
                        </Text>
                        <View style={styles.social_icon_view_team_member_view}>
                          <TouchableOpacity
                            style={[styles.social_btn_view_edit_page]}>
                            <Image
                              source={Images.linked_in_about_us}
                              style={[
                                styles.social_btn_view_edit_page,
                              ]}></Image>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.social_btn_view_edit_page,
                              {marginLeft: 8},
                            ]}>
                            <Image
                              source={Images.Gigs_icon_about_us}
                              style={[
                                styles.social_btn_view_edit_page,
                              ]}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                  <ImageBackground
                    imageStyle={{borderRadius: 5}}
                    source={{
                      uri:
                        'https://i.pinimg.com/236x/71/8d/7e/718d7e48aca7e7cdc0fcca58152d14bc--netflix-original-series-netflix-series.jpg',
                    }}
                    resizeMode="cover"
                    style={[
                      styles.Team_member_box_style,
                      {borderColor: '#00f27d'},
                    ]}>
                    <LinearGradient
                      colors={[
                        'rgba(0, 0, 0,0.1)',
                        'rgba(0, 0, 0,0.5)',
                        'rgba(0, 0, 0,0.9)',
                      ]}
                      style={[
                        styles.linearGradient2,
                        {width: '100%', borderRadius: 5},
                      ]}>
                      <View style={styles.name_post_social_view_container}>
                        <Text style={styles.team_member_name_text_style}>
                          Joe Natoli
                        </Text>
                        <Text style={styles.team_member_position_text_style}>
                          Designation
                        </Text>
                        <View style={styles.social_icon_view_team_member_view}>
                          <TouchableOpacity
                            style={[styles.social_btn_view_edit_page]}>
                            <Image
                              source={Images.linked_in_about_us}
                              style={[
                                styles.social_btn_view_edit_page,
                              ]}></Image>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.social_btn_view_edit_page,
                              {marginLeft: 8},
                            ]}>
                            <Image
                              source={Images.Gigs_icon_about_us}
                              style={[
                                styles.social_btn_view_edit_page,
                              ]}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </ScrollView>
              </View>
            </View>
            {/* Our Team view stop */}
            {/* Join us in the journey part start */}
            <View style={{marginTop: 50}}>
              <Text style={styles.what_we_belive_title_text_style}>
                Join us in the journey
              </Text>
              <Text style={styles.what_we_belive_description_text_style}>
                We are looking for people that share our vision. Are you
                adaptable, driven, and friendly? Do you thrive in a fast-paced
                work environment where collaboration is the norm?
                {'\n'}
                {'\n'}
                If the answer is yes, then we want you.
              </Text>
              <TouchableOpacity
                style={{flexDirection: 'row', marginVertical: 14}}>
                <Text style={styles.view_job_opning_text_style}>
                  View Job Openings
                </Text>
                <AntDesign
                  style={{alignSelf: 'center', marginLeft: 8, marginTop: 2}}
                  name="arrowright"
                  size={10}
                  color="#fff"
                />
              </TouchableOpacity>
              {/* cruve view start  */}
              <View style={{marginTop: 30}}>
                <View style={styles.vector_view_style}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      marginLeft: 16,
                    }}>
                    <Image
                      source={Images.Vector_about_us}
                      style={styles.Vector_about_us_img_style}></Image>
                  </View>
                  <View
                    style={{
                      flex: 3,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View>
                      <Text style={styles.software_dev_about_text_style}>
                        I have enjoyed working with GL. I can proudly say this
                        is my first and best move. Work environment is good.
                        GIGS Live is fundamentally a strong concern with lot of
                        opportunities to learn.
                      </Text>
                      <Text style={styles.software_dev_name_text_style}>
                        Christina Jeffery
                      </Text>
                      <Text style={styles.software_dev_position_text_style}>
                        Software Developer
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* cruve view stop  */}
            </View>
            {/* Join us in the journey part stop */}
            {/* What they say about us part start */}
            <View style={{marginTop: 50}}>
              <Text style={styles.leader_behind_vision_title_text_style}>
                What they say about us
              </Text>
              <View style={{marginVertical: 30}}>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{height: 300}}
                  horizontal={true}>
                  <View style={styles.they_say_about_us_box}>
                    <Image
                      source={Images.bruno}
                      style={{
                        width: 90,
                        height: 58,
                        position: 'absolute',
                        top: -58,
                      }}></Image>
                    <View>
                      <Text  style={styles.review_text_style}>
                        Accomplished and dedicated Technology Leader with 19
                        years of Amazon experience in leading large, agile,
                        distributed teams in the delivery of technology products
                        and programs. Demonstrated success in managing multiple
                        teams simultaneously while driving continual
                        improvements to increase productivity, efficiency, and
                        customer satisfaction. Experienced in establishing and
                        executing short and long-term architectural roadmaps,
                        adept at
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.name_of_reviwer_text_style}>Y&I</Text>
                      <Text style={styles.Artist_on_gigsLive_text_style}>
                        Artist on GigsLive
                      </Text>
                    </View>
                  </View>
                  <View style={styles.they_say_about_us_box}>
                    <Image
                      source={Images.bruno}
                      style={{
                        width: 90,
                        height: 58,
                        position: 'absolute',
                        top: -58,
                      }}></Image>
                    <View>
                      <Text style={styles.review_text_style}>
                        Accomplished and dedicated Technology Leader with 19
                        years of Amazon experience in leading large, agile,
                        distributed teams in the delivery of technology products
                        and programs. Demonstrated success in managing multiple
                        teams simultaneously while driving continual
                        improvements to increase productivity, efficiency, and
                        customer satisfaction. Experienced in establishing and
                        executing short and long-term architectural roadmaps,
                        adept at
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.name_of_reviwer_text_style}>Y&I</Text>
                      <Text style={styles.Artist_on_gigsLive_text_style}>
                        Artist on GigsLive
                      </Text>
                    </View>
                  </View>
                  <View style={styles.they_say_about_us_box}>
                    <Image
                      source={Images.bruno}
                      style={{
                        width: 90,
                        height: 58,
                        position: 'absolute',
                        top: -58,
                      }}></Image>
                    <View>
                      <Text style={styles.review_text_style}>
                        Accomplished and dedicated Technology Leader with 19
                        years of Amazon experience in leading large, agile,
                        distributed teams in the delivery of technology products
                        and programs. Demonstrated success in managing multiple
                        teams simultaneously while driving continual
                        improvements to increase productivity, efficiency, and
                        customer satisfaction. Experienced in establishing and
                        executing short and long-term architectural roadmaps,
                        adept at
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.name_of_reviwer_text_style}>Y&I</Text>
                      <Text style={styles.Artist_on_gigsLive_text_style}>
                        Artist on GigsLive
                      </Text>
                    </View>
                  </View>
                  <View style={styles.they_say_about_us_box}>
                    <Image
                      source={Images.bruno}
                      style={{
                        width: 90,
                        height: 58,
                        position: 'absolute',
                        top: -58,
                      }}></Image>
                    <View>
                      <Text style={styles.review_text_style}>
                        Accomplished and dedicated Technology Leader with 19
                        years of Amazon experience in leading large, agile,
                        distributed teams in the delivery of technology products
                        and programs. Demonstrated success in managing multiple
                        teams simultaneously while driving continual
                        improvements to increase productivity, efficiency, and
                        customer satisfaction. Experienced in establishing and
                        executing short and long-term architectural roadmaps,
                        adept at
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.name_of_reviwer_text_style}>Y&I</Text>
                      <Text style={styles.Artist_on_gigsLive_text_style}>
                        Artist on GigsLive
                      </Text>
                    </View>
                  </View>
                  <View style={styles.they_say_about_us_box}>
                    <Image
                      source={Images.bruno}
                      style={{
                        width: 90,
                        height: 58,
                        position: 'absolute',
                        top: -58,
                      }}></Image>
                    <View>
                      <Text style={styles.review_text_style}>
                        Accomplished and dedicated Technology Leader with 19
                        years of Amazon experience in leading large, agile,
                        distributed teams in the delivery of technology products
                        and programs. Demonstrated success in managing multiple
                        teams simultaneously while driving continual
                        improvements to increase productivity, efficiency, and
                        customer satisfaction. Experienced in establishing and
                        executing short and long-term architectural roadmaps,
                        adept at
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.name_of_reviwer_text_style}>Y&I</Text>
                      <Text style={styles.Artist_on_gigsLive_text_style}>
                        Artist on GigsLive
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              </View>
              {/* What they say about us part stop */}
            </View>
          </View>
        </View>
        <Footer/>
      </ScrollView>
    );
  }
}
export default AboutUsScreen;

import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
import { Fonts } from '../../common/fonts';
import { normalize } from "../../common/normalize";

export const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#101113',
    },
    header_view:{
        backgroundColor:'#141414'
    },
    user_img:{
        height:24,
        width:24,
        borderRadius:24/2,
        backgroundColor:'#767676',
        marginLeft:16,
        marginVertical:12
    },
    top_Img_banner:{
        justifyContent:'center',
        alignItems:'center',
        height:438,
        width:width
    },
    top_image_bg_text_style:{
        //fontFamily:Fonts.BennetTextOne_SemiBold,
        color:'#fff',
        fontSize: normalize(24),
        textAlign:'center',
        paddingHorizontal:30
    },
    gigs_by_Numbers_view:{
        marginTop:49,
        alignSelf:'center',
        backgroundColor:'grey',
        width:'86%',
        height:150,
        padding:12,
        paddingBottom:0,
        marginBottom:50
    },
    gigs_by_num_text_title:{
        marginBottom:10
    },
    gigs_by_umbers_title_text_style:{
        //fontFamily:Fonts.BennetTextOne_SemiBold,
        color:'#fff',
        fontSize: normalize(21),
        textAlign:'left'
    },
    gigs_num_container:{
        flex:1,flexDirection:'row',
    },
    fan_enjoyed_count_text:{
        //fontFamily:Fonts.BennetTextOne_SemiBold,
        color:'#fff',
        fontSize: normalize(22),
        textAlign:'left',
        lineHeight:23
    },
    fan_enjoyed_text_style:{
        fontFamily:Fonts.OpenSans_regular,
        color:'#fff',
        fontSize: normalize(10),
        textAlign:'left',
        lineHeight:10,
        letterSpacing:0.74
    },
    ticket_bought_container:{

    },
    black_text_n_img_container:{
        marginBottom:20
    },
    data_box_container:{

    },
    data_box_title_text_style:{
        //fontFamily:Fonts.BennetTextOne_SemiBold,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(14),
        lineHeight:19,
        alignSelf:'center',
        marginBottom:10
    },
    data_box_description_text_style:{
        fontFamily:Fonts.OpenSans_Light,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(12),
        lineHeight:17,
        alignSelf:'center',
        textAlign:'center',
        paddingHorizontal:75,
        opacity:0.7
    },
    img_box_container:{
        marginTop:30,
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    left_img_box_style:{
        width:100,
        height:100,
        borderRadius:10,
        transform: [{rotate: '-10deg'}],
        backgroundColor:'#c4c4c4'
    },
    right_img_box_style:{
        width:100,
        height:100,
        borderRadius:10,
        transform: [{rotate: '10deg'}],
        backgroundColor:'#c4c4c4'
    },
    what_we_belive_title_text_style:{
        //fontFamily:Fonts.BennetTextOne_SemiBold,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(18),
        lineHeight:23,
        alignSelf:'flex-start',
        marginLeft:16
    },
    what_we_belive_description_text_style:{
        fontFamily:Fonts.OpenSans_Light,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(12),
        lineHeight:17,
        textAlign:'left',
        marginLeft:16,
        paddingRight:75,
        marginTop:12,
        marginBottom:24
    },
    band_about_us_img_style:{
        width:268,
        height:170,
        marginLeft:30
    },
    leader_behind_vision_title_text_style:{
        //fontFamily:Fonts.BennetTextOne_SemiBold,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(18),
        lineHeight:23,
        alignSelf:'center',
    },
    owner_box_container:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:45
    },
    owener_box_view:{
        elevation:9,
        alignSelf:'center',
        borderRadius:10,
        width:'87%',
        backgroundColor:'#262626',
        flexDirection:'row'
    },
    owener_box_Data_view:{
        flex:3,
        padding:16
    },
    owener_box_img_view:{
        flex:1,
    },
    name_n_green_tick_container:{
        flexDirection:'row'
    },
    color_dot_style:{
        width:15,
        height:15
    },
    owner_name_text_style:{
        //fontFamily:Fonts.BennetTextOne_SemiBold,
        color:'#fff',
        fontSize: normalize(12),
        lineHeight:15,
        marginLeft:10
    },
    about_owner_text_view:{
        marginTop:6,
        marginLeft:26
    },
    about_owner_text_style:{
        fontFamily:Fonts.OpenSans_Light,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(10),
        lineHeight:14,
        opacity:0.7
    },
    social_icon_container:{
        marginTop:14,
        marginLeft:26,
        flexDirection:'row',
    },
    social_btn_view_edit_page: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        height: 24,
        width: 24,
      },
      our_team_title_text_style:{
        //fontFamily:Fonts.BennetTextOne_SemiBold,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(18),
        lineHeight:23,
        alignSelf:'center',
      },
      our_team_box_view:{
        marginTop:20
      },
      Team_member_box_style:{
        borderRadius:5,
        width:150,
        height:150,
        borderWidth:1,
        marginLeft:16
      },
      name_post_social_view_container:{
        marginLeft:8,
        marginBottom:8,
        position:'absolute',
        bottom:0
      },
      team_member_name_text_style:{
        fontFamily:Fonts.OpenSans_Light,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(13),
        lineHeight:12,
        fontWeight:"600"
      },
      team_member_position_text_style:{
        fontFamily:Fonts.OpenSans_Light,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(10),
        lineHeight:10,
        marginTop:6
      },
      social_icon_view_team_member_view:{
        flexDirection:'row',
        marginTop:8
      },
      linearGradient2: {
        opacity: 1,
        flex: 1,
        width: '100%',
        borderRadius: 3,
      },
      view_job_opning_text_style:{
        fontFamily:Fonts.OpenSans_regular,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(12),
        lineHeight:15,
        marginLeft:16
      },
      vector_view_style:{
            backgroundColor:'#262626',
            width:"90%",
            height:181,
            alignSelf:'flex-end',
            borderTopLeftRadius:100,
            borderBottomLeftRadius:10,
            flexDirection:'row',
            paddingTop:10
      },
      Vector_about_us_img_style:{
          width:60,
          height:113,
      },
      software_dev_about_text_style:{
        fontFamily:Fonts.OpenSans_Light,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(10),
        lineHeight:10,
      },
      software_dev_name_text_style:{
        fontFamily:Fonts.OpenSans_semibold,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(12),
        lineHeight:12,
        marginTop:14
      },
      software_dev_position_text_style:{
        fontFamily:Fonts.OpenSans_Light,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(10),
        lineHeight:10,
        marginTop:4
      },
      they_say_about_us_box:{
        elevation:9,
        alignSelf:'center',
        borderRadius:10,
        backgroundColor:'#262626',
        height:180,
        padding:11,
        justifyContent:'space-between',
        marginLeft:16,
        width:251
      },
      review_text_style:{
        fontFamily:Fonts.OpenSans_Light,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(10),
        lineHeight:11,
        alignSelf: 'stretch',
        opacity:0.8
      },
      name_of_reviwer_text_style:{
        //fontFamily:Fonts.BennetTextOne_SemiBold,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(12),
        lineHeight:15,
      },
      Artist_on_gigsLive_text_style:{
        fontFamily:Fonts.OpenSans_Light,
        color:'rgba(255, 255, 255, 0.9)',
        fontSize: normalize(10),
        lineHeight:10,
        marginTop:4,
        opacity:0.7
      }
})
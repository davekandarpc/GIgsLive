import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment-timezone';
import { Platform } from "react-native";
import {keyConstants, strings} from '../common';
import Share from 'react-native-share';
import { getFormattedDate } from "../common";
import { getBasicAuthForAPi } from "../common/functions";

var encodedString = getBasicAuthForAPi()

//#region -> To display date with local timezone with Country Abbreviated code
//           ex. Aug 25 4:30 PM (PST), use below helper method
export const formatDateFromMilliseconds = (dateInMilliseconds, tab) => {
  const intDate =
    1000 *
    (typeof dateInMilliseconds !== 'int'
      ? parseInt(dateInMilliseconds)
      : dateInMilliseconds);
  const date = new Date(intDate);
  const m = moment(intDate);
  // Getting month and day of the month ie. MMM DD -> ex. Aug 25
  const day = m.format('MMM DD');
  // Getting hours and minutes of the day ie. h:mm -> ex. 4:30
  const time = m.format('h:mm');
  // Getting AM/PM of the time ie. a -> ex. PM
  const ampm = m.format('a').toLocaleUpperCase();
  // Getting timezone using 'moment-timezone' library
  const timezone = moment.tz.guess();
  // Getting abbreviated country code of particular region using 'moment-timezone' library
  const timezoneAbbr = moment.tz.zone(timezone).abbr(date.getTimezoneOffset());
  const tabBetween = function () {
    let spannedTabs = '';
    for (let i = 0; i < tab; i++) {
      spannedTabs = `${spannedTabs} `;
    }
    return spannedTabs;
  };
  // Generating final date formatted
  return `${day}${tabBetween()}${time} ${ampm} (${timezoneAbbr})`;
};
//#endregion

//#region -> To display date with local timezone
//           ex. Aug 25, 2020 then use below helper method
export const formatDateFromMillisecondsMMMDDYYYY = (dateInMilliseconds) => {
  const intDate =
    1000 *
    (typeof dateInMilliseconds !== 'int'
      ? parseInt(dateInMilliseconds)
      : dateInMilliseconds);
  const m = moment(intDate);
  // Getting month and day of the month ie. MMM DD, YYYY -> ex. Aug 25, 2020
  const day = m.format('MMM DD, YYYY');
  return day;
};
//#endregion

//#region -> To find day/s and hour/s difference, use below helper method
export const dayDiff = (startDate, endDate) => {
  // Convert the type of input date to INT, if datatype is other then that
  var mStartDate = moment(
    typeof startDate !== 'int' ? parseInt(startDate) : startDate,
  );
  var mEndDate = moment(typeof endDate !== 'int' ? parseInt(endDate) : endDate);
  //Difference between date in hours
  var diff = moment.duration(mEndDate.diff(mStartDate));
  var days = mEndDate.diff(mStartDate, 'days');
  // var days = diff.days();
  var hours = diff.hours();
  var minutes = diff.minutes();
  var seconds = diff.seconds();

  // Adding final difference value into array for easy to fetch
  let finalDiff = [];
  finalDiff.push(days);
  finalDiff.push(hours);
  finalDiff.push(minutes);
  finalDiff.push(seconds);
  finalDiff.push(diff);

  return finalDiff;
};
//#endregion
//#region -> Split Endpoint apart
export const splitEndPoint = (endpoint) => {
  let endPointSplitted = endpoint !== null && endpoint.split('/');
  let length = endPointSplitted.length - 1;
  return endPointSplitted != null && endPointSplitted.length < 1
    ? endPointSplitted
    : endPointSplitted[length];
};
//#endregion
//#region
export const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
//#endregion
//#region -> Fetch user data from Async Storage
export const getLoggedInUserDataObject = async () => {
  let userdata = JSON.parse(await AsyncStorage.getItem('loginData'));
  return userdata;
};
//#endregion
//#region -> Fetch user logged in flag from Async Storage
export const isUserLoggedInUser = async () => {
    try {
      let value = await AsyncStorage.getItem(keyConstants.IS_LOGGED_IN)
      return value
    } catch (err) {
      console.log('err: ' + err)
    }
};
//#endregion
//#region -> Get Token
export const getAccessToken = async () => {
  await getLoggedInUserDataObject().then((data) => {
    console.log('userdata: ', data);
    console.log('userdata: ', data.token);
    try {
      var token = data.token;
      return token;
    } catch (error) {
      return undefined;
    }
  });
};
//#endregion
//#region -> Get Api Header param
export const getHeaderParam = async () => {
  await getAccessToken().then((token) => {
    return {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token,
      'Authorization': `Basic ${encodedString}`, //Z2lnczpkZXY=
    };
  });
};
//#endregion
//#region -> Share Intent
export const ShareIt = async (item) => {
  // console.log("shareIt url:-> ",item)
  try {
    let url =
      typeof item === 'string' ? item : item.path ? item.path : item.share_link;
    const title = typeof item === 'string' ? '' : `${item.title} ${getFormattedDate(item.date)} ${item.url}  : `;
    const message = typeof item === 'string' ? '' : `${item.date} : `;
    const icon = `${item.image}`
    // const shareOptions = {
    //   title: title,
    //   message: message,
    //   url: url,
    //   subject: subject,
    // };
    const options = Platform.select({
      ios: {
        url:url
      },
      android :{
        // title:title,
        // message : title,
        url:url,
      }
    });
    Share.open(options);
  }
  catch (error) {
    console.log(error.message);
  }
};
//#endregion

/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  Linking
} from 'react-native';
import ViewUtils from "../../utils/ViewUtils"
import {MORE_MENU} from "../../common/MoreMenu"
import GlobalStyles from "../../../res/styles/GlobalStyles"
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon"

export default class AboutPage extends Component {
  constructor(props) {
    super(props)
    this.AboutCommon = new AboutCommon(props, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about)
  }
  updateState(dic){
    this.setState(dic)
  }
  onClick(name){
    let TargetComponent,
        params = {...this.props, menuType: name}
    switch(name) {
      case MORE_MENU.Website.name:
          TargetComponent = "WebViewPage"
          params.url = "http://www.devio.org/io/GitHubPopular/"
          params.title = "GitHubPopular"
          break;
      case MORE_MENU.Feedback.name:
      const url = "mailto://crazycodebody.gmail.com "
          Linking.canOpenURL(url).then(supported => {
          if (!supported) {
          console.log('Can\'t handle url: ' + url);
          } else {
          return Linking.openURL(url);
          }
          }).catch(err => console.error('An error occurred', err));
          break;
      case MORE_MENU.Share.name:
          break;
    }
    if(TargetComponent) {
      console.log("TargetComponent", TargetComponent)
      this.props.navigation.navigate(TargetComponent, params)
    }
  }
  getItem(tag, text){
    return ViewUtils.getSettingItem(() => this.onClick(tag.name), tag.icon, tag.name)
  }


  render(){
    const content = <View>
      {this.getItem(MORE_MENU.Website)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.About_Author)}
      <View style={GlobalStyles.line}/>
      {this.getItem(MORE_MENU.Feedback)}
      <View style={GlobalStyles.line}/>
    </View>
    return this.AboutCommon.render(content, {
      'name': 'GitHub Popular',
      'description': '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
      'avatar':"http://avatar.csdn.net/1/1/E/1_fengyuzhengfan.jpg",
      'backgroundImg': "http://www.devio.org/io/GitHubPopular/img/for_githubpopular_about_me.jpg",
    })
  }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },

});

/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  Linking,
  Clipboard
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import ViewUtils from "../../utils/ViewUtils"
import {MORE_MENU} from "../../common/MoreMenu"
import GlobalStyles from "../../../res/styles/GlobalStyles"
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon"
import config from "../../../res/data/config.json"
const FLAG = {
    REPOSITORY: '开源项目',
    BLOG: {
        name: '技术博客',
        items: {
            PERSONAL_BLOG: {
                title: '个人博客',
                url: 'http://jiapenghui.com',
            },
            CSDN: {
                title: 'CSDN',
                url: 'http://blog.csdn.net/fengyuzhengfan',
            },
            JIANSHU: {
                title: '简书',
                url: 'http://www.jianshu.com/users/ca3943a4172a/latest_articles',
            },
            GITHUB: {
                title: 'GitHub',
                url: 'https://github.com/crazycodeboy',
            },
        }
    },
    CONTACT: {
        name: '联系方式',
        items: {
            QQ: {
                title: 'QQ',
                account: '1586866509',
            },
            Email: {
                title: 'Email',
                account: 'crazycodeboy@gmail.com',
            },
        }
    },
    QQ: {
        name: '技术交流群',
        items: {
            MD: {
                title: '移动开发者技术分享群',
                account: '335939197',
            },
            RN: {
                title: 'React Native学习交流群',
                account: '165774887',
            }
        },
    },
}

export default class AboutMePage extends Component {
  constructor(props) {
    super(props)
    this.aboutCommon = new AboutCommon(props, (dic) => this.updateState(dic), FLAG_ABOUT.flag_about_me, config)
    this.state = {
      projectModels: [],
      author: config.author,
      showRepository: false,
      showBlog: false,
      showQQ: false,
      showContact: false
    }
  }
  componentDidMount(){
    this.aboutCommon.componentDidMount()
  }
  //获取item右侧图标
  onClickIcon(isShow){
    return isShow ? require("../../../res/images/ic_tiaozhuan_up.png") : require("../../../res/images/ic_tiaozhuan_down.png")
  }
  updateState(dic){
    this.setState(dic)
  }
  onClick(name){
    let TargetComponent,
        params = {...this.props, menuType: name}
    switch(name) {
      case FLAG.BLOG.items.PERSONAL_BLOG:
      case FLAG.BLOG.items.CSDN:
      case FLAG.BLOG.items.JIANSHU:
      case FLAG.BLOG.items.GITHUB:
          TargetComponent = "WebViewPage"
          params.url = name.url
          params.title = name.title
          break;
      case FLAG.REPOSITORY:
          this.setState({showRepository: !this.state.showRepository})
          break;
      case FLAG.BLOG:
          this.setState({showBlog: !this.state.showBlog})
          break;
      case FLAG.CONTACT:
          this.setState({showContact: !this.state.showContact})
          break;
      case FLAG.QQ:
          this.setState({showQQ: !this.state.showQQ})
      case FLAG.CONTACT.items.Email:
          const url = "mailto://" + name.account
          Linking.canOpenURL(url).then(supported => {
          if (!supported) {
          console.log('Can\'t handle url: ' + url);
          } else {
          return Linking.openURL(url);
          }
          }).catch(err => console.error('An error occurred', err));
          break;
      case FLAG.CONTACT.items.QQ:
          Clipboard.setString(name.account)
          this.toast.show("QQ:" + name.account + "已复制到剪切板")
          break;

      case FLAG.QQ.items.MD:
      case FLAG.QQ.items.RN:
          Clipboard.setString(name.account)
          this.toast.show("群号:" + name.account + "已复制到剪切板")
          break;
    }
    if(TargetComponent) {
      this.props.navigation.navigate(TargetComponent, params)
    }
  }


  renderItems(dic, isShowAccount){

    if(!dic) return null;
    const views = []
    for(let i in dic) {
      let title = isShowAccount ? dic[i].title + ":" + dic[i].account : dic[i].title
      views.push(
        <View key={i}>
          {ViewUtils.getSettingItem(() => this.onClick(dic[i]), null,title, {tintColor: '#2196F3'})}
          <View style={GlobalStyles.line}/>
        </View>
      )
    }
    return views
  }
  render(){
    const content = <View>
      {ViewUtils.getSettingItem(() => this.onClick(FLAG.BLOG), require('../../../res/images/ic_computer.png'), FLAG.BLOG.name, {tintColor: '#2196F3'}, this.onClickIcon(this.state.showBlog))}
      <View style={GlobalStyles.line}/>
      {
        this.state.showBlog ? this.renderItems(FLAG.BLOG.items) : null
      }
      {ViewUtils.getSettingItem(() => this.onClick(FLAG.REPOSITORY), require('../../../res/images/ic_code.png'), FLAG.REPOSITORY, {tintColor: '#2196F3'}, this.onClickIcon(this.state.showBlog))}
      <View style={GlobalStyles.line}/>
      {
        this.state.showRepository ? this.aboutCommon.renderRepository(this.state.projectModels) : null
      }
      {ViewUtils.getSettingItem(() => this.onClick(FLAG.QQ), require('../../../res/images/ic_computer.png'), FLAG.QQ.name, {tintColor: '#2196F3'}, this.onClickIcon(this.state.showBlog))}
      <View style={GlobalStyles.line}/>
      {
        this.state.showQQ ? this.renderItems(FLAG.QQ.items, true) : null
      }
      {ViewUtils.getSettingItem(() => this.onClick(FLAG.CONTACT), require('../../../res/images/ic_contacts.png'), FLAG.CONTACT.name, {tintColor: '#2196F3'}, this.onClickIcon(this.state.showBlog))}
      <View style={GlobalStyles.line}/>
      {
        this.state.showContact ? this.renderItems(FLAG.CONTACT.items, true) : null
      }

    </View>

    return (
      <View style={styles.container}>
        {this.aboutCommon.render(content, {
          'name': 'GitHub Popular',
          'description': '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
          'avatar': this.state.author.avatar1,
          'backgroundImg': this.state.author.backgroundImg1,
        })}
        <Toast ref={(toast) => this.toast = toast}/>
      </View>
    )
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
  },

});

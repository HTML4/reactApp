/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  TouchableHighlight,
  Image
} from 'react-native';
import NavigationBar from "../../common/NavigationBar"
import LanguageDao, {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao"
import {MORE_MENU} from "../../common/MoreMenu"
import GlobalStyles from "../../../res/styles/GlobalStyles"
import ViewUtils from "../../utils/ViewUtils"
export default class MyPage extends Component {
  onClick(name){
    let TargetComponent,
        params = {...this.props, menuType: name}
    switch(name) {
      case MORE_MENU.Custom_Language.name:
          TargetComponent = "CustomKeyPage"
          params.flag = FLAG_LANGUAGE.flag_language
          break;
      case MORE_MENU.Custom_Key.name:
          TargetComponent = "CustomKeyPage"
          params.flag = FLAG_LANGUAGE.flag_key
          break;
      case MORE_MENU.Remove_Key.name:
          TargetComponent = "CustomKeyPage"
          params.flag = FLAG_LANGUAGE.flag_key
          params.isRemoveKey = true
          break;
      case MORE_MENU.Sort_Key.name:
          TargetComponent = "SortKeyPage"
          params.flag = FLAG_LANGUAGE.flag_key
          break;
      case MORE_MENU.Sort_Language.name:
          TargetComponent = "SortKeyPage"
          params.flag = FLAG_LANGUAGE.flag_language
          break;
      case MORE_MENU.Custom_Theme.name:
          break;
      case MORE_MENU.About_Author.name:
          TargetComponent = "AboutMePage"
          break;
      case MORE_MENU.About.name:
          TargetComponent = "AboutPage"
          break;
    }

    if(TargetComponent) {
      this.props.navigation.navigate(TargetComponent, params)
    }
  }
  getItem(tag){
    return ViewUtils.getSettingItem(() => this.onClick(tag.name), tag.icon, tag.name)
  }
  render() {
    return (
      <View style={GlobalStyles.root_container}>
        <NavigationBar
          title="我的"/>
        <ScrollView>
          <TouchableHighlight onPress={() => this.onClick(MORE_MENU.About.name)}>
            <View style={[styles.item, {height: 90}]}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <Image style={[{width: 40, height: 40, marginRight: 10}, {tintColor: '#2196F3'}]} source={require("../../../res/images/ic_trending.png")}/>
                <Text>text</Text>
              </View>
              <Image style={[{width: 22, height: 22, marginRight: 10}, {tintColor: '#2196F3'}]} source={require("../../../res/images/ic_tiaozhuan.png")}/>
            </View>
          </TouchableHighlight>
          <View style={GlobalStyles.line}/>
          {/*趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*语言排序*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*标签排序*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*标签移除*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.Custom_Theme)}
          {/*关于作者*/}
          <View style={GlobalStyles.line}/>
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line}/>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    height: 60,
    backgroundColor: "white"
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,

  }
});

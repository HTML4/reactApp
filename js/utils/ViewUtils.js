/* @flow */

import React, { Component } from 'react';
import {
  TouchableOpacity,
  Image,
  TouchableHighlight,
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class ViewUtils {
  static getLeftButton(callBack){
    return (
      <TouchableOpacity
        style={{padding: 8}}
        onPress={callBack}>
        <Image style={{width: 22, height: 22, tintColor: "white"}} source={require("../../res/images/ic_arrow_back_white_36pt.png")}/>
      </TouchableOpacity>
    )
  }
  //expandableIcon 右侧图标
  static getSettingItem(callBack, icon, text, tintColor, expandableIcon){
    return (
      <TouchableHighlight onPress={callBack}>
        <View style={styles.setting_item_container}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Image resizeMode="stretch" style={[{width: 16, height: 16, marginRight: 10}, tintColor || {tintColor: '#2196F3'}]} source={icon}/>
            <Text>{text}</Text>
          </View>
          <Image
            style={[{width: 22, height: 22, marginRight: 10}, tintColor || {tintColor: '#2196F3'}]}
            source={expandableIcon ? expandableIcon : require("../../res/images/ic_tiaozhuan.png")}/>
        </View>
      </TouchableHighlight>
    )
  }
}
const styles = StyleSheet.create({
  setting_item_container: {
    backgroundColor: 'white',
    padding: 10, height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
});

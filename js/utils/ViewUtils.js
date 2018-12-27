/* @flow */

import React, { Component } from 'react';
import {
  TouchableOpacity,
  Image
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

}

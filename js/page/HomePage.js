/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  DeviceEventEmitter
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import NavigationBar from "../common/NavigationBar"
import PopularPage from "./PopularPage"
export const ACTION_HOME = {A_SHOW_TOAST: "showToast", A_RESTART: "restart"}
export const FLAG_TAB = {
  flag_popularTab: 'tb_popular',
  flag_trendingTab: 'tb_trending',
  flag_favoriteTab: 'tb_favorite',
  flag_my: 'tb_my'
}
export default class HomePage extends Component {
  constructor(props) {
    super(props)
    let selectedTab = this.props.selectedTab ? this.props.selectedTab : "tb_popular"
    this.state = {
      selectedTab: selectedTab
    }
  }
  componentDidMount(){
    this.listener = DeviceEventEmitter.addListener("ACTION_HOME", (action, params) => {
      console.log("action, params", action, params)
      this.onAction(action, params)
    })
  }
  componentWillUnmount(){
    this.listener && this.listener.remove()
  }
  onAction(action, params){
    if(action === ACTION_HOME.A_RESTART) {
      this.onRestart()
    } else if(action === ACTION_HOME.A_SHOW_TOAST) {
      this.toast.show(params.text, DURATION.LENGTH_LONG)
    }
  }
  //重启首页 jumpToTab 默认显示的页面
  onRestart(jumpToTab){
    this.props.navigation.replace("HomePage", {
      ...this.props,
      selectedTab: jumpToTab
    })
  }
  render() {
    const {navigation} = this.props
    return (
      <View style={styles.container}>
        <PopularPage navigation={this.props.navigation}/>
        <Toast ref={(toast) => this.toast = toast}/>
      </View>
    );
  }
}
//navigation.navigate("tabNav")
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

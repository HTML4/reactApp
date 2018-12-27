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
export default class HomePage extends Component {
  componentDidMount(){
    this.listener = DeviceEventEmitter.addListener("showToast", (text) => {
      this.toast.show(text, DURATION.LENGTH_LONG)
    })
  }
  componentWillUnmount(){
    this.listener && this.listener.remove()
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

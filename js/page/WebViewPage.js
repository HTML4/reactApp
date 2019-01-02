/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  WebView
} from 'react-native';
import GlobalStyles from "../../res/styles/GlobalStyles"
import NavigationBar from "../common/NavigationBar"
import ViewUtils from "../utils/ViewUtils"

export default class WebViewPage extends Component {
  constructor(props){
    super(props)
    const {url, title} = props.navigation.state.params

    this.state = {
      url: url,
      canGoBack: false,
      title: title
    }
  }
  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack,
      url: e.url
    })
  }
  onBackPress(){
    if(this.state.canGoBack) {
      this.webView.goBack()
    } else {
      this.props.navigation.goBack()
    }
  }
  render() {
    return (
      <View style={GlobalStyles.root_container}>
        <NavigationBar
          title={this.state.title}
          leftButton={ViewUtils.getLeftButton(() => this.onBackPress())}/>
        <WebView
          ref={e => this.webView = e}
          source={{uri: this.state.url}}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}/>
      </View>
    );
  }
}

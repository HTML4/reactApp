/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  WebView
} from 'react-native';
import NavigationBar from "../common/NavigationBar"
import ViewUtils from "../utils/ViewUtils"

const TRENDING_URL = 'https://github.com/'

export default class RepositoryDetail extends Component {
  constructor(props) {
    super(props)
    const {html_url, full_name, fullName} = props.navigation.state.params.item
    this.state = {
      url: html_url || TRENDING_URL + fullName,
      title: full_name || fullName,
      canGoBack: false
    }
  }
  onNavigationStateChange(e) {
    this.setState({
      canGoBack: e.canGoBack,
      url: e.url
    })
  }
  onBack(){
    if(this.state.canGoBack) {
      this.webView.goBack()
    } else {
      this.props.navigation.goBack()
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={this.state.title}
          leftButton={ViewUtils.getLeftButton(() => this.onBack())}/>
        <WebView
          ref={e => this.webView = e}
          source={{uri: this.state.url}}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

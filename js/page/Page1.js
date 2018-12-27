/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button
} from 'react-native';

export default class Page1 extends Component {
  render() {
    const {navigation} = this.props
    return (
      <View style={styles.container}>
        <Text>I'm the Page1 component</Text>
        <Button
          title="go back"
          onPress={() => {
            navigation.goBack()
          }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

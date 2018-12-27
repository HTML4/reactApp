/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button
} from 'react-native';
import NavigationBar from "../../common/NavigationBar"
import LanguageDao, {FLAG_LANGUAGE} from "../../expand/dao/LanguageDao"
export default class MyPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title="我的"/>
        <Button title="自定义标签" onPress={() => this.props.navigation.navigate("CustomKeyPage", {
          flag: FLAG_LANGUAGE.flag_key
          })}/>
        <Button title="标签排序" onPress={() => this.props.navigation.navigate("SortKeyPage", {
          flag: FLAG_LANGUAGE.flag_key
          })}/>
        <Button title="移除标签" onPress={() => this.props.navigation.navigate("CustomKeyPage", {
          isRemoveKey: true
        })}/>
        <Button title="自定义语言" onPress={() => this.props.navigation.navigate("CustomKeyPage", {
          flag: FLAG_LANGUAGE.flag_language
        })}/>
        <Button title="语言排序" onPress={() => this.props.navigation.navigate("SortKeyPage", {
          flag: FLAG_LANGUAGE.flag_language
          })}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

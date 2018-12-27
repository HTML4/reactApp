/* @flow */

import React, {Component} from 'react';

import {
    StyleSheet,
    Platform,
    DeviceInfo,
    Image,
    StatusBar,
    Text,
    View,
    ViewPropTypes
} from 'react-native'
import PropTypes from 'prop-types';
const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 0 : 20;
const StatusBarShape = {
    barStyle: PropTypes.oneOf(['light-content', 'default']),
    hidden: PropTypes.bool,
    backgroundColor: PropTypes.string,
};

export default class NavigationBar extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle:ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton:  PropTypes.element,
    leftButton: PropTypes.element
  }
  static defaultProps = {
    statusBar: {
      barStyle: 'light-content',
      hidden: false,
    },
  }
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      hide: false
    };
  }
  getButtonElement(data) {
    return (
      <View style={styles.navBarButton}>
        {data? data : null}
      </View>
    );
  }
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {
          !this.props.statusBar.hidden ? (
            <View style={styles.statusBar}>
              <StatusBar {...this.props.statusBar} />
            </View>
          ) : null
        }

        {
          this.props.hide ? null : (
            <View style={styles.navBar}>
              {this.getButtonElement(this.props.leftButton)}
              <View style={[styles.navBarTitleContainer,this.props.titleLayoutStyle]}>
                {
                  this.props.titleView ? this.props.titleView : (
                    <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{this.props.title}</Text>
                  )
                }
              </View>
              {this.getButtonElement(this.props.rightButton)}
            </View>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2196F3',
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    },
    navBarTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 40,
        top: 0,
        right: 40,
        bottom: 0,
    },
    title: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    navBarButton: {
        alignItems: 'center',
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT:0,

    },
})

import {StackNavigator, TabNavigator} from 'react-navigation'
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons'
import HomePage from '../page/HomePage'
import TrendingPage from '../page/TrendingPage'
import MyPage from '../page/my/MyPage'
import CustomKeyPage from '../page/my/CustomKeyPage'
import SortKeyPage from '../page/my/SortKeyPage'
import RepositoryDetail from '../page/RepositoryDetail'

export const AppTabNavigator = TabNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      tabBarLabel: "HomePage",
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons
          name={focused ? "ios-home" : "ios-home-outline"}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  TrendingPage: {
    screen: TrendingPage,
    navigationOptions: {
      tabBarLabel: "趋势",
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons
          name={focused ? "ios-home" : "ios-home-outline"}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: "我的",
      tabBarIcon: ({tintColor, focused}) => (
        <Ionicons
          name={focused ? "ios-person" : "ios-person-outline"}
          size={26}
          style={{color: tintColor}}
        />
      )
    }
  },

})
export const AppStackNavigator = StackNavigator({
  Index: {
    screen: AppTabNavigator,
  },
  HomePage: {
    screen: HomePage
  },
  MyPage: {
    screen: MyPage
  },
  CustomKeyPage: {
    screen: CustomKeyPage
  },
  SortKeyPage: {
    screen: SortKeyPage
  },
  RepositoryDetail: {
    screen: RepositoryDetail
  },
}, {
    navigationOptions: {
        header: null
    }
})
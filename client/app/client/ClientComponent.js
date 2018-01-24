import React from 'react';
import { StyleSheet, Text, View, NetInfo } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Trips from "./Trips";

export default class ClientComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: "home",
      connectionType: null
    }
  }
  
  componentDidMount() {
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
      this.setState({connectionType: connectionInfo.type})
    });
    
    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }
  
  handleFirstConnectivityChange = (connectionInfo) => {
    console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    this.setState({connectionType: connectionInfo.type})
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    );
  }

  renderOnline = () => {
    return (
      <TabNavigator style={styles.container}>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'home'}
          title="Home"
          onPress={() => this.setState({ selectedTab: 'home' })}>
          <Trips/>
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'profile'}
          title="Profile"
          onPress={() => this.setState({ selectedTab: 'profile' })}>
          <Text>text</Text>
        </TabNavigator.Item>
      </TabNavigator>
    )
  }
  
  renderOffline = () => {
    return (
      <View><Text>OFFLINE</Text></View>
    )
  }
  render() {
    const {connectionType} = this.state
    if(connectionType === "wifi"){
      return this.renderOnline()
    } else {
      return this.renderOffline()
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

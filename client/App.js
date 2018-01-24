import React from 'react';
import { StyleSheet, View, NavigatorIOS, Button, NetInfo } from 'react-native';
import EmployeeComponent from "./app/employee/EmployeeComponent";
import ClientComponent from "./app/client/ClientComponent";

export default class App extends React.Component {
  constructor(){
    super()
    this.state = {
      user: null,
    }
  }
  
  goTo = (user) => {
    this.setState({user})
  }
  
  render() {
    console.disableYellowBox = true
    const {user} = this.state
    if(user === "employee") {
      return (
        <NavigatorIOS
          style={styles.container}
          initialRoute={{
            title: 'Employee',
            component: EmployeeComponent
          }}/>
      )
    } else if(user === "client") {
      return (
        <NavigatorIOS
          style={styles.container}
          initialRoute={{
            title: 'Client',
            component: ClientComponent
          }}/>
      )
    } else {
      return (
        <View style={styles.container}>
          <Button onPress={() => this.goTo("client")} title="Client" />
          <Button onPress={() => this.goTo("employee")} title="Employee" />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginBottom:90,
    flexDirection: 'column',
    justifyContent: 'center',
  }
});

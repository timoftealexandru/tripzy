import React from 'react';
import { ListView, StyleSheet, Text, TouchableHighlight, View, AsyncStorage } from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'

export default class Trips extends React.Component {
  constructor(props){
    super(props)
    const items = []
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      dataSource: this.ds.cloneWithRows(items),
      connectionType: props.connectionType || null,
    }
    
    this.ws = new WebSocket('http://192.168.100.7:3200/trips');
  }
  
  async componentDidMount() {
    if(this.state.connectionType !== "wifi") {
      console.log("OFFLINE")
      await this.fillWithDataOffline()
    } else {
      console.log("ONLINE")
      this.registerSockets()
      await this.fillWithDataOnline()
    }
  }
  
  fillWithDataOffline = async () => {
    try {
      const value = await AsyncStorage.getItem('booked');
      if (value !== null && JSON.parse(value).id) {
        console.log("FOUND:", JSON.parse(value))
        this.setState({
          dataSource: this.ds.cloneWithRows([JSON.parse(value)])
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  fillWithDataOnline = async () => {
    try {
      const value = await AsyncStorage.getItem('booked');
      if (value !== null && JSON.parse(value).id){
        console.log("FOUND:", JSON.parse(value))
        this.setState({
          dataSource: this.ds.cloneWithRows([JSON.parse(value)])
        })
      } else {
        await AsyncStorage.removeItem('booked');
        fetch('http://192.168.100.7:3200/trips')
          .then((data) => {
            this.setState({
              dataSource: this.ds.cloneWithRows(JSON.parse(data._bodyText))
            })
          }).catch((error) => {
          console.log("Request failed", error)
          this.setState({error})
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  registerSockets = () => {
    this.ws.onopen = () => {
      console.log("WS CONNECTED")
    };
    this.ws.onmessage = (e) => {
      console.log("WS::RECEIVED DATA", e.data);
      let ds = this.state.dataSource._dataBlob.s1.slice(0)
      ds.push(JSON.parse(e.data))
      this.setState({dataSource: this.ds.cloneWithRows(ds)})
    };
    this.ws.onerror = (e) => {
      console.log("WS::ERROR:",e.message);
    };
    this.ws.onclose = (e) => {
      console.log("WS::CLOSE:",e.code, e.reason);
    };
  }
  
  showToast = (msg) => {
    this.refs.toast.show(msg, 500);
  }
  
  onBook = (id) => {
    console.log("ID",id ,JSON.stringify({id: id}) )
    
    return fetch('http://192.168.100.7:3200/book', {
      method: 'post',
      body: JSON.stringify({id: id}),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => res.json())
      .then(async (data)=>{
        console.log("RES",data)
        this.showToast("The trip was succesfully booked")
        try {
          const res = await AsyncStorage.setItem('booked', JSON.stringify(data));
          console.log("saved", res)
          await this.fillWithDataOnline()
        } catch (error) {
          this.showToast(error)
        }
      }).catch(error => {
        console.log("ERR", error)
        this.showToast(error)
      })
  }
  
  onCancelBook = (id) => {
    return fetch(`http://192.168.100.7:3200/cancel/${id}`, {
      method: 'delete',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => res.json())
      .then(async (data)=>{
        console.log("RES",data)
        this.showToast("The booking was succesfully canceled")
        try {
          const res = await AsyncStorage.removeItem('booked');
          console.log("removed", res)
          this.fillWithDataOnline()
        } catch (error) {
          this.showToast(error)
        }
      }).catch(error => {
        console.log("ERR", error)
        this.showToast(error)
      })
  }
  
  renderRow = (item) => {
    //<Row note={note} onDelete={this.handleDelete} onEdit={this.handleEdit}/>
    const {connectionType} = this.state
    let button = null
    if(item.status === "Unavailable" && connectionType === 'wifi') {
      button = <TouchableHighlight
        style={styles.bookButton}
        onPress={() => this.onCancelBook(item.id)}
        underlayColor="#88D4F5">
        <Text style={styles.buttonText}> Cancel </Text>
      </TouchableHighlight>
    } else if(connectionType === 'wifi') {
      button = <TouchableHighlight
        style={styles.bookButton}
        onPress={() => this.onBook(item.id)}
        underlayColor="#88D4F5">
        <Text style={styles.buttonText}> Book </Text>
      </TouchableHighlight>
    }
    
    console.log("ITEM:", item)
    return (
      <View>
        <View style={styles.editContainer}>
          <Text>Name:{item.name} | Type:{item.type} | Rooms:{item.rooms}</Text>
          {button}
        </View>
        <View style={styles.separator} />
      </View>
      
    )
  }
  
  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderHeader={() => <Text>Trips</Text> }
          enableEmpySections={true}/>
        <Toast ref="toast" position="top" style={{backgroundColor:'blue'}}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    marginTop:90
  },
  separator:{
    height: 1,
    backgroundColor: 'black',
    flex: 1,
    marginLeft: 15
  },
  bookButton: {
    height: 60,
    backgroundColor: '#48BBEC',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white'
  },
  rowContainer: {
    padding: 10
  },
})
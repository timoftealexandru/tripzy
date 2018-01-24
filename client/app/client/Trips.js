import React from 'react';
import { ListView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export default class Trips extends React.Component {
  constructor(props){
    super(props)
    const items = []
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      dataSource: this.ds.cloneWithRows(items),
    }
    
    this.ws = new WebSocket('http://192.168.100.7:3200/trips');
  }
  
  componentDidMount() {
    this.registerSockets()
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
  
  onBook = (id) => {
    
    const payload = {id: id}
    console.log("ID",id, JSON.stringify(payload))
    // const data = new FormData()
    // data.append("json", JSON.stringify(payload))
    return fetch('http://192.168.100.7:3200/book', {
      method: 'post',
      body: JSON.stringify(payload)
    }).then(res => res.json())
      .then(data=>{
        console.log("RES",data)
      }).catch(error => {
        console.log("ERR", error)
      })
  }
  
  renderRow = (item) => {
    //<Row note={note} onDelete={this.handleDelete} onEdit={this.handleEdit}/>
    return (
      <View>
        <View style={styles.editContainer}>
          <Text>Name:{item.name} | Type:{item.type} | Rooms:{item.rooms}</Text>
          <TouchableHighlight
            style={styles.bookButton}
            onPress={() => this.onBook(item.id)}
            underlayColor="#88D4F5">
            <Text style={styles.buttonText}> Book </Text>
          </TouchableHighlight>
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
    backgroundColor: '#E4E4E4',
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
});


// mapData = (data) => {
//   console.log("DAta", data)
//   return data
//     ?data.map(item =>{
//       const {name, rooms, type, id } = item
//       console.log("IETM",item , name, rooms, type, id)
//       return { name, rooms, type, id }
//     })
//     :null
// }

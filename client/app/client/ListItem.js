import React, {Component} from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from 'react-native'

const styles = StyleSheet.create({
  editContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  buttonText: {
    fontSize: 18,
    color: 'white'
  },
  saveButton: {
    height: 60,
    backgroundColor: '#48BBEC',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    height: 60,
    backgroundColor: '#48BBEC',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    height: 60,
    width:60,
    backgroundColor: '#ff0000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  editInput: {
    height: 60,
    padding: 10,
    fontSize: 18,
    color: '#111',
    flex: 10
  },
  rowContainer: {
    padding: 10
  },
  
});

export default class Row extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.note.id,
      text: props.note.text,
      editedText: '',
      error: '',
      editingNote: null
    };
  }
  componentWillReceiveProps (nextProps) {
    const { id, text } = nextProps.note
    this.setState({id, text})
  }
  
  handleOnPress = (id,text) => {
    this.setState({ editingNote:id, editedText:text })
  }
  
  handleSave = () => {
    const { editedText, editingNote} = this.state
    const { onEdit } = this.props
    if (onEdit) {
      onEdit(editedText, editingNote)
    }
    this.setState({ editingNote:null,text: editedText, editedText:''  })
  }
  
  render() {
    const { id, text, editedText } = this.state
    const { onDelete } = this.props
    return (
      <View>
        <View style={styles.rowContainer}>
          {this.state.editingNote !== null && this.state.editingNote === id
            ?	<View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={editedText}
                onChangeText={(editedText) => this.setState({editedText})}
              />
              <TouchableHighlight
                style={styles.saveButton}
                onPress={this.handleSave}
                underlayColor="#88D4F5"
              >
                <Text style={styles.buttonText}> Save </Text>
              </TouchableHighlight>
            </View>
            :<View style={styles.editContainer}>
              <TouchableHighlight
                style={styles.button}
                onPress={()=>this.handleOnPress(id,text)}
                underlayColor="#88D4F5"
              >
                <Text style={styles.buttonText}> {text} </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.deleteButton}
                onPress={() => onDelete(id)}
                underlayColor="#88D4F5"
              >
                <Text style={styles.buttonText}> X </Text>
              </TouchableHighlight>
            </View>
          }
        </View>
        {/*<Separator/>*/}
      </View>
    )
  }
}
import React, {Component} from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableWithoutFeedback, Image, Dimensions} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput, Button  } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
const {width,height} = Dimensions.get('window');
export default class BookingScreen extends Component{
    
    state = {
        date: new Date(),
        stringDate:new Date().toString(),
        mode: 'date',
        show: false,
        text:'Okay',
        nights:'1',
        rooms:[
            {
                'id':1,
                'label':'Executive Suite',
                'ammount':188
            },
            {
                'id':2,
                'label':'Deluxe Room',
                'ammount':88
            },
        ],
        cart:{
            1:0,
            2:0
        },
        room_stocks:{
            1:1,
            2:2,
        }
    };


    setDate = (event, date) => {
        date = date || this.state.date;
        console.log(date);
        this.setState({
          show: Platform.OS === 'ios' ? true : false,
          date,
          stringDate:date.toString()
        });
    }

    show = mode => {
        this.setState({
            show: true,
            mode,
        });
    }

    datepicker = () => {
        this.show('date');
    }

    renderRooms = () => {

        let rooms = [];

        this.state.rooms.forEach(room => {
            rooms.push(
                <View style={{flexDirection:'row',height:height*0.1,marginTop:5}}>
                    <View style={{flex:1}}>
                        <Image source={{uri:'https://d1nabgopwop1kh.cloudfront.net/hotel-asset/30000002000493661_dm_10'}} resizeMode={'cover'} style={{borderRadius:5,flex:1,height:'100%'}} />
                    </View>
                    <View style={{flex:2,flexDirection:'column',marginHorizontal:5}}>
                        <Text>{room.label}</Text>
                        <Text>${room.ammount}/night</Text>
                    </View>
                    <View style={{position:'absolute',right:10}}>
                        <Text onPress={()=>this.add_cart(room.id)}>Add to Chart</Text>
                    </View>
                </View>
            );
        });

        return rooms;
    
    }


    add_cart = (id) =>{
        var {cart} = this.state;
        cart[id]++;
        this.setState({cart:cart});
        console.log(this.state.cart);
    }

    render(){
        const { show, date, mode, rooms,cart,stringDate,nights } = this.state;

        return(
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.formBox}>
                    { show && 
                    <DateTimePicker 
                        value={date}
                        mode={mode}
                        is24Hour={false}
                        display="default"
                        onChange={this.setDate} />
                    }
                    <TextInput
                        label='Booking Date'
                        value={this.state.stringDate}
                        onFocus={this.datepicker}
                        style={styles.input}
                    />
                    
                    <TextInput
                        keyboardType={'numeric'}
                        label='Night(s)'
                        value={this.state.nights}
                        onChangeText={text => this.setState({ nights:text })}
                        style={styles.input}
                    />
                    <Button mode="contained" onPress={() => console.log('Pressed')}>
                        Find Available Rooms
                    </Button>

                </View>

                <View style={styles.formBox}>
                    <Text>Rooms</Text>
                    {
                        rooms.length < 1 &&
                        <Text style={{alignSelf:'center',justifyContent:'center'}}>No Rooms Available Sorry!</Text> 
                    }
                    {
                        rooms.length > 0 &&
                        <React.Fragment>
                            {this.renderRooms()}
                            <Button mode="contained" onPress={() => this.props.navigation.navigate('Payment',{rooms:rooms,cart:cart,booking_date:stringDate,nights:nights})} style={{marginTop:10}}>
                                Save Booking ({(cart[1]+cart[2])} rooms)
                            </Button>
                        </React.Fragment>
                        
                    }
                </View>

            </SafeAreaView>
        );
    }


}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#ededed'
    },
    formBox:{
        marginHorizontal:15,
        marginVertical:10,
        borderRadius:13,
        backgroundColor:'#fff',
        padding:10,
    },
    input:{
        backgroundColor:'transparent',
        marginBottom:10
    }
})
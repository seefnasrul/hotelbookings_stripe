import React from 'react';
import {View,Text, SafeAreaView, StyleSheet,Dimensions, Image,ScrollView} from 'react-native';
import { TextInput, Button  } from 'react-native-paper';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import axios from 'axios';
import querystring from 'querystring';
const publishKey = 'pk_test_wugkiHicsDcjb5Raj3i8y70200FE9PgY4W';

const {width,height} = Dimensions.get('window');
const stripeAuthHeader = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Bearer sk_test_hqr6IZIVlJhLt6r2w3EYIis300aowqtT4e`
};
export default class PaymentScreen extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            total_ammount:0,
            nights:this.props.navigation.state.params.nights,
            booking_date:this.props.navigation.state.params.booking_date,
            cart:this.props.navigation.state.params.cart,
            rooms:this.props.navigation.state.params.rooms,
            number: '4242 4242 4242 4242',
            expMonth: '',
            expYear: '',
            cvc: '',
            currency: 'usd',
        };
    
        this.stripe = null;
    
    }
    
    componentDidMount = () =>{
        
        
        const {rooms,cart,nights} = this.state;
        console.log([rooms,cart]);
        var ammount  = 0;
        for (let index = 0; index < rooms.length; index++) {
            const element = rooms[index];
            ammount += (element.ammount*cart[element.id])*nights;
        }

        this.setState({total_ammount:ammount},()=>console.log(this.state.total_ammount));

        Stripe.setOptionsAsync({
            publishableKey:publishKey , // Your key
        });
    }


    get_card_token = async () =>{
        var params = {
            number: this.state.number,
            expMonth: parseInt(this.state.expMonth),
            expYear: parseInt(this.state.expYear),
            cvc: this.state.cvc,
            currency: this.state.currency,
        }
        var token = await Stripe.createTokenWithCardAsync(params);
       console.log(token);

        

        let data = {
            amount:this.state.total_ammount, 
            currency:'usd',
            source:token.tokenId, 
            description:"Booking for Hotel"
        }

        console.log(stripeAuthHeader);

        
        

        axios.post('https://api.stripe.com/v1/charges',querystring.stringify(data),{ headers: stripeAuthHeader })
        .then((response)=>{
            alert(response.data.status);
                console.log(response.data);
        })
        .catch((error)=>{
            alert(response.data.status);
                console.log(error.response.data);
        });

    }


    renderRooms = () => {

        let rooms = [];

        this.state.rooms.forEach(room => {
            if(this.state.cart[room.id]>0){
                rooms.push(
                    <View style={{flexDirection:'row',height:height*0.1,marginTop:5}}>
                        <View style={{flex:1}}>
                            <Image source={{uri:'https://d1nabgopwop1kh.cloudfront.net/hotel-asset/30000002000493661_dm_10'}} resizeMode={'cover'} style={{borderRadius:5,flex:1,height:'100%'}} />
                        </View>
                        <View style={{flex:2,flexDirection:'column',marginHorizontal:5}}>
                            <Text>{room.label}</Text>
                            <Text>${room.ammount}/night</Text>
                            <Text>{this.state.cart[room.id]} Rooms</Text>
                            <Text>{this.state.nights} Nights</Text>
                        </View>
                    </View>
                );
            }
            
        });

        return rooms;
    
    }


    render(){
        return(
            <ScrollView style={styles.mainContainer}>
                <View style={styles.formBox}>
                    <Text>Rooms</Text>
                    {this.renderRooms()}
                    <Text>Total Payment: {this.state.total_ammount}</Text>
                </View>
                <View style={styles.formBox}>
                    <TextInput
                        keyboardType={'numeric'}
                        label='Card Number'
                        value={this.state.number}
                        style={styles.input}
                        onChangeText={text => this.setState({ number:text })}
                    />
                    <TextInput
                        keyboardType={'numeric'}
                        label='Exp Month'
                        value={this.state.expMonth}
                        style={styles.input}
                        onChangeText={text => this.setState({ expMonth:text })}
                    />
                    <TextInput
                        keyboardType={'numeric'}
                        label='Exp Year'
                        value={this.state.expYear}
                        style={styles.input}
                        onChangeText={text => this.setState({ expYear:text })}
                    />
                    <TextInput
                        keyboardType={'numeric'}
                        label='CVC'
                        value={this.state.cvc}
                        style={styles.input}
                        onChangeText={text => this.setState({ cvc:text })}
                    />
                    <Button mode="contained" onPress={() => this.get_card_token()}>
                        Secure Booking
                    </Button>
                </View>
            </ScrollView>

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
import React from 'react';
import { FlatList, ActivityIndicator, Text, View, Linking, StyleSheet, WebView, Image, TextInput, Button, BackHandler} from 'react-native';
import { StackNavigator } from 'react-navigation';

console.disableYellowBox = true;
global.ingredients = "";
global.food = "";
var foodArray;
var recipeURL = "http://www.recipepuppy.com/api/?i=";

class FlatListItem extends React.Component{
	render() {
	   return (
		   <View style={{
			   flex: 1,
			   flexDirection:'column',
		   }}>
			   <View style={{
					   flex: 1,
					   flexDirection:'row',
					   // backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen': 'tomato'
					   backgroundColor: '#3BC2F3'
			   }}>
				   <Image
					   source={{uri: this.props.item.thumbnail}}
					   style={{width: 100, height: 100, margin: 5}}
				   >

				   </Image>
				   <View style={{
						   flex: 1,
						   flexDirection:'column',
						   height: 100
					   }}>
						   <Text style={styles.flatListItem} onPress={() => Linking.openURL(this.props.item.href.replace(/\\/,""))}>{this.props.item.title}</Text>
						   <Text style={styles.TextStyle}>{this.props.item.ingredients}</Text>
				   </View>
			   </View>
			   <View style={{
				   height: 1,
				   backgroundColor:'white'
			   }}>

			   </View>
		 </View>
	   );
	}
}
 class RecipeScreen extends React.Component {

  constructor(props){
    super(props);
    this.state ={
		isLoading: true,
		showWebPart: false,
		recipePage: ''}
  }

  componentDidMount(){
	console.log({food});
    return fetch(recipeURL)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.results,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }
  // BackHandler.addEventListener('hardwareBackPress', function() {
	//   console.log("TEST");
  // });

  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
	else if (this.state.showWebPart) {
		this.setState({showWebPart: false});
		return(
			<WebView
				source={{uri:this.state.recipePage}}
			/>
		);
	}
    return(
      // <View style={{flex: 1, paddingTop:20}}>
      //   <FlatList
      //     data={this.state.dataSource}
      //     renderItem={({item}) => <Text onPress={ e => this.setState({showWebPart:true, recipePage: Linking.openURL(item.href.replace(/\\/,""))})} >{item.title + "\n"}</Text>}
      //     keyExtractor={(item, index) => index}
      //   />
      // </View>
	  <View style={{flex: 1, marginTop: 22}}>
	  	<Text>{ingredients}</Text>
            <FlatList
                data={this.state.dataSource}
                renderItem={({item, index})=>{
                    //console.log(`Item = ${JSON.stringify(item)}, index = ${index}`);
                    return (
                    <FlatListItem item={item} index={index}>

                    </FlatListItem>);
                }}
				keyExtractor={(item, index) => index}
			>
            </FlatList>
	</View>
    );
  }
}

class SearchScreen extends React.Component{
	constructor(props) {
		super(props);
		this.state = { text: '' };
	}

	// _handleTextChange = event => {
  //   this.setState( {food: event.nativeEvent.food}).bind(this);
  //   global.ingredients = this.state.food;
  // }

  sendData = (data)=>{
	  // this._handleTextChange.bind(this);
	  this.setState({text:data}, function(){
		  foodArray = data.split(',');
		  var i;
		  	for(i = 0; i < foodArray.length; i++){
				recipeURL+= (foodArray[i]+",");
			}
          global.food = this.state.text;
    	  this.props.navigation.navigate('Recipe', {food: this.state.text});
	  });
  }

	render(){
		return (
			<View style = {styles.container}>
				<Text style={styles.otherText}>Write ingredients, separate each with comma, no spaces:</Text>
				<TextInput style={styles.nameInput} onSubmitEditing={(event) => this.sendData(event.nativeEvent.text)}/>
		   </View>
		 );
	}

}

const RootStack = StackNavigator(
  {
    Recipe: {
      screen: RecipeScreen,
    },
    Search: {
      screen: SearchScreen,
    },
},
  {
    initialRouteName: 'Search',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({

  MainContainer: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center'
  },

  TextStyle: {

	color: '#E91E63',
	fontSize: 20,

},
  flatListItem: {
        color: 'white',
		textDecorationLine: 'underline',
        padding: 10,
        fontSize: 16,
}
});

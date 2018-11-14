import React from 'react';
import { FlatList, ActivityIndicator, Text, View, Linking, StyleSheet, WebView, Image, TextInput, BackHandler} from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { Header, Body, Title, Content, Left, Icon, Right } from 'native-base'
import * as firebase from 'firebase';
import { Input } from './components/Input';
import { Button } from './components/Button';


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

class LoginScreen extends React.Component{
	constructor(props){
    super(props)
	
	this.state = {
		username: '',
		email: '',
		password: '',
		authenticating: false,
		user: null,
		error: '',
	}
  }
	onPressSignIn() {
    this.setState({
      authenticating: true,
    });
	
	const { email, password } = this.state;
	
	firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => this.setState({
        authenticating: false,
        user,
        error: '',
      }))
      .catch(() => {
        // Login was not successful
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(user => this.setState({
            authenticating: false,
            user,
            error: '',
          }))
          .catch(() => this.setState({
            authenticating: false,
            user: null,
            error: 'Authentication Failure',
          }))
      })
	}
	
	onPressLogOut() {
    firebase.auth().signOut()
      .then(() => {
        this.setState({
          email: '',
          password: '',
          authenticating: false,
          user: null,
        })
      }, error => {
        console.error('Sign Out Error', error);
      });
	}
	  renderCurrentState() {
    if (this.state.authenticating) {
      return (
        <View style={styles.form}>
          <ActivityIndicator size='large' />
        </View>
      )
    }

    if (this.state.user !== null) {
      return (
		this.props.navigation.navigate('Search', {username: this.state.email})
       // <View style={styles.form}>
       //   <Text>Logged In</Text>
       //   <Button onPress={() => this.onPressLogOut()}>Log Out</Button>
       // </View>
      )
    }

    return (
      <View style={styles.form}>
        <Input
          placeholder='Enter your email...'
          label='Email'
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <Input
          placeholder='Enter your password...'
          label='Password'
          secureTextEntry
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button onPress={() => this.onPressSignIn()}>Log In</Button>
        <Text>{this.state.error}</Text>
      </View>
    )

  }

  render() {
    return (
      <View style={styles.container1}>
        {this.renderCurrentState()}
      </View>
    );
  }
}

class LogoutScreen extends React.Component {
	constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  _handleTextChange = event => {
  this.setState( {text: event.nativeEvent.text});
  global.name = this.state.text;
};

onPressLogOut() {
  firebase.auth().signOut()
	.then(() => {
	  this.setState({
		email: '',
		password: '',
		authenticating: false,
		user: null,
	  })
	  this.props.navigation.navigate('Login')
	}, error => {
	  console.error('Sign Out Error', error);
	});
  }

render() {
   return (
      <View style = {styles.container}>
		  <Button onPress={() => this.onPressLogOut()}>Log Out</Button>
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
		this.state = { 
			text: '',
			username: this.props.navigation.state.params.username
		};
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
	  userarray = this.state.username.split('@');
	  firebase.database().ref('users/' + userarray[0]).set(
		{
			pantry: data
		}
	  )
	  
  }
  
  onPressSearch() {
     this.props.navigation.navigate('Recipe', {food: this.state.text});
}

	render(){
		return (
			<View style = {styles.container}>
				<Text style={styles.otherText}>Write ingredients, separate each with comma, no spaces:</Text>
				<TextInput style={styles.nameInput} onSubmitEditing={(event) => this.sendData(event.nativeEvent.text)}/>
				<Button onPress={() => this.onPressSearch()}>Search</Button>
		   </View>
		 );
	}

}

class PantryScreen extends React.Component{
	render(){
		return (
			<View style = {styles.container}>
				<Text> Hello </Text>
			</View>
		);
	}
}

const LoginStack = StackNavigator({
  Login: { screen: LoginScreen },
}, {
  headerMode: 'float',
  navigationOptions: {
    headerStyle: {backgroundColor: '#E73536'},
    title: 'You are not logged in',
    headerTintColor: 'white'
  }
});

const DrawerStack = DrawerNavigator({
  Search: { screen: SearchScreen },
  Recipe: { screen: RecipeScreen },
  //Home: { screen: HomeScreen},
  Pantry: { screen: PantryScreen },
  LogOut: { screen: LogoutScreen }
});

const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack }
}, {
  headerMode: 'float',
  navigationOptions: ({navigation}) => ({
    headerStyle: {backgroundColor: '#4C3E54'},
    title: 'Welcome!',
    headerTintColor: 'white',
	headerLeft: <Text style={{color: 'white'}} onPress={() => {
      if (navigation.state.index === 0) {
        navigation.navigate('DrawerOpen')
      } else {
        navigation.navigate('DrawerClose')
      }
}}>Menu</Text>
  })
});

const RootStack = StackNavigator(
{
	loginStack: { screen: LoginStack},
	drawerStack: { screen: DrawerNavigation }
},
	{
		headerMode: 'none',
		title: 'Main',
		initialRouteName: 'loginStack',
	}
);
export default class App extends React.Component {
  
  componentWillMount(){
	var config = {
		apiKey: "AIzaSyD5e9uuw6-6UqxYKS3Gf6IMxjkYQsGim9Y",
		authDomain: "chef-me-up.firebaseapp.com",
		databaseURL: "https://chef-me-up.firebaseio.com",
		projectId: "chef-me-up",
		storageBucket: "chef-me-up.appspot.com",
		messagingSenderId: "356573297289"
  };
  firebase.initializeApp(config);
  }
  
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
},
container1: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  form: {
    flex: 1
  },
  buttona: {
	  
  }
});
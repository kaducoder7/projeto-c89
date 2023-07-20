import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import StoryCard from "./StoryCard";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { FlatList } from "react-native-gesture-handler";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

let stories = require("./temp_stories.json");

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: true,
         light_theme: true,
          posts:[]
    };
  }

  FetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/user/" + firebase.auth().currentUser.uid)
      .on("/value", (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      })
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.FetchUser();
    this.FetchPosts();
  }

  FetchPosts = () => {
    firebase
      .database()
      .ref("/posts/")
      .on("/value", (snapshot) => {
        let posts = [];
        if (snapshot.val()) {
          Object.keys(snapshot.val()).forEach(function (key) {
            posts.push({
              key: key,
              value: snapshot.val()[key],
            });
          });
        }
        this.setState({posts: posts})
        this.props.setUpdateToFalse();
    },function (errorObject){
       console.log(" The reading had failed" + errorObject.code);
      })
  }

  
  renderItem = ({ item: story }) => {
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={styles.appTitleText}>App Narração de Histórias</Text>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <FlatList
              keyExtractor={this.keyExtractor}
              data={stories}
              renderItem={this.renderItem}
            />
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c",
  },
  containerLight:{
   flex:1,
   backgroundColor: "white"
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.8,
    justifyContent: "center",
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans",
  },

appTitleTextight: {
 color: "black",
 fontSize: RFValue(28)
},

  cardContainer: {
    flex: 0.85,
  },

noPosts:{
  flex: 0.85,
  justifyContent: "center",
  alignItems: "center"
},
noPostsTextLight: {
  fontSize : RfValue(20),
},
noPostsText: {
  color: "white",
  fontSize: RFValue(20),
}
});

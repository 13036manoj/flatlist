import React from 'react';
import { StyleSheet, Text, View,FlatList,ActivityIndicator } from 'react-native';
import { List, ListItem,SearchBar } from "react-native-elements";
export default class App extends React.Component {
 constructor(props){
  super(props)
  this.state = {
    loading: false,
    data: [],
    page: 1,
    seed: 1,
    error: null,
    refreshing: false,
  };
 } 
 componentDidMount(){
  this.makeRemoteRequest();
 }
 makeRemoteRequest=()=>{
  const { page, seed } = this.state;
  const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
  this.setState({ loading: true });
  fetch(url)
    .then(res => res.json())
    .then(res => {
      this.setState({
        data: page === 1 ? res.results : [...this.state.data, ...res.results],
        error: res.error || null,
        loading: false,
        refreshing: false
      });
    })
    .catch(error => {
      this.setState({ error, loading: false });
    });
 }
 renderSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "86%",
        backgroundColor: "#CED0CE",
        marginLeft: "14%"
      }}
    />
  );
}
renderHeader = () => {
  return <SearchBar placeholder="Type Here..." lightTheme round />;
}
renderFooter = () => {
  if (!this.state.loading) return null;

  return (
    <View
      style={{
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: "#CED0CE"
      }}
    >
      <ActivityIndicator animating size="large" />
    </View>
  );
};
handleRefresh=()=>{
  this.setState({
    page:1,
    refreshing:true,
    seed:this.state.seed+1
  },()=>{
    this.makeRemoteRequest();
  })
}
handleEndReach1=()=>{
  this.setState({
    page:this.state.page+1
  },
  ()=>{
    this.makeRemoteRequest();
  }
)
}

  render() {
    return (
      <List
      containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}
      >
       <FlatList
       data={this.state.data}
       renderItem={({ item }) => (
        <ListItem
            roundAvatar
            title={`${item.name.first} ${item.name.last}`}
            subtitle={item.email}
            avatar={{ uri: item.picture.thumbnail }}
            containerStyle={{ borderBottomWidth: 0 }}
          />
        )}
         keyExtractor={(item)=>item.email}
         ItemSeparatorComponent={this.renderSeparator}
         ListHeaderComponent={this.renderHeader}
         ListFooterComponent={this.renderFooter}
         refreshing={this.state.refreshing}
         onRefresh={this.handleRefresh}
         onEndReached={this.handleEndReach1}
         onEndReachedThreshold={1}
       />
      </List>
    );
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

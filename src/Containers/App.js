import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadProfiles } from '../actions/profile';
import { loadDocsIntoIndex, lunrStartSearch, loadStateIntoIndex } from '../lunr/actions';

class App extends Component {

  componentDidMount() {
    this.props.dispatch(loadProfiles())
  }

  loadDocs() {
    //this.props.dispatch(loadDocsIntoIndex([
    //  {id: "1", name: "sven" , interesses: ["Tandheelkunde", "GZZ"], city: "Utrecht", type: "Duo Praktijk"},
    //  {id: "2", name: "henk" , interesses: ["Tandheelkunde", "GZZ"], city: "Utrecht", type: "Solo Praktijk"},
    //  {id: "3", name: "rob" , interesses: ["Tandheelkunde", "GZZ"], city: "Amsterdam", type: "Praktijk"},
    //  {id: "4", name: "dave" , interesses: ["Tandheelkunde", "GZZ"], city: "Utrecht"},
    //  {id: "5", name: "hanny" , interesses: ["Tandheelkunde", "GZZ"], city: "Utrecht"},
    //  {id: "6", name: "sven" , interesses: ["Tandheelkunde", "GZZ"], city: "Utrecht"},
    //  {id: "7", name: "Svenie"}
    //]))
    this.props.dispatch(loadStateIntoIndex())
  }

  doSearch() {
    this.props.dispatch(lunrStartSearch("lol"))
  }

  handleChange(event) {
    const query = event.target.value;
    this.props.dispatch(lunrStartSearch(query))
  }

  render() {
    console.log('this.props', this.props);
    return (
        <div className="myFirsComponent">
          <h1>Hello</h1>
          <button onClick={::this.loadDocs}>Load docs</button>
          <button onClick={::this.doSearch}>Search</button>
          <input onChange={::this.handleChange} type="search"/>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {profile: state.profiles}
}

export default connect(mapStateToProps)(App)
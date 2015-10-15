import React, { Component } from 'react';
import Result from '../components/Result';
import { connect } from 'react-redux';
import { loadProfiles } from '../actions/profile';
import { loadDocsIntoIndex, lunrStartSearch, loadStateIntoIndex } from '../lunr/actions';
import _debounce from 'lodash.debounce';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      query: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChange = _debounce(this.handleChange, 300)
    this.checkWord = this.checkWord.bind(this);
    this.alterText = this.alterText.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(loadProfiles())
  }

  componentWillMount() {

  }



  loadDocs() {
    this.props.dispatch(loadDocsIntoIndex([
      {id: "1", name: "sven" , interesses: ["Tandheelkunde", "GZZ"], city: "Utrecht", type: "Duo Praktijk"},
      {id: "2", name: "henk" , interesses: ["Tandheelkunde", "Jeugdzorg", "Tandarts"], city: "Utrecht", type: "Solo Praktijk"},
      {id: "3", name: "rob" , interesses: ["Tandheelkunde", "Iets anders"], city: "Amsterdam", type: "Praktijk"},
      {id: "4", name: "dave" , interesses: ["Tandheelkunde", "Dicking"], city: "Utrecht"},
      {id: "5", name: "hanny" , interesses: ["Tandheelkunde", "GZZ"], city: "Utrecht"},
      {id: "6", name: "sven" , interesses: ["Tandheelkunde", "GZZ"], city: "Utrecht"},
      {id: "7", name: "Svenie"}
    ]))
    //this.props.dispatch(loadStateIntoIndex())
  }

  doSearch() {
    this.props.dispatch(lunrStartSearch("lol"))
  }

  handleChange(event) {
    const query = event.target.value;
    this.setState({
      query
    })

    this.props.dispatch(lunrStartSearch(query))
  }

  checkWord(_query, word) {
    return (new RegExp(`${_query}`, 'i')).test(word)
  }

  alterText(query, word) {
    var escape = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    var tagStr = '{tag}$&{tag}';
    const markTag = '**';
    const caseSensitive = false

    return word.replace(
        RegExp(escape, caseSensitive ? 'g' : 'gi'),
        tagStr.replace(/{tag}/gi, markTag)
    );
  }

  prettifyText() {
    const _query = "Ta"

    this.props.lunr.results.forEach((result) => {

      var newObj = {};
      Object.keys(result).forEach((key) => {

        if (Array.isArray(result[key])) {

          result[key].forEach((el) => {


            if (this.checkWord(_query, el)) {
              console.log('key is', key);

              /* Already an array in newObject? */
              if (Array.isArray(newObj[key])) {
                const newWord = this.alterText(_query, el);
                newObj[key] = newWord
              } else {
                console.log('EL IS', el);
                const newWord = this.alterText(_query, el);
                console.log('newWord', newWord);
                newObj[key] = newWord
              }
            }
          })
        }

        if (!Array.isArray(result[key]) && this.checkWord(_query, result[key])) {
          const newString = this.alterText(_query, result[key])

          newObj[key] = newString
        } else {
          newObj[key] = result[key]
        }
      })

      console.log('newObject', newObj);

      return newObj




    })

    return "lol"

  }

  render() {
    console.log('this.props', this.props);



    const resultNode = () => {
      return this.props.lunr.results.map((res) => {
        return <Result {...Object.assign({}, res, {query: this.state.query})} />
      })
    }


    console.log('this.props', this.props);
    return (
        <div className="myFirsComponent">
          <h1>Hello</h1>
          <button onClick={::this.loadDocs}>Load docs</button>
          <button onClick={::this.doSearch}>Search</button>
          <input onChange={this.handleChange} type="search"/>
          {::this.prettifyText()}
          {resultNode()}
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profiles,
    lunr: state.lunr
  }
}

export default connect(mapStateToProps)(App)
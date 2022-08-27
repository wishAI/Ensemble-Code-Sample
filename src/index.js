import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import MovieList from './App';
import reportWebVitals from './reportWebVitals';

const API_KEY = "5473bf65";

class MovieApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      has_result: false,
      result_error: "",
    };
    this.requestMovies = this.requestMovies.bind(this);
  }
  
  requestMovies(query) {
    let self = this;
    fetch("http://www.omdbapi.com/?apikey=" + API_KEY + "&" + query)
      .then(response => response.json())
      .then(data => {
        if (data["Search"]) {
          let movies = data["Search"].map(movie => {
            movie["poster"] = "https://img.omdbapi.com/?apikey=5473bf65&i=" + movie.imdbID
            return movie;
          });
          self.setState({
            movies: movies,
            has_result: true,
          });
        } else {
          self.setState({
            movies: [],
            has_result: false,
            result_error: data.Error
          })
        }
      });
  }
  
  render() {
    return (
      <div style={{padding: '10px'}}>
        <SearchBar onSubmit={this.requestMovies}/>
        {this.state.has_result && <MovieList movies={this.state.movies}/>}
        {(!this.state.has_result) && <span style={{ padding: "10px" }}>{this.state.result_error}</span>}
      </div>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    let maxYear = new Date().getFullYear();
    let minYear = 1800;
    this.years = [...Array(maxYear - minYear).keys()].map((i) => {
      return { val: String(i + minYear) };
    });
    
    this.state = {
      title: "",
      year: "Any",
    }
    
    this.queryUpdate = this.queryUpdate.bind(this);
    this.titleUpdate = this.titleUpdate.bind(this);
    this.yearUpdate = this.yearUpdate.bind(this);
  }
  
  queryUpdate() {
    if (this.state.title) {
      let query = "s=" + this.state.title;
      if (this.state.year != "Any") {
        query += "&y=" + this.state.year
      }
      this.props.onSubmit(query);
    }
  }

  titleUpdate(e) {
    this.setState({
      title: e.target.value
    }, this.queryUpdate);
  }

  yearUpdate(e) {
    this.setState({
      year: e.target.value
    }, this.queryUpdate);
  }
  
  render() {
      return (
        <div style={{padding: '10px'}}>
          <input id="title_input" 
                 style={{ margin: '0px 40px 0px 0px', fontSize: '120%'}} 
                 placeholder="title" type="text" 
                 onChange={this.titleUpdate}></input> 
          <label htmlFor="year_input">Year: </label>
          <select id="year_input" 
                  style={{ margin: '0px 40px 0px 0px'}} 
                  defaultValue={{label: 1800, value: 1800}} 
                  onChange={this.yearUpdate}>
            <option key="Any" text="Any">Any</option> 
            {this.years.map(year => {
              return (<option key={year.val} text={year.val} value={year.val}>{year.val}</option>)
            })}
          </select>
          <button onClick={this.queryUpdate}>Search</button>
        </div>
      );
  }
}

class MovieList extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div style={{padding: '10px'}}>
        {this.props.movies.map(movie => {
          return (
            <div key={movie.imdbID} style={{ display: 'flex', flexDirection: 'row', padding: '10px' }}>
              <div style={{ margin: '0px 20px 0px 0px' }}>
                <img style={{width: '120px'}} src={movie.poster}></img>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '500px' }}>
                <span style={{ margin: '0px 0px 5px 0px'}}>{movie.Title}</span>
                <span style={{ fontSize: '80%', color: 'grey' }}>{movie.Year}</span>
              </div>
              <button style={{width: '30px', height: '30px'}}>→</button>
            </div>
          );
        })}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MovieApp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, { useState, useEffect } from "react"
import facade from "./apiFacade";
//import 'bootstrap/dist/css/bootstrap.min.css';
import './other.css'
import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
 
function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);
 
  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials,[evt.target.id]: evt.target.value })
  }
 
  return (
    <div>
      <div id="formContent">
      <h2>Login</h2>
      
      <form class="fadeIn second" onChange={onChange} >
        <input placeholder="User Name" class="form-control" id="username" />
        <br></br>
        <div class="fadeIn third"><input placeholder="Password" class="form-control" id="password" /></div>
        <br></br>
        
        <br></br>

        <div id="formFooter">
        <a class="underlineHover" href="#"><div class="fadeIn fourth"><button class="btn btn-default" onClick={performLogin}>Login</button></div></a>
        </div>
      </form>

    </div></div>
  )
 
}
function LoggedIn(props) {
  const [dataFromServer, setDataFromServer] = useState("")
  const [adminToken, setAdminToken] = useState("")

  useEffect(() => { facade.fetchData().then(data=> setDataFromServer(data.msg)
    )
    let tokenTemp = dataFromServer.search("admin")
    setAdminToken(tokenTemp);
    }, [])
 
    return (
      <div>
      <Header logout={props.logout} loggedIn = {props.loggedIn} token={adminToken}/>
      <Switch>
        <Route exact path="/">
          <Home data = {dataFromServer} login = {props.login} loggedIn = {props.loggedIn} errorMessage = {props.errorMessage}/>
        </Route>
        <Route path="/yourdogs" >
          <YourDogs />
        </Route>
        <Route path="/breeds" >
          <Breeds />
        </Route>
        <Route path="/admin" >
          <Admin />
        </Route>
      </Switch>
    </div>
    );
 
}


const Header = (props) => {
  return (
<div ><ul class="nav nav-pills" style={{ textAlign: "center"}}>
  <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
  {props.loggedIn && <li><NavLink activeClassName="active" to="/yourdogs">Your Dogs</NavLink></li>}
  <li><NavLink activeClassName="active" to="/breeds">Breeds</NavLink></li>
  {props.adminToken != -1 && <li><NavLink activeClassName="active" to="/admin">Admin</NavLink></li>}
  {props.loggedIn && <li><NavLink activeClassName="active" style={{color: "red"}} to="/" onClick={props.logout}>Logout</NavLink></li>}
</ul>
<hr />
</div>
  );
}

const url = "http://localhost:8080/eksamen/api/"

const Action = (props) => {
  // let url = "http://localhost:8080/eksamen/api/";
  let dat;
  localStorage.setItem('type', "GET")
   facade.fetchFromServer(url + props.middleId + props.id).then(data=>{
    dat = data;
  })
  return (<button class="btn btn-outline-info" onClick= {() => props.setItem(dat)}>{props.buttonText}</button>)
}

function Home(props) {

  return (
    <div style={{ textAlign: "center"}}>
      <br></br>
      {!props.loggedIn ? <div><LogIn login = {props.login}/> <br/><br/><br/><br/>{props.errorMessage}</div> : <div>{props.data}</div>}
    </div>
  );
}

function Admin(props) {
  const [searches, setSearches] = useState("")
  // const Action = (props) => {
  //   let dat;
  //   localStorage.setItem('type', "GET")
  //    facade.fetchFromServer(url + props.middleId + props.id).then(data=>{
  //     dat = data;
  //   })
  //   return (<button class="btn btn-outline-info" onClick= {() => props.setItem(dat)}>{props.buttonText}</button>)
  // }
  if(searches.searches){
  return (<div>
  <Action id={"searches"} middleId="info/" methodType="GET" buttonText ="Get searches" setItem={(item) => setSearches(item)} />
  {searches.searches && <div class="wrapper fadeIn">{searches.searches.map((data ) => (<div>{data.date}, {data.breed}<br/><br/></div>))}</div>} </div>)}
  return (<div><Action id={"searches"} middleId="info/" methodType="GET" buttonText ="Get searches" setItem={(item) => setSearches(item)} /></div>)
  }
 
  


function Breeds() {
  const [breeds, setBreeds] = useState(0)
  const [specificBreed, setSpecificBreed] = useState({breed: ""})
  const [breedToSearch, setBreedToSearch] = useState("boxer")
  // const url = "http://localhost:8080/eksamen/api/"

  useEffect(() => {
   
  }, []);

  
  // const Action = (props) => {
  //   let dat;
  //   localStorage.setItem('type', "GET")
  //    facade.fetchFromServer(url + props.middleId + props.id).then(data=>{
  //     dat = data;
  //   })
  //   return (<button class="btn btn-outline-info" onClick= {() => props.setItem(dat)}>{props.buttonText}</button>)
  // }

  if(specificBreed.breed != ""){
  return (<div>
  <br/>
  <input type="text" id="myInput" placeholder="Insert ID" value={breedToSearch} onChange={(event) => setBreedToSearch(event.target.value)} />
  <Action id={breedToSearch} middleId="info/breedInfo/" buttonText ="Find breed" setItem={(item) => setSpecificBreed(item)} />
  
  <br/>
   {specificBreed.breed != "" && <div class="wrapper fadeIn">
      Breed: {specificBreed.breed && specificBreed.breed}<br />
      Wikipedia: {specificBreed.wikipedia && specificBreed.wikipedia}<br/><br/>
      <img src={specificBreed.image}></img></div>} 

    <Action id={"breeds"} middleId="info/" methodType="GET" buttonText ="Show all breeds" setItem={(item) => setBreeds(item)} />
    {breeds.dogs && <div class="wrapper fadeIn">{breeds.dogs.map((data ) => (<div>{data.breed}<br/><br/></div>))}</div>} 

  </div>)}

  return (<div>
    <br/>
    <input type="text" id="myInput" placeholder="Insert ID" value={breedToSearch} onChange={(event) => setBreedToSearch(event.target.value)} />
    {/* <input type="text" id="myInput" placeholder="Insert ID" value={breedToSearch} onChange={(event) => setBreedToSearch(event.target.value)} /> */}
    <Action id={breedToSearch} middleId="info/breedInfo/" buttonText ="Find breed" setItem={(item) => setSpecificBreed(item)} />

    <Action id={"breeds"} middleId="info/" methodType="GET" buttonText ="Show all breeds" setItem={(item) => setBreeds(item)} />
    {breeds.dogs && <div class="wrapper fadeIn">{breeds.dogs.map((data ) => (<div>{data.breed}<br/><br/></div>))}</div>} 
  </div>)
}

class AddDog extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: "", info: "", dateOfBirth: ""};
  
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleInfoChange = this.handleInfoChange.bind(this);
      this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleNameChange(event) {
      this.setState({name: event.target.value});
    }

    handleInfoChange(event) {
      this.setState({info: event.target.value});
    }

    handleDateOfBirthChange(event) {
      this.setState({dateOfBirth: event.target.value});
    }
  
    handleSubmit(event) {
    event.preventDefault()
    // let url = "http://localhost:8080/eksamen/api/info/addDog/2"
   
    let dog = {
     name: this.state.name,
     info: this.state.info,
     dateOfBirth: this.state.dateOfBirth
    } 

      localStorage.setItem('type', "POST")
      if(dog){
      localStorage.setItem('body', JSON.stringify(dog)
      )}
      facade.sendToServer("http://localhost:8080/eksamen/api/info/addDog/2")
    }
  
    render() {
      return (
        <div>
         
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:<br/>
            <input type="text" value={this.state.name} onChange={this.handleNameChange} /><br/><br/>
          </label>
          <label>
            Info:<br/>
            <input type="text" value={this.state.info} onChange={this.handleInfoChange} /><br/><br/>
          </label>
          <label>
            DD/MM/YY:<br/>
            <input type="text" value={this.state.dateOfBirth} onChange={this.handleDateOfBirthChange} /><br/><br/>
          </label>
          <br/><input type="submit" value="Add dog" />
        </form></div>
      );
    }
  }

  class EditDog extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: "", info: "", dateOfBirth: "", id: 0};
  
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleInfoChange = this.handleInfoChange.bind(this);
      this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this);
      this.handleIdChange = this.handleIdChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleNameChange(event) {
      this.setState({name: event.target.value});
    }

    handleInfoChange(event) {
      this.setState({info: event.target.value});
    }

    handleDateOfBirthChange(event) {
      this.setState({dateOfBirth: event.target.value});
    }

    handleIdChange(event) {
      this.setState({id: event.target.value});
    }
  
    handleSubmit(event) {
    event.preventDefault()
   
    let dog = {
     name: this.state.name,
     info: this.state.info,
     dateOfBirth: this.state.dateOfBirth
    } 

      localStorage.setItem('type', "PUT")
      if(dog){
      localStorage.setItem('body', JSON.stringify(dog)
      )}
      facade.sendToServer("http://localhost:8080/eksamen/api/info/editDog/" + this.state.id)
    }
  
    render() {
      return (
        <div>
         
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:<br/>
            <input type="text" value={this.state.name} onChange={this.handleNameChange} /><br/><br/>
          </label>
          <label>
            Info:<br/>
            <input type="text" value={this.state.info} onChange={this.handleInfoChange} /><br/><br/>
          </label>
          <label>
            DD/MM/YY:<br/>
            <input type="text" value={this.state.dateOfBirth} onChange={this.handleDateOfBirthChange} /><br/><br/>
          </label>
          <label>
            Id:<br/>
            <input type="text" value={this.state.id} onChange={this.handleIdChange} /><br/><br/>
          </label>
          <br/><input type="submit" value="Edit dog" />
        </form></div>
      );
    }
  }


function YourDogs(){
  const [yourDogs, setYourDogs] = useState(0)
  // const url = "http://localhost:8080/eksamen/api/"

  // const Action = (props) => {
  //   let dat;
  //   localStorage.setItem('type', props.methodType)
  //   localStorage.setItem('body', undefined)
  //    facade.fetchFromServer(url + props.middleId + props.id).then(data=>{
  //     dat = data;
  //   })
  //   return (<button class="btn btn-outline-info" onClick= {() => props.setItem(dat)}>{props.buttonText}</button>)
  // }

  return (<div>
    
    <AddDog />
    <br/>
    <EditDog />
    <Action id={"dogs"} middleId="info/" methodType="GET" buttonText ="Show your dogs" setItem={(item) => setYourDogs(item)} />
    {yourDogs.dogsDTO && <div class="wrapper fadeIn">{yourDogs.dogsDTO.map((data ) => (<div><b>{data.name}</b><br/> Id: {data.id} <br/>Born {data.dateOfBirth} <br/>{data.info}<br/><br/></div>))}</div>}

  </div>);
}



// function Database(){
//   const [count, setCount] = useState(0)
//   const [authoredBook, setAuthoredBook] = useState({})
//   const [bookToFind, setBookToFind] = useState(102)
//   const [author, setAuthor] = useState({})
//   const [authorToFind, setAuthorToFind] = useState(101)
//   const [display, setDisplay] = useState("")
//   const url = "http://localhost:8080/startcode/api/info/"

//   useEffect(() => {
   
//   }, []);

//   const ActionButton = (props) => {
//     let dat;
//      fetch(url + props.middleId + props.id).then(res=>res.json()).then(data=>{
//        dat = data;
//      })
//     return (<button class="btn btn-outline-info" onClick= {() => props.setItem(dat)}>{props.buttonText}</button>)
//   }
  
//   return (<div class="wrapper fadeIn">
  
//   <input type="text" id="myInput" placeholder="Insert ID" value={bookToFind} onChange={(event) => setBookToFind(parseInt(event.target.value))} />
//   <ActionButton id={bookToFind} middleId="authoredbook/" buttonText ="Find book by ID" setItem={(item) => setAuthoredBook(item)} />
//   {authoredBook.title && <div class="wrapper fadeIn">
//   Title: {authoredBook.title && authoredBook.title}<br />
//   Release date: {authoredBook.releaseDate && authoredBook.releaseDate}<br />
//   Author: {authoredBook.author && authoredBook.author}</div>}


//   <input type="text" id="myInput" placeholder="Insert ID" value={authorToFind} onChange={(event) => setAuthorToFind(parseInt(event.target.value))} />
//   <ActionButton id={authorToFind} middleId="authorDTO/" buttonText ="Find author by ID" setItem={(item) => setAuthor(item)} />
//   {author.firstName && <div class="wrapper fadeIn">
//   First name: {author.firstName && author.firstName}<br />
//   Last name: {author.lastName && author.lastName}<br />
//   Book titles: {author.booksSimple && author.booksSimple}</div>}<br/>

//   <ActionButton id={"all"} middleId="authoredbook/" buttonText ="Get all books" setItem={(item) => setDisplay(item)} />
//   <ActionButton id={"all"} middleId="authorDTO/" buttonText ="Get all authors" setItem={(item) => setDisplay(item)} />
  
//   {display.booksDTO && <div class="wrapper fadeIn">{display.booksDTO.map((data ) => (<div>{data.id}: {data.title} by {data.author}<br/></div>))}</div>}
//   {display.authorsDTO && <div class="wrapper fadeIn">{display.authorsDTO.map((data ) => (<div>{data.id}: {data.firstName} {data.lastName}<br/></div>))}</div>}
//   </div>)
// }

 
function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
 
  const logout = () => {  
    facade.logout()
    setLoggedIn(false)
 } 
  const login = (user, pass) => { 
    facade.login(user,pass)
    .then(res => {
      setLoggedIn(true)
    })
    .catch((error) => {
      error.fullError.then((err) => {
        setErrorMessage(err.message)
      })
    })
    ;} 
 
  return (
    <div style={{ textAlign: "center"}} class="wrapper fadeInDown">      
        <br>
        </br>
        <br></br>
          <Router>
          <LoggedIn logout={logout} login={login} loggedIn = {loggedIn} errorMessage = {errorMessage}/>
          </Router><br></br>
        </div>
  )
}
export default App;

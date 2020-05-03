import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Grid, Button, Form, Radio, Input, GridColumn, Modal} from 'semantic-ui-react';
import {check_user} from './Globals/Checkuser';
import hive from '@hiveio/hive-js';

class App extends Component {
  constructor(props) {
      super(props);
      
      this.state={
        exists:false,
        logged:false,
        username:'',
        charselected:false,
        char:'',
        userdata:{
          hivebalance:'',
          hbdbalance:'',
          profilepicture:''
        }
          
      };
  
  }
      componentWillMount(){}
  
      componentDidMount() {}

      // handle user login - Check if Hive KeyChain exists & user information is valid
      checkKeyChain=()=>{
        setTimeout(()=>{if(window.hive_keychain) {
          this.setState({exists:true})         
          } else {
          this.setState({exists:false}) 
          }

        // check if the user name place is empty
        if(this.state.username===""){
          this.setState({exists:false})
          alert("please enter a valid username") 

        //check if the user is a valid hive user - make this external function - 
        }else{
          hive.api.getAccountsAsync([this.state.username]).then(r => {
            console.log(r);

            // While trying to get user profile picture, prevent "shit happens" if JSON turns empty...
            try {
              var json = r[0].json_metadata;
              var err=0;                 
              console.log(JSON.parse(json));
            } catch (e) {
              if (e instanceof SyntaxError) {
                  err=1;
              } else {
                }
            }

            //console.log(JSON.parse(r[0].json_metadata).profile.profile_image);
            // if user is not a valid Hive User - alert user and turn to login screen -
            if(r.length==0){
              alert("The username "+this.state.username+" is not a Hive User.(don't use @ at the beginning");
              this.setState({
                exists:false,
                username:'',
                
              })

            // if user is a valid Hive user, get user information and update it.
            }else{
              // if the JSON is OK, update user data with current profile picture
              if(err==0){
                this.setState({
                  userdata:{
                    hivebalance:r[0].balance,
                    hbdbalance:r[0].sbd_balance,
                    profilepicture:JSON.parse(r[0].json_metadata).profile.profile_image
                  }
                })
                // otherwise, update user data with an anonymous profile picture
              }else{
                this.setState({
                  userdata:{
                    hivebalance:r[0].balance,
                    hbdbalance:r[0].sbd_balance,
                    profilepicture:"https://cdn0.iconfinder.com/data/icons/user-pictures/100/unknown_1-2-512.png"
                  }
                })
              }
              console.log(this.state.userdata.hivebalance,this.state.userdata.hbdbalance,this.state.userdata.profilepicture);
            }
          });
        }       
        },100);      
      }

      // user name handler - use to update the name on user selected card
      handleNameChange = event => {
        this.setState({ username: event.target.value });
      }
      
      // user select rogue events
      handleRogueSelect=()=>{
        console.log("rogue selected");
        this.setState({ 
        charselected: true,
        char:'Rogue'
         });
      }
      
      // user select warrior events
      handleWarriorSelect=()=>{
        console.log("warrior selected");
        this.setState({ 
        charselected: true,
        char:'Warrior'
         });
      }

      // user select priest events
      handlePriestSelect=()=>{
        console.log("priest selected");
        this.setState({ 
        charselected: true,
        char:'Cleric'
         });
      }
  
  render() {
    const{
      exists,
      charselected,
      char,
      username,
      userdata
    }=this.state;
      
    return (
      <div className="App">
        <div id="MainDiv">
          <h1>HIVE ARENA</h1>
        
          {!exists&&<Modal id="loginmodal" size="mini" open={true}>
            <Modal.Header></Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <div class="ui labeled input">
                    <div class="uilabel">@{this.state.username}</div>
                    <input id="nameinput" type="text" placeholder="username" onChange={this.handleNameChange} />
                </div>
                <Button id="modalBut" onClick={this.checkKeyChain}>LOGIN</Button>                                 
                <p id="logintext">You need Hive KeyChain installed to play.{<br />}
                </p>
                  
              </Modal.Description>
            </Modal.Content>
          </Modal>}
            
          {exists&&!charselected&&<Modal id="charselect" size="large" open={true}>
            <Button id="roguebutton" onClick={this.handleRogueSelect}>
              <p id="RogueDef">Click to Select Rogue{<br />}
                Attack  : Sum of 3 dices + 1{<br />}
                Defence : Sum of 2 dices - 1{<br />}
                HP      : 27
              </p>
            </Button>
            <Button id="warriorbutton" onClick={this.handleWarriorSelect}>
              <p id="WarriorDef">Click to Select Warrior{<br />}
                Attack  : Sum of 3 dices{<br />}
                Defence : Sum of 2 dices{<br />}
                HP      : 27
              </p>
            </Button>
            <Button id="priestbutton" onClick={this.handlePriestSelect}>
              <p id="PriestDef">Click to Select Cleric{<br />}
                Attack  : Sum of 3 dices -1{<br />}
                Defence : Sum of 2 dices{<br />}
                HP      : 30
              </p>
            
            </Button>   
          </Modal>}  

          {(charselected)&&<Modal id="online" size="mini" open={true}>
            <p>Users Online{<br />}</p>
            <p>{username}-{char}{<br />}</p>
          </Modal>}    

          {(char=='Rogue')&&<Modal id="roguecard" size="mini" open={true}>
            <img id="userpicture" src={userdata.profilepicture}height="42" width="42"></img>
            <p id="cardheader">{username} - {char}{<br />}</p>
            <p id="cardtext">
                Attack  : Sum of 3 dices + 1{<br />}
                Defence : Sum of 2 dices - 1{<br />}
                HP      : 27{<br />}{<br />}
              {userdata.hivebalance}{<br />}
              {userdata.hbdbalance}{<br />}
            </p>
            <Button id="pvpbutton" onClick={this.handlePvP}>PvP</Button>
            <Button id="serverbossbutton" onClick={this.handleServerBoss}>Server Boss</Button>
            
          </Modal>}   

          {(char=='Warrior')&&<Modal id="warriorcard" size="mini" open={true}>
            <img id="userpicture" src={userdata.profilepicture}height="42" width="42"></img>
            <p id="cardheader">{username} - {char}{<br />}</p>
            <p id="cardtext">
                Attack  : Sum of 3 dices{<br />}
                Defence : Sum of 2 dices{<br />}
                HP      : 27{<br />}{<br />}
              {userdata.hivebalance}{<br />}
              {userdata.hbdbalance}{<br />}
            </p>
            <Button id="pvpbutton" onClick={this.handlePvP}>PvP</Button>
            <Button id="serverbossbutton" onClick={this.handleServerBoss}>Server Boss</Button>
          </Modal>}   

          {(char=='Cleric')&&<Modal id="priestcard" size="mini" open={true}>
            <img id="userpicture" src={userdata.profilepicture}height="42" width="42"></img>
            <p id="cardheader">{username} - {char}{<br />}</p>
            <p id="cardtext">
                Attack  : Sum of 3 dices -1{<br />}
                Defence : Sum of 2 dices{<br />}
                HP      : 30{<br />}{<br />}
              {userdata.hivebalance}{<br />}
              {userdata.hbdbalance}{<br />}
            </p>
            <Button id="pvpbutton" onClick={this.handlePvP}>PvP</Button>
            <Button id="serverbossbutton" onClick={this.handleServerBoss}>Server Boss</Button>
          </Modal>}   

        </div>
      </div>

      )
  }
}
export default App;
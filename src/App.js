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
          hbdbalance:''
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

            // if user is not a valid Hive User - alert user and turn to login screen -
            if(r.length==0){
              alert("The username "+this.state.username+" is not a Hive User.(don't use @ at the beginning");
              this.setState({
                exists:false,
                username:''
              })

            // if user is a valid Hive user, get user information and update it.
            }else{
              this.setState({
                userdata:{
                  hivebalance:r[0].balance,
                  hbdbalance:r[0].sbd_balance
                }
              })
              console.log(this.state.userdata.hivebalance,this.state.userdata.hbdbalance);
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
        char:'Priest'
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
            <Button id="roguebutton" onClick={this.handleRogueSelect}>Select Rogue
            
            </Button>
            <Button id="warriorbutton" onClick={this.handleWarriorSelect}>Select Warrior</Button>
            <Button id="priestbutton" onClick={this.handlePriestSelect}>Select Priest</Button>   
          </Modal>}  

          {(charselected)&&<Modal id="online" size="mini" open={true}>
            <p>Users Online{<br />}</p>
            <p>{username}-{char}{<br />}</p>
          </Modal>}    

          {(char=='Rogue')&&<Modal id="roguecard" size="mini" open={true}>
            <p>User {username} Selected Rogue.{<br />}</p>
            <p>User Balance is:{<br />}</p>
            <p>{userdata.hivebalance}{<br />}</p>
            <p>{userdata.hbdbalance}{<br />}</p>
          </Modal>}   

          {(char=='Warrior')&&<Modal id="warriorcard" size="mini" open={true}>
            <p>User {username} Selected Warrior.{<br />}</p>
            <p>User Balance is:{<br />}</p>
            <p>{userdata.hivebalance}{<br />}</p>
            <p>{userdata.hbdbalance}{<br />}</p>
          </Modal>}   

          {(char=='Priest')&&<Modal id="priestcard" size="mini" open={true}>
            <p>User {username} Selected Priest.{<br />}</p>
            <p>User Balance is:{<br />}</p>
            <p>{userdata.hivebalance}{<br />}</p>
            <p>{userdata.hbdbalance}{<br />}</p>
          </Modal>}   

        </div>
      </div>

      )
  }
}
export default App;
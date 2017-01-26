import React, { Component } from 'react';
import './App.css';

class ContactFields extends Component {
  render(){
    return (
     <form>
      <label>
       Name:
       <input name="fullName" 
	type="text" 
	value={this.props.fullName}
	onChange={this.props.onInputChange}/>
      </label>
      <br />
      <label>
       Phone Number:
       <input name="phone"
        type="text"
        value={this.props.phone}
        onChange={this.props.onInputChange}/>
      </label>
      <br />
      <label>
       Email Address:
       <input name="email"
        type="text"
        value={this.props.email}
        onChange={this.props.onInputChange}/>
      </label>
      <br />
      <label>
	Notes:
       <input name="notes"
        type="text"
        value={this.props.notes}
        onChange={this.props.onInputChange}/>
      </label>
     </form>
   )
  }
};

const emptyContact = {fullName:"",phone:"",email:"",notes:""};

function Button(props){
  return (
    <button disabled={props.disabled} onClick={() => props.onClick()}>{props.title}</button>
  );
}
class ContactManager extends Component {
  constructor() {
    super();
    this.state = {
      displayMode: "list",
      contacts: [],
      selectedName: null,
      activeContact: emptyContact,
      backupContact: emptyContact
    };
  }

  confirmContact() {
    var name = this.state.activeContact.fullName.slice();
    if (!name || 0 === name.length){
	alert("Name must not be empty");
	return null;
    };
    var isUnique = false;
    if (this.state.contacts.length === 0){
	isUnique = true;
    } else if (this.state.contacts.every(function(contactName){
		return contactName !== name})){
	isUnique = true;
    };
    if (isUnique){
    	var newContacts = this.state.contacts.slice();
    	newContacts.push(Object.assign({}, this.state.activeContact));
    	newContacts.sort();
    	this.setState({	displayMode: "list", 
			contacts: newContacts, 
			selectedName: name,
			activeContact: emptyContact});
    } else {
	alert('A contact named '+ name + 'already exists');
    }
  }

  discardChanges() {
    this.setState({displayMode: "list", 
		contacts: this.state.contacts, 
		activeContact: emptyContact});
  }

  handleContactSelect(contact) {
    this.setState({
	selectedName: contact.currentTarget.value
    });
  }

  handleInputChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    var active = Object.assign({}, this.state.activeContact);
    active[name]=value;
    this.setState({
      activeContact: active
    });
  }

  render() {
    var selectedContact = null;
    if (this.state.selectedName!==null){
	selectedContact = Object.assign({},this.state.contacts.filter(
         function(contact){
          return contact.fullName===this.state.selectedName}, this
        )[0]);
    };
    const topState = this;
    const contactsList = this.state.contacts.map(function(contact){
        return (<div key={contact.fullName}>
	<input type="radio"
        name="contactName"
        value={contact.fullName}
        checked={this.state.selectedName === contact.fullName}
        onChange={(e) => this.handleContactSelect(e)} />
        {contact.fullName}
        </div>)
    }, this);
    if (this.state.displayMode === "list") {
      return (<div className="ContactManager">  
	<h1>Contact List</h1>
	<Button onClick={() => this.setState({displayMode: "add",
					contacts: this.state.contacts,
					activeContact: emptyContact})}
		    title="Add Contact"
		    disabled={false}/>
	<Button onClick={() => this.setState({displayMode: "edit",
					contacts: this.state.contacts.filter(
					function(na){return na.fullName!==this.state.selectedName},topState),
					activeContact: selectedContact,
					backupContact: {fullName: selectedContact.fullName.slice(),
                                        phone: selectedContact.phone.slice(),
                                        email: selectedContact.email.slice(),
                                        notes: selectedContact.notes.slice()}})}
		    title="Edit Contact"
		    disabled={this.state.selectedName===null}/>
	{contactsList}
      </div>
      )
    } else if (this.state.displayMode ==="add") {
      return (<div className="ContactManager">
	<h1>Add New Contact</h1>
	<ContactFields fullName={this.state.activeContact.fullName}
			phone={this.state.activeContact.phone}
			email={this.state.activeContact.email}
			notes={this.state.activeContact.notes}
			onInputChange={(e) => this.handleInputChange(e)}
			/>
	<Button onClick={() => this.confirmContact()} title="Accept" disabled={false}/>
	<Button onClick={() => this.discardChanges()} title="Cancel" disabled={false}/>
      </div>
      )
    } else if (this.state.displayMode==="edit") {
      return (<div className="ContactManager">
	<h1>Edit Existing Contact</h1>
	<ContactFields fullName={this.state.activeContact.fullName}
                        phone={this.state.activeContact.phone}
                        email={this.state.activeContact.email}
                        notes={this.state.activeContact.notes}
                        onInputChange={(e) => this.handleInputChange(e)}/>
	<Button onClick={() => this.confirmContact()} title="Accept" disabled={false}/>
        <Button onClick={() => this.discardChanges()} title="Delete" disabled={false}/>
      </div>
      )
    };
  }
}

export default ContactManager;

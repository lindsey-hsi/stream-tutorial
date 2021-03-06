import { post } from './Http'
import { StreamChat } from 'stream-chat';
import { EThree, IdentityAlreadyExistsError, LookupError } from '@virgilsecurity/e3kit';
import React, { PureComponent } from 'react';

export class StartChat extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      receiver: '',
      sender: '',
      stream: null,
      virgil: null,
      error: null,
    }
  };

  _handlesenderChange = (event) => {
    this.setState({ sender: event.target.value });
  };

  _handlereceiverChange = (event) => {
    this.setState({ receiver: event.target.value });
  };

  _handleRegister = (event) => {
    event.preventDefault();
    console.log("about to handle register")
    // to work locally
    // post("http://localhost:8080/v1/authenticate", { sender: this.state.sender })
    // to work on netlify
    // post("https://animated-froyo-aa2c68.netlify.app/controllers/v1/authenticate", { sender: this.state.sender })
    // trying heroku deploy for backend
    post("https://polar-brook-70189.herokuapp.com/v1/authenticate", { sender: this.state.sender })
    // post(".netlify/functions/node-fetch", { sender: this.state.sender })
      .then(res => res.authToken)
      .then(this._connect);
    console.log("successfully handled register")
  };

  _handleStartChat = async (event) => {
    event.preventDefault();
    console.log("about to handle start chat")
    try {
      let members = [this.state.sender, this.state.receiver];
      members.sort();

      const channel = this.state.stream.client.channel('messaging', {
        image: `https://getstream.io/random_svg/?id=rapid-recipe-0&name=${members.join("+")}`,
        name: members.join(", "),
        members: members,
      });

      const publicKeys = await this.state.virgil.eThree.lookupPublicKeys([this.state.sender, this.state.receiver]);

      this.props.onConnect({
        sender: this.state.sender,
        receiver: this.state.receiver,
        stream: { ...this.state.stream, channel },
        virgil: { ...this.state.virgil, publicKeys }
      });
    } catch (err) {
      if (err instanceof LookupError) {
        this.setState({ error: 'Other user is not registered. Open another window and register that user.' })
      } else {
        this.setState({ error: err.message });
      }
    }
    console.log("successfully handled start chat")
  };

  _connectStream = async (backendAuthToken) => {
    // to work locally
    // const response = await post("http://localhost:8080/v1/stream-credentials", {}, backendAuthToken);
    // trying heroku deployment
    const response = await post("https://polar-brook-70189.herokuapp.com/v1/stream-credentials", {}, backendAuthToken);
    // to work on netlify
    console.log("about to connect to stream")
    // const response = await post("https://animated-froyo-aa2c68.netlify.app/v1/stream-credentials", {}, backendAuthToken);
    const client = new StreamChat(response.apiKey);
    client.setUser(response.user, response.token);

    console.log("successfully connected to stream")
    return { ...response, client };

  };

  _connectVirgil = async (backendAuthToken) => {
    // to work locally
    // const response = await post("http://localhost:8080/v1/virgil-credentials", {}, backendAuthToken);
    // trying heroku deployment
    const response = await post("https://polar-brook-70189.herokuapp.com/v1/virgil-credentials", {}, backendAuthToken);
    // to work on netlify
    console.log("about to connect to virgil")
    // const response = await post("https://animated-froyo-aa2c68.netlify.app/v1/virgil-credentials", {}, backendAuthToken);
    const eThree = await EThree.initialize(() => response.token);
    try {
      await eThree.register();
    } catch (err) {
      if (err instanceof IdentityAlreadyExistsError) {
        // already registered, ignore
      } else {
        this.setState({ error: err.message });
      }
    }
    console.log("successfully connected to virgil")
    return { ...response, eThree };
  };

  _connect = async (authToken) => {
    const stream = await this._connectStream(authToken);
    const virgil = await this._connectVirgil(authToken);

    this.setState({ stream, virgil })
  };

  render() {
    let form;
    if (this.state.virgil && this.state.stream) {
      form = {
        field: 'receiver',
        title: 'Who do you want to chat with?',
        subtitle: 'Registered as "' + this.state.sender + '". Open this app in another window to register another user, or type a previously registered username below to start a chat.',
        submitLabel: 'Start Chat',
        submit: this._handleStartChat,
        handleFieldChange: this._handlereceiverChange
      }
    } else {
      form = {
        field: 'sender',
        title: 'Who are you?',
        subtitle: 'Enter a username.',
        submitLabel: 'Register',
        submit: this._handleRegister,
        handleFieldChange: this._handlesenderChange
      };
    }

    return (
      <div className="container">
        <form className="card" onSubmit={form.submit}>
          <label htmlFor={form.field}>{form.title}</label>
          <div className='subtitle'>{form.subtitle}</div>
          <input id="sender" type="text" name={form.field} value={this.state[form.field]}
                 onChange={form.handleFieldChange}/>
          <input type="submit" value={form.submitLabel}/>
          <div className="error">{this.state.error}</div>
        </form>
      </div>
    )
  }
}

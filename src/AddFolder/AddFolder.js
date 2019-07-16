import React from 'react';
import ApiContext from '../ApiContext';
import config from '../config'
import './AddFolder.css';
import ValidationError from '../ValidationError/ValidationError';

export default class AddFolder extends React.Component {
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      name_touched: false
    }
  }

  handleAddFolder = (folderName) => {
    const body = JSON.stringify({
      name: folderName
    });

    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body
    }

    fetch(`${config.API_ENDPOINT}/folders`, options)
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e));
        return res.json()
      })
      .then((folder) => {
        this.context.addFolder(folder)
      })
      .catch(error => {
        console.error(error)
      })
      
  }
  
  handleSubmit(e) {
    e.preventDefault()
    const { name } = this.state
    this.handleAddFolder(name)
    this.props.history.push('/')
  }

  validateName(fieldValue) {
    const name = this.state.name.trim();
    if (name.length === 0) {
      return 'Name is required';
    }
  }

  updateName(name) {
    this.setState({
      name: name,
      name_touched: true
    })
  }

  handleButtonClick = () => {
    const { history } = this.props
    history.push('/')
  }


  
  
  render() {
    return (
      <form className='form' onSubmit={e => this.handleSubmit(e)}>
        <h2>Add Folder</h2>
        <div className='add-folder-hint'>* required</div>
        <div className='form-group'>
          <label htmlFor='name'>Name *</label>
          <input type='text' className='form-control'
            name='name' id='name' onChange={e => this.updateName(e.target.value)}/>
        </div>
        {this.state.name_touched && (
          <ValidationError message={this.validateName()}/>
        )}
        <div className='form-button-group'>
          <button type='submit'
            className='form-button'
            disabled={
              this.validateName()
            }
          >
            Add
          </button>
        </div>
      </form>
    )
  }
}
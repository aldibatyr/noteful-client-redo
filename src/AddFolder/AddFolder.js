import React from 'react';
import ApiContext from '../ApiContext';
import './AddFolder.css';
import ValidationError from '../ValidationError/ValidationError';

export default class AddFolder extends React.Component {
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: '',
        touched: false
      }
    }
  }
  
  handleSubmit(e) {
    e.preventDefault()
    const {name} = this.state
    this.context.addFolder(name)
  }

  validateName(fieldValue) {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return 'Name is required';
    }
  }

  updateName(name) {
    this.setState({
      name: {
        value:name,
        touched: true
      }
    })
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
        {this.state.name.touched && (
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
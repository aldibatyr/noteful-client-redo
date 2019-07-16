import React from 'react';
import ValidationError from '../ValidationError/ValidationError';
import ApiContext from '../ApiContext';
import config from '../config';

export default class AddNote extends React.Component {
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      name_touched: false,
      content: '',
      content_touched: false,
      folder: '',
      folder_touched: false
    }
  }

  handleAddNote = (noteName, noteContent, noteFolder) => {
    const body = JSON.stringify({
      name: noteName,
      modified: new Date(),
      content: noteContent,
      folderId: noteFolder
    })

    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body
    }

    fetch(`${config.API_ENDPOINT}/notes`, options)
      .then(res => {
        if (!res.ok) 
          return res.json().then(e => Promise.reject(e))
        res.json()
      })
      .then(newNote => {
        this.context.addNote(newNote)
      })
      .catch(error => {
        console.error(error)
      })
  }

  validateName(fieldValue) {
    const name = this.state.name.trim();
    if (name.length === 0) {
      return 'Name is required';
    }
  }

  validateContent(fieldValue) {
    const content = this.state.content.trim();
    if (content.length === 0) {
      return 'Content is required'
    }
  }

  validateFolder(fieldValue) {
    const folder = this.state.folder.trim();
    if (folder.length === 0) {
      return 'Folder must be selected';
    }
  }

  updateName(name) {
    this.setState({
      name: name,
      name_touched: true
    })
  }

  updateContent(content) {
    this.setState({
      content: content,
      content_touched: true
    })
  }

  updateFolder(folder) {
    this.setState({
      folder: folder,
      folder_touched: true
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    const { name, content, folder } = this.state;
    this.handleAddNote(name, content, folder)
    this.props.history.push('/')
  }



  render() {
    const options = this.context.folders.map((folder, index) => {
      return (
        <option value={folder.id} key={index}>{folder.name}</option>
      )

    })
    return (
      <form className='form' onSubmit={e => this.handleSubmit(e)}>
        <h2>Add Note</h2>
        <div className='add-note-hint'>* required</div>
        <div className='form-group'>
          <label htmlFor='name'>Name *</label>
          <input type='text' className='form-control'
            name='name' id='name' onChange={e => this.updateName(e.target.value)}/>
        </div>
        {this.state.name_touched && (
          <ValidationError message={this.validateName()}/>
        )}
        <div className='form-group'>
          <label htmlFor='content'>Content *</label>
          <textarea type='text' className='form-control'
            name='content' id='content' onChange={e => this.updateContent(e.target.value)}/>
        </div>
        {this.state.content_touched && (
          <ValidationError message={this.validateContent()}/>
        )}
        <div className='form-group'>
          <label htmlFor='folder'>Folder *</label>
          <select onChange={e=>this.updateFolder(e.target.value)}>
            {options}
          </select>
        </div>
        {this.state.folder_touched && (
          <ValidationError message={this.validateFolder()} />
        )}

        <div className='form-button-group'>
          <button type='submit'
            className='form-button'
          >
            Add
          </button>
        </div>
      </form>
    )
  }
}
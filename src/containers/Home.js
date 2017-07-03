import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Home.css';
import { invokeApig } from '../libs/awsLib';
import {Card, Collection, CollectionItem} from 'react-materialize';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      notes: [],
    };
  }

  async componentDidMount() {
  if (this.props.userToken === null) {
    return;
  }

  this.setState({ isLoading: true });

  try {
    const results = await this.notes();
    this.setState({ notes: results });
  }
  catch(e) {
    alert(e);
  }

  this.setState({ isLoading: false });
}

notes() {
  return invokeApig({ path: '/notes' }, this.props.userToken);
}

handleNoteClick = (event) => {
  event.preventDefault();
  this.props.history.push(event.currentTarget.getAttribute('href'));
}

renderNotesList(notes) {
  return [{}].concat(notes).map((note, i) => (
    i !== 0
      ? ( <CollectionItem
            key={note.noteId}
            href={`/notes/${note.noteId}`}
            onClick={this.handleNoteClick}
            header={note.content.trim().split('\n')[0]}>{note.content.trim().split('\n')[0]} <br />
              { "Created: " + (new Date(note.createdAt)).toLocaleString() }
          </CollectionItem> )
      : ( <CollectionItem
            key="new"
            href="/notes/new"
            onClick={this.handleNoteClick}>
              <b>{'\uFF0B'}</b> Create a new note
          </CollectionItem> )
  ));
}

  renderLander() {
    return (
     <div className="lander">
      <Card className='landing' textClassName='black-text' title='Scribble'>
  		A simple note taking app.<br/><br/><br/>
  		</Card>
     </div>
    );
  }

  renderNotes() {
    return (
      <div className="notes">
        <Collection>
          	<CollectionItem>
              { ! this.state.isLoading
                        && this.renderNotesList(this.state.notes) }
            </CollectionItem>
        </Collection>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        { this.props.userToken === null
          ? this.renderLander()
          : this.renderNotes() }
      </div>
    );
  }
}

export default withRouter(Home);

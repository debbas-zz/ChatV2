/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @jsx React.DOM
 */

var React = require('react');
var UserListItem = require('../components/UserListItem.react');
var ThreadStore = require('../stores/ThreadStore');
var UserStore = require('../stores/UserStore');


function getStateFromStores() {
  return {
  	users: UserStore.getAllForCurrentThread(),
    threads: ThreadStore.getAllChrono(),
    currentThreadID: ThreadStore.getCurrentID()
  };
}

var UsersSection = React.createClass({

  getInitialState: function() {
  	//console.log(getStateFromStores());
    return getStateFromStores();
  },
  
  
  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
    ThreadStore.removeChangeListener(this._onChange);
  },


  render: function() {
    var usersListItems = this.state.users.map(function(user) {
      return (
        <UserListItem 
        	key={user.id}
			user={user}
        />
      );
    }, this);

    return (
      <div className="users-section">
        <div className="message-thread-heading">
          Users
        </div>
        <ul className="thread-list">
          {usersListItems}
          </ul>
      </div>
    );
  },
  
  
  /**
   * Event handler for 'change' events coming from the MessageStore
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }



});

module.exports = UsersSection;

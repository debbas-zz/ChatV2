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
 */

var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var EventEmitter = require('events').EventEmitter;
var ThreadStore = require('../stores/ThreadStore');
var merge = require('react/lib/merge');

var ActionTypes = ChatConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var ChatThreadActionCreators = require('../actions/ChatThreadActionCreators');


var _currentID = null;
var _users = {};
var socket = io();


function _addUsers(users) {
  for (var key in users) {
  	var user = users[key];
    if (!_users[user.userName]) {
      _users[user.userName] = user;
    }
  }
}


var UserStore = merge(EventEmitter.prototype, {

	getInitialState: function(){
		socket.on('login', this.login);
		socket.on('update users', this.updateUsers);
	},
	
	
	login: function(data){
		_users = data;
		this.emit(CHANGE_EVENT);
	},

	
	updateUsers: function(data){
		_users = data;
		ChatThreadActionCreators.clickThread(ThreadStore.getCurrentID());
	},
	
	 emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  get: function(id) {
    return _users[ThreadStore.getCurrentID()].users[id];
  },

  getAll: function() {
    return _users;
  },

  /**
   * @param {string} threadID
   */
  getAllForThread: function(threadID) {
    var threadUsers = [];
    
    if (!_users[threadID])
    	return threadUsers;
    var users  = _users[threadID].users;
    for (var userName in users) {
        threadUsers.push(users[userName]);
    }
    threadUsers.sort(function(a, b) {
      if (a.userName < b.userName) {
        return -1;
      } else if (a.userName > b.userName) {
        return 1;
      }
      return 0;
    });
    return threadUsers;
  },

  getAllForCurrentThread: function() {
    return this.getAllForThread(ThreadStore.getCurrentID());
  },
  
 
  getCurrentID: function() {
    return _currentID;
  },
  
  setCurrentID: function(username) {
    _currentID = username;
  },

  getCurrent: function() {
    return this.get(this.getCurrentID());
  }


});

UserStore.getInitialState();


UserStore.dispatchToken = ChatAppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.CLICK_THREAD:
      ChatAppDispatcher.waitFor([ThreadStore.dispatchToken]);
      UserStore.emitChange();
      break;
	 
	 case ActionTypes.RECEIVE_RAW_MESSAGES:
      ChatAppDispatcher.waitFor([ThreadStore.dispatchToken]);
      UserStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = UserStore;

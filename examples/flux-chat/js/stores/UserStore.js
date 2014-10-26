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


var _currentID = null;
var _users = {};

function _addUsers(users) {
  users.forEach(function(user) {
    if (!_users[user.id]) {
      _users[user.id] = user;
    }
  });
}

function _markAllInThreadRead(threadID) {
  for (var id in _users) {
    if (_users[id].threadID === threadID) {
      //_users[id].isRead = true;
    }
  }
}

var UserStore = merge(EventEmitter.prototype, {

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
    return _users[id];
  },

  getAll: function() {
    return _users;
  },

  /**
   * @param {string} threadID
   */
  getAllForThread: function(threadID) {
    var threadUsers = [];
    for (var id in _users) {
      if (_users[id].threadID === threadID) {
        threadUsers.push(_users[id]);
      }
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

UserStore.dispatchToken = ChatAppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.CLICK_THREAD:
      ChatAppDispatcher.waitFor([ThreadStore.dispatchToken]);
      _markAllInThreadRead(ThreadStore.getCurrentID());
      UserStore.emitChange();
      break;
	 
	 case ActionTypes.RECEIVE_RAW_MESSAGES:
      _addUsers(action.users);
      ChatAppDispatcher.waitFor([ThreadStore.dispatchToken]);
      _markAllInThreadRead(ThreadStore.getCurrentID());
      UserStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = UserStore;

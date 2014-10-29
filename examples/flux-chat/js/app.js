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

// This file bootstraps the entire application.

var ChatApp = require('./components/ChatApp.react');
var ChatExampleData = require('./ChatExampleData');
var ChatWebAPIUtils = require('./utils/ChatWebAPIUtils');
var UserStore = require('./stores/UserStore');

var React = require('react');

window.React = React; // export for http://fb.me/react-devtools


var socket = io();
var username;

socket.on('connect', function(){
	while(username == null || username == "")
	{
		username = prompt("Please pick a username", "");
		socket.emit('add user', username);
	}
});




UserStore.setCurrentID(username);

ChatExampleData.init(username); // load example data into localstorag


ChatWebAPIUtils.getAllMessages();

React.renderComponent(
    <ChatApp />,
    document.getElementById('react')
);

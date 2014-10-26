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
var cx = require('react/lib/cx');

var ReactPropTypes = React.PropTypes;

var UserListItem = React.createClass({

  propTypes: {
    user: ReactPropTypes.object,
  },


  render: function() {
  
    var user = this.props.user;
    
    //console.log(user);
    return (
      <li
        className={cx({
          'thread-list-item': true})}>
        <h5 className="thread-name">{user.userName}</h5>
        
      </li>
    );
  }


});

module.exports = UserListItem;

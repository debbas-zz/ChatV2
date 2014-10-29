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

module.exports = {

  init: function(username) {
    localStorage.clear();
    
    
    localStorage.setItem('messages', JSON.stringify([
      {
        id: 'm_1',
        threadID: 'room1',
        threadName: 'Room1',
        authorName: "Server",
        text: 'Welcome to Room1',
        timestamp: Date.now() - 99999
      },
      {
        id: 'm_4',
        threadID: 'room2',
        threadName: 'Room2',
        authorName: 'Server',
        text: 'Welcome to Room2',
        timestamp: Date.now() - 69999
      },
      {
        id: 'm_6',
        threadID: 'room3',
        threadName: 'Room3',
        authorName: 'Server',
        text: 'Welcome to Room3',
        timestamp: Date.now() - 49999
      }
    ]));
        
    
    
  }

};

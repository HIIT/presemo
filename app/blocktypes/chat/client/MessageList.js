var rpc = require("/core/rpc");
var socket = require("/core/socket");

var MessageList = React.createClass({
  displayName: 'MessageList',

  getInitialState: function() {
    return {
      msgs : []
    };
  },

  render: function render() {

    var createItem = function createItem(item, index) {
      return React.createElement(
        'li',
        { key: index },
        item.text
      );
    };

    return React.createElement(
      'ul',
      null,
      this.state.msgs.map(createItem)
    );
  },

  componentDidMount: function() {
    var self = this;
    socket.onmessage = function(event) {
      var eventdata = JSON.parse(event.data);

      console.log( self.props.id );

      if (eventdata.m !== undefined && eventdata.m.indexOf("$msgIn") !== -1 && eventdata.m.indexOf( self.props.id ) ) {
          var message = eventdata.p[0];
          console.log( message );

          var msgs = self.state.msgs;
          msgs.push( message );
          self.setState( { 'msgs': msgs } );

      }
    }
  }

});

module.exports = MessageList;

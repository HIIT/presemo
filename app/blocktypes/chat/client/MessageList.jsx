var rpc = require("/core/rpc");
var socket = require("/core/socket");

var Message = require('/chat/Message');

var MessageList = React.createClass({
  displayName: 'MessageList',

  getInitialState: function() {
    return {
      msgs : []
    };
  },

  render: function render() {

    var createItem = function createItem(item, index) {
      return <Message key={index} message={item}/>;
    };

    return <div>
        {this.state.msgs.map(createItem)}
      </div>;
  },

  componentDidMount: function() {

    var self = this;

    socket.onmessage = function(event) {

      event = JSON.parse(event.data);

      console.log( event );

      if( ! event.m && event.p.length >= 0 && event.p[0] && event.p[0].msgs ) {
        self.setState( { 'msgs': event.p[0].msgs } );
        return;
      }

      if ( event.m !== undefined && event.m.indexOf("$msgIn") !== -1 && event.m.indexOf( self.props.id ) ) {

          var message = event.p[0];

          console.log( self );

          console.log( self.state );

          var msgs = self.state.msgs;
          msgs.push( message );
          self.setState( { 'msgs': msgs } );

      }
    }
  }

});

module.exports = MessageList;

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

  componentWillMount: function() { // check which is the corrct term here

    var self = this;

    // integrating using props.block isn't the fanciest way to do this, but will do for now

    this.props.block.on('data', function(data) {
      // TODO compare here or somewhere
      if (data.msgs) {
        self.setState( { 'msgs': data.msgs } );
      }
    });

    this.props.block.$msgIn = function( msg ) {

      var msgs = self.state.msgs;
      msgs.push( msg );
      self.setState( { 'msgs': msgs } );

    }
  }

});

module.exports = MessageList;

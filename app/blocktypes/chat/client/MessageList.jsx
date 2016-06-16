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

    var self = this;

    var createItem = function createItem(item, index) {
      return <Message key={index} message={item} block={self.props.block}/>;
    };

    var msgs = this.state.msgs.slice();
    msgs.reverse();

    // for screen, separate highlighted items for a separate div

    var highlights = [];


    if( __SCREEN__ ) {

      var removed = [];

      for( var i in msgs ) {

      var msg = msgs[i];

      var tags = msg.tags || [];

        if( tags.indexOf('screen') >= 0 ) {
          highlights.push( msg );
          removed.push( i );
        }

      }

      removed.reverse()

      for( var i in removed ) {
        i = removed[i];
        console.log("removed " + i );
        msgs.splice( i , 1 );
      }

    }

    // end screen spesific code

    return <div>
        {msgs.map(createItem)}

        <div style={{position: 'absolute', top: '30px'}}>
          {highlights.map(createItem)}
        </div>
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

    this.props.block.$data = function( msg ) {

      var msgs = self.state.msgs;

      for( var i = 0; i < msgs.length; i++ ) { // could be done more smartly?
        if( msgs[i].id === msg.id ) {
          msgs[i] = msg;
        }
      }

      self.setState( { 'msgs': msgs } );
    };


    this.props.block.$msgIn = function( msg ) {

      var msgs = self.state.msgs;
      msgs.push( msg );
      self.setState( { 'msgs': msgs } );

    }

  }

});

module.exports = MessageList;

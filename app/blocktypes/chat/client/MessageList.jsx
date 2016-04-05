var rpc = require("/core/rpc");
var socket = require("/core/socket");

var Message = require('/chat/Message');

var MessageList = React.createClass({
  displayName: 'MessageList',

  getInitialState: function() {
    return {
      msgs : [],
      rates : [],
      user : -1
    };
  },

  render: function render() {

    var self = this;

    var createItem = function createItem(item, index) {
      return <Message key={index} message={item} block={self.props.block} canRespond={true} responses={responses[item.id]}/>;
    };

    // response threads hack!
    // collect all messages that are responses
    var msgs = this.state.msgs.slice();

    var _responses = msgs.filter( function(m) { return m.response != null; })
    var firstmsg = msgs.filter( function(m) { return m.response == null; })

    var responses = {};

    for( var msg in firstmsg ) {
      msg = firstmsg[ msg ];
      responses[ msg.id ] = [];
    }

    for( var msg in _responses ) {
      msg = _responses[ msg ];
      responses[ msg.response ].push( msg );
    }

    firstmsg.reverse();

    return <div>

      <div style={{'position' : 'fixed', 'top' : '5px', 'right' : '25px', 'background' : 'white'}}>
        {self.state.rates}
      </div>

        {firstmsg.map(createItem)}

      </div>;
  },

  componentWillMount: function() { // check which is the corrct term here

    var self = this;

    setInterval( function() {
      var rates = self.state.rates;
      rates.pop();
      self.setState( {'rates' : rates } );
    }, 25000 );

    // integrating using props.block isn't the fanciest way to do this, but will do for now

    this.props.block.on('data', function(data) {
      // TODO compare here or somewhere
      if (data.msgs) {
        self.setState( { 'msgs': data.msgs } );
      }
      if( data.user ) {
        self.setState( { 'user' : data.user } );
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

    };

    this.props.block.$rated = function( user , rate  ) {

      if( user == self.state.user ) {
        var rates = self.state.rates;
        rates.push( rate );
        self.setState( { 'rates' : rates } );
      }
    };

  }

});

module.exports = MessageList;

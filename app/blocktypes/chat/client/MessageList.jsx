var rpc = require("/core/rpc");
var socket = require("/core/socket");

var Message = require('/chat/Message');

var MessageList = React.createClass({
  displayName: 'MessageList',

  getInitialState: function() {
    return {
      msgs : [],
      rates : [],
      responses : [],
      user : -1
    };
  },

  render: function render() {

    var self = this;

    var createItem = function(item, index) {
      return <li key={'message-' + item.id}>
                <Message message={item} block={self.props.block} canRespond={true} responses={responses[item.id]}/>
            </li>;
    };

    var showRates = function(item, index) {
      return <div key={index} className={'emoticon-' + item}></div>;
    };

    var showResponses = function( item, index ) {
      return <div>{item}</div>;
    }

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
        <p>{self.state.rates.map(showRates)}</p>
        <p>{self.state.responses.map(showResponses)}</p>
      </div>

        <ul>
        {firstmsg.map(createItem)}
        </ul>

      </div>;
  },

  componentWillMount: function() { // check which is the corrct term here

    var self = this;

    setInterval( function() {
      var rates = self.state.rates;
      rates.pop();
      var responses = self.state.responses;
      responses.pop()
      self.setState( {'rates' : rates, 'responses' : responses } );
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

    this.props.block.$responseIn = function( msg ) {

      if( msg.meta.userId == self.state.user ) {

        var time = new Date( msg.time || msg.tc );
        var hours = time.getHours();
        var mins = time.getMinutes();

        if( hours < 10 ) {
          hours = '0' + hours;
        }

        if( mins < 10 ) {
          mins = '0' + mins;
        }

        time = hours + ':' + mins;

        var responses = self.state.responses;
        responses.push( 'Message at ' + time + ' responded' );
        self.setState( { 'responses' : responses } );
      }
    };

  }

});

module.exports = MessageList;

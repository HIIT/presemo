var Message = React.createClass({

  getInitialState: function() {
    return {
      response: '...'
    };
  },

  getDefaultProps: function() {
    return {
      responses: []
    }
  },

  time_fix: function( time ) {

    // todo: this might be a code that should be commonized

    var hours = time.getHours();
    var mins = time.getMinutes();

    if( hours < 10 ) {
      hours = '0' + hours;
    }

    if( mins < 10 ) {
      mins = '0' + mins;
    }

    return hours + ':' + mins;

  },

  responseChange: function( event ){
    this.setState( { 'response' : event.target.value } );
  },

  $respond: function(event) {
    var _default = this.getInitialState().response;
    if( this.state.response != _default ) {
      this.props.block.rpc('$msg', { text : this.state.response, response: this.props.message.id } );
    }
    this.setState( { 'response' : _default } );
  },

  $highlight: function() {
    this.props.block.rpc('$toggleTag', this.props.message.id, 'screen');
  },

  $delete: function() {
    this.props.block.rpc('$toggleTag', this.props.message.id, 'delete');
  },

  $rate: function( i ) {
    this.props.block.rpc('$rate', this.props.message.id, i );
  },

  render: function render() {

    var self = this;

    console.log( self.props.canRespond );

    var createItem = function createItem(item, index) {
      return <li>
                <Message key={index} message={item} block={self.props.block} canRespond={false} responses={[]}/>;
            </li>
  };

    var buttons = [];

    if( __CONTROL__ ) { // if-structures inside return seem a bit hairy
      var b = <button className="btn btn-xs btn-primary" onClick={this.$highlight}>Highlight</button>;
      buttons.push( b );
    }

    if( __CONTROL__ ) { // if-structures inside return seem a bit hairy
      var b = <button className="btn btn-xs btn-primary" onClick={this.$delete}>Delete</button>;
      buttons.push( b );
    }

    var time = new Date( this.props.message.time || this.props.message.tc );
    time = this.time_fix( time );

    var style = {
      height: '40px'
    };

    var tags = this.props.message.tags || [];

    if( tags.indexOf('screen') >= 0 ) style.fontWeight = 'bold';

    if( tags.indexOf('delete') >= 0 )  {
      if( __CONTROL__ ) {
        style.color = 'grey';
      } else {
        style.display = 'none';
      }
    }

    // response functionality

    var response_field = '';

    if( this.props.canRespond ) {
      response_field = <div className="input-group">
        <input type="text" className="form-control" onChange={this.responseChange} value={this.state.response} />
        <span className="input-group-btn">
          <button onClick={this.$respond} className="btn btn-default" type="button">Respond</button>
        </span>
      </div>;
    }

    var rates = ['like','wow','haha','love','angry','sad','yay'].reverse();

    return <div style={style}>
      {time}{' '}-{' '}
      {this.props.message.text}{' '}
      {buttons}
      <br/>
      <div>
        { rates.map( (function(i) {
          return <div className={'emoticon-' + i} onClick={this.$rate.bind( this , i )}> </div>;
        }).bind(this) ) }
        <div className="clearfix"></div>
      </div>

      <div style={{'margin-left': '20px'}}>
        <ul>
        {this.props.responses.map(createItem)}
        </ul>
      </div>

      {response_field}



    </div>;
  }

});

module.exports = Message;

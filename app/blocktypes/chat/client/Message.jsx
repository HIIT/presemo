var Message = React.createClass({

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

  highlight: function() {
    this.props.block.rpc('$toggleTag', this.props.message.id, 'screen');
    console.log("Hurraa!");
  },

  render: function render() {

    var buttons = [];

    if( __CONTROL__ ) { // if-structures inside return seem a bit hairy
      var b = <button className="btn btn-xs btn-primary" onClick={this.highlight}>Highlight</button>;
      buttons.push( b );
    }

    if( __CONTROL__ ) { // if-structures inside return seem a bit hairy
      var b = <button className="btn btn-xs btn-primary">Delete</button>;
      buttons.push( b );
    }

    var time = new Date( this.props.message.time );
    time = this.time_fix( time );

    return <div>
      {time}{' '}-{' '}
      {this.props.message.text}{' '}
      {buttons}
    </div>;
  }
});

module.exports = Message;

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

  $highlight: function() {
    this.props.block.rpc('$toggleTag', this.props.message.id, 'screen');
  },

  $delete: function() {
    this.props.block.rpc('$toggleTag', this.props.message.id, 'delete');
  },

  render: function render() {

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

    var style = {};

    var tags = this.props.message.tags || [];

    if( tags.indexOf('screen') >= 0 ) {
      if( __SCREEN__ ) { // todo: fixme, does not overlay nicely
        style.background = "grey";
        style.fontSize = "40px";
        style.position = "relative";
        style.top = -250;
        style.height = "50px";

      } else {
        style.fontWeight = 'bold';
      }
    }

    if( tags.indexOf('delete') >= 0 )  {
      if( __CONTROL__ ) {
        style.color = 'grey';
      } else {
        style.display = 'none';
      }
    }

    return <div style={style}>
      {time}{' '}-{' '}
      {this.props.message.text}{' '}
      {buttons}
    </div>;
  }

});

module.exports = Message;

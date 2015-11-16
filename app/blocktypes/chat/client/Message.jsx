var Message = React.createClass({

  render: function render() {

    var time = new Date( this.props.message.time );

    return <div>
      {time.getHours()}:{time.getMinutes()} -{' '}
      {this.props.message.text}
    </div>;
  }
});

module.exports = Message;

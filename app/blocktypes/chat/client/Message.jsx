var Message = React.createClass({

  render: function render() {

    return <div>
      {this.props.message.text}
    </div>;
  }
});

module.exports = Message;

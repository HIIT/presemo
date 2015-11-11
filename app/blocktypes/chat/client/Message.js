var Message = React.createClass({
  displayName: "Message",

  render: function render() {
    return React.createElement(
      "div",
      null,
      "Message text: ",
      this.props.msg.text
    );
  }
});

module.exports = Message;

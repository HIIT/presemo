var Message = React.createClass({
  displayName: "Message",

  render: function render() {
    return React.createElement(
      "div",
      null,
      "Hello ",
      this.props.name
    );
  }
});

module.exports = Message;

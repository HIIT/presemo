var Message = React.createClass({
  displayName: "Message",

  render: function render() {

    var p = "kissa";

    if( __CONTROL__ ) {
      p = "koira";
    }


    return <div>
      {this.props.message.text}
      {p}
    </div>;
  }
});

module.exports = Message;

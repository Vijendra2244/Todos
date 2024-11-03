import React from "react";
class Title extends React.Component {
  constructor() {
    super();
    this.state = { c: 0 };
    this.addStudent = this.addStudent.bind(this);
    this.decremeent = this.decremeent.bind(this);
  }
  addStudent() {
    console.log(this.state,"thsi")
    this.setState((prevState) => {
      return { c: prevState.c+1};
    });
  }
 decremeent() {
    console.log(this.state,"thsi")
    this.setState((prevState) => {
      return { c: prevState.c-1};
    });
  }
  render() {
    return (
      <>
        <p>{this.state.c}</p>
        <h1 onClick={this.addStudent}>+</h1>
        <h1 onClick={this.decremeent}>-</h1>
      </>
    );
  }
}

export default Title;

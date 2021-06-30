import * as React from "react";

// 

function Avatar(props) {
  return (
    <div>{props.user.name}</div>
  );
}

function NagigationBar(props) {
  return (
    <a href="javscripit:;">
      {props.avatar}
    </a>
  );
}

function PageLayout(props) {
  return (
    <NagigationBar avatar={props.avatar} />
  );
}


export default class Page extends React.Component {
  render() {
    const user = { name: 'yufeilong', link: 'www.test.com' };
    return (
      <React.Fragment>
        <PageLayout avatar={<Avatar user={user} />} />
      </React.Fragment>
    );
  }
}
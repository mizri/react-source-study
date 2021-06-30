import * as React from "react";

// 

function Avatar(props) {
  return (
    <div>{props.user.name}</div>
  );
}

function NagigationBar(props) {
  return (
    <a href={props.user.link}>
      <Avatar user={props.user} />
    </a>
  );
}

function PageLayout(props) {
  return (
    <NagigationBar user={props.user} />
  );
}


export default class Page extends React.Component {
  render() {
    const user = { name: 'yufeilong', link: 'www.test.com' };
    return (
      <React.Fragment>
        <PageLayout user={user} />
      </React.Fragment>
    );
  }
}
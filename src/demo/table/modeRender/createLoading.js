
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import classnames from 'classnames';

export default function createLoading(distance, $container) {
  ReactDOM.render(
    <div className={classnames({ [distance]: !!distance  })}><Spin spinning /></div>,
    $container,
  );

  return () => {
    ReactDOM.unmountComponentAtNode($container);
  }
}
import dynamic from 'next/dynamic';

import Store from '../store';
import * as actions from '../store/actions';
import * as selectors from '../store/selectors';

const App = dynamic(() => import('../components/AppShell'), {
  ssr: false,
});
export default function Index() {
  return <App />;
}

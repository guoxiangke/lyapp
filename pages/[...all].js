import dynamic from 'next/dynamic';

import Store from '../store';
import * as actions from '../store/actions';
import * as selectors from '../store/selectors';

const App = dynamic(() => import('../components/AppShell'), {
  ssr: false,
});
export const getServerSideProps = async () => {
    // Call an external API endpoint to get posts.

    // Fetch data from external API
    const res = await fetch('https://txly2.net/index.php?option=com_vdata&task=get_feeds&type=vd6usermons42&column=sermon_publish_up&value=2022-03-11')
    const data = await res.json()
    
    actions.setPlayerList(data)
    console.log('刷新一次，在后端执行一次1 TODO Cache!', 'getServerSideProps', data.length)
    // Pass data to the page via props
    // actions.setDone(list, item, !item.done)
    return { props: { data } }
}

export default function Index({ data }) {
  console.log('data.length111', data.length)
  return <App />;
}

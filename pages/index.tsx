import Layout from '../components/Layout'
import SingleService from './singleService'

const Home = () => {
  return <SingleService />
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default Home

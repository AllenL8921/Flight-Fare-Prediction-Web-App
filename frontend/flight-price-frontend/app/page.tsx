import Layout from './components/Layout';
import FlightForm from './components/FlightForm';

export default function Home() {
  return (
    <Layout>
      <div className="bg-white shadow rounded-lg">
        <FlightForm />
      </div>
    </Layout>
  );
}

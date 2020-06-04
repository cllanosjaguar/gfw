import capitalize from 'lodash/capitalize';

import Layout from 'app/layouts/root';
import Topics from 'pages/topics';
import routes from 'app/routes';

export const getStaticPaths = async () => {
  const paths = routes['/topics/[topic]'].allowedParams.topic.map((key) => ({
    params: { topic: key },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => ({
  props: {
    title: `${capitalize(params?.topic)} | Topics`,
  },
});

const TopicPage = (props) => {
  return (
    <Layout {...props}>
      <Topics />
    </Layout>
  );
};

export default TopicPage;

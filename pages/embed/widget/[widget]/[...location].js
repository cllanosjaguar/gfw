import PropTypes from 'prop-types';

import Layout from 'app/layouts/root';
import ConfirmationMessage from 'components/confirmation-message';
import Dashboards from 'pages/dashboards/components/embed';

import getLocationData from 'services/location';

export const getServerSideProps = getLocationData;

const DashboardsLocationPage = (props) => (
  <Layout {...props}>
    {props?.locationName?.includes('not found') ? (
      <ConfirmationMessage title={props.locationName} error large />
    ) : (
      <Dashboards />
    )}
  </Layout>
);

DashboardsLocationPage.propTypes = {
  locationName: PropTypes.string.isRequired,
};

export default DashboardsLocationPage;

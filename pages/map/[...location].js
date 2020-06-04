import PropTypes from 'prop-types';

import Layout from 'app/layouts/root';
import ConfirmationMessage from 'components/confirmation-message';
import Map from 'pages/map';

// import getLocationData from 'app/location';

// export const getServerSideProps = getLocationData;

const MapLocationPage = (props) => (
  <Layout {...props}>
    {props?.locationName?.includes('not found') ? (
      <ConfirmationMessage title={props.locationName} error large />
    ) : (
      <Map />
    )}
  </Layout>
);

MapLocationPage.propTypes = {
  locationName: PropTypes.string.isRequired,
};

export default MapLocationPage;

import getLocationData from 'services/location';

import MapPage from '../../map/[...location]';

export const getServerSideProps = getLocationData;

export default MapPage;

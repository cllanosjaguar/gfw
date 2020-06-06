import LayoutEmbed from 'app/layouts/embed';
import WidgetEmbed from 'pages/dashboards/components/embed';
import ConfirmationMessage from 'components/confirmation-message';

import { getServerSideProps as getProps } from '../../../dashboards/[...location]';

export const getServerSideProps = getProps;

const MapEmbedPage = (props) => (
  <LayoutEmbed {...props}>
    {props?.title === 'Dashboard not found' ? (
      <ConfirmationMessage title="Location not found" error large />
      ) : (
        <WidgetEmbed embed />
    )}
  </LayoutEmbed>
);

export default MapEmbedPage;

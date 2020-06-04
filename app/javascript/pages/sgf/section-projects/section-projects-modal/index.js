import { connect } from 'react-redux';

import { getProjectsWithImages } from 'pages/sgf/section-projects/selectors';

import { setSGFModal } from '../actions';

import SectionProjectsModalComponent from './component';

const mapStateToProps = ({ sgfProjects }) => {
  const { data, sgfModal } = sgfProjects || {};
  const { projects, images } = data || {};
  const allProjects = getProjectsWithImages({ data: projects, images });

  return {
    data: allProjects?.find((p) => p.id === parseInt(sgfModal, 10)),
    slug: sgfModal,
  };
};

export default connect(mapStateToProps, { setSGFModal })(
  SectionProjectsModalComponent
);

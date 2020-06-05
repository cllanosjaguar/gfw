import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { initGA, handlePageTrack } from 'app/analytics';
import checkBrowser from 'utils/browser';
import { MediaContextProvider } from 'utils/responsive';

import Header from 'components/header';
import Footer from 'components/footer';
import Cookies from 'components/cookies';
import Button from 'components/ui/button';
import ContactUsModal from 'components/modals/contact-us';
import NavLink from 'components/nav-link';
import gfwLogo from 'assets/logos/gfw.png';

import 'styles/styles.scss';
import './styles.scss';

class App extends PureComponent {
  static propTypes = {
    loggedIn: PropTypes.bool,
    isGFW: PropTypes.bool,
    isTrase: PropTypes.bool,
    children: PropTypes.node,
    router: PropTypes.object,
    embed: PropTypes.bool,
    fullScreen: PropTypes.bool,
    hideFooter: PropTypes.bool,
  };

  componentDidMount() {
    const { router } = this.props;

    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    handlePageTrack();

    const isValidBrowser = checkBrowser();
    if (!isValidBrowser) {
      router.push('/browser-support');
    }
  }

  render() {
    const {
      loggedIn,
      isGFW,
      isTrase,
      children,
      embed,
      fullScreen,
      hideFooter,
    } = this.props;

    return (
      <MediaContextProvider>
        <div
          className={cx('l-root', {
            '-full-screen': fullScreen,
            '-embed': embed,
            '-trase': isTrase,
          })}
        >
          {!embed && (
            <Header
              loggedIn={loggedIn}
              fullScreen={fullScreen}
              NavLinkComponent={({
                children: headerChildren,
                className,
                ...props
              }) => (
                <NavLink {...props}>
                  <a className={className}>{headerChildren}</a>
                </NavLink>
              )}
            />
          )}
          {embed && (
            <a className="page-logo" href="/" target="_blank">
              <img src={gfwLogo} alt="Global Forest Watch" />
            </a>
          )}
          <div className="page">{children}</div>
          {embed && !isGFW && !isTrase && (
            <div className="embed-footer">
              <p>For more info</p>
              <Button
                className="embed-btn"
                extLink={window.location.href.replace('/embed', '')}
              >
                EXPLORE ON GFW
              </Button>
            </div>
          )}
          <Cookies />
          <ContactUsModal />
          {!hideFooter && !embed && <Footer />}
        </div>
      </MediaContextProvider>
    );
  }
}

export default App;

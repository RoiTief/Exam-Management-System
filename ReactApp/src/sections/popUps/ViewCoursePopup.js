import PropTypes from 'prop-types';
import {overlayStyle, popupStyle} from './popup-style'
import Page from 'src/pages/course';

export const ViewCourse = (props) => {
  const { isOpen, closePopup } = props;

  return (
    (isOpen) ? (
        <div className="popup">
            <div onClick={closePopup} style={overlayStyle}></div>
            <div className="popup-content" style={popupStyle}>
                <Page></Page>
                <button onClick={closePopup}>Close</button>
            </div>
        </div>
    ) : ""
  );
};

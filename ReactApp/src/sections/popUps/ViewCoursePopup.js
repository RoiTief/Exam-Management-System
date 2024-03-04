import PropTypes from 'prop-types';
import {overlayStyle, popupStyle} from './popup-style'

export const ViewCourse = (props) => {
  const { isOpen, closePopup } = props;

  return (
    (isOpen) ? (
        <div className="popup">
            <div onClick={closePopup} style={overlayStyle}></div>
            <div className="popup-content" style={popupStyle}>
                <h2>This is view Course Popup</h2>
                <p>This is some content inside the popup.</p>
                <button onClick={closePopup}>Close</button>
            </div>
        </div>
    ) : ""
  );
};

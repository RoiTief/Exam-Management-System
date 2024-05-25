import PropTypes from 'prop-types';
import {overlayStyle, popupStyle} from './popup-style'
import PdfViewer from '../../utils/PdfViewer';

export const QuestionPdfView = (props) => {
  const { isOpen, closePopup, question } = props;

  console.log(JSON.stringify(question))

  return (
    (isOpen) ? (
      <div className="popup">
        <div onClick={closePopup} style={overlayStyle}></div>
        <div className="popup-content" style={popupStyle}>
          <PdfViewer question={question}/>
          <button onClick={closePopup}>Close</button>
        </div>
      </div>
    ) : ""
  );
};

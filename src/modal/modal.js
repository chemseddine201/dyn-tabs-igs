import React, { memo } from 'react';
import { ApiContext } from '../utils/context.js';

const Modal = memo(
  function Modal(props) {
    const api = React.useContext(ApiContext);

    const closeModal = () => document.getElementById("close-tab-modal").classList.remove("open");

    const closeTab = () => {
        const elem = document.getElementById("close-tab-modal");
        const id = elem.getAttribute("data-id");
        elem.classList.remove("open");
        api.close(id);
    }

    return (
        <div id="close-tab-modal" className="modal">
        <div className="modal__content">
            <div class="modal-icon modal-question modal-icon-show" style={{display: "flex"}}>
                <div class="modal-icon-content">?</div>
            </div>
            <h1 className="close-title">Close Tab</h1>
            <p className="close-message">
                All Your Filled Data Will be Lost!
            </p>
            <div className="modal__footer">
                <span 
                    role="button" 
                    className="modal__close close-tab" 
                    onClick={closeTab}>Close</span>
                <span onClick={closeModal} role="button" className="modal__cancel">Cancel</span>
            </div>
            <span onClick={closeModal} role="button"  className="modal__cancel absolute-top">&times;</span>
        </div>
    </div>
    );
  },
  () => true,
);

export default Modal;

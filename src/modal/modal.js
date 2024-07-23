import React, { memo } from 'react';
import { ApiContext } from '../utils/context.js';

const Modal = memo(

    function Modal({ title = "Close Tab", message = "All Your Filled Data Will be Lost!", onCloseTab = false, ...props }) {
        const api = React.useContext(ApiContext);

        const closeModal = () => document.getElementById("rc-dyn-tabs-close-modal").classList.remove("rc-dyn-tabs-open");

        const closeTab = () => {
            const elem = document.getElementById("rc-dyn-tabs-close-modal");
            if (!elem) return;
            const id = elem.getAttribute("data-id");
            elem.classList.remove("rc-dyn-tabs-open");
            api.close(id);
            //
            if (typeof onCloseTab === 'function') {
                onCloseTab();
            }
        }

        return (
            <div id="rc-dyn-tabs-close-modal" className="rc-dyn-tabs-modal">
                <div className="rc-dyn-tabs-modal__content">
                    <div className="rc-dyn-tabs-modal-icon rc-dyn-tabs-modal-question rc-dyn-tabs-modal-icon-show" style={{ display: "flex" }}>
                        <div className="rc-dyn-tabs-modal-icon-content">?</div>
                    </div>
                    <h1 className="rc-dyn-tabs-close-title">{title}</h1>
                    <p className="rc-dyn-tabs-close-message">
                        {message}
                    </p>
                    <div className="rc-dyn-tabs-modal__footer">
                        <span
                            role="button"
                            className="rc-dyn-tabs-modal__close rc-dyn-tabs-close-tab"
                            onClick={closeTab}>Close</span>
                        <span
                            role="button"
                            className="rc-dyn-tabs-modal__cancel"
                            onClick={closeModal} >Cancel</span>
                    </div>
                    <span
                        role="button"
                        className="rc-dyn-tabs-modal__cancel rc-dyn-tabs-absolute-top"
                        onClick={closeModal}>&times;</span>
                </div>
            </div>
        );
    },
    () => true,
);

export default Modal;

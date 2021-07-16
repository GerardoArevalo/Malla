import React from "react";
import EditItemModal from './EditItemModal';
import CreateItemModal from './CreateItemModal';
import '../../styles/modal.css';

function ItemModal({ courseId, itemCategory, handleClose }) {

    return (

        <div className="modal">
            {itemCategory.item !== null ?
                <EditItemModal courseId={courseId} itemCategory={itemCategory} handleClose={handleClose} /> :
                <CreateItemModal courseId={courseId} itemCategory={itemCategory} handleClose={handleClose} />}
        </div >

    );

}

export default ItemModal;
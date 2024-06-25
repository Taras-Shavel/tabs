import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import css from './tab.module.css';

const ItemType = 'TAB';

const Tab = ({ tab, index, moveTab, canDrop }) => {
    const [, ref] = useDrag({
        type: ItemType,
        item: { index }
    });

    const [{ isOver, canDropItem }, drop] = useDrop({
        accept: ItemType,
        canDrop: (draggedItem) => canDrop(index),
        drop: (draggedItem) => {
            if (draggedItem.index !== index && canDrop(index)) {
                moveTab(draggedItem.index, index);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDropItem: monitor.canDrop()
        })
    });

    return (
        <div ref={node => ref(drop(node))} className={`${css.tab} ${isOver && canDropItem ? css.hover : ''}`}>
            {tab.title}
        </div>
    );
};

export default Tab;

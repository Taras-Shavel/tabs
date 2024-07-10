import React, {useState} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import css from './tab.module.css';

const ItemType = 'TAB';

const Tab = ({tab, index, moveTab, canDrop, togglePin}) => {
    const [{isDragging}, drag] = useDrag({
        type: ItemType,
        item: {index},
        canDrag: tab.pinned,
    });

    const [{isOver, canDropItem}, drop] = useDrop({
        accept: ItemType,
        canDrop: (draggedItem) => canDrop(index) && draggedItem.index !== index,
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

    const [isSelected, setIsSelected] = useState(false);
    const handleTabClick = () => {
        setIsSelected(!isSelected);
    };
    return (
        <div
            ref={node => drop(drag(node))}
            onClick={handleTabClick}
            id={`${isSelected ? `${css.selected}` : ''}`}
            className={`${css.tab} ${isOver && canDropItem ? css.hover : ''} ${tab.pinned ? css.pinned : ''}`}
            onDoubleClick={() => togglePin(index)}
            style={{
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            {tab.pinned ? tab.title.charAt(0) : tab.title}

        </div>
    );
};

export default Tab;

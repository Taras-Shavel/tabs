import React, {useState, useEffect, useCallback, useRef} from 'react';
import tabsData from '../../data/dataTabs.json';
import Tab from "../Tab/Tab";
import css from './tabs.module.css';
import {ChevronDown} from 'react-feather';

const LOCAL_STORAGE_KEY = 'tabs';

const Tabs = () => {
    const [tabs, setTabs] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const [visibleTabs, setVisibleTabs] = useState([]);
    const [overflowTabs, setOverflowTabs] = useState([]);

    useEffect(() => {
        const savedTabs = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedTabs) {
            setTabs(JSON.parse(savedTabs));
        } else {
            setTabs(tabsData);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tabs));
    }, [tabs]);

    useEffect(() => {
        const updateTabs = () => {
            const containerWidth = containerRef.current.offsetWidth;
            const tabWidth = 150;
            const visibleCount = Math.floor(containerWidth / tabWidth);
            setVisibleTabs(tabs.slice(0, visibleCount));
            setOverflowTabs(tabs.slice(visibleCount));
        };

        updateTabs();
        window.addEventListener('resize', updateTabs);
        return () => window.removeEventListener('resize', updateTabs);
    }, [tabs]);

    const moveTab = useCallback((dragIndex, hoverIndex) => {
        const updatedTabs = [...tabs];
        const dragTab = updatedTabs[dragIndex];

        updatedTabs.splice(dragIndex, 1);
        updatedTabs.splice(hoverIndex, 0, dragTab);

        const pinnedTabs = updatedTabs.filter(tab => tab.pinned);
        const unpinnedTabs = updatedTabs.filter(tab => !tab.pinned);


        if (visibleTabs.length < tabs.length) {
            const firstOverflowTab = overflowTabs[0];
            setOverflowTabs(overflowTabs.slice(1));
            setVisibleTabs([...visibleTabs.slice(0, hoverIndex), firstOverflowTab, ...visibleTabs.slice(hoverIndex)]);
        }

        setTabs(pinnedTabs.concat(unpinnedTabs));
    }, [tabs, visibleTabs, overflowTabs]);

    const togglePin = useCallback((index) => {
        const updatedTabs = [...tabs];
        updatedTabs[index].pinned = !updatedTabs[index].pinned;

        const pinnedTabs = updatedTabs.filter(tab => tab.pinned);
        const unpinnedTabs = updatedTabs.filter(tab => !tab.pinned);

        setTabs(pinnedTabs.concat(unpinnedTabs));
    }, [tabs]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={css.container} ref={containerRef}>
            {overflowTabs.length > 0 && (
                <div className={css.dropdownContainer}>
                    <div className={css.dropdownToggle} onClick={toggleDropdown}>
                        <ChevronDown size={24}/>
                    </div>
                    {isOpen && (
                        <div className={css.dropdownMenu}>
                            {overflowTabs.map((tab, index) => (
                                <div key={tab.id} className={css.menuItem}>
                                    <Tab
                                        tab={tab}
                                        index={visibleTabs.length + index}
                                        moveTab={moveTab}
                                        canDrop={hoverIndex => tabs[hoverIndex].pinned === tab.pinned}
                                        togglePin={togglePin}
                                        style={{width: '150px'}}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {visibleTabs.map((tab, index) => (
                <Tab
                    key={tab.id}
                    tab={tab}
                    index={index}
                    moveTab={moveTab}
                    canDrop={hoverIndex => tabs[hoverIndex].pinned === tab.pinned}
                    togglePin={togglePin}
                    style={{width: '150px'}}
                />
            ))}

        </div>
    );
};

export default Tabs;

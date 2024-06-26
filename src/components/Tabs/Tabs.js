import React, { useState, useEffect, useCallback } from 'react';
import tabsData from '../../data/dataTabs.json';
import Tab from "../Tab/Tab";
import css from './tabs.module.css';

const LOCAL_STORAGE_KEY = 'tabs';

const Tabs = () => {
    const [tabs, setTabs] = useState([]);

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

    const moveTab = useCallback((dragIndex, hoverIndex) => {
        const updatedTabs = [...tabs];
        const dragTab = updatedTabs[dragIndex];

        // Move the dragged tab to the new position
        updatedTabs.splice(dragIndex, 1);
        updatedTabs.splice(hoverIndex, 0, dragTab);

        // Update pinned and unpinned tabs separately
        const pinnedTabs = updatedTabs.filter(tab => tab.pinned);
        const unpinnedTabs = updatedTabs.filter(tab => !tab.pinned);

        // Combine updated pinned and unpinned tabs
        setTabs(pinnedTabs.concat(unpinnedTabs));
    }, [tabs]);

    const togglePin = useCallback((index) => {
        const updatedTabs = [...tabs];
        updatedTabs[index].pinned = !updatedTabs[index].pinned;

        // Update pinned and unpinned tabs separately
        const pinnedTabs = updatedTabs.filter(tab => tab.pinned);
        const unpinnedTabs = updatedTabs.filter(tab => !tab.pinned);

        // Combine updated pinned and unpinned tabs
        setTabs(pinnedTabs.concat(unpinnedTabs));
    }, [tabs]);

    return (
        <div className={css.container}>
            {tabs.map((tab, index) => (
                <Tab
                    key={tab.id}
                    tab={tab}
                    index={index}
                    moveTab={moveTab}
                    canDrop={hoverIndex => tabs[hoverIndex].pinned === tab.pinned}
                    togglePin={togglePin}
                />
            ))}
        </div>
    );
};

export default Tabs;

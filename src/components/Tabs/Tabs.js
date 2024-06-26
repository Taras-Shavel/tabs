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
        const dragTab = tabs[dragIndex];
        const updatedTabs = [...tabs];
        updatedTabs.splice(dragIndex, 1);
        updatedTabs.splice(hoverIndex, 0, dragTab);
        setTabs(updatedTabs);
    }, [tabs]);

    const togglePin = useCallback((index) => {
        const updatedTabs = [...tabs];
        updatedTabs[index].pinned = !updatedTabs[index].pinned;

        const pinnedTabs = updatedTabs.filter(tab => tab.pinned);
        const unpinnedTabs = updatedTabs.filter(tab => !tab.pinned);

        setTabs(pinnedTabs.concat(unpinnedTabs));
    }, [tabs]);

    const pinnedTabs = tabs.filter(tab => tab.pinned);
    const unpinnedTabs = tabs.filter(tab => !tab.pinned);

    return (
        <div className={css.container}>
            {pinnedTabs.concat(unpinnedTabs).map((tab, index) => (
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

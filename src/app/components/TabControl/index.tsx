import { useState } from "react";
import styles from "./index.module.css";

interface Tab {
    tabTitle: string;
    tabContent: JSX.Element;
}

interface TabControlProps {
    tabs: Array<Tab>;
}

function TabControl({ tabs }: TabControlProps) {
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    return (
        <div className={styles.tabControl}>

            {/* Container das abas */}
            <div className={styles.tabHeader}>
                {
                    tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`${styles.tabButton} ${activeTabIndex === index ? styles.active : ""}`}
                            onClick={() => setActiveTabIndex(index)}
                        >
                            {tab.tabTitle}
                        </button>
                    ))
                }
            </div>

            {/* Container dos dados da aba ativa */}
            <div>
                {tabs[activeTabIndex].tabContent}
            </div>
        </div>
    );
};

export { TabControl };

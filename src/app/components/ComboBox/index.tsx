import { useState, useRef, useEffect } from "react";

interface ListItem {
    id: number | string;
    description: string
}

interface ComboBoxProps {
    items: Array<ListItem>;
    defaultText?: string;
    onSelectItem: (selectedItem: ListItem) => void;
}

const ComboBox: React.FC<ComboBoxProps> = ({ items, defaultText, onSelectItem }) => {
    const [searchTerm, setSearchTerm] = useState(defaultText || "");
    const [filteredItems, setFilteredItems] = useState<Array<ListItem>>(items);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setFilteredItems(
            items.filter((item) =>
                item.description.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const handleSelect = (item: ListItem) => {
        setSearchTerm(item.description);
        setShowDropdown(false);
        onSelectItem(item);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: 'relative', width: '300px' }}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Selecione uma opção..."
                style={{
                    width: '100%',
                    padding: '8px',
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                }}
            />
            {showDropdown && (
                <ul
                    style={{
                        position: 'absolute',
                        top: '40px',
                        left: 0,
                        right: 0,
                        maxHeight: '150px',
                        overflowY: 'auto',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        zIndex: 1000,
                    }}
                >
                    {filteredItems.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            style={{
                                padding: '8px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                            }}
                            onMouseDown={(e) => e.preventDefault()} // Impede que o dropdown feche ao clicar
                        >
                            {item.description}
                        </li>
                    ))}
                    {filteredItems.length === 0 && (
                        <li style={{ padding: '8px', color: '#888' }}>Nenhum item encontrado</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export { ComboBox };
import { useEffect, useState } from 'react'
import { ReactSortable, Sortable } from "react-sortablejs";

const Option = ({item, selectedHook}) => {
    const [selected, setSelected] = selectedHook   
    return (
        <div 
            onClick={() => {
                setSelected(item.id);
                console.log('Item ID: ' + item.id); 
                console.log('Selected: ' + item.id); 
            }} 
            className={`box-border p-2 w-10 h-10 hover:text-white dark:shadow hover:bg-primary/75 dark:hover:bg-primary/50 cursor-pointer rounded ${selected === item.id ? "bg-primary/75 dark:bg-primary/50" : "bg-lightish dark:bg-darkish"}`}
        >
            {item.name}
        </div>
    )
}

const TestPage = () => {
    const [selected, setSelected] = useState(1);
    const [state, setState] = useState([
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 4, name: "4" },
        { id: 5, name: "5" },
        { id: 6, name: "6" },
        { id: 7, name: "7" },
        { id: 8, name: "8" },
        { id: 9, name: "9" },
        { id: 10, name: "10" },
      ]);
    
      return (
        <div>
            <ReactSortable
                className="flex flex-row gap-x-2 justify-center text-center"
                list={state}
                setList={setState}
                group="groupName"
                animation={200}
                // delayOnTouchStart={true}
                delay={2}
                multiDrag
            >
            {state.map((item) => (
                <Option 
                    item={item}  
                    key={item.id}
                    selectedHook={[selected, setSelected]}
                />
            ))}
            </ReactSortable>
        </div>
        
      );
}
export default TestPage

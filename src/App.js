import './App.css';
import Tabs from "./components/Tabs/Tabs";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";


function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <Tabs/>
        </DndProvider>
    );
}

export default App;

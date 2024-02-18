import { Schedule } from "../components/planner";
import { ExchangeSidebar } from "../components/exchange/ExchangeSidebar";

const ExchangePage = () => {
    return (
        <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
            <div className="schedule">
                <Schedule courseOptions={[]}/>
            </div>
            <ExchangeSidebar />
        </div>
    );
}

export default ExchangePage;
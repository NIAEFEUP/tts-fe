import { useParams } from "react-router-dom";
import useExchangeVerify from "../hooks/useExchangeVerify";
import { ExchangeVerifyStatus } from "../components/exchange/verify/ExchangeVerifyStatus";
import { MoonLoader } from "react-spinners";

/**
 * After the user submits an exchange, verification links will be sent to the participants
 * involved in the exchange.
 * 
 * This page will be rendered when the user goes into the link that we sent to their emails.
 * 
 * It receives a token in the parameters. 
 * We make a request to the backend to verify the token and then tell the user if it is valid or not.
 * 
 */
const ExchangeVerifyPage = () => {
    const { token } = useParams();
    const { verified, loading} = useExchangeVerify(token);

    return (<div className="flex flex-col flex-grow items-center justify-center min-h-screen mb-48">
        {loading
            ? <div>
                <MoonLoader size={20} />
            </div>
            : <ExchangeVerifyStatus verified={verified} />
        }
    </div>
    )
};

export default ExchangeVerifyPage;
import React from 'react';
import wiki, {wikiSummary} from 'wikipedia';
import { predict } from '../utils/model';

interface PredictionsPropsType {
    symptoms: string[]
}
interface PredictionType {
    accuracy: string;
    name: string;
}

export default function Predictions({ symptoms }: PredictionsPropsType) {

    const [predictionsList, setPredictionsList] = React.useState<PredictionType[]>([]);


    React.useEffect(() => {

        if (symptoms.length >= 1) {
            predict(symptoms).then((result) => {
                setPredictionsList(result);
            });
        } else {
            setPredictionsList([])
        }

    }, [symptoms]);

    return <ul className="flex flex-col p-1 gap-1 my-2">
        {
            predictionsList.map((v: PredictionType, k: number) => {
                return <Prediction key={k + "--prediction"} accuracy={v.accuracy} name={v.name} />
            })
        }
        <PredictionModal />
    </ul>
}

function Prediction({ accuracy, name }: PredictionType) {

    return <li onClick={() => { window.location.hash = "prediction-modal"; window.DISEASE_NAME = name }} style={{ "--progress-value": accuracy } as React.CSSProperties} className="progress-bar flex flex-row justify-between p-3 bg-slate-500/10 text-sm rounded-md text-blue-950 cursor-pointer">
        <span>{name}</span>
        <span>{accuracy}</span>
    </li>
}

// Modal component that shows details of the prediction. 
function PredictionModal(props: any) {
    const [details, setDetails] = React.useState<null|wikiSummary>(null);

    window.onhashchange = (e: any) => {
        if (window.location.hash == "#prediction-modal") {
            setDetails(null)
            if (window.DISEASE_NAME) {
                wiki.search(window.DISEASE_NAME).then((result) => {
                    console.log(result, "--search details");
                    wiki.summary(result.results[0].title).then((summary) => {
                        setDetails(summary);
                    })
                })
            }
        }
    }

    return <div id="prediction-modal" className="fixed top-0 left-0 w-[100vw] h-[100dvh] overflow-y-auto backdrop-blur-lg bg-slate-400/30 hidden target:flex flex-row justify-center items-center">
        <div className="bg-white p-4 w-full md:w-[50%] h-auto flex flex-col">
            {
                details?.originalimage?.source != undefined ?
                <img className="w-[100%] h-auto max-h-[40dvh] object-contain" src={details?.originalimage?.source} /> :
                <></>
            }
            
            <h3 className="mt-3">{details?.title}</h3>
            <p className="font-sans">{details?.extract}</p>
            {
                details ? <></> : <div className="loader-ui"></div>
            }

            {
                !details ? <></> : 
                <div className="flex flex-row gap-4 py-2 justify-end">
                    <a href={details?.content_urls.mobile.page} target="_blank" className="underline px-0">Wikipedia</a>
                    <button onClick={() => {window.history.back()}} className="underline p-0">Close</button>
                </div>
            }
            
        </div>
    </div>
}
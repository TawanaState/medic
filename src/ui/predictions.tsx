import React from 'react';
import json_symptom_mapping from './../assets/symptom_mapping.json';

interface PredictionsPropsType{
    symptoms:string[]
}
interface PredictionType {
    accuracy:string;
    name:string;
}

export default function Predictions({symptoms}:PredictionsPropsType) {

    const [predictionsList, setPredictionsList] = React.useState<PredictionType[]>([
        {
            name : "Flu",
            accuracy : "80%"
        },
        {
            name : "Covid",
            accuracy : "20%"
        },
        {
            name : "Stomach ache here",
            accuracy : "2%"
        }
    ]);

    React.useEffect(() => {

    }, [symptoms]);

    return <ul className="flex flex-col p-1 gap-1 my-2">
        {
            predictionsList.map((v:PredictionType, k:number) => {
                return <Prediction accuracy={v.accuracy} name={v.name} />
            })
        }
    </ul>
}

function Prediction({accuracy, name} : PredictionType) {
    return <li style={{"--progress-value":accuracy} as React.CSSProperties} className="progress-bar flex flex-row justify-between p-3 bg-slate-500/10 text-sm rounded-md text-blue-950">
        <span>{name}</span>
        <span>{accuracy}</span>
    </li>
}
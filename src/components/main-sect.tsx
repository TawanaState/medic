import React from 'react';
import SymptomsSelect from './../ui/symptom';
import Predictions from '../ui/predictions';
import { useState } from 'react';
import json_symptom_mapping from './../assets/symptom_mapping.json';
import { loadModel } from '../utils/model';

export default function MainSect() {
    const [selected, setSelected] = useState<string[]>([]);
    const [dataset, setDataset] = useState<string[]>([]);
    const [model_Loaded, setModel_loaded] = useState(false);

    // Fetch the dataset from the json files
    React.useEffect(() => {
        // console.log(json_symptom_mapping);
        setDataset(Object.keys(json_symptom_mapping));

        loadModel().then(() => {
            setModel_loaded(true);
        })
    }, [])

    


    return <div className='md:px-24 lg:px-48'>
        
        <SymptomsSelect selected={selected} setSelected={setSelected} DATASET={dataset} />
        <span className="opacity-50">
            {
                model_Loaded ? "" : "Loading..."
            }
        </span>
        <Predictions symptoms={selected} />
    </div>
}
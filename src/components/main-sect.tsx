import React from 'react';
import SymptomsSelect from './../ui/symptom';
import Predictions from '../ui/predictions';
import { useState } from 'react';
import json_symptom_mapping from './../assets/symptom_mapping.json';

export default function MainSect() {
    const [selected, setSelected] = useState<string[]>([]);
    const [dataset, setDataset] = useState<string[]>([]);

    // Fetch the dataset from the json files
    React.useEffect(() => {
        console.log(json_symptom_mapping);
        setDataset(Object.keys(json_symptom_mapping));
    }, [])


    return <div>
        <SymptomsSelect selected={selected} setSelected={setSelected} DATASET={dataset} />

        <Predictions symptoms={selected} />
    </div>
}
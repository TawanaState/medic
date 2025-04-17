import React from 'react';
import SymptomsSelect from './../ui/symptom';
import Predictions from '../ui/predictions';
import { useState } from 'react';
import json_symptom_mapping from './../assets/symptom_mapping.json';
import { predict } from '../utils/model';

export default function MainSect() {
    const [selected, setSelected] = useState<string[]>([]);
    const [dataset, setDataset] = useState<string[]>([]);

    // Fetch the dataset from the json files
    React.useEffect(() => {
        console.log(json_symptom_mapping);
        setDataset(Object.keys(json_symptom_mapping));
    }, [])

    


    return <div className='md:px-24 lg:px-48'>
        <SymptomsSelect selected={selected} setSelected={setSelected} DATASET={dataset} />

        <Predictions symptoms={selected} />
    </div>
}
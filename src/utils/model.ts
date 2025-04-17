// Does all AI model operations 
import json_symptom_mapping from './../assets/symptom_mapping.json';
import json_disease_mappping from "./../assets/disease_mapping.json";
import * as tf from '@tensorflow/tfjs';

const MAX_PREDICTIONS = 10; 
let model: tf.GraphModel | null = null;

async function loadModel() {
  model = await tf.loadGraphModel("model/model.json");
}

export async function predict(symptoms: string[]): Promise<{ name: string; accuracy: string; }[]> {
    if (!model) {
        await loadModel();
    }
    let x_tensor = symptomsToTensor(symptoms);
    const sortedPredictions = await getSortedPredictionsTFJS(x_tensor);
    let total_sum = sortedPredictions.slice(0, MAX_PREDICTIONS).map((v: any, k: number) => {
      return v.probability
    }).reduce((acc, value) => acc + value, 0);

    return sortedPredictions.slice(0, MAX_PREDICTIONS).map((v:any) => {
      return {
        name : indexToDisease(v.index),
        accuracy : `${Number((v.probability / total_sum) * 100).toFixed(1)}%`
      }
    });
}
 
function symptomsToTensor(symptoms: string[]) {
    const ALL_SYMPTOMS = Object.keys(json_symptom_mapping);
    const SYMPTOM_IDs = Object.values(json_symptom_mapping);

    // Creating my all zero array
    let x_tensor = [];
    for (let i = 1; i <= ALL_SYMPTOMS.length; i++) {
        if (SYMPTOM_IDs[ALL_SYMPTOMS.findIndex((v) => { return symptoms.includes(v) })] == i) {
            x_tensor.push(1);
        } else {
            x_tensor.push(0);
        }
    }
    return tf.tensor([x_tensor]);
} 

function indexToDisease(index: number) {
    const ALL_DISEASES = Object.keys(json_disease_mappping);
    const DISEASE_IDs = Object.values(json_disease_mappping);

    return ALL_DISEASES[DISEASE_IDs.findIndex((v) => { return v == index })];

}

async function getSortedPredictionsTFJS(inputTensor: tf.Tensor) {
    if (!model) {
        throw new Error("Model not loaded");
    }
    
    const predictionsTensor = model.predict(inputTensor) as tf.Tensor;
    const predictionsArray = await predictionsTensor.array() as number[][];

    // For a single input sample (most common case for prediction)
    if (predictionsArray.length === 1) {
        const probabilities = predictionsArray[0];
        const predictionList = [];

        probabilities.forEach((probability:number, index:number) => {
            predictionList.push({ index, probability });
        });

        // Sort the list by probability in descending order
        predictionList.sort((a, b) => b.probability - a.probability);

        predictionsTensor.dispose();
        return predictionList;
    } else {
        // If you have a batch of predictions, you might want to process each one
        const batchPredictionLists = [];
        for (const probabilities of predictionsArray) {
            const predictionList = [];
            probabilities.forEach((probability:number, index:number) => {
                predictionList.push({ index, probability });
            });
            predictionList.sort((a, b) => b.probability - a.probability);
            batchPredictionLists.push(predictionList);
        }
        predictionsTensor.dispose();
        return batchPredictionLists;
    }
}

// Does all AI model operations 
import json_symptom_mapping from './../assets/symptom_mapping.json';
import json_disease_mappping from "./../assets/disease_mapping.json";
import * as tf from '@tensorflow/tfjs';

const model = await tf.loadLayersModel('/model/model.json');
model.summary();
model.layers[1].apply(tf.zeros([1, 377])).print();
export async function predict(symptoms:string[]) {
    let x_tensor = symptomsToTensor(symptoms);
    //console.log(x_tensor.shape, "--the new shape");
    let prediction_tensor = await model.predict(x_tensor);
    const {values, indices} = tf.topk((prediction_tensor as tf.Tensor2D), 3);
    values.array().then((val) => {
        console.log(val);
    })
    indices.print()
    return prediction_tensor;

}

function symptomsToTensor(symptoms:string[]) {
    const ALL_SYMPTOMS = Object.keys(json_symptom_mapping);
    const SYMPTOM_IDs = Object.values(json_symptom_mapping);

    // Creating my all zero array
    let x_tensor = [];
    for (let i = 0; i < ALL_SYMPTOMS.length; i++) {
        if (SYMPTOM_IDs[ALL_SYMPTOMS.findIndex((v) => {return symptoms.includes(v)})] == i) {
            x_tensor.push(1);
        }else{
            x_tensor.push(0);
        }
    }
    /*console.log(tf.tensor([x_tensor]).shape, "--my symps")
    console.log("---arg max now")
    let mydata = tf.tensor1d([1, 2, 3]).as1D().argMax();
    console.log(mydata);
    console.log("---arg max close")*/
    return tf.tensor([x_tensor,x_tensor]);
}

function tensorToDiseases(prediction_tensor:any[]) {
    const ALL_DISEASES = Object.keys(json_disease_mappping);
    const DISEASE_IDs = Object.values(json_disease_mappping);

    // Finding the arg max of a tensor, and accessing the IDs and outputting the object {name:disease, accuracy:accuracy}[]


    // Get the index's of the highest values in the tensor, using
    const top_predictions = prediction_tensor.argMax(1).dataSync();
    
    const top_values = prediction_tensor.max(1).dataSync();
    let prediction_array: { name: string; accuracy: number }[] = [];
    for (let i = 0; i < top_predictions.length; i++) {
        prediction_array.push({
            name: ALL_DISEASES[DISEASE_IDs.findIndex((v) => { return v == top_predictions[i] })],
            accuracy: top_values[i]
        })
    }
    return prediction_array;

}
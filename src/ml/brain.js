export class Brain {
    constructor(weightsData) {
        this.layers = weightsData;
    }

    predict(observation) {
        let currentInput = observation;

        for (let i = 0; i < this.layers.length; i += 2) {
            const weights = this.layers[i];
            const biases = this.layers[i + 1];
            
            const outputSize = biases.length;
            const nextInput = new Array(outputSize).fill(0);

            for (let row = 0; row < outputSize; row++) {
                let sum = 0;
                for (let col = 0; col < currentInput.length; col++) {
                    sum += currentInput[col] * weights[row][col];
                }
                sum += biases[row];

                if (i < this.layers.length - 2) {
                    nextInput[row] = Math.tanh(sum);
                } else {
                    nextInput[row] = sum;
                }
            }
            currentInput = nextInput;
        }
        return currentInput;
    }
}
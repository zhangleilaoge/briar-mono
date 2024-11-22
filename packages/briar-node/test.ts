import * as brain from 'brain.js';
import { ITrainingStatus } from 'brain.js/dist/feed-forward';
import * as fs from 'fs';

// provide optional config object, defaults shown.
const config = {
  inputSize: 20,
  inputRange: 20,
  hiddenLayers: [20, 20],
  outputSize: 20,
  learningRate: 0.01,
  decayRate: 0.999,
  timeout: 10 * 60 * 1000,
};

// create a simple recurrent neural network
const net = new brain.recurrent.RNN(config);

net.train([
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] },
]);

let output = net.run([0, 0]); // [0]
output = net.run([0, 1]); // [1]
output = net.run([1, 0]); // [1]
output = net.run([1, 1]); // [0]
console.log(output);

// fs.writeFile('data.json', JSON.stringify(net.toJSON(), null, 4), (err) => {
//   // `null, 4` 用于格式化
//   if (err) {
//     console.error('写入文件出错:', err);
//   } else {
//     console.log("JSON 对象已成功写入 'data.json' 文件。");
//   }
// });

// console.log(output);

// const trainingData = [
//   'Jane saw Doug.',
//   'Doug saw Jane.',
//   'Spot saw Doug and Jane looking at each other.',
//   'It was love at first sight, and Spot had a frontrow seat. It was a very special moment for all.',
// ];

const lstm = new brain.recurrent.LSTM();
lstm.train(trainingData, {
  timeout: 10 * 60 * 1000,
});

const run1 = lstm.run('Jane');
const run2 = lstm.run('Doug');
const run3 = lstm.run('Spot');
const run4 = lstm.run('It');

// console.log('run 1: Jane' + run1);
// console.log('run 2: Doug' + run2);
// console.log('run 3: Spot' + run3);
// console.log('run 4: It' + run4);

// fs.writeFile('data2.json', JSON.stringify(lstm.toJSON(), null, 4), (err) => {
//   // `null, 4` 用于格式化
//   if (err) {
//     console.error('写入文件出错:', err);
//   } else {
//     console.log("JSON 对象已成功写入 'data.json' 文件。");
//   }
// });

// const net = new brain.NeuralNetwork();
// net
//   .trainAsync(
//     [
//       { input: [0, 0], output: [0] },
//       { input: [0, 1], output: [1] },
//       { input: [1, 0], output: [1] },
//       { input: [1, 1], output: [0] },
//     ],
//     {
//       learningRate: 0.01,
//       timeout: 10 * 60 * 1000,
//     },
//   )
//   .then(() => {
//     // do something with my trained network
//     console.log(net.run([1, 1]));
//   });

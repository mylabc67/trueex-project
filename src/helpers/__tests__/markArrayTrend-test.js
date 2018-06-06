import markArrayTrend from '../markArrayTrend';
import { isEqual } from 'lodash';

const testOriginalArray = [
    { id: 1, a: 43, b: 56, c: 46},
    { id: 2, a: 34, b: 94, c: 44},
    { id: 3, a: 12, b: 21, c: 41},
    { id: 4, a: 75, b: 64, c: 76},
    { id: 5, a: 77, b: 23, c: 43},
];

const transformOriginalArrayWithoutUpdate = [
    { id: 1, a: { value: 43, preValue: 43 }, b: { value: 56, preValue: 56 }, c: { value: 46, preValue: 46 }},
    { id: 2, a: { value: 34, preValue: 34 }, b: { value: 94, preValue: 94 }, c: { value: 44, preValue: 44 }},
    { id: 3, a: { value: 12, preValue: 12 }, b: { value: 21, preValue: 21 }, c: { value: 41, preValue: 41 }},
    { id: 4, a: { value: 75, preValue: 75 }, b: { value: 64, preValue: 64 }, c: { value: 76, preValue: 76 }},
    { id: 5, a: { value: 77, preValue: 77 }, b: { value: 23, preValue: 23 }, c: { value: 43, preValue: 43 }},
];

const updatedArray = [
    { id: 3, a: 20, b: 23, c: 54},
    { id: 5, a: 65, b: 49, c: 65},
];

const expectedArray = [
    { id: 1, a: { value: 43, preValue: 43 }, b: { value: 56, preValue: 56 }, c: { value: 46, preValue: 46 }},
    { id: 2, a: { value: 34, preValue: 34 }, b: { value: 94, preValue: 94 }, c: { value: 44, preValue: 44 }},
    { id: 3, a: { value: 20, preValue: 12 }, b: { value: 23, preValue: 21 }, c: { value: 54, preValue: 41 }},
    { id: 4, a: { value: 75, preValue: 75 }, b: { value: 64, preValue: 64 }, c: { value: 76, preValue: 76 }},
    { id: 5, a: { value: 65, preValue: 77 }, b: { value: 49, preValue: 23 }, c: { value: 65, preValue: 43 }},
];

function matchTwoArrays(array1, array2) {
  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++) {
    expect(isEqual(array1[i], array2[i])).toBeTruthy;
  }
}

describe('The test cases for markArrayTrend', () => {
  it('test original input is empty array', () => {
    const testCase1 = markArrayTrend([], [1, 2, 3, 4, 5]);
    const testCase2 = markArrayTrend([], []);
    expect(testCase1.length).toBe(0);
    expect(testCase2.length).toBe(0);
  });

  it('test only get valid original array', () => {
    const testResult1 = markArrayTrend(testOriginalArray, []);
    const testResult2 = markArrayTrend(testOriginalArray);
    matchTwoArrays(testResult1, transformOriginalArrayWithoutUpdate);
    matchTwoArrays(testResult2, transformOriginalArrayWithoutUpdate);
  });

  it('test two inputs are arrays contain records', () => {
    const testResult = markArrayTrend(testOriginalArray, updatedArray);
    matchTwoArrays(testResult, expectedArray);
  });
});
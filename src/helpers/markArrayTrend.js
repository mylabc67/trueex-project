import { keyBy, get } from 'lodash';

/**
 * This function is doing combination with original array and updated array
 * generate a new format of response contains previous value and current value
 * if the record did not get updated, then just set current value same as previoud value
 * @param {array} originalArray - the original data array
 * @param {array} updatedArray - the updated data array
 */
export default function markArrayTrend(originalArray, updatedArray) {
  // convert the array to object for easily locating data
  const helperUpdatedData = keyBy(updatedArray, 'id');

  return originalArray.map((item) => {
    const itemKeys = Object.keys(item);
    const updatedItem = get(helperUpdatedData, item.id, item);
    const resultObj = {};
    itemKeys.forEach((key) => {
      resultObj[key] = {
        value: updatedItem[key],
        preValue: item[key],
      };
    });

    return resultObj;
  });
}
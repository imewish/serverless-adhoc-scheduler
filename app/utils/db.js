const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient()

module.exports.putItem = async (item) => {

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: item
  }

  console.log(params)
  try {
    let putItem = await ddb.put(params).promise()
    return putItem
  } catch (error) {
    console.log(error)
  }

}
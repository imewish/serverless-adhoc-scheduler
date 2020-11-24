const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient()
const { response } = require('../utils/response')

module.exports.handler = async event => {
  console.log(JSON.stringify(event))
  var params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: `#type = :hkey`,
    ExpressionAttributeNames: { '#type': 'type' },
    ExpressionAttributeValues: {
      ':hkey': event.queryStringParameters.type || 'default',
    },
    Limit: event.queryStringParameters.limit || 10
  }
  
  try {
    let res = await ddb.query(params).promise()
    return response(200, res)
  } catch (error) {
    console.log(error)
    return response(400, 'Failed')
  }

}
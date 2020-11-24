'use strict';
const AWS = require('aws-sdk')
const stepfunctions = new AWS.StepFunctions()
const ddb = new AWS.DynamoDB.DocumentClient()

const { response } = require('../utils/response')

module.exports.handler = async event => {
  console.log(JSON.stringify(event))
  const { type, createdAt } = JSON.parse(event.body)

  var params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      type: type,
      createdAt: parseInt(createdAt)
    }
  }

  let item = await ddb.get(params).promise()
  let schedulerArn = item.Item.schedulerArn

  params = {
    executionArn: schedulerArn,
    cause: 'Cancelled by the User'
  }

  try {
    let cancel = await stepfunctions.stopExecution(params).promise()
    console.log(cancel)
    return response(200, 'Cancelled Scheduled Job')
  } catch (error) {
    console.log(error)
    return response(400, 'Failed To Cancel Scheduled Job')
  }

}
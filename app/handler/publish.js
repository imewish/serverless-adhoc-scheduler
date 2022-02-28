'use strict'
const AWS = require('aws-sdk')
const stepfunctions = new AWS.StepFunctions()

const { putItem } = require('../utils/db')

/**
  Receives events from DynamoDB streams and schedule in 
  step functions
**/

module.exports.handler = async event => {
  console.log(JSON.stringify(event))
  const stateMachineArn = process.env.STATEMACHINE_ARN

  if (event.Records[0].eventName != 'REMOVE') {
    console.log('Ignoring Non Delete Event')
    return
  }

  if (event.Records[0].dynamodb.OldImage.state.S != 'idle') {
    console.log('Ignoring Cancelled Schedule')
    return
  }

  let unmarshaledData = AWS.DynamoDB.Converter.unmarshall(event.Records[0].dynamodb.OldImage)

  let result
  try {
    result = await stepfunctions.startExecution({
      stateMachineArn,
      input: JSON.stringify(unmarshaledData)
    }).promise()
    console.log(result)
  } catch (error) {
    console.error(error)
  }

  try {
    delete unmarshaledData.ttl
    unmarshaledData.schedulerArn = result.executionArn
    unmarshaledData.state = 'scheduled'
    await putItem(unmarshaledData)
  } catch (error) {
    console.error(error)
  }

  console.log(`State machine ${stateMachineArn} executed successfully`);
  return `State machine ${stateMachineArn} executed successfully`
}
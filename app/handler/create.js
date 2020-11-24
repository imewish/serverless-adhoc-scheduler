'use strict'
const AWS = require('aws-sdk')
const { putItem } = require('../utils/db')
const { response } = require('../utils/response')


/**
  Create an entry in DynamoDB Table
**/
module.exports.handler = async event => {
  console.log(JSON.stringify(event))
  let item = JSON.parse(event.body)
  // let item = event.body
  /* 
    Set TTL for dynamoDb for expiring the item immediately and send to streams 
    and wait inside the step funtion state machine until the scheduled time
  */
  item.state = 'idle'
  item.type = item.type || 'default'
  item.createdAt = Date.now()
  item.ttl = new Date(item.scheduledTime)
  item.ttl = new Date(item.scheduledTime)
  item.ttl = item.ttl.setDate(item.ttl.getDate() - 2) / 1000
  try {
    await putItem(item)
    return response(200, 'Scheduling Success!!')
  } catch (error) {
    console.log(error)
    return response(400, 'Scheduling Failed!!', error)
  }

}
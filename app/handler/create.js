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

  /* 
    Set TTL for dynamoDb for expiring the item immediately and send to streams 
    and wait inside the step funtion state machine until the scheduled time.

    DynammDb TTL will take around 10 min to 48hours to delete the item from the table.
    To delete the items from table without waiting for this buffer period, we will set
    the TTL = Actual Schedule Time - 48 hours. 
  */

  item.state = 'idle' // State before sending to Step Function
  item.type = item.type || 'default'  // DynamoDb Hash Key
  item.createdAt = Date.now() // DynamoDb Sort Key
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
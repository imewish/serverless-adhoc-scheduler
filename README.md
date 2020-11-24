# serverless-scheduler

### Create Schedule


```
POST 

https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/createSchedule

{
    "scheduledTime": "2020-11-21T07:27:26.000Z",
    "type": "promo",
    "data": {
        "John": "Doe",
        "Foo": "Bar"
    }, 
    "topicArn": "arn:aws:sns:us-east-1:123456:test-sns-target"
  }
```

### Cancel Schedule

```
POST 

https://xxxxxx.execute-api.us-east-1.amazonaws.com/dev/cancelSchedule

{
    "type": "promo",
    "createdAt": "1606192905993"
}
```

### List Schedules

```
GET 

https://xxxxx.execute-api.us-east-1.amazonaws.com/dev/listSchedules?type=default&&limit=10
```
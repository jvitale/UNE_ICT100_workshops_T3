// class pub/sub manager for event-driven approach

class PubSubManager {

    // constructor creating empty list
    // of subscribers
    constructor() {
        this.subscribers = [];
        this.lastId = 0; 
    }

    // method to transform messages into readable strings
    msgToStr(message) {
        let strObj = '';
        for (let key in message) {
            if (strObj.length > 0) {
                strObj += ', ';
            }
            strObj += key + ' -> ' + message[key];
        }
        return '(' + strObj + ')';
    }

    // method to publish a message for a topic
    // topic is a string
    // message is an object {}
    publish(topic, message){
        console.log('Publishing message ' +  this.msgToStr(message) + ' for topic ' + topic);
        for (let index in this.subscribers) {
            if (this.subscribers[index].topic == topic) {
                console.log('Message for topic ' + topic + ' received by subscriber ' + this.subscribers[index].id)
                this.subscribers[index].callback(message);
            }
        }
    }

    // method to subscribe to a topic
    // topic is a string
    // callback is a callback function with a single parameter message
    // the method return a subscriber id
    subscribe(topic, callback){
        this.lastId++;
        this.subscribers[this.subscribers.length] = {
            id: this.lastId,
            topic: topic,
            callback: callback
        }
        console.log('Created new subscriber for topic ' + topic + ' with id ' + this.lastId);
        return this.lastId;
    }

    // method to unsubscribe
    // subscriber_id is an int
    // the method return true if successfully unsubscribed or false otherwise
    unsubscribe(subscriberId) {
        for (let index in this.subscribers){
            if (this.subscribers[index].id == subscriberId) {
                console.log('Unsubscribing subscriber with id ' + subscriberId + ' for topic ' + this.subscribers[index].topic);
                this.subscribers.splice(index,1);
                return true;
            }
        }

        return false;
    }
}

// creating an object from the class PubSubManager
const manager = new PubSubManager();
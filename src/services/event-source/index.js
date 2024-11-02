export default {
  create (topic, handlers) {
    console.log('TOPIC IN HERE', topic)

    const eventSource = new EventSource(`${process.env.VUE_APP_MERCURE_HUB_URL}/.well-known/mercure?topic=` + encodeURIComponent(topic))

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      console.log('DATA', data)

      for (const handler of handlers) {
        if (handler.eventType === data.eventType) {
          handler.handle(data.payload)
        }
      }
    }

    return eventSource
  }
}

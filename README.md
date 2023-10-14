Part 2
To handle 100,000 URL requests per second, we can deploy multiple instances of our service behind a load balancer. To achieve this we can use Docker and Kubernetes.
Another way to do it that we can deploy our app on Lambda or some other serverless cloud platform. It will automatically scale our application to handle it.
Probably redis caching that is already available in the app can help handle large amount of requests.
Queues can be used to handle that many requests. We can just redirect our data to the queues to perform that action asynchronously. As for technologies we can use Redis Queue, RabbitMQ, Kafka or others
To secure our server from failing we can use rate limiting to ensure that requests will not overwhelm our server.
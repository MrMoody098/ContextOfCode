MetricMan is a Realtime Metrics Collector and Visualisation Full stack Application created for my "Context of the code" module at University Of Limerick.
The Application consists of a Python Metric Collector/Uploader Agent which interacts with a SpringBoot REST API hosted on AWS, the API controls the CRUD operations for 
our MongoDB Atlas instance and acts as the middle man between the Collector hosted on our local device, the Cloud DB and the React Front end hosted on AWS S2 instance.

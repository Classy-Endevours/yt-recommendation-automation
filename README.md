## Youtube recommendation automation

to start the server following are the command
```
npm install
npm run dev
```
then make a request using following cURL
```
curl --location 'http://localhost:4000/api' \
--header 'Content-Type: application/json' \
--data '{
    "url": "https://www.youtube.com/watch?v=tKL6wEqbyNs&list=PLShTCj6cbon9gK9AbDSxZbas1F6b6C_Mx",
    "count": 5
}'
```

change the values based on your need
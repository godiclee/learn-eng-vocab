# 英文單字學習

## Installation and Usage
In the project directory, you can run:

### `yarn`
To install the dependencies

### `yarn start`
To open backend

### `yarn start_react`
To open frontend (you may need to type 'y' in the terminal since it shares the same port with backend)

### MongodB Databse
Remember to change MONGDB_URL in .env.defaults. to your own MONGODB_URL in order to conecct to database.

Change 'INSERT_YOUR_MONGODB_URL" in /crawler/upload.js to your only MONGDB_URL
then call node --experimental-json-modules upload.js to upload level*.json to mongdb server (* is specified when importing json file in upload.js line 1 )

### Deployment
You can deploy the app to heroku without changing any code (apart from .env.defaults)  

![Screenshot from 2022-01-15 13-40-21](https://user-images.githubusercontent.com/31987572/149610644-21bf04fa-a10b-4840-9408-ec69cbc234b0.png)
![Screenshot from 2022-01-15 13-45-57](https://user-images.githubusercontent.com/31987572/149610653-453bb391-56e9-454e-bded-a5a3fdb897b3.png)

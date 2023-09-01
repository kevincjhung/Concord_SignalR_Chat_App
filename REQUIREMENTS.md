# Sprints & Features To Implement

## Currently Working On

- implement react router

## Backlog

- Create a page/component that allows you to create a new channel.
    Take all the code for createChannel, DeleteChannel, put it in the PersistentDrawer

- Rewrite the database
    Users
      Users have other users that they are connected to
      Users can add other users in a conversation
    
    Messages

    Channels (Change this to conversation)

- Create UI that allows you to delete a channel.

- Create functionality that allows users to add other users to a channel. For now, assume all users can add all other users to all channels. 

- infinite scroll with react query on the frontend. first, get 50, then when you scroll to a 
  certain point,    get the next 50, etc. You will need to pass in a parameter to the API call, which will be the last message id.

- only listen to messages from a certain chat room in frontend react app

- Switch database to CockroachDB

- Users have channels they are and are not subscribed to

- Implement S3 or Azure Blob Storage

- Send photos

- Send videos

- Media page

- Read receipts

## Stuck 


## Completed


## Known Problems

- The deployed version shows the react app and the whole interface, but it does not show the messages. Try sending a JSON object straight from the backend instead of the database. If that works, then it's likely a problem with database connection or the database itself.
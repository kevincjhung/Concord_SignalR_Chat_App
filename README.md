# Concord - A Realtime Chat App Built with .NET and React

Concord is a real-time chat application designed to showcase modern web technologies and foster efficient communication and collaboration among users. Developed with React, Vite, and TypeScript.
<br>

![Concord Preview](./Concord/frontend/public/Chat_Interface.png)
Photo: Screenshot of the main chat interface

## Table of Contents

1. [Key Features](#key-features)
2. [Tech Stack](#tech-stack)
   - [Backend](#backend)
     - [.NET 7 with Entity Framework Core](#net-7-with-entity-framework-core)
     - [SignalR](#signalr)
     - [PostgreSQL](#postgresql)
   - [Frontend](#frontend)
     - [React with Vite](#react-with-vite)
     - [TypeScript](#typescript)
     - [MaterialUI](#materialui)
     - [Tailwind CSS](#tailwind-css)
3. [Features To Be Implemented](#features-to-be-implemented)

## Key Features

Real-Time Communication:
Our chat application leverages SignalR, enabling real-time bidirectional communication between users. Users can instantly send and receive messages.

When the client sends a message, the message is sent to the server using HTTP POST. The server then broadcasts the message to all connected clients subscribed to the channel through SignalR.

Multiple Channels:
The app supports the creation and management of multiple channels,aka "conversations". Users can create and delete conversations.

Responsive Design:
Our frontend, built using React with Vite and enhanced by Tailwind CSS, offers a responsive and adaptive user interface. Users can access the application across various devices.

Material Design Principles:
The frontend UI adopts MaterialUI, a well-established and widely-used UI library based on Material Design principles. This ensures a visually appealing and consistent design language throughout the application, enhancing user familiarity and ease of use.


## Tech Stack

### Frontend
 
- Framework: React with Vite
- Language: TypeScript
- Styling and UI: MaterialUI, Tailwind CSS

### Backend

- Framework: .NET 7 with Entity Framework Core
- Language: C#
- Realtime Communication: SignalR
- Database: PostgreSQL.
For visualization of the database schema, see: <https://dbdiagram.io/d/64f4df1e02bd1c4a5ee2d8cf>

#### Database Schema


![Entity Relationship Diagram Preview](./Concord/frontend/public/EntityRelationshipDiagram.png)
Photo: Entity Relationship Diagram of the database schema

**Optimizations**

* The Messages table contains all of the messages, and is expected to get very large. The data type of the primary key can be changed to BigInt to allow for a larger number of unique values. BigInt is chosen instead of UUID because of the need for sequential access.

* Implement a clustered index on the "channelId" key for the "Messages" table to optimize query performance for retrieving messages from specific individual channels.  

* Consider horizontal database partitioning of the "Message" table using "ChannelId" as the partition key if the volume of data becomes substantial. This can enhance database scalability and query efficiency. This particular method is chosen as it is expected that a single query will only ever request messages from a single channel. 

## Deployment

Currently, there are some issues with deployment. If you wish to test out the full application, you can clone the repository and run the application locally.

The application is set up to use a Postgres database. You will need to create an instance of a cloud Postgres database. Within the "Concord" directory, create a .env file, and add a connection string to the database. The connection string should be in the following format:

```
  DATABASE_CONNECTION_STRING="Server=containers-us-west-000.railway.app;Port=0000;User Id=postgresuser;Password=password1;Database=database1"
```

The frontend and backend are set up to run on different ports, you will need to run the app on two separate terminals. 

With one of the terminals: 

cd into the "/Concord" directory, then run: 

```bash
  dotnet run watch --urls http://0.0.0.0:5001
```

With another terminal, cd into the "/Concord/frontend" directory, then run: 

```bash
  npm run dev

  // or 

  yarn dev
```


NOTE: Certain features may be on development branches.

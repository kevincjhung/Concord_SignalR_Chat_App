# Concord - A Realtime Chat App Built with .NET and React

Concord is a real-time chat application designed to showcase modern web technologies and foster efficient communication and collaboration among users. Developed with React, Vite, and TypeScript.

Originally conceived as a school project, this application has grown significantly, with ongoing development efforts and regular feature additions. It has evolved beyond its academic origins into a dynamic, actively maintained project.



<br>

![Concord Preview](./Concord/frontend/public/Chat_Interface.png)
Photo: Screenshot of the main chat interface

## Table of Contents

1. [Key Features](#key-features)
2. [Tech Stack](#tech-stack)
   - [Backend](#backend)
     - [Schema Design & Optimization](#schema-design--optimization)
     - [.NET 7 with Entity Framework Core](#net-7-with-entity-framework-core)
     - [SignalR](#signalr)
     - [PostgreSQL](#postgresql)
   - [Frontend](#frontend)
     - [React with Vite](#react-with-vite)
     - [TypeScript](#typescript)
     - [MaterialUI](#materialui)
     - [Tailwind CSS](#tailwind-css)
3. [Deployment](#deployment)
4. [Features To Be Implemented](#features-to-be-implemented)


## Key Features

Real-Time Communication:
The chat application leverages SignalR, enabling real-time bidirectional communication between users. Users can instantly send and receive messages, fostering seamless and interactive conversations

Multiple Channels:
The app supports the creation and management of multiple channels, allowing users to engage in distinct conversations based on their interests or topics. The intuitive sidebar interface makes channel selection effortless.

Responsive Design:
The frontend, built using React with Vite and enhanced by Tailwind CSS, offers a responsive and adaptive user interface. Users can access the application across various devices, ensuring a consistent and enjoyable experience on desktops, tablets, and mobile phones.

Material Design Principles:
The frontend UI adopts MaterialUI, a well-established and widely-used UI library based on Material Design principles. This ensures a visually appealing and consistent design language throughout the application, enhancing user familiarity and ease of use.

Type Safety with TypeScript:
TypeScript is employed in the development process, providing static typing and robust type safety. This results in fewer errors during development and better code quality, making the application more reliable and maintainable.

## Tech Stack

### Backend

#### Schema Design & Optimization

Data persistence is done using a cloud Postgres database.

The database schema is as follows: 

![EntityRelationshipDiagram](./Concord/frontend/public/EntityRelationshipDiagram.png)
Photo: Entity Relationship Diagram of the current schema

The functionalities and constraints of the schema is as follows:

##### Relationships

Channel has a one-to-many relationship with Message, where each channel can have many messages.

Message has a one-to-many relationship with MessageAttachment, allowing a message to have multiple attachments.

User has a one-to-many relationship with both Message and Channel. Users can send multiple messages and participate in multiple channels.

A many-to-many relationship exists between User and Channel using a join entity called UserChannel. Users can be associated with multiple Channels, and each Channel can have multiple Users.

MessageAttachments are resource URLs from cloud storage serivces (ex. Azure Blob Storage or Amazon S3) that belong to a message. They are used for sending file attachments in the chat. One message can have many files attached,  a MessageAttachment belongs to a single Message.

##### Optimizations

* The Messages table contains all of the messages, and is expected to get very large. The data type of the primary key can be changed to BigInt to allow for a larger number of unique values. BigInt is chosen instead of UUID because of the need for sequential access.

* Implement a clustered index on the "channelId" key for the "Messages" table to optimize query performance for retrieving messages from specific individual channels.  

* Consider vertical partitioning of the "Message" table using "ChannelId" as the partition key if the volume of data becomes substantial, which can enhance database scalability and query efficiency.


#### .NET 7 with Entity Framework Core

Entity Framework Core We utilize Entity Framework Core as our ORM (Object-Relational Mapping) tool, which simplifies database interactions, enhances database performance, and ensures a smooth and hassle-free integration with our PostgreSQL cloud database.

#### SignalR

This app uses SignalR for realtime communication, SignalR enables bidirectional communication between clients and the server, eliminating the need for frequent polling and providing real-time updates to users whenever a new message is sent or received.


### Frontend

#### React with Vite

We have chosen React as the frontend framework for its component-based architecture and reactivity, allowing us to build dynamic and scalable user interfaces. Vite, a fast build tool, further enhances the development experience by providing rapid hot module replacement and instant server startup.

#### TypeScript

TypeScript is employed to bring static typing to our codebase, ensuring enhanced type safety and reduced errors during development.

#### MaterialUI

The frontend adopts MaterialUI as the primary external UI library. Following the principles of Material Design, MaterialUI provides a visually consistent and intuitive user experience. Its extensive set of components and styles accelerate development while maintaining a cohesive and professional appearance.

#### Tailwind CSS

Tailwind CSS works in harmony with MaterialUI to provide a customizable and utility-first CSS framework. Tailwind CSS facilitates effortless styling and layout adjustments, empowering us to craft unique and responsive designs that match our application's specific needs.

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
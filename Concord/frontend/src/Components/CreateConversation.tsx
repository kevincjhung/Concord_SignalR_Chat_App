export default function CreateConversation(){
    
    return (
        <>
            <h1>Create Conversation</h1>
            <form> 
                <label>Conversation Name</label>
                <input type="text" name="conversationName" />
                <label>Users</label>
                <input type="text" name="users" />
                <input type="submit" value="Create Conversation" />
            </form>
        </>
    )
}

// TODO: 
// a form that allows users to enter the conversation name
// a UI that allows users to select users to add to the conversation
// allow any user to add any other user to a conversation

# Template base includes:

- Nextjs
- Firebase
- Chakra UI
- Framer motion
- Tailwind CSS
  -react-query

### The modal state is global since we need to be able to toggle it everywhere in our application. If we arent logged in and we perform an action that requires being logged in, The modal should pop up

### Interesting that the AuthInput handles what view the modal is showing

<!-- Things that need fixing -->

- the firebase folder is inside of the components folder.....

<!-- reminders -->

<!-- when we create a post, we need to add the id of the post as a property in firestore -->

<!-- need to know when we do a manual setQueryData on a single post item; when i go back will the react query change too? I think it does because it might count as a refresh -->

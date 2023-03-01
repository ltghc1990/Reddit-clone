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
<!-- something funky going on when i hover the menu items on the directory
 -->
 <!-- the opencommunity provider needs a fix. currently im adding a onclick to the body to autoclose the directory. this is introducing some problmes like having to set stop propagation to some components so that the directory is able to open -->

<!-- when we create a post, we need to add the id of the post as a property in firestore -->

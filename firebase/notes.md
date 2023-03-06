# The way the data is set up, we cant actually have a delete community function. We have a sub collection in our users of all the communities we are apart of.. which makes it easy to join or leave a community as we are just calling a method on a single array. With the delete community, we would have to loop thru all the users and then loop thru the users subcollection communities array to remove the community.

<!-- maybe delete the community anyway and add it to a deleted collections. -->

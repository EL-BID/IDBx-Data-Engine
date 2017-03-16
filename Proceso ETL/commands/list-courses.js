// Get a list of unique courses IDs
// mongo STORAGE_HOST/edx --quiet list-courses.js
var list = [];
db.getCollectionNames().forEach( function( v ) {
  if( v.indexOf( 'idb' ) == 0 ) {
    var entry = v.split( '.' );
    if( list.indexOf( entry[0] ) == -1 ) {
      list.push( entry[0] );
      print( entry[0] );
    }
  }
});

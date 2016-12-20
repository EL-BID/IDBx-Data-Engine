// Generate a table with details of enrollments of all moocs
// mongo STORAGE_HOST/edx --quiet enrollments-report.js
var fields = [
  'mooc_name',
  'mooc_id',
  'registration_date',
  'gender',
  'country'
];
print( fields.join( ',' ) );
var courses = db.reports.find({},{metadata:1})
while( courses.hasNext() ) {
  c = courses.next();
  var enrollments = db[c._id].enrollments.find({},{_id:0,user_id:1,created:1})
  while( enrollments.hasNext() ) {
    e = enrollments.next()
    values = [];
    values.push( c.metadata.name );
    values.push( c._id );
    values.push( e.created );
    details = db[c._id].demographics.findOne({"user_id" : e.user_id},{_id:0,country:1,gender:1});
    if( details.country == "NULL" ) {
      details.country = "";
    }
    values.push( details.gender );
    values.push( details.country );
    print( values.join( ',' ) );
  }
}

// mongo STORAGE_HOST/edx --quiet general-report.js
var fields = [
  'id',
  'name',
  'sme',
  'start_date',
  'end_date',
  'total_users',
  'active_users',
  'approved_users',
  'certified_users',
  'failed_users',
  'male',
  'female',
  'countries'
];
print( fields.join( ',' ) );
var cursor = db.reports.find();
while( cursor.hasNext() ) {
  c = cursor.next();
  values = [];
  values.push( c._id );
  values.push( c.metadata.name );
  values.push( '"' + c.metadata.sme + '"');
  values.push( c.metadata.start_date );
  values.push( c.metadata.end_date );
  values.push( c.report.users.total );
  values.push( c.report.users.active );
  values.push( c.report.users.certificates.approved );
  values.push( c.report.users.certificates.certified );
  values.push( c.report.users.certificates.failed );
  values.push( c.report.gender.m );
  values.push( c.report.gender.f );
  values.push( Object.keys( c.report.countries ).length );
  print( values.join( ',' ) );
}

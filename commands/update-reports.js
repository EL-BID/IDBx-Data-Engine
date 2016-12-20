// Generate a report for each course and store it on the db
// mongo STORAGE_HOST/edx --quiet update-reports.js
load('shell.js');
coursesMetadata.forEach( function( meta ) {
  id = meta.id
  report = generateCourseReport( id );
  delete report.code
  delete meta.id
  db.reports.save({
    _id: id,
    metadata: meta,
    report: report
  });
  print( id );
});

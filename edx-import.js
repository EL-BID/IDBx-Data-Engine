#!/usr/bin/env node
'use strict';

// Requirements
var _ = require( 'underscore' );
var cli = require( 'commander' );
var fs = require( 'fs' );
var path = require( 'path' );
var execSync = require( 'child_process' ).execSync;

cli
  .version( '0.0.1' )
  .option( '-s, --server <host>', 'MongoDB instance to use' )
  .option( '-d, --database <database>', 'Database to use for storage' )
  .option( '-D, --directory <directory>', 'Directory to scan for data files' );

cli
  .command( 'courses' )
  .description( 'Import courses data' )
  .action( _importCourses );

cli
  .command( 'events' )
  .description( 'Import events data' )
  .action( _importEvents );

cli
  .command( 'update-reports' )
  .description( 'Update reports for all courses' )
  .action( _updateReports );

// Import courses data files
function _importCourses() {
  var seed;
  var course;
  var cmd;
  var drop;

  fs.readdir( path.join( cli.directory, 'courses' ), function( err, files ) {
    // Remove hidden files
    files = _.filter( files, function( el ) {
      return el.charAt( 0 ) != '.';
    });

    // Nothing to do?
    if( files.length == 0 ) {
      console.log( 'No courses to process' );
      return;
    }

    _.each( files, function( file ) {
      var subcollection = false;

      // course.?.users
      if( file.indexOf( '-auth_user-prod-analytics.sql' ) > -1 ) {
        seed = file.substring( 0, file.indexOf( '-auth_user-prod-analytics.sql' ) ).toLowerCase();
        course = seed.substring( seed.indexOf( '-' ) + 1 ).replace( '-', '_' ).replace( '.', '_' );
        subcollection = course + '.users';
      }

      // course.?.demographics
      if( file.indexOf( '-auth_userprofile-prod-analytics.sql' ) > -1 ) {
        seed = file.substring( 0, file.indexOf( '-auth_userprofile-prod-analytics.sql' ) ).toLowerCase();
        course = seed.substring( seed.indexOf( '-' ) + 1 ).replace( '-', '_' ).replace( '.', '_' );
        subcollection = course + '.demographics';
      }

      // course.?.certificates
      if( file.indexOf( '-certificates_generatedcertificate-prod-analytics.sql' ) > -1 ) {
        seed = file.substring( 0, file.indexOf( '-certificates_generatedcertificate-prod-analytics.sql' ) ).toLowerCase();
        course = seed.substring( seed.indexOf( '-' ) + 1 ).replace( '-', '_' ).replace( '.', '_' );
        subcollection = course + '.certificates';
      }

      // course.?.courseware
      if( file.indexOf( '-courseware_studentmodule-prod-analytics.sql' ) > -1 ) {
        seed = file.substring( 0, file.indexOf( '-courseware_studentmodule-prod-analytics.sql' ) ).toLowerCase();
        course = seed.substring( seed.indexOf( '-' ) + 1 ).replace( '-', '_' ).replace( '.', '_' );
        subcollection = course + '.courseware';
      }

      // course.?.enrollments
      if( file.indexOf( '-student_courseenrollment-prod-analytics.sql' ) > -1 ) {
        seed = file.substring( 0, file.indexOf( '-student_courseenrollment-prod-analytics.sql' ) ).toLowerCase();
        course = seed.substring( seed.indexOf( '-' ) + 1 ).replace( '-', '_' ).replace( '.', '_' );
        subcollection = course + '.enrollments';
      }

      // course.?.userIDs
      if( file.indexOf( '-user_id_map-prod-analytics.sql' ) > -1 ) {
        seed = file.substring( 0, file.indexOf( '-user_id_map-prod-analytics.sql' ) ).toLowerCase();
        course = seed.substring( seed.indexOf( '-' ) + 1 ).replace( '-', '_' ).replace( '.', '_' );
        subcollection = course + '.userIDs';
      }

      // Ignore unsupported files
      if( ! subcollection ) {
        return;
      }

      // Import file
      cmd = 'mongoimport --drop --verbose=2';
      cmd += ' -h ' + cli.server;
      cmd += ' -d ' + cli.database;
      cmd += ' -c ' + subcollection;
      cmd += ' --headerline --type tsv ' + path.join( cli.directory, 'courses', file );
      execSync( cmd );
    });
  });
}

// Import events data files
function _importEvents() {
  var cmd;

  fs.readdir( path.join( cli.directory, 'events' ), function( err, files ) {
    // Remove hidden files
    files = _.filter( files, function( el ) {
      return el.charAt( 0 ) != '.';
    });

    // Nothing to do?
    if( files.length == 0 ) {
      console.log( 'No courses to process' );
      return;
    }

    _.each( files, function( file ) {
      // Import file
      cmd = '';
      cmd += 'mongoimport -h ' + cli.server;
      cmd += ' -d ' + cli.database;
      cmd += ' -c events';
      cmd += ' --type json ' + path.join( cli.directory, 'events', file );
      execSync( cmd );
    });
  });
}

// Update reports for all courses
function _updateReports() {
  var cmd;
  cmd = '';
  cmd += 'mongo ' + cli.server + '/' + cli.database;
  cmd += ' --quiet commands/update-reports.js';
  execSync( cmd );
}

cli.parse( process.argv );
